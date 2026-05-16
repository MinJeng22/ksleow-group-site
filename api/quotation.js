import PDFDocument from "pdfkit";

const TEXT = "#111111";
const MUTED = "#5f5f5f";
const LINE = "#1f1f1f";

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
      Author: "KSL BUSINESS SOLUTIONS SDN BHD",
      Subject: "Official Quotation",
      Keywords: "quotation,pdf,ksl",
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
      Author: "KSL BUSINESS SOLUTIONS SDN BHD",
      Subject: "Official Quotation",
      Keywords: "quotation,pdf,ksl",
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
      description: getItemDescription(item),
      qty: formatQty(item.qty),
      uom: cleanText(item.uom || item.unit || "UNIT", 20),
      price: formatMoney(item.price),
      amount: formatMoney(item.amount),
    })),
    grandTotal: formatMoney(payload.grand_total),
  };
}

function drawQuotation(doc, quote) {
  drawPageFrame(doc);
  drawHeader(doc);
  drawQuotationTitle(doc);
  drawCustomerMeta(doc, quote);
  drawDocumentMeta(doc, quote);
  drawIntro(doc);
  drawItemsTable(doc, quote.items);
  drawTotalsAndTerms(doc, quote);
  drawFooterNote(doc);
}

function drawPageFrame(doc) {
  const left = 28;
  const right = doc.page.width - 28;

  doc.save()
    .lineWidth(0.7)
    .strokeColor("#8f8f8f")
    .dash(3, { space: 3 })
    .moveTo(left, 0)
    .lineTo(left, doc.page.height)
    .moveTo(right, 0)
    .lineTo(right, doc.page.height)
    .stroke()
    .undash()
    .restore();
}

function drawHeader(doc) {
  const { left, right, width } = pageLayout(doc);

  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(15).text(
    "KSL BUSINESS SOLUTIONS SDN BHD (202401005119)",
    left,
    18,
    { width, align: "center" }
  );
  doc.fillColor(TEXT).font("Helvetica").fontSize(11).text(
    "NO.8, 2nd Floor, Taman Zabidin, Kampung Catin,",
    left,
    42,
    { width, align: "center" }
  );
  doc.text("28400, Mentakab, Pahang.", left, 58, { width, align: "center" });

  doc.moveTo(left, 96).lineTo(right, 96).strokeColor(LINE).lineWidth(0.8).stroke();
}

function drawQuotationTitle(doc) {
  const { left, width } = pageLayout(doc);
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(14).text("QUOTATION", left, 106, {
    width,
    align: "center",
  });
}

function drawCustomerMeta(doc, quote) {
  const x = 50;
  const y = 132;
  const w = 316;
  const h = 96;

  drawCornerBox(doc, x, y, w, h);

  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(7.5).text("BILL TO", x + 18, y + 17, {
    width: w - 36,
  });
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text(quote.companyName, x + 18, y + 31, {
    width: w - 36,
  });
  doc.fillColor(MUTED).font("Helvetica").fontSize(7.5).text("Source: " + quote.source, x + 18, y + 45, {
    width: w - 36,
  });

  doc.fillColor(TEXT).font("Helvetica").fontSize(9).text("TEL  :", x + 20, y + h - 20, {
    width: 100,
  });
  doc.text("FAX  :", x + 170, y + h - 20, {
    width: 100,
  });
}

function drawDocumentMeta(doc, quote) {
  const x = 392;
  const colonX = 454;
  const valueX = 472;
  const startY = 108;
  const lineHeight = 19;
  const rows = [
    ["No.", quote.quotationNo],
    ["Your Ref.", ""],
    ["From", ""],
    ["C. C.", ""],
    ["Date", quote.displayDate],
    ["Page", "1 of 1"],
  ];

  rows.forEach(([label, value], index) => {
    const y = startY + index * lineHeight;
    doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(10).text(label, x, y, {
      width: 54,
      align: "right",
    });
    doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(10).text(":", colonX, y, {
      width: 10,
      align: "center",
    });
    doc.fillColor(TEXT).font(index === 5 ? "Helvetica-Bold" : "Helvetica").fontSize(10).text(value, valueX, y, {
      width: 78,
    });
  });
}

function drawIntro(doc) {
  const { left, width } = pageLayout(doc);
  doc.fillColor(TEXT).font("Helvetica").fontSize(9.5).text(
    "Thank you for your inquiry. We are pleased to submit our quote as follows:",
    left + 6,
    238,
    { width: width - 12 }
  );
}

function drawItemsTable(doc, items) {
  const { left, right, width } = pageLayout(doc);
  const tableTop = 254;
  const tableBottom = 590;
  const columns = [
    { label: "Item", key: "code", width: 72, align: "left" },
    { label: "Description", key: "description", width: 231, align: "left" },
    { label: "Qty", key: "qty", width: 42, align: "center" },
    { label: "UOM", key: "uom", width: 49, align: "center" },
    { label: "U/ Price", key: "price", width: 66, align: "right" },
    { label: "Total", key: "amount", width: width - 460, align: "right" },
  ];

  let y = drawTableHeader(doc, left, tableTop, columns);

  items.forEach((item) => {
    const rowHeight = measureRowHeight(doc, item, columns);

    if (y + rowHeight > tableBottom - 8) {
      doc.moveTo(left, tableBottom).lineTo(right, tableBottom).strokeColor(LINE).lineWidth(0.8).stroke();
      doc.addPage();
      drawPageFrame(doc);
      drawHeader(doc);
      drawQuotationTitle(doc);
      doc.fillColor(MUTED).font("Helvetica").fontSize(8).text("Continued", left, 112, {
        width,
        align: "center",
      });
      y = drawTableHeader(doc, left, 140, columns);
    }

    drawTableRow(doc, left, y, columns, item, rowHeight);
    y += rowHeight;
  });

  doc.moveTo(left, Math.max(y, tableTop + 58)).lineTo(right, Math.max(y, tableTop + 58)).strokeColor(LINE).lineWidth(0.7).stroke();
}

function drawTotalsAndTerms(doc, quote) {
  const { left, right } = pageLayout(doc);
  const y = 606;

  doc.moveTo(left, y).lineTo(right, y).strokeColor(LINE).lineWidth(0.8).stroke();

  const leftLabels = [
    ["Validity", getValidUntil(quote.date)],
    ["Delivery Term", ""],
    ["Payment Term", ""],
  ];

  leftLabels.forEach(([label, value], index) => {
    const rowY = y + 14 + index * 17;
    doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text(label, left, rowY, { width: 85 });
    doc.text(":", left + 88, rowY, { width: 10, align: "center" });
    doc.fillColor(TEXT).font("Helvetica").fontSize(9).text(value, left + 106, rowY, { width: 160 });
  });

  drawSummaryLine(doc, "Total", quote.grandTotal, y + 8);
  drawSummaryLine(doc, "Rounding Adj.", "0.00", y + 25);
  drawSummaryLine(doc, "Final Total", quote.grandTotal, y + 42);
}

function drawSummaryLine(doc, label, value, y) {
  const labelX = 416;
  const boxX = 494;
  const boxW = 64;
  const boxH = 12;

  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(9).text(label, labelX, y + 1, {
    width: 70,
    align: "right",
  });
  doc.rect(boxX, y, boxW, boxH).strokeColor(LINE).lineWidth(0.8).stroke();
  doc.fillColor(TEXT).font("Helvetica").fontSize(6.8).text(`RM ${value}`, boxX + 3, y + 3, {
    width: boxW - 6,
    align: "right",
  });
}

function drawTableHeader(doc, left, y, columns) {
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  doc.moveTo(left, y).lineTo(left + tableWidth, y).strokeColor(LINE).lineWidth(0.8).stroke();
  doc.moveTo(left, y + 23).lineTo(left + tableWidth, y + 23).strokeColor(LINE).lineWidth(0.8).stroke();
  let x = left;
  columns.forEach((column) => {
    doc.fillColor(TEXT).font("Helvetica").fontSize(8.2).text(column.label, x + 5, y + 6, {
      width: column.width - 14,
      align: column.align || "left",
    });
    x += column.width;
  });

  return y + 23;
}

function measureRowHeight(doc, row, columns) {
  doc.font("Helvetica").fontSize(7.6);
  const heights = columns.map((column) => doc.heightOfString(row[column.key], {
    width: column.width - 14,
    align: column.align || "left",
  }));

  return Math.max(19, Math.ceil(Math.max(...heights) + 9));
}

function drawTableRow(doc, left, y, columns, row, rowHeight) {
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  let x = left;
  columns.forEach((column) => {
    doc.fillColor(TEXT)
      .font("Helvetica")
      .fontSize(7.6)
      .text(row[column.key], x + 5, y + 5, {
        width: column.width - 10,
        align: column.align || "left",
        lineGap: 0.8,
      });
    x += column.width;
  });

  doc.moveTo(left, y + rowHeight).lineTo(left + tableWidth, y + rowHeight).strokeColor("#aaaaaa").lineWidth(0.35).stroke();
}

function drawFooterNote(doc) {
  const { left, width } = pageLayout(doc);

  doc.fillColor(TEXT).font("Helvetica").fontSize(9).text(
    "Note : Prices are subjected to change without prior notice. We hope that our quotation is favourable to you and looking forward to receive your valued orders in due course. Thank and regards.",
    left,
    688,
    { width, lineGap: 1 }
  );

  doc.fillColor(TEXT).font("Helvetica").fontSize(10).text("Yours faithfully,", left + 8, 742);
  doc.moveTo(left + 2, 776).lineTo(left + 185, 776).strokeColor(LINE).lineWidth(0.8).stroke();
  doc.fillColor(TEXT).font("Helvetica").fontSize(8).text("Administrator", left + 58, 781, {
    width: 90,
    align: "center",
  });
}

function drawCornerBox(doc, x, y, width, height) {
  const len = 22;
  doc.strokeColor(LINE).lineWidth(0.8);
  doc.moveTo(x, y + len).lineTo(x, y).lineTo(x + len, y).stroke();
  doc.moveTo(x + width - len, y).lineTo(x + width, y).lineTo(x + width, y + len).stroke();
  doc.moveTo(x, y + height - len).lineTo(x, y + height).lineTo(x + len, y + height).stroke();
  doc.moveTo(x + width - len, y + height).lineTo(x + width, y + height).lineTo(x + width, y + height - len).stroke();
}

function pageLayout(doc) {
  const left = 36;
  const right = doc.page.width - 36;
  return { left, right, width: right - left };
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

function getItemDescription(item) {
  const description = item.description
    || item.desc
    || item.name
    || item.product_name
    || item.productName
    || item.item_name
    || item.itemName
    || item.item_description
    || item.itemDescription
    || item.details
    || item.seat_type
    || item.seatType;

  return cleanText(description || item.code || "As quoted", 180);
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
