// Polyfill the small DOM surface ReactDOM probes during SSR.
function createSsgElement() {
  return {
    style: {},
    children: [],
    setAttribute: () => {},
    removeAttribute: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild(child) {
      this.children.push(child);
      return child;
    },
  };
}

global.window = global.window || {
  addEventListener: () => {},
  removeEventListener: () => {},
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
};
global.document = global.document || {
  createElement: createSsgElement,
  createElementNS: createSsgElement,
  createTextNode: (text = "") => ({ textContent: text }),
  documentElement: { style: {} },
  body: createSsgElement(),
  querySelector: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.window.document = global.document;
const nodeNavigator = globalThis.navigator || { userAgent: "node.js" };
Object.defineProperty(globalThis, "navigator", {
  value: nodeNavigator,
  configurable: true,
});
global.window.navigator = nodeNavigator;

import { mkdir, readFile, writeFile } from "node:fs/promises";
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
  const title = doc.route === "/" 
    ? "K.S. Leow Group | AutoCount Authorized Dealer, Mentakab, Pahang"
    : `${doc.title} | ${siteName}`;
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

async function main() {
  const template = await readFile(path.join(distDir, "index.html"), "utf8");
  const index = JSON.parse(await readFile(path.join(kbDir, "index.json"), "utf8"));
  
  const serverEntry = path.join(distDir, "server", "entry-server.cjs");
  
  // Use import() to load the CJS file (it will be wrapped in a default export)
  const ssrModule = await import(pathToFileURL(serverEntry).href);
  console.log("SSR Module default export keys:", Object.keys(ssrModule.default || {}));
  
  // Extract render safely
  const render = ssrModule.render || ssrModule.default?.render || (typeof ssrModule.default === "function" ? ssrModule.default : undefined);

  if (typeof render !== 'function') {
    throw new Error(`SSG Error: 'render' is not a function. Check your entry-server export. Actual exports: ${Object.keys(ssrModule.default || ssrModule)}`);
  }

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
