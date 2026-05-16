import PDFDocument from "pdfkit";

const BRAND = "#2f315a";
const GOLD = "#c9a84c";
const TEXT = "#242642";
const MUTED = "#6b6f91";
const LINE = "#d9dbea";
const LIGHT = "#f5f5f8";
const WHITE = "#ffffff";

const MAX_BODY_BYTES = 128 * 1024;

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed. Use POST." });
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
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Quote-Secret");
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

  let y = 166;
  y = drawCustomerMeta(doc, quote, y);
  y += 26;
  y = drawItemsTable(doc, quote.items, y);
  y += 22;
  drawGrandTotal(doc, quote.grandTotal, y);
  drawFooterNote(doc);
}

function drawHeader(doc, quote) {
  const pageWidth = doc.page.width;
  const left = doc.page.margins.left;
  const right = pageWidth - doc.page.margins.right;

  doc.rect(0, 0, pageWidth, 116).fill(BRAND);
  doc.rect(0, 112, pageWidth, 4).fill(GOLD);

  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(18).text("GREENDEN PRODUCT SDN BHD", left, 34, {
    width: 305,
  });
  doc.fillColor("#dfe2f1").font("Helvetica").fontSize(9).text("Official business quotation generated by KS Omni", left, 60, {
    width: 305,
  });

  const badgeWidth = 176;
  doc.roundedRect(right - badgeWidth, 32, badgeWidth, 42, 6).fill(GOLD);
  doc.fillColor(BRAND).font("Helvetica-Bold").fontSize(13).text("OFFICIAL QUOTATION", right - badgeWidth, 45, {
    width: badgeWidth,
    align: "center",
  });

  doc.fillColor(WHITE).font("Helvetica").fontSize(8).text(`Quote No: ${quote.quotationNo}`, right - badgeWidth, 82, {
    width: badgeWidth,
    align: "center",
  });
}

function drawCustomerMeta(doc, quote, y) {
  const left = doc.page.margins.left;
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const cardHeight = 82;

  doc.roundedRect(left, y, contentWidth, cardHeight, 8).fillAndStroke(LIGHT, LINE);

  doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8).text("PREPARED FOR", left + 18, y + 16);
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(15).text(quote.companyName, left + 18, y + 30, {
    width: contentWidth * 0.55,
    lineGap: 2,
  });

  const rightColX = left + contentWidth * 0.64;
  drawMetaLine(doc, "Quotation Date", quote.displayDate, rightColX, y + 17, contentWidth * 0.32);
  drawMetaLine(doc, "Source", quote.source, rightColX, y + 45, contentWidth * 0.32);

  return y + cardHeight;
}

function drawMetaLine(doc, label, value, x, y, width) {
  doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(7.5).text(label.toUpperCase(), x, y, { width });
  doc.fillColor(TEXT).font("Helvetica").fontSize(10).text(value, x, y + 11, { width });
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
  doc.fillColor(BRAND).font("Helvetica-Bold").fontSize(13).text("OFFICIAL QUOTATION", left, 46);
  doc.fillColor(MUTED).font("Helvetica").fontSize(8).text("Continued", left, 64);
  doc.moveTo(left, 80).lineTo(doc.page.width - doc.page.margins.right, 80).strokeColor(LINE).stroke();
}

function drawTableHeader(doc, left, y, columns) {
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  doc.roundedRect(left, y, tableWidth, 30, 6).fill(BRAND);
  let x = left;
  columns.forEach((column) => {
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(7.6).text(column.label, x + 7, y + 10, {
      width: column.width - 14,
      align: column.align || "left",
    });
    x += column.width;
  });

  return y + 30;
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
  const rowFill = rowIndex % 2 === 0 ? WHITE : "#fbfbfd";
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  doc.rect(left, y, tableWidth, rowHeight).fill(rowFill);
  doc.rect(left, y, tableWidth, rowHeight).strokeColor(LINE).stroke();

  let x = left;
  columns.forEach((column) => {
    doc.moveTo(x, y).lineTo(x, y + rowHeight).strokeColor(LINE).stroke();
    doc.fillColor(column.key === "amount" ? BRAND : TEXT)
      .font(column.key === "amount" ? "Helvetica-Bold" : "Helvetica")
      .fontSize(8.6)
      .text(row[column.key], x + 7, y + 9, {
        width: column.width - 14,
        align: column.align || "left",
        lineGap: 1.5,
      });
    x += column.width;
  });

  doc.moveTo(x, y).lineTo(x, y + rowHeight).strokeColor(LINE).stroke();
}

function drawGrandTotal(doc, grandTotal, y) {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 86;

  if (y > bottomLimit) {
    doc.addPage();
    y = 96;
  }

  const boxWidth = 228;
  const boxHeight = 48;
  const x = right - boxWidth;

  doc.roundedRect(x, y, boxWidth, boxHeight, 8).fill(BRAND);
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(9).text("Grand Total:", x + 16, y + 12, {
    width: 86,
  });
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(16).text(`RM ${grandTotal}`, x + 92, y + 10, {
    width: boxWidth - 108,
    align: "right",
  });

  doc.fillColor(MUTED).font("Helvetica").fontSize(8).text("This quotation is system generated and valid subject to product availability.", left, y + boxHeight + 18, {
    width: right - left,
  });
}

function drawFooterNote(doc) {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const y = doc.page.height - doc.page.margins.bottom - 28;

  doc.moveTo(left, y - 10).lineTo(right, y - 10).strokeColor(LINE).stroke();
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
