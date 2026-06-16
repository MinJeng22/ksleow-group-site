import { mkdir, readFile, writeFile, readdir } from "node:fs/promises"; // 💡 增加了 readdir 用来读取目录
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distDir = path.join(root, "dist");
const kbDir = path.join(root, "public", "kb");
const siteName = "K.S. Leow Group";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectHead(html, doc) {
  const title = `${doc.title} | ${siteName}`;
  const description = doc.description || `${doc.title} from ${siteName}`;
  const canonical = doc.url;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": doc.category === "Product" ? "SoftwareApplication" : "WebPage",
    name: doc.title,
    description,
    url: canonical,
    provider: {
      "@type": "Organization",
      name: siteName,
      url: "https://ksleow.vercel.app",
    },
  };

  let next = html
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(description)}" />`);

  const tags = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join("\n    ");

  next = next.replace("</head>", `    ${tags}\n  </head>`);
  return next;
}

async function writeRouteHtml(template, doc, render) {
  const appHtml = render(doc.route);
  const html = injectHead(template, doc).replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  if (doc.route === "/") {
    await writeFile(path.join(distDir, "index.html"), html);
    return;
  }

  const routeDir = path.join(distDir, doc.route.replace(/^\/+/, ""));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}

// 💡 新增一个辅助函数：动态寻找带随机哈希的 entry-server 文件
async function findServerEntry() {
  const serverAssetsDir = path.join(root, "dist", "server", "assets");
  try {
    const files = await readdir(serverAssetsDir);
    // 寻找长得像 entry-server-xxxxx.js 的文件
    const match = files.find(f => f.startsWith("entry-server") && f.endsWith(".js"));
    if (match) {
      return path.join(serverAssetsDir, match);
    }
  } catch (e) {
    // 如果 assets 目录不存在，退回到旧版路径兜底（比如某些本地旧缓存情况）
    return path.join(root, "dist", "server", "entry-server.js");
  }
  throw new Error("Could not find entry-server file in dist/server/assets");
}

async function main() {
  const template = await readFile(path.join(distDir, "index.html"), "utf8");
  const index = JSON.parse(await readFile(path.join(kbDir, "index.json"), "utf8"));
  
  // 💡 动态获取真实的打包路径
  const serverEntry = await findServerEntry();
  const { render } = await import(pathToFileURL(serverEntry).href);

  for (const item of index) {
    const doc = JSON.parse(await readFile(path.join(kbDir, `${item.id}.json`), "utf8"));
    await writeRouteHtml(template, doc, render);
  }

  console.log(`Generated SSG HTML for ${index.length} routes`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});