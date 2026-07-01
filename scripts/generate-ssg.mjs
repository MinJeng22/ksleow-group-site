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
const siteUrl = process.env.SITE_URL || "https://ksleow.com.my";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectHead(html, doc) {
  const title = doc.route === "/" ? doc.title : `${doc.title} | ${siteName}`;
  const description = doc.description || `${doc.title} from ${siteName}`;
  const canonical = doc.url;
  const absoluteUrl = (value) => {
    if (!value) return `${siteUrl}/favicon.png`;
    return String(value).startsWith("http") ? value : `${siteUrl}${value}`;
  };
  const pageImage = absoluteUrl(doc.image);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": doc.category === "Product" ? "SoftwareApplication" : "WebPage",
    name: doc.title,
    description,
    url: canonical,
    image: pageImage,
    inLanguage: "en-MY",
    provider: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };
  if (doc.category === "Product") {
    jsonLd.applicationCategory = doc.applicationCategory || "BusinessApplication";
    jsonLd.operatingSystem = doc.operatingSystem || "Web, Windows";
    jsonLd.areaServed = { "@type": "Country", name: "Malaysia" };
  }
  if (Array.isArray(doc.keywords) && doc.keywords.length) {
    jsonLd.keywords = doc.keywords.join(", ");
  }

  const graph = [jsonLd];
  if (doc.category === "Company") {
    graph.push({
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/images/branding/ksl-logo-circle.webp`,
      image: `${siteUrl}/images/branding/ksleow-search-card.webp`,
      telephone: "+60179052323",
      email: "support@ksleow.com.my",
      areaServed: {
        "@type": "Country",
        name: "Malaysia",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+60179052323",
          contactType: "customer support",
          areaServed: "MY",
          availableLanguage: ["English", "Chinese", "Malay"],
        },
      ],
    });
  }
  if (Array.isArray(doc.faqs) && doc.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: doc.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }
  const structuredData = graph.length > 1 ? { "@context": "https://schema.org", "@graph": graph } : jsonLd;

  let next = html
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(description)}" />`);

  const tags = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    Array.isArray(doc.keywords) && doc.keywords.length ? `<meta name="keywords" content="${escapeHtml(doc.keywords.join(", "))}" />` : "",
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:image" content="${escapeHtml(pageImage)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(`${siteName} business and technology solutions`)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(pageImage)}" />`,
    `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`,
  ].filter(Boolean).join("\n    ");

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
