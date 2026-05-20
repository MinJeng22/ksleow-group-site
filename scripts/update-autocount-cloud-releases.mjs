import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src/content/autocountCloudReleases.json");
const FORUM_URL = "https://help.accounting.autocountcloud.com/support/discussions/forums/69000107078";
const HELP_ORIGIN = "https://help.accounting.autocountcloud.com";
const USER_AGENT = "KSL AutoCount Cloud Release Sync/1.0 (+https://ksleow.com)";

async function main() {
  const links = await collectReleaseLinks();
  if (links.length === 0) {
    throw new Error("No AutoCount Cloud Accounting release notes found.");
  }

  const releases = [];
  for (const link of links) {
    const html = await fetchText(link.url);
    releases.push(parseReleasePage(html, link));
  }

  releases.sort((a, b) => compareVersions(b.version, a.version));

  const nextJson = `${JSON.stringify(releases, null, 2)}\n`;
  let currentJson = "";
  try {
    currentJson = await fs.readFile(OUTPUT_FILE, "utf8");
  } catch {
    // First run creates the file.
  }

  if (currentJson === nextJson) {
    console.log(`AutoCount Cloud release notes already up to date. Latest: ${releases[0]?.version}.`);
    return;
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, nextJson, "utf8");
  console.log(`Updated ${path.relative(ROOT, OUTPUT_FILE)} with ${releases.length} releases. Latest: ${releases[0]?.version}.`);
}

async function collectReleaseLinks() {
  const links = new Map();

  for (let page = 1; page <= 20; page += 1) {
    const url = page === 1 ? FORUM_URL : `${FORUM_URL}/page/${page}`;
    const html = await fetchText(url);
    const pageLinks = extractForumLinks(html);
    if (pageLinks.length === 0) break;

    for (const link of pageLinks) {
      links.set(link.version, link);
    }

    if (!hasNextPage(html, page)) break;
  }

  return [...links.values()].sort((a, b) => compareVersions(b.version, a.version));
}

function extractForumLinks(html) {
  const items = [];
  const topicRe = /<a\s+([^>]*href="([^"]+)"[^>]*)>\s*Cloud Accounting Release Note v([0-9.]+)\s*<\/a>/gi;
  let match;

  while ((match = topicRe.exec(html))) {
    const after = html.slice(match.index, match.index + 1200);
    const titleDate =
      textMatch(after, /title=['"]([^'"]+)['"][^>]*class=['"]?timeago/i) ||
      textMatch(after, /class=['"]?timeago[^>]*title=['"]([^'"]+)['"]/i);
    const postedLabel = cleanHtml(textMatch(after, /<span[^>]*class=['"]?timeago[^>]*>[\s\S]*?<\/span>/i, 0));

    items.push({
      version: match[3],
      rev: `Release ${match[3].split(".").at(-1)}`,
      date: normaliseFreshdeskDate(titleDate),
      postedLabel,
      url: absoluteUrl(decodeHtml(match[2])),
    });
  }

  return items;
}

function hasNextPage(html, currentPage) {
  const next = currentPage + 1;
  return new RegExp(`forums/69000107078/page/${next}|>\\s*${next}\\s*<`, "i").test(html);
}

function parseReleasePage(html, link) {
  const content = extractPostContent(html);
  const titleVersion =
    textMatch(html, /Cloud Accounting Release Note v([0-9.]+)/i) ||
    link.version;
  const timeTitle =
    textMatch(html, /<span[^>]*class=['"]timeago['"][^>]*title=['"]([^'"]+)['"]/i) ||
    textMatch(html, /title=['"]([^'"]+)['"][^>]*class=['"]timeago['"]/i);
  const date = normaliseFreshdeskDate(timeTitle) || link.date || "";
  const postedLabel = cleanHtml(textMatch(html, /<span[^>]*class=['"]timeago['"][^>]*>[\s\S]*?<\/span>/i, 0)) || link.postedLabel || "";

  return {
    version: titleVersion,
    rev: `Release ${titleVersion.split(".").at(-1)}`,
    date,
    postedLabel,
    features: extractFirstListAfterStrong(content, ["Enhancement", "Enhancements"]),
    fixes: extractFirstListAfterStrong(content, ["Bug", "Bugs", "Bug Fixed", "Bug Fixes"]),
    highlights: extractHighlights(content),
    sourceUrl: link.url,
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function extractPostContent(html) {
  const match = html.match(/<div class="p-desc">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);
  return match?.[1] || html;
}

function extractFirstListAfterStrong(html, labels) {
  for (const label of labels) {
    const items = extractListAfterStrong(html, label);
    if (items.length > 0) return items;
  }
  return [];
}

function extractListAfterStrong(html, label) {
  const re = new RegExp(`<strong>\\s*${escapeRegex(label)}\\s*<\\/strong>[\\s\\S]*?<ul>([\\s\\S]*?)<\\/ul>`, "i");
  const match = html.match(re);
  if (!match) return [];
  return [...match[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((item) => cleanHtml(item[1]))
    .filter(Boolean);
}

function extractHighlights(html) {
  const marker = html.search(/<strong>\s*Highlights\s*<\/strong>/i);
  if (marker === -1) return [];

  const section = html.slice(marker);
  const paragraphs = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((item) => cleanHtml(item[1]))
    .filter(Boolean)
    .filter((text) => !/^highlights$/i.test(text))
    .filter((text) => !/^prepared by/i.test(text));

  return paragraphs.slice(0, 8);
}

function textMatch(html, regex, group = 1) {
  const match = String(html).match(regex);
  return match?.[group]?.trim() || "";
}

function cleanHtml(value) {
  return decodeHtml(String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ndash;|&#8211;/g, "-")
    .replace(/&mdash;|&#8212;/g, "-")
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "'");
}

function normaliseFreshdeskDate(value) {
  if (!value) return "";
  const match = value.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{4})/i);
  if (!match) return "";
  const month = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  }[match[3].slice(0, 3).toLowerCase()];
  return `${match[4]}-${month}-${match[2].padStart(2, "0")}`;
}

function absoluteUrl(href) {
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `${HELP_ORIGIN}${href}`;
  return href;
}

function compareVersions(a, b) {
  const left = String(a).split(".").map(Number);
  const right = String(b).split(".").map(Number);
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
