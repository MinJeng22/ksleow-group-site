import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { Img } from "../../components/Media.jsx";
import { PageSectionDivider, getSection } from "../../components/PageSections.jsx";
import { IconVideo, IconGrid, IconLedger, IconStar, IconTrophy, IconRocket } from "../../components/SectionDivider.jsx";
import cloudReleases from "../../content/autocountCloudReleases.json";
import WhyChooseUs from "../../components/WhyChooseUs.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
import FeatureShowcase from "../../components/FeatureShowcase.jsx";
import ProductPromotionBento from "../../components/ProductPromotionBento.jsx";
import { SegmentedControl, SelectField } from "../../components/FormControls.jsx";
import { CompareRevBadge, CopyReleaseButton, ReleaseNumber, ShareLinkButton } from "../../components/ReleaseTools.jsx";
import { CompareFeatureCell, editionRowDiffers, filterEditionValues, getEditionColumnIndexes } from "../../components/CompareTable.jsx";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to start AutoCount CloudAccounting free trial and compare the available editions. Thank you."
)}`;

const OFFICIAL_PRODUCT_URL = "https://www.autocountsoft.com/pro-cloud-acc.html";
const OFFICIAL_RELEASE_URL = "https://help.accounting.autocountcloud.com/support/discussions/forums/69000107078";
const FREE_TRIAL_URL = "https://auth.autocountcloud.com/identity/account/register/accounting?dealerCode=SYNS6037";
const TRAINING_URL = "https://youtu.be/zHstLv2-ATw?si=tSfLxwPCw1YvYKSg";

const CLOUD_VIDEOS = [
  {
    id: 'NNnJevwax-8',
    label: 'Software Introduction',
    description: 'A brief introduction to AutoCount CloudAccounting and its capabilities.',
    note: 'Introduction',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
  },
  {
    id: 'zHstLv2-ATw',
    label: 'General Tutorial',
    description: 'Learn AutoCount CloudAccounting in Just 30 Minutes. A fast orientation for owners and accounts teams who want to understand the workflow before starting a trial.',
    note: 'Quick-Start Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'pHRMw-oo0o0',
    label: 'e-Invoice Tutorial',
    description: 'Learn how to generate e-Invoices with AutoCount CloudAccounting seamlessly.',
    note: 'e-Invoice Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  }
];

const RELEASES = cloudReleases;

const CLOUD_SECTIONS = [
  { id: "features", label: "Advantages", icon: IconStar, color: "#16a14b" },
  { id: "promotions", label: "Promotions", icon: IconRocket, color: "#16a14b" },
  { id: "training", label: "30-Min Guide", icon: IconVideo, color: "#16a14b" },
  { id: "editions", label: "Editions", icon: IconGrid, color: "#2f315a" },
  { id: "releases", label: "Release Notes", icon: IconLedger, color: "#16a14b" },
  { id: "why-ksl", label: "Why Choose Us", icon: IconTrophy, color: "#16a14b" },
];

const FEATURES = [
  {
    icon: "/images/services/lhdn-logo.webp",
    title: "LHDN e-Invoice Ready",
    desc: "Directly supports Malaysia e-Invoice workflows so daily billing can stay compliant without a separate add-on.",
  },
  {
    icon: "/images/icons/feature-device.svg",
    title: "Anytime, Anywhere, Any Device",
    desc: "Access your account book through a browser on desktop, tablet, or phone without maintaining your own server.",
  },
  {
    icon: "/images/icons/feature-scan.svg",
    title: "Capture, Upload & Extract Data",
    desc: "Use AI SmartScan to capture invoices, bills, and receipts, then extract key transaction details automatically.",
  },
  {
    icon: "/images/icons/feature-bank.svg",
    title: "Bank Connection",
    desc: "Connect supported business bank feeds for faster reconciliation and clearer real-time cash visibility.",
  },
];

const CLOUD_PROMOTIONS = [
  {
    title: "24 Months Subscription with 75% Off",
    image: "/images/promotions/autocount-cloudaccounting-75-promo.webp",
    cta: { href: FREE_TRIAL_URL, target: "_blank" },
  },
  {
    title: "Earn rewards when you refer AutoCount users",
    image: "/images/promotions/ksl-referral-program.webp",
    cta: { href: FREE_TRIAL_URL, target: "_blank" },
  },
  {
    title: "CloudAccounting 65 Promo",
    image: "/images/promotions/autocount-cloudaccounting-65-promo.webp",
    cta: { href: FREE_TRIAL_URL, target: "_blank" },
  },
];

const EDITIONS = ["Lite", "Basic", "Plus", "Pro", "Accountant"];
const EDITION_CODE = {
  Lite: "lite",
  Basic: "basic",
  Plus: "plus",
  Pro: "pro",
  Accountant: "acct",
};
const CODE_TO_EDITION = Object.fromEntries(
  Object.entries(EDITION_CODE).map(([name, code]) => [code, name])
);

const CLOUD_EDITION_TABLE = {
  topRows: [
    ["Monthly Price", ["RM 70 /mo", "RM 100 /mo", "RM 140 /mo", "RM 180 /mo", "RM 10 /mo"]],
    ["12 Months Price (65% off)", ["RM 294", "RM 420", "RM 588", "RM 756", "RM 120"]],
    ["24 Months Price (75% off)", ["RM 420", "RM 600", "RM 840", "RM 1,080", "RM 240"]],
    ["Best for", ["Start-up / Micro Company", "Professional Services", "Trading of products", "Multi-warehouse", "Accounting firm"]],
    ["Included users", ["1 user", "2 users", "3 users", "3 users", "2 users"]],
    ["Accountant access", ["1 accountant", "1 accountant", "1 accountant", "1 accountant", ""]],
  ],
  sections: [
    {
      name: "ACCOUNTING MODULES",
      rows: [
        ["Accounting", ["+", "+", "+", "+", "+"]],
        ["Auto Bank Reconciliation", ["+", "+", "+", "+", "+"]],
      ],
    },
    {
      name: "SALES MODULES",
      rows: [
        ["Quotation, Invoice, Credit Note", ["+", "+", "+", "+", "Only Invoice, Credit Note"]],
        ["Printing of Sales Document", ["+", "+", "+", "+", ""]],
        ["Sales Report - Monthly Sales Analysis", ["", "+", "+", "+", ""]],
        ["Sales Report - Profit & Loss of Document", ["", "", "+", "+", ""]],
      ],
    },
    {
      name: "PURCHASE MODULES",
      rows: [
        ["Purchase Order, Invoice, Return", ["+", "+", "+", "+", "Only Purchase Invoice, Purchase Return"]],
        ["Printing of Purchase Document", ["Only Purchase Order", "+", "+", "+", ""]],
        ["Purchase Report - Monthly Purchase Analysis", ["", "+", "+", "+", ""]],
      ],
    },
    {
      name: "OTHERS MODULES",
      rows: [
        ["LHDN e-Invoice", ["+", "+", "+", "+", "+"]],
        ["SST", ["", "+", "+", "+", "+"]],
        ["Recurring Transaction", ["", "+", "+", "+", "+"]],
        ["Multi-Currency", ["", "", "+", "+", "+"]],
        ["Track Inventory", ["", "", "+", "+", ""]],
        ["Track Product Variant", ["", "", "+", "+", ""]],
        ["Department", ["", "", "+", "+", "+"]],
        ["Multi-Location", ["", "", "", "+", ""]],
        ["Customize Financial Report Layout", ["", "", "", "+", "+"]],
        ["AI SmartScan *", ["+", "+", "+", "+", "+"]],
        ["Attachment", ["5GB", "5GB", "10GB", "20GB", "5GB"]],
      ],
    },
    {
      name: "SUPPORT",
      rows: [
        ["Email Ticketing", ["+", "+", "+", "+", "+"]],
        ["Live Chat", ["+", "+", "+", "+", "+"]],
        ["Phone Support", ["A fee is chargeable", "A fee is chargeable", "A fee is chargeable", "A fee is chargeable", "A fee is chargeable"]],
      ],
    },
    {
      name: "ADD-ON",
      rows: [
        ["Add-on User", ["RM10 /month /per user", "RM10 /month /per user", "RM20 /month /per user", "RM20 /month /per user", "RM10 /month /per user"]],
      ],
    },
  ],
};

function EditionMarker({ value }) {
  if (value === "+") {
    return <span style={{ color: "#16a14b", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>✔</span>;
  }
  if (!value) {
    return null;
  }
  return <span style={{ color: "#444", fontWeight: 500, fontSize: "0.84rem", lineHeight: 1.3 }}>{value}</span>;
}

const fmtDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" });
};

const versionCode = (release) => String(release?.version || "").split(".").at(-1) || "";
const findByCode = (code) => RELEASES.find((release) => versionCode(release) === String(code));

function copyRelease(release, type) {
  const lines = type === "features" ? release.features : release.fixes;
  const title = type === "features"
    ? `*AutoCount CloudAccounting ${release.version} - Enhancements*`
    : `*AutoCount CloudAccounting ${release.version} - Bug Fixes*`;
  navigator.clipboard.writeText(`${title}\n${lines.map((line) => `- ${line}`).join("\n")}`).catch(() => {});
}

function copyCompare(items, fromVersion, toVersion, type) {
  const title = type === "features"
    ? `*AutoCount CloudAccounting Enhancements (${fromVersion} to ${toVersion})*`
    : `*AutoCount CloudAccounting Bug Fixes (${fromVersion} to ${toVersion})*`;
  navigator.clipboard.writeText(`${title}\n${items.map((item) => `[${item.rev}] - ${item.text}`).join("\n")}`).catch(() => {});
}

function EditionTable({ selected = null, diffOnly = false }) {
  const cols = selected?.length ? selected : EDITIONS;
  const colIdx = getEditionColumnIndexes(EDITIONS, selected);
  const filterRow = (values) => filterEditionValues(values, colIdx);
  const rowDiffers = (values) => editionRowDiffers(values, colIdx);

  return (
    <div className="ks-compare-panel">
      <div className="ks-compare-wrap">
        <table className="ks-compare-table">
          <thead className="ks-compare-thead">
            <tr style={{ "--th-bg": "#16a14b" }}>
              <th className="ks-compare-th ks-compare-th-left"></th>
              {cols.map(e => (
                <th key={e} className="ks-compare-th">{e}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLOUD_EDITION_TABLE.topRows.map(([rowName, values], idx) => {
              const isFirst = idx === 0;
              const isPriceRow = rowName.includes("Price");
              return (
                <tr key={rowName} className={isPriceRow ? "ks-compare-tr-book" : "ks-compare-tr-data"}>
                  <CompareFeatureCell className={isPriceRow ? "ks-compare-td-book" : "ks-compare-td-data"} style={{ fontWeight: 500 }}>
                    {rowName}
                  </CompareFeatureCell>
                  {filterRow(values).map((v, i) => (
                    <td key={i} className={isPriceRow ? "ks-compare-td-book" : "ks-compare-td-data"}>
                      {isFirst && v.includes("More info") ? (
                        <>
                          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#16a14b" }}>RM 10 /mo</div>
                          <a href="#" style={{ fontSize: "0.75rem", color: "#16a14b", textDecoration: "underline" }}>More info</a>
                        </>
                      ) : (
                        <span style={isPriceRow ? { fontWeight: 700, fontSize: "1.1rem", color: "#16a14b" } : {}}>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}

            {CLOUD_EDITION_TABLE.sections.map((section) => {
              const rows = diffOnly
                ? section.rows.filter(([, values]) => rowDiffers(values))
                : section.rows;
              if (rows.length === 0) return null;
              return (
                <React.Fragment key={section.name}>
                  <tr className="ks-compare-tr-section">
                    <td colSpan={cols.length + 1} className="ks-compare-td-section">
                      {section.name}
                    </td>
                  </tr>
                  {rows.map(([rowName, values]) => {
                    const visibleVals = filterRow(values);
                    return (
                      <tr key={rowName} className="ks-compare-tr-data">
                        <CompareFeatureCell style={{ fontWeight: 500 }}>
                          {rowName}
                        </CompareFeatureCell>
                        {rowName === "Phone Support" ? (
                          <td colSpan={cols.length} className="ks-compare-td-data" style={{ fontStyle: "italic", color: "#6b6f91" }}>
                            A fee is chargeable for Phone Support
                          </td>
                        ) : (
                          visibleVals.map((v, vi) => (
                            <td key={vi} className="ks-compare-td-data">
                              <EditionMarker value={v} />
                            </td>
                          ))
                        )}
                      </tr>
                    );
                  })}
                  {section.name === "SUPPORT" && (
                    <tr className="ks-compare-tr-data">
                      <CompareFeatureCell style={{ fontWeight: 500 }}>API for Integration</CompareFeatureCell>
                      <td colSpan={cols.length} className="ks-compare-td-data">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                           {/* Render the check under PLUS if needed, but it's simpler to just center the text as requested */}
                           <a href="https://accounting-api.autocountcloud.com/documentation/" target="_blank" rel="noopener noreferrer" style={{ color: "#16a14b", textDecoration: "underline", fontWeight: 500 }}>More information on Open API available</a>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReleaseCard({ release, expanded, onToggle }) {
  const isLatest = release === RELEASES[0];
  const hasHighlights = release.highlights?.length > 0;

  return (
    <div id={`cloud-release-${versionCode(release)}`} className="release-card" style={{
      borderRadius: 14,
      border: `1px solid ${expanded ? "rgba(47,49,90,0.22)" : "rgba(47,49,90,0.1)"}`,
      background: "#ffffff",
      overflow: "hidden",
      scrollMarginTop: 28,
    }}>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onToggle();
        }}
        className="release-card-header cloud-release-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.1rem 1.4rem",
          background: expanded ? "#f8f8fb" : "#ffffff",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div className="release-card-main" style={{ flex: 1, minWidth: 0 }}>
          <div className="release-card-title-row" style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="release-card-version" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2f315a" }}>{release.version}</span>
            <span className="release-card-rev" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a8abcc" }}>{release.rev}</span>
          </div>
          <div className="release-card-actions" style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.42rem" }}>
            {isLatest && (
              <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", background: "#2f315a", color: "#ffffff", padding: "0.18rem 0.6rem", borderRadius: 50 }}>
                Latest
              </span>
            )}
            {hasHighlights && (
              <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(0,158,57,0.12)", color: "#009e39", padding: "0.18rem 0.58rem", borderRadius: 50 }}>
                Highlights
              </span>
            )}
            <a
              href={release.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              style={{ color: "#009e39", fontSize: "0.66rem", fontWeight: 800, textDecoration: "none" }}
            >
              Official Note
            </a>
            <ShareLinkButton variant="button" compact hash={`#cloud-release-${versionCode(release)}`} params={{ cr: versionCode(release) }} />
          </div>
          <div className="release-card-meta" style={{ fontSize: "0.78rem", color: "#a8abcc", marginTop: 2 }}>
            Released {fmtDate(release.date) || release.postedLabel || "from official help centre"}
          </div>
        </div>

        <div className="release-card-counts" style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: "#2f315a", fontWeight: 700 }}>{release.features.length} New</span>
          <span style={{ fontSize: "0.72rem", color: "#009e39", fontWeight: 700 }}>{release.fixes.length} Fix</span>
        </div>
        <svg className="release-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2" style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: "0 1.4rem 1.4rem", borderTop: "0.5px solid rgba(47,49,90,0.08)" }}>
          {hasHighlights && (
            <div style={{ marginTop: "1.1rem", marginBottom: "1.1rem", padding: "1rem", borderRadius: 12, background: "rgba(0,158,57,0.08)", border: "1px solid rgba(0,158,57,0.18)" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#009e39", marginBottom: "0.55rem" }}>
                Highlights
              </div>
              {release.highlights.slice(0, 4).map((item, index) => (
                <div key={index} style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "#4d4f68", marginBottom: index === release.highlights.slice(0, 4).length - 1 ? 0 : "0.35rem" }}>
                  {item}
                </div>
              ))}
            </div>
          )}
          <div className="cloud-release-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: hasHighlights ? 0 : "1.1rem" }}>
            <ReleaseList title="New Features" items={release.features} type="feature" copy={() => copyRelease(release, "features")} />
            <ReleaseList title="Bug Fixes" items={release.fixes} type="fix" copy={() => copyRelease(release, "fixes")} />
          </div>
        </div>
      )}
    </div>
  );
}

function ReleaseList({ title, items, type, copy }) {
  const gold = type === "fix";
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.75rem" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: gold ? "#009e39" : "#2f315a" }}>
          {title}
        </div>
        {items.length > 0 && <CopyReleaseButton variant="button" onClick={copy} gold={gold} />}
      </div>
      {items.length === 0 && (
        <div style={{ fontSize: "0.82rem", color: "#a8abcc", lineHeight: 1.6 }}>
          No items listed in this official note.
        </div>
      )}
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.55rem" }}>
          <ReleaseNumber number={index + 1} type={type} fixColor="#009e39" fixBg="rgba(0,158,57,0.12)" />
          <span className="ks-list-text">{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function AutoCountCloudAccountingPage() {
  const [editionCompareMode, setEditionCompareMode] = useState(false);
  const [editionA, setEditionA] = useState(EDITIONS[0]);
  const [editionB, setEditionB] = useState(EDITIONS[3]);
  const [editionDiffOnly, setEditionDiffOnly] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(RELEASES[RELEASES.length - 1]?.version || "");
  const [compareB, setCompareB] = useState(RELEASES[0]?.version || "");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(5);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eaName = CODE_TO_EDITION[params.get("cea")] || params.get("editionA");
    const ebName = CODE_TO_EDITION[params.get("ceb")] || params.get("editionB");
    if (params.get("cem") === "c" || eaName || ebName) {
      setEditionCompareMode(true);
      if (eaName && EDITIONS.includes(eaName)) setEditionA(eaName);
      if (ebName && EDITIONS.includes(ebName)) setEditionB(ebName);
      if (params.get("ced") === "1") setEditionDiffOnly(true);
    }

    const fromRelease = findByCode(params.get("cva")) || RELEASES.find((release) => release.version === params.get("vA"));
    const toRelease = findByCode(params.get("cvb")) || RELEASES.find((release) => release.version === params.get("vB"));
    if (params.get("cvm") === "c" || fromRelease || toRelease) {
      setCompareMode(true);
      if (fromRelease) setCompareA(fromRelease.version);
      if (toRelease) setCompareB(toRelease.version);
    }

    const hashRelease = window.location.hash.match(/^#cloud-release-(\d+)$/);
    const sharedRelease = findByCode(params.get("cr")) || (hashRelease && findByCode(hashRelease[1]));
    if (sharedRelease) {
      setCompareMode(false);
      setExpanded(sharedRelease.version);
    }

    const scrollTarget = window.location.hash || (sharedRelease ? `#cloud-release-${versionCode(sharedRelease)}` : "");
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.querySelector(scrollTarget);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return RELEASES;
    return RELEASES.filter((release) => (
      release.version.includes(q) ||
      release.rev.toLowerCase().includes(q) ||
      release.features.some((item) => item.toLowerCase().includes(q)) ||
      release.fixes.some((item) => item.toLowerCase().includes(q)) ||
      release.highlights?.some((item) => item.toLowerCase().includes(q))
    ));
  }, [search]);

  const highlightCount = RELEASES.filter((release) => release.highlights?.length > 0).length;

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <SectionSidebar sections={CLOUD_SECTIONS} themeColor="#16a14b" />

      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Cloud Accounting"
          title="AutoCount CloudAccounting"
          body="A secure browser-based accounting platform for Malaysian SMEs that need e-Invoice compliance, real-time access, document capture, and bank-connected bookkeeping without maintaining an office server."
          iconSrc="/images/products/cloudaccounting-icon.webp"
          iconAlt="AutoCount CloudAccounting"
          backgroundImage="/images/products/autocount-cloudaccounting-hero.webp"
          primaryCta={{ label: "Start Free Trial", href: FREE_TRIAL_URL, target: "_blank", className: "ks-btn-cloud" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
      {/* ── Feature highlights ── */}
      <div className="product-app-section product-app-section-paper product-app-section-clean" style={{ '--feature-strip-bg': 'linear-gradient(180deg, #16a14b 0%, #0d7032 100%)', '--feature-strip-shadow': '0 0 16px rgba(22, 161, 75, 0.4)' }}>
        <FeatureShowcase features={FEATURES} />
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-paper)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
        <PageSectionDivider sections={CLOUD_SECTIONS} id="promotions" />
      </div>

      <div className="product-app-section product-app-section-paper product-app-section-clean">
        <ProductPromotionBento
          id="promotions"
          title="CloudAccounting Subscription Offers"
          accent="#16a14b"
          items={CLOUD_PROMOTIONS}
        />
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
        <PageSectionDivider sections={CLOUD_SECTIONS} id="training" />
      </div>

      <div className="product-app-section product-app-section-mist product-app-section-from-paper product-app-section-to-ice">
        <div id="training">
          <AutoCountTrainingWebGL 
            customVideos={CLOUD_VIDEOS} 
            title="AutoCount CloudAccounting Quick-Start Guide"
            themeColor="#16a14b" 
            themeHoverColor="#19b554" 
            activeTabBg="#2f315a"
            playBtnBg="#16a14b" 
            playIconColor="#ffffff" 
          />
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
        <PageSectionDivider sections={CLOUD_SECTIONS} id="editions" />
      </div>

      <div id="editions" className="ac-section-tight product-app-section product-app-section-ice product-app-section-to-cloud" style={{ overflow: "visible" }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.7rem" }}>
            <h2 className="ks-section-title" style={{ marginBottom: "0.85rem" }}>
              Comparing 5 Editions of CloudAccounting
            </h2>
            <p className="ks-body-text" style={{ maxWidth: 680, margin: "0 auto" }}>
              Use Lite for simple billing, move to Plus or Pro when stock and branch control become important, or choose Accountant when managing multiple client books.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.6rem" }}>
            <SegmentedControl
              ariaLabel="Edition view mode"
              value={editionCompareMode ? "compare" : "browse"}
              onChange={(mode) => setEditionCompareMode(mode === "compare")}
              options={[
                { value: "browse", label: "Browse All Editions" },
                { value: "compare", label: "Compare Editions" },
              ]}
            />
          </div>

          {editionCompareMode && (
            <div style={{ maxWidth: 760, margin: "0 auto 1.5rem" }}>
              <div className="cloud-compare-selectors" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
                <SelectField
                  label="Edition A"
                  value={editionA}
                  onChange={setEditionA}
                  options={EDITIONS.map((edition) => ({ value: edition, label: edition }))}
                />
                <div style={{ textAlign: "center", fontSize: "1rem", fontWeight: 800, color: "#009e39", marginTop: "1.2rem" }}>VS</div>
                <SelectField
                  label="Edition B"
                  value={editionB}
                  onChange={setEditionB}
                  options={EDITIONS.map((edition) => ({ value: edition, label: edition }))}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.25rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#6b6f91", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={editionDiffOnly}
                    onChange={(event) => setEditionDiffOnly(event.target.checked)}
                    style={{ accentColor: "#2f315a", cursor: "pointer" }}
                  />
                  Show only rows where the two editions differ
                </label>
                <ShareLinkButton
                  variant="button"
                  hash="#editions"
                  params={{
                    cem: "c",
                    cea: EDITION_CODE[editionA],
                    ceb: EDITION_CODE[editionB],
                    ced: editionDiffOnly,
                  }}
                />
              </div>
            </div>
          )}

          <EditionTable
            selected={editionCompareMode ? [editionA, editionB] : null}
            diffOnly={editionCompareMode && editionA !== editionB && editionDiffOnly}
          />

          <div className="ks-note-text" style={{ marginTop: "1rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem", color: "#6b6f91" }}>
            <h4 style={{ fontWeight: 700, margin: 0, color: "#2f315a", fontSize: "0.85rem" }}>FREE TRIAL RANGE BASED ON MODULE</h4>
            <div><strong style={{ color: "#444" }}>Sales Module:</strong> Unlimited transaction including Quotation, Invoice, Credit Note (CN.)*</div>
            <div><strong style={{ color: "#444" }}>Purchase Module:</strong> Up to 60 transactions including Purchase Order (PO.), Purchase Invoices (PI.) and Purchase Return (PR.)*</div>
            <div><strong style={{ color: "#444" }}>Stock Module:</strong> Up to 60 transactions including Stock Adjustment and Stock Transfer*</div>
            <div><strong style={{ color: "#444" }}>Accounting Module:</strong> Up to 60 transactions including Cash Book and Journal Voucher.*</div>
            <div style={{ marginTop: "0.5rem" }}>*Free Trial: use for free until any of the above modules reaches its free trial transaction limit within a calendar year.</div>
            <div>*Prices exclude 8% SST.</div>
            <div>*All promotion offers are subject to terms and conditions.</div>
          </div>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
        <PageSectionDivider sections={CLOUD_SECTIONS} id="releases" />
      </div>

      <div id="releases" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-to-warm">
        <div className="content-wrap">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>

              <h2 className="ks-section-title">
                Release Notes - CloudAccounting
              </h2>
              <p className="ks-card-text" style={{ marginTop: "0.35rem" }}>
                {RELEASES.length} releases - {highlightCount} with highlights - {RELEASES.at(-1)?.version} to {RELEASES[0]?.version} - Newest first
              </p>
            </div>

            <SegmentedControl
              ariaLabel="Release notes view mode"
              value={compareMode ? "compare" : "browse"}
              onChange={(mode) => setCompareMode(mode === "compare")}
              options={[
                { value: "browse", label: "Browse All" },
                { value: "compare", label: "Compare Versions" },
              ]}
              style={{ background: "#f0f0f5" }}
            />
          </div>

          {compareMode ? (
            <ReleaseCompare
              compareA={compareA}
              setCompareA={setCompareA}
              compareB={compareB}
              setCompareB={setCompareB}
            />
          ) : (
            <>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search version or keyword..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="ks-field"
                    style={{ paddingLeft: 34, paddingRight: 12, minHeight: 38, borderRadius: 50 }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(null)}
                  className="ks-btn ks-btn-sm ks-btn-muted"
                >
                  Collapse all
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#a8abcc", fontSize: "0.9rem" }}>
                    No releases match "{search}"
                  </div>
                )}
                {filtered.slice(0, visibleLimit).map((release) => (
                  <ReleaseCard
                    key={release.version}
                    release={release}
                    expanded={expanded === release.version}
                    onToggle={() => setExpanded(expanded === release.version ? null : release.version)}
                  />
                ))}
                {visibleLimit < filtered.length && (
                  <div style={{ textAlign: "center", paddingTop: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setVisibleLimit(l => l + 5)}
                      className="ks-btn ks-btn-outline ks-btn-md"
                    >
                      View more releases
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          
        </div>
      </div>

      <WhyChooseUs section={getSection(CLOUD_SECTIONS, "why-ksl")} sectionFrom="var(--ks-page-cloud)" sectionTo="var(--ks-page-warm)" />
      <EnquireNowCTA 
        heading="Move accounting work into the cloud with proper guidance."
        body="KSL can help you choose the right edition, start the free trial, and prepare the account book for daily use."
        buttons={[{ label: "Enquire Now", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
      />

      <Footer />
      </main>
    </div>
  );
}

function ReleaseCompare({ compareA, setCompareA, compareB, setCompareB }) {
  const rA = RELEASES.find((release) => release.version === compareA) || RELEASES.at(-1);
  const rB = RELEASES.find((release) => release.version === compareB) || RELEASES[0];
  const idxA = RELEASES.indexOf(rA);
  const idxB = RELEASES.indexOf(rB);
  const older = idxA > idxB ? rA : rB;
  const newer = idxA > idxB ? rB : rA;
  const olderIdx = RELEASES.indexOf(older);
  const newerIdx = RELEASES.indexOf(newer);
  const between = olderIdx === newerIdx ? [newer] : RELEASES.slice(newerIdx, olderIdx);
  const allFeatures = between.flatMap((release) => release.features.map((text) => ({ ver: release.version, rev: release.rev, text })));
  const allFixes = between.flatMap((release) => release.fixes.map((text) => ({ ver: release.version, rev: release.rev, text })));

  return (
    <div>
      <div className="cloud-compare-selectors" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
        <SelectField
          label="From version"
          value={compareA}
          onChange={setCompareA}
          options={RELEASES.map((release) => ({ value: release.version, label: `${release.version} (${release.rev})` }))}
        />
        <div style={{ textAlign: "center", fontSize: "1.3rem", color: "#009e39", marginTop: "1.2rem" }}>-&gt;</div>
        <SelectField
          label="To version"
          value={compareB}
          onChange={setCompareB}
          options={RELEASES.map((release) => ({ value: release.version, label: `${release.version} (${release.rev})` }))}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
        <ShareLinkButton
          variant="button"
          hash="#releases"
          params={{
            cvm: "c",
            cva: versionCode(RELEASES.find((release) => release.version === compareA)),
            cvb: versionCode(RELEASES.find((release) => release.version === compareB)),
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Releases covered", value: between.length, bg: "rgba(47,49,90,0.06)", color: "#2f315a" },
          { label: "New features", value: allFeatures.length, bg: "rgba(47,49,90,0.06)", color: "#2f315a" },
          { label: "Bug fixes", value: allFixes.length, bg: "rgba(0,158,57,0.1)", color: "#009e39" },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1, minWidth: 130, background: item.bg, borderRadius: "var(--radius-card)", padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div className="ks-control-label" style={{ marginTop: 4, marginBottom: 0 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="cloud-release-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <CompareList
          title={`New Features (${allFeatures.length})`}
          items={allFeatures}
          type="feature"
          copy={() => copyCompare(allFeatures, compareA, compareB, "features")}
        />
        <CompareList
          title={`Bug Fixes (${allFixes.length})`}
          items={allFixes}
          type="fix"
          copy={() => copyCompare(allFixes, compareA, compareB, "fixes")}
        />
      </div>
    </div>
  );
}

function CompareList({ title, items, type, copy }) {
  const gold = type === "fix";
  return (
    <div className="ks-panel" style={{ padding: "1.4rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: "0.75rem" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: gold ? "#009e39" : "#2f315a" }}>
          {title}
        </div>
        {items.length > 0 && <CopyReleaseButton variant="button" onClick={copy} gold={gold} />}
      </div>
      {items.length === 0 && (
        <div style={{ fontSize: "0.82rem", color: "#a8abcc", lineHeight: 1.6 }}>No items listed in this range.</div>
      )}
      {items.map((item, index) => (
        <div key={`${item.rev}-${index}`} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
          <CompareRevBadge type={type}>
            {item.rev}
          </CompareRevBadge>
          <span className="ks-list-text">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

