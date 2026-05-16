import PDFDocument from "pdfkit";

const TEXT = "#111111";
const MUTED = "#5f5f5f";
const SOFT = "#9a9a9a";
const LINE = "#1f1f1f";
const LIGHT = "#eeeeee";
const WHITE = "#ffffff";

const MAX_BODY_BYTES = 128 * 1024;
const DEFAULT_WORKER_URL = "https://ks-omni.kslbs.workers.dev";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET") {
    await handleStoredQuotation(req, res);
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed. Use GET or POST." });
    return;
  }

  if (!isAuthorized(req)) {
    sendJson(res, 401, { error: "Unauthorized quotation request." });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Invalid JSON payload." });
    return;
  }

  const validation = validatePayload(payload);
  if (validation) {
    sendJson(res, 422, { error: validation });
    return;
  }

  const quote = normalizePayload(payload);
  const filename = makeFilename(quote.companyName, quote.date);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
  res.setHeader("Cache-Control", "no-store");

  const doc = new PDFDocument({
    size: "A4",
    margin: 46,
    bufferPages: false,
    info: {
      Title: `Quotation - ${quote.companyName}`,
      Author: "GREENDEN PRODUCT SDN BHD",
      Subject: "Official Quotation",
      Keywords: "quotation,pdf,greenden",
    },
  });

  doc.on("error", () => {
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Failed to generate quotation PDF." });
    } else {
      res.end();
    }
  });

  doc.pipe(res);
  drawQuotation(doc, quote);
  doc.end();
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Quote-Secret");
}

async function handleStoredQuotation(req, res) {
  const url = new URL(req.url, getRequestOrigin(req));
  const quoteId = cleanText(url.searchParams.get("quote") || url.searchParams.get("id"), 80);
  const token = cleanText(url.searchParams.get("token"), 160);

  if (!quoteId || !token) {
    sendJson(res, 400, { error: "quote and token are required." });
    return;
  }

  let payload;
  try {
    payload = await fetchStoredQuotation(quoteId, token);
  } catch (error) {
    sendJson(res, error.statusCode || 502, { error: error.message || "Unable to retrieve quotation." });
    return;
  }

  const validation = validatePayload(payload);
  if (validation) {
    sendJson(res, 422, { error: validation });
    return;
  }

  const quote = normalizePayload(payload);
  const filename = makeFilename(quote.companyName, quote.date);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
  res.setHeader("Cache-Control", "private, no-store");

  const doc = new PDFDocument({
    size: "A4",
    margin: 46,
    bufferPages: false,
    info: {
      Title: `Quotation - ${quote.companyName}`,
      Author: "GREENDEN PRODUCT SDN BHD",
      Subject: "Official Quotation",
      Keywords: "quotation,pdf,greenden",
    },
  });

  doc.on("error", () => {
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Failed to generate quotation PDF." });
    } else {
      res.end();
    }
  });

  doc.pipe(res);
  drawQuotation(doc, quote);
  doc.end();
}

async function fetchStoredQuotation(quoteId, token) {
  const workerUrl = getWorkerUrl();
  const endpoint = new URL("/quote-data", workerUrl);
  endpoint.searchParams.set("quote", quoteId);
  endpoint.searchParams.set("token", token);

  const headers = {};
  if (process.env.QUOTE_API_SECRET) {
    headers["X-Quote-Secret"] = process.env.QUOTE_API_SECRET;
  }

  const response = await fetch(endpoint, { headers });
  if (!response.ok) {
    let detail = "";
    try { detail = await response.text(); } catch { /* ignore */ }
    const error = new Error(`Quotation data lookup failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`);
    error.statusCode = response.status === 404 ? 404 : 502;
    throw error;
  }

  const data = await response.json();
  return data.quotation || data.quote || data.payload || data;
}

function getRequestOrigin(req) {
  const protocol = getHeader(req.headers || {}, "x-forwarded-proto") || "https";
  const host = getHeader(req.headers || {}, "host") || "ksleow.vercel.app";
  return `${protocol}://${host}`;
}

function getWorkerUrl() {
  return String(process.env.QUOTE_WORKER_URL || DEFAULT_WORKER_URL).replace(/\/+$/, "");
}

function isAuthorized(req) {
  const secret = process.env.QUOTE_API_SECRET;
  if (!secret) return true;

  const headers = req.headers || {};
  const auth = getHeader(headers, "authorization");
  const bearer = auth?.replace(/^Bearer\s+/i, "");
  const explicitSecret = getHeader(headers, "x-quote-secret");

  return bearer === secret || explicitSecret === secret;
}

function getHeader(headers, key) {
  const direct = headers[key];
  if (direct) return Array.isArray(direct) ? direct[0] : direct;

  const found = Object.keys(headers).find((name) => name.toLowerCase() === key.toLowerCase());
  const value = found ? headers[found] : undefined;
  return Array.isArray(value) ? value[0] : value;
}

async function readJsonBody(req) {
  if (req.body) {
    if (Buffer.isBuffer(req.body)) return parseJson(req.body.toString("utf8"));
    if (typeof req.body === "string") return parseJson(req.body);
    if (typeof req.body === "object") return req.body;
  }

  let raw = "";
  let bytes = 0;

  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      throw new Error("Request body is too large.");
    }
    raw += chunk.toString("utf8");
  }

  if (!raw.trim()) {
    throw new Error("Request body is required.");
  }

  return parseJson(raw);
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "Payload must be a JSON object.";
  if (!payload.company_name || typeof payload.company_name !== "string") return "company_name is required.";
  if (!Array.isArray(payload.items) || payload.items.length === 0) return "items must be a non-empty array.";
  if (payload.items.length > 80) return "items cannot exceed 80 rows.";

  for (const [index, item] of payload.items.entries()) {
    if (!item || typeof item !== "object") return `items[${index}] must be an object.`;
    if (!item.code) return `items[${index}].code is required.`;
    if (item.qty === undefined || item.qty === null || item.qty === "") return `items[${index}].qty is required.`;
    if (item.price === undefined || item.price === null || item.price === "") return `items[${index}].price is required.`;
    if (item.amount === undefined || item.amount === null || item.amount === "") return `items[${index}].amount is required.`;
  }

  if (payload.grand_total === undefined || payload.grand_total === null || payload.grand_total === "") {
    return "grand_total is required.";
  }

  return "";
}

function normalizePayload(payload) {
  const date = cleanText(payload.date || new Date().toISOString().slice(0, 10), 32);

  return {
    companyName: cleanText(payload.company_name, 120),
    date,
    displayDate: formatDisplayDate(date),
    quotationNo: cleanText(payload.quotation_no || payload.quote_no || makeQuotationNo(date, payload.from_phone), 40),
    source: cleanText(payload.source || "omni-channel", 40),
    items: payload.items.map((item) => ({
      code: cleanText(item.code, 60),
      description: cleanText(item.description || item.desc || item.name || "As quoted", 180),
      qty: formatQty(item.qty),
      price: formatMoney(item.price),
      amount: formatMoney(item.amount),
    })),
    grandTotal: formatMoney(payload.grand_total),
  };
}

function drawQuotation(doc, quote) {
  drawHeader(doc, quote);

  let y = 178;
  y = drawCustomerMeta(doc, quote, y);
  y = drawInstructions(doc, y + 26);
  y = drawItemsTable(doc, quote.items, y);
  drawGrandTotal(doc, quote.grandTotal, y);
  drawFooterNote(doc);
}

function drawHeader(doc, quote) {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;

  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(17).text("GREENDEN PRODUCT SDN BHD", left, 58, {
    width: 280,
  });
  doc.fillColor(TEXT).font("Helvetica-Oblique").fontSize(9).text("Official quotation generated by KS Omni", left, 78, {
    width: 280,
  });
  doc.fillColor(MUTED).font("Helvetica").fontSize(9).text("Pahang, Malaysia", left, 104, {
    width: 220,
  });
  doc.text("Phone", left, 118, { width: 220 });
  doc.text("Email", left, 132, { width: 220 });

  doc.fillColor(SOFT).font("Helvetica").fontSize(30).text("Quotation", right - 190, 52, {
    width: 190,
    align: "right",
  });

  drawHeaderMeta(doc, "DATE", quote.displayDate, right - 185, 103);
  drawHeaderMeta(doc, "Quotation #", quote.quotationNo, right - 185, 119);
  drawHeaderMeta(doc, "Source", quote.source, right - 185, 135);
}

function drawHeaderMeta(doc, label, value, x, y) {
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(8).text(label, x, y, {
    width: 70,
    align: "right",
  });
  doc.fillColor(TEXT).font("Helvetica").fontSize(8.5).text(value, x + 78, y, {
    width: 107,
    align: "left",
  });
}

function drawCustomerMeta(doc, quote, y) {
  const left = doc.page.margins.left;
  const rightX = left + 285;

  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text("Bill To:", left, y);
  doc.fillColor(TEXT).font("Helvetica").fontSize(9).text(quote.companyName, left, y + 15, { width: 220 });
  doc.fillColor(MUTED).font("Helvetica").fontSize(9).text("Company Name", left, y + 29, { width: 220 });
  doc.text("Street Address", left, y + 43, { width: 220 });
  doc.text("City, ST ZIP Code", left, y + 57, { width: 220 });
  doc.text("Phone", left, y + 71, { width: 220 });

  doc.fillColor(TEXT).font("Helvetica-Oblique").fontSize(9).text("Quotation valid until:", rightX, y + 6, {
    width: 115,
    align: "right",
  });
  doc.fillColor(TEXT).font("Helvetica").fontSize(9).text(getValidUntil(quote.date), rightX + 125, y + 6, {
    width: 90,
  });
  doc.fillColor(TEXT).font("Helvetica-Oblique").fontSize(9).text("Prepared by:", rightX, y + 22, {
    width: 115,
    align: "right",
  });
  doc.fillColor(TEXT).font("Helvetica").fontSize(9).text("KS Omni", rightX + 125, y + 22, {
    width: 90,
  });

  return y + 98;
}

function drawInstructions(doc, y) {
  const left = doc.page.margins.left;
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text("Comments or special instructions:", left, y);
  return y + 36;
}

function drawItemsTable(doc, items, startY) {
  const left = doc.page.margins.left;
  const bottom = doc.page.height - doc.page.margins.bottom - 72;
  const columns = [
    { label: "No", key: "no", width: 28, align: "center" },
    { label: "Product Code", key: "code", width: 82 },
    { label: "Description", key: "description", width: 173 },
    { label: "Qty", key: "qty", width: 36, align: "center" },
    { label: "Unit Price (RM)", key: "price", width: 86, align: "right" },
    { label: "Total Amount (RM)", key: "amount", width: 98, align: "right" },
  ];

  let y = drawTableHeader(doc, left, startY, columns);

  items.forEach((item, index) => {
    const row = { no: String(index + 1), ...item };
    const rowHeight = measureRowHeight(doc, row, columns);

    if (y + rowHeight > bottom) {
      doc.addPage();
      drawContinuedHeader(doc);
      y = drawTableHeader(doc, left, 96, columns);
    }

    drawTableRow(doc, left, y, columns, row, rowHeight, index);
    y += rowHeight;
  });

  return y;
}

function drawContinuedHeader(doc) {
  const left = doc.page.margins.left;
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(13).text("Quotation", left, 46);
  doc.fillColor(MUTED).font("Helvetica").fontSize(8).text("Continued", left, 64);
  doc.moveTo(left, 80).lineTo(doc.page.width - doc.page.margins.right, 80).strokeColor(LINE).stroke();
}

function drawTableHeader(doc, left, y, columns) {
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  doc.rect(left, y, tableWidth, 22).fillAndStroke(LIGHT, LINE);
  let x = left;
  columns.forEach((column) => {
    if (x > left) doc.moveTo(x, y).lineTo(x, y + 22).strokeColor(LINE).stroke();
    doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(7.5).text(column.label, x + 5, y + 7, {
      width: column.width - 14,
      align: column.align || "left",
    });
    x += column.width;
  });

  return y + 22;
}

function measureRowHeight(doc, row, columns) {
  doc.font("Helvetica").fontSize(8.6);
  const heights = columns.map((column) => doc.heightOfString(row[column.key], {
    width: column.width - 14,
    align: column.align || "left",
  }));

  return Math.max(34, Math.ceil(Math.max(...heights) + 18));
}

function drawTableRow(doc, left, y, columns, row, rowHeight, rowIndex) {
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  doc.rect(left, y, tableWidth, rowHeight).fillAndStroke(WHITE, LINE);

  let x = left;
  columns.forEach((column) => {
    if (x > left) doc.moveTo(x, y).lineTo(x, y + rowHeight).strokeColor(LINE).stroke();
    doc.fillColor(TEXT)
      .font(column.key === "amount" ? "Helvetica-Bold" : "Helvetica")
      .fontSize(8.6)
      .text(row[column.key], x + 5, y + 9, {
        width: column.width - 10,
        align: column.align || "left",
        lineGap: 1.5,
      });
    x += column.width;
  });
}

function drawGrandTotal(doc, grandTotal, y) {
  const left = doc.page.margins.left;
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 90;

  if (y > bottomLimit) {
    doc.addPage();
    y = 96;
  }

  const tableWidth = 503;
  const amountWidth = 98;
  const totalLabelWidth = tableWidth - amountWidth;
  const rowHeight = 24;

  doc.rect(left, y, tableWidth, rowHeight).strokeColor(LINE).stroke();
  doc.moveTo(left + totalLabelWidth, y).lineTo(left + totalLabelWidth, y + rowHeight).strokeColor(LINE).stroke();
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text("TOTAL", left, y + 7, {
    width: totalLabelWidth - 9,
    align: "right",
  });
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text(`RM ${grandTotal}`, left + totalLabelWidth + 5, y + 7, {
    width: amountWidth - 10,
    align: "right",
  });

  doc.fillColor(TEXT).font("Helvetica").fontSize(8.5).text(
    "If you have any questions concerning this quotation, contact K.S. Leow Group.",
    left,
    y + rowHeight + 24,
    { width: tableWidth }
  );
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text("THANK YOU FOR YOUR BUSINESS!", left, y + rowHeight + 64, {
    width: tableWidth,
    align: "center",
  });
}

function drawFooterNote(doc) {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const y = doc.page.height - doc.page.margins.bottom - 28;

  doc.fillColor(MUTED).font("Helvetica").fontSize(7.5).text("GREENDEN PRODUCT SDN BHD | Official Quotation", left, y, {
    width: right - left,
    align: "center",
  });
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function cleanText(value, maxLength) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function formatMoney(value) {
  const number = Number.parseFloat(String(value).replace(/[^\d.-]/g, ""));
  const safeNumber = Number.isFinite(number) ? number : 0;
  return safeNumber.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatQty(value) {
  const number = Number.parseFloat(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isFinite(number)) {
    return Number.isInteger(number) ? String(number) : String(number);
  }
  return cleanText(value, 20);
}

function formatDisplayDate(value) {
  const parsed = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getValidUntil(value) {
  const parsed = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setDate(parsed.getDate() + 10);
  return parsed.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function makeQuotationNo(date, phone) {
  const compactDate = String(date).replace(/[^\d]/g, "").slice(0, 8) || new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const phoneTail = String(phone || "").replace(/\D/g, "").slice(-4);
  return phoneTail ? `QT-${compactDate}-${phoneTail}` : `QT-${compactDate}`;
}

function makeFilename(companyName, date) {
  const company = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "customer";
  const safeDate = String(date).replace(/[^0-9-]/g, "").slice(0, 10) || "quotation";
  return `quotation-${company}-${safeDate}.pdf`;
}
