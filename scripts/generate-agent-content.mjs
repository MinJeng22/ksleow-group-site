import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const kbDir = path.join(publicDir, "kb");
const siteUrl = process.env.SITE_URL || "https://ksleow.com.my";

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

function plain(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeRelease(release) {
  if (!release) return null;
  return {
    version: release.version,
    rev: release.rev,
    date: release.date,
    features: (release.features || []).slice(0, 12).map(plain),
    fixes: (release.fixes || []).slice(0, 12).map(plain),
    highlights: (release.highlights || []).slice(0, 10).map(plain),
    sourceUrl: release.sourceUrl || release.highlightsUrl || "",
  };
}

function doc({ slug, title, description, route, category, sections = [], facts = {}, source = "site-content", ...metadata }) {
  return {
    id: slug,
    title,
    description,
    url: `${siteUrl}${route}`,
    route,
    category,
    source,
    ...metadata,
    facts,
    sections: sections.map((section) => ({
      heading: section.heading,
      body: Array.isArray(section.body) ? section.body.map(plain) : [plain(section.body)].filter(Boolean),
    })),
  };
}

function docText(document) {
  const lines = [
    document.title,
    document.description,
    `URL: ${document.url}`,
    `Category: ${document.category}`,
  ];
  if (Array.isArray(document.keywords) && document.keywords.length) {
    lines.push("Keywords", ...document.keywords.map(plain));
  }

  for (const [key, value] of Object.entries(document.facts || {})) {
    if (Array.isArray(value)) {
      lines.push(`${key}: ${value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join("; ")}`);
    } else if (value && typeof value === "object") {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (value) {
      lines.push(`${key}: ${value}`);
    }
  }

  for (const section of document.sections || []) {
    lines.push(section.heading);
    lines.push(...section.body);
  }

  return lines.filter(Boolean).join("\n");
}

function releaseText(release) {
  const summary = summarizeRelease(release);
  if (!summary) return "";
  return [
    `${summary.version} ${summary.rev}`,
    summary.date ? `Date: ${summary.date}` : "",
    summary.features?.length ? `Features: ${summary.features.join("; ")}` : "",
    summary.fixes?.length ? `Fixes: ${summary.fixes.join("; ")}` : "",
    summary.highlights?.length ? `Highlights: ${summary.highlights.join("; ")}` : "",
    summary.sourceUrl ? `Source: ${summary.sourceUrl}` : "",
  ].filter(Boolean).join("\n");
}

async function main() {
  await mkdir(kbDir, { recursive: true });

  const [siteRoutes, products, services, otherServices, plugins, releases, cloudReleases, sales2do, gallery] = await Promise.all([
    readJson("src/content/siteRoutes.json"),
    readJson("src/content/products.json"),
    readJson("src/content/services.json"),
    readJson("src/content/otherServices.json"),
    readJson("src/content/autocountPlugins.json"),
    readJson("src/content/autocountReleases.json"),
    readJson("src/content/autocountCloudReleases.json"),
    readJson("src/content/sales2do.json"),
    readJson("src/content/gallery.json"),
  ]);

  const productItems = products.items || [];
  const serviceItems = services.items || [];
  const otherItems = otherServices.items || [];
  const pluginItems = (plugins.sections || []).flatMap((section) =>
    (section.items || []).map((item) => ({ ...item, collection: section.label }))
  );
  const galleryItems = gallery.items || [];
  const routeById = Object.fromEntries(siteRoutes.map((route) => [route.id, route]));
  const latestAccountingRelease = releases[0];
  const latestCloudRelease = cloudReleases[0];

  const documents = [
    doc({
      slug: "home",
      title: routeById.home.title,
      description: routeById.home.description,
      route: routeById.home.route,
      category: routeById.home.category,
      image: `${siteUrl}/images/branding/ksl-logo-circle.webp`,
      keywords: [
        "K.S. Leow Group",
        "Business solutions Malaysia",
        "One-stop business services Malaysia",
        "Accounting and POS software training",
        "Auditing services Malaysia",
        "Corporate management services",
        "IT hardware Malaysia",
        "Web development Malaysia",
        "POS system Malaysia",
        "Accounting services Malaysia",
      ],
      facts: {
        phone: "+60 17-905 2323",
        email: "support@ksleow.com.my",
        serviceArea: "Malaysia, with local support in Pahang including Mentakab and Temerloh.",
        products: productItems.map((item) => `${item.name}: ${item.desc}`),
        services: serviceItems.map((item) => `${item.title}: ${item.desc}`),
        otherServices: otherItems.map((item) => `${item.title}: ${item.desc}`),
      },
      sections: [
        { heading: services.heading, body: services.intro },
        { heading: products.heading, body: products.intro },
        { heading: otherServices.heading, body: otherServices.intro },
      ],
    }),
    doc({
      slug: "autocount-accounting",
      title: routeById["autocount-accounting"].title,
      description: routeById["autocount-accounting"].description,
      route: routeById["autocount-accounting"].route,
      category: routeById["autocount-accounting"].category,
      facts: {
        whatsapp: "+60 17-905 2323",
        latestRelease: summarizeRelease(latestAccountingRelease),
        officialReleaseNote: "https://wiki.autocountsoft.com/wiki/Category:AutoCount_Accounting_2.2:Release_Note",
      },
      sections: [
        { heading: "Key features", body: [
          "SST and LHDN e-Invoice ready workflows for Malaysian compliance.",
          "Integrated operations across accounting, POS, inventory, payroll, and custom business workflows.",
          "Prompt technical support from KSL for setup, training, and practical usage questions.",
          "Extensible through plugins, custom fields, scripting, and workflow automation.",
        ] },
        { heading: "Latest release note summary", body: releaseText(latestAccountingRelease) },
      ],
    }),
    doc({
      slug: "autocount-cloud-accounting",
      title: routeById["autocount-cloud-accounting"].title,
      description: routeById["autocount-cloud-accounting"].description,
      route: routeById["autocount-cloud-accounting"].route,
      category: routeById["autocount-cloud-accounting"].category,
      facts: {
        officialProductUrl: "https://www.autocountsoft.com/pro-cloud-acc.html",
        officialApiUrl: "https://accounting-api.autocountcloud.com/documentation/",
        officialReleaseNote: "https://help.accounting.autocountcloud.com/support/discussions/forums/69000107078",
        pricing: [
          "Lite: Monthly RM70, 12 months RM294, 24 months RM420",
          "Basic: Monthly RM100, 12 months RM420, 24 months RM600",
          "Plus: Monthly RM140, 12 months RM588, 24 months RM840",
          "Pro: Monthly RM180, 12 months RM756, 24 months RM1080",
          "Accountant: Monthly RM10, 12 months RM120, 24 months RM240",
        ],
        latestRelease: summarizeRelease(latestCloudRelease),
      },
      sections: [
        { heading: "Four advantages", body: [
          "LHDN e-Invoice Ready.",
          "Anytime, anywhere, any device.",
          "Capture, upload and extract data with AI SmartScan.",
          "Bank Connection for faster reconciliation.",
        ] },
        { heading: "Training", body: "Learn AutoCount CloudAccounting in Just 30 Minutes with the official tutorial video." },
        { heading: "Latest release note summary", body: releaseText(latestCloudRelease) },
      ],
    }),
    doc({
      slug: "autocount-pos",
      title: routeById["autocount-pos"].title,
      description: routeById["autocount-pos"].description,
      route: routeById["autocount-pos"].route,
      category: routeById["autocount-pos"].category,
      image: `${siteUrl}/images/products/autocount-pos-showcase.webp`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Windows",
      keywords: [
        "AutoCount POS Malaysia",
        "POS system Malaysia",
        "retail POS Malaysia",
        "F&B POS Malaysia",
        "AutoCount Accounting POS integration",
        "barcode scanner POS",
        "receipt printer POS",
        "branch outlet POS",
      ],
      facts: {
        whatsapp: "+60 17-905 2323",
        supportedBusinesses: ["Retail shop", "F&B outlet", "Branch outlet", "Counter sales"],
        integrations: ["AutoCount Accounting", "Inventory and stock control", "Receipt printer", "Barcode scanner", "Cash drawer"],
        supportRegion: "Malaysia, with local support from KSL Business Solutions in Pahang.",
      },
      faqs: [
        {
          question: "What is AutoCount POS used for?",
          answer: "AutoCount POS is used for front counter sales, cashier billing, barcode scanning, receipt printing, payment collection, stock control, and syncing sales data back to AutoCount Accounting.",
        },
        {
          question: "Is AutoCount POS suitable for retail and F&B businesses in Malaysia?",
          answer: "Yes. AutoCount POS supports retail counters, F&B outlets, and branch operations with front-end cashier tools and backend accounting, stock, and reporting workflows.",
        },
        {
          question: "Can KSL help install AutoCount POS?",
          answer: "Yes. KSL Business Solutions can advise on editions and modules, prepare the setup, and help with installation, training, and practical support.",
        },
      ],
      sections: [
        { heading: "Overview", body: productItems.find((item) => item.name === "AutoCount POS")?.desc || "" },
        { heading: "Best fit", body: [
          "Retail shops that need fast cashier checkout, receipt printing, barcode scanning, and stock control.",
          "F&B outlets that need a practical POS counter workflow with AutoCount backend reporting.",
          "Businesses with multiple outlets that need sales, stock movement, and payment data connected to accounting.",
        ] },
        { heading: "Implementation support", body: "KSL helps Malaysian SMEs choose the correct POS backend, front-end counter license, add-on modules, and implementation plan for real business operations." },
      ],
    }),
    doc({
      slug: "feedme-pos",
      title: routeById["feedme-pos"].title,
      description: routeById["feedme-pos"].description,
      route: routeById["feedme-pos"].route,
      category: routeById["feedme-pos"].category,
      sections: [
        { heading: "Overview", body: productItems.find((item) => item.name === "FeedMe POS")?.desc || "" },
      ],
    }),
    doc({
      slug: "autocount-plugin",
      title: routeById["autocount-plugin"].title,
      description: routeById["autocount-plugin"].description,
      route: routeById["autocount-plugin"].route,
      category: routeById["autocount-plugin"].category,
      facts: {
        plugins: pluginItems.map((item) => `${item.name} (${item.collection}, ${item.dealer}): ${item.summary}`),
      },
      sections: [
        { heading: plugins.hero?.title || "AutoCount Plugin", body: plugins.hero?.body || "" },
      ],
    }),
    doc({
      slug: "sales2do",
      title: routeById.sales2do.title,
      description: routeById.sales2do.description,
      route: routeById.sales2do.route,
      category: routeById.sales2do.category,
      facts: {
        whatsapp: "+60 17-905 2323",
        download: "/downloads/app/Sales2DO.app",
      },
      sections: [
        { heading: "Overview", body: sales2do.hero?.body || pluginItems.find((item) => item.name === "Sales2DO")?.summary || "" },
        { heading: "Features", body: pluginItems.find((item) => item.name === "Sales2DO")?.features || [] },
      ],
    }),
    doc({
      slug: "ks-omni",
      title: routeById["ks-omni"].title,
      description: routeById["ks-omni"].description,
      route: routeById["ks-omni"].route,
      category: routeById["ks-omni"].category,
      facts: {
        assistantName: "K.S. Leow Group AI Assistant",
        supportedChannels: ["Web chat", "WhatsApp handoff"],
        supportedInputs: ["Text", "Images", "PDF/document upload", "Quotation request workflows"],
      },
      sections: [
        { heading: "Purpose", body: "KS Omni helps customers ask product, software, service, and quotation questions through a guided AI assistant experience." },
        { heading: "Knowledge base integration", body: "The assistant can use the public /kb structured content layer for clean retrieval of product, service, plugin, and quotation information." },
      ],
    }),
    doc({
      slug: "gallery",
      title: routeById.gallery.title,
      description: routeById.gallery.description,
      route: routeById.gallery.route,
      category: routeById.gallery.category,
      facts: {
        categories: (gallery.categories || []).map((category) => `${category.label}: ${category.value}`),
        albums: galleryItems.map((item) => [
          item.title,
          item.category ? `category ${item.category}` : "",
          item.date ? `date ${item.date}` : "",
          item.location ? `location ${item.location}` : "",
          item.description || "",
        ].filter(Boolean).join(", ")),
      },
      sections: [
        { heading: gallery.heading || "Company Gallery", body: gallery.intro || "" },
        {
          heading: "Gallery albums",
          body: galleryItems.map((item) => {
            const photoCount = Array.isArray(item.photos) ? item.photos.length : 0;
            return `${item.title}: ${item.description || "Company activity album"} (${item.category || "gallery"}, ${photoCount} photos)`;
          }),
        },
      ],
    }),
    doc({
      slug: "quotation",
      title: routeById.quotation.title,
      description: routeById.quotation.description,
      route: routeById.quotation.route,
      category: routeById.quotation.category,
      facts: {
        generatedBy: "KS Omni",
        usage: "Opens signed quotation PDF links generated from quotation JSON payloads.",
      },
      sections: [
        { heading: "Quotation workflow", body: "KS Omni can generate an official PDF quotation link that users can open, download, or share from ksleow.com.my." },
      ],
    }),
  ];

  const index = documents.map((document) => ({
    id: document.id,
    title: document.title,
    description: document.description,
    url: document.url,
    route: document.route,
    category: document.category,
    changefreq: routeById[document.id]?.changefreq || "weekly",
    priority: routeById[document.id]?.priority || "0.7",
    kbJson: `${siteUrl}/kb/${document.id}.json`,
    kbText: `${siteUrl}/kb/${document.id}.txt`,
  }));

  await writeFile(path.join(kbDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

  for (const document of documents) {
    await writeFile(path.join(kbDir, `${document.id}.json`), `${JSON.stringify(document, null, 2)}\n`);
    await writeFile(path.join(kbDir, `${document.id}.txt`), `${docText(document)}\n`);
  }

  const sitemap = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...index.map((item) => `  <url><loc>${item.url}</loc><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`),
    `  <url><loc>${siteUrl}/kb/index.json</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`,
    "</urlset>",
  ].join("\n");

  await writeFile(path.join(publicDir, "sitemap.xml"), `${sitemap}\n`);
  await writeFile(path.join(publicDir, "robots.txt"), [
    "User-agent: *",
    "Allow: /",
    "Allow: /kb/",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n"));

  await writeFile(path.join(publicDir, "llms.txt"), [
    "# K.S. Leow Group",
    "",
    "This website provides information about K.S. Leow Group one-stop business and technology services, including auditing, corporate management, IT hardware, web development, accounting software, POS software, training, and support.",
    "",
    "## Preferred Knowledge Base",
    `- Index: ${siteUrl}/kb/index.json`,
    ...index.map((item) => `- ${item.title}: ${item.kbText}`),
    "",
    "## Crawling Guidance",
    "Use the /kb/*.json or /kb/*.txt files for clean structured content. Use the public web pages for user-facing presentation and context.",
    "",
  ].join("\n"));

  console.log(`Generated ${documents.length} knowledge-base documents in public/kb`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
