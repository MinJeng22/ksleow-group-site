import React, { useEffect, useMemo, useRef, useState } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { Img } from "../../components/Media.jsx";
import SectionDivider, { IconVideo, IconGrid, IconLedger, IconStar } from "../../components/SectionDivider.jsx";
import cloudReleases from "../../content/autocountCloudReleases.json";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to start AutoCount CloudAccounting free trial and compare the available editions. Thank you."
)}`;

const OFFICIAL_PRODUCT_URL = "https://www.autocountsoft.com/pro-cloud-acc.html";
const OFFICIAL_RELEASE_URL = "https://help.accounting.autocountcloud.com/support/discussions/forums/69000107078";
const FREE_TRIAL_URL = "https://auth.autocountcloud.com/identity/account/register/accounting?dealerCode=SYNS6037";
const TRAINING_URL = "https://youtu.be/zHstLv2-ATw?si=tSfLxwPCw1YvYKSg";
const TRAINING_EMBED = "https://www.youtube.com/embed/zHstLv2-ATw";

const RELEASES = cloudReleases;

const SIDEBAR_ITEMS = [
  { id: "features", label: "Advantages",    icon: IconStar },
  { id: "training", label: "30-Min Guide",  icon: IconVideo },
  { id: "editions", label: "Editions",      icon: IconGrid },
  { id: "releases", label: "Release Notes", icon: IconLedger },
];

const FEATURES = [
  {
    icon: "/images/services/lhdn-logo.png",
    title: "LHDN e-Invoice Ready",
    desc: "Directly supports Malaysia e-Invoice workflows so daily billing can stay compliant without a separate add-on.",
  },
  {
    icon: "/images/icons/integration-icon.png",
    title: "Anytime, Anywhere, Any Device",
    desc: "Access your account book through a browser on desktop, tablet, or phone without maintaining your own server.",
  },
  {
    icon: "/images/branding/ksl-logo-circle.webp",
    title: "Capture, Upload & Extract Data",
    desc: "Use AI SmartScan to capture invoices, bills, and receipts, then extract key transaction details automatically.",
  },
  {
    icon: "/images/icons/ac-plugin-icon.png",
    title: "Bank Connection",
    desc: "Connect supported business bank feeds for faster reconciliation and clearer real-time cash visibility.",
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

const EDITION_ROWS = [
  ["Monthly price", ["RM 70", "RM 100", "RM 140", "RM 180", "RM 10"]],
  ["Best for", ["Start-up / Micro Company", "Professional Services", "Trading of products", "Multi-warehouse", "Accounting firm"]],
  ["Included users", ["1 user", "2 users", "3 users", "3 users", "2 users"]],
  ["Accountant access", ["1 accountant", "1 accountant", "1 accountant", "1 accountant", "Client account books"]],
  ["Sales documents", ["Invoice, Credit Note", "Quotation, Invoice, Credit Note", "Quotation, Invoice, Credit Note", "Quotation, Invoice, Credit Note", "Client review"]],
  ["Purchase documents", ["Purchase Invoice, Purchase Return", "Purchase Order, Purchase Invoice, Purchase Return", "Purchase Order, Purchase Invoice, Purchase Return", "Purchase Order, Purchase Invoice, Purchase Return", "Client review"]],
  ["LHDN e-Invoice", ["Included", "Included", "Included", "Included", "Included"]],
  ["AI SmartScan", ["Included", "Included", "Included", "Included", "Included"]],
  ["Bank connection", ["Available", "Available", "Available", "Available", "Available"]],
  ["Attachment storage", ["5GB", "5GB", "10GB", "20GB", "5GB"]],
  ["Operating fit", ["Simple online billing", "Service business", "Product trading", "Inventory and branches", "Manage client books"]],
  ["Add-on user", ["RM10 / month", "RM10 / month", "RM20 / month", "RM20 / month", "RM10 / month"]],
];

const fmtDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" });
};

const versionCode = (release) => String(release?.version || "").split(".").at(-1) || "";
const findByCode = (code) => RELEASES.find((release) => versionCode(release) === String(code));

function CopyBtn({ onClick, gold = false }) {
  const [copied, setCopied] = useState(false);
  function handle(event) {
    event.stopPropagation();
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handle}
      className="ks-btn ks-btn-sm ks-btn-muted"
      style={{
        gap: "0.35rem",
        background: copied ? (gold ? "rgba(201,168,76,0.18)" : "rgba(47,49,90,0.1)") : "#fff",
        border: `1px solid ${gold ? "rgba(201,168,76,0.32)" : "rgba(47,49,90,0.14)"}`,
        color: copied ? (gold ? "#8a6a10" : "#2f315a") : "#6b6f91",
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ShareLinkButton({ params, hash, compact = false }) {
  const [copied, setCopied] = useState(false);

  function handle(event) {
    event.stopPropagation();
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== false) {
        usp.set(key, value === true ? "1" : String(value));
      }
    });
    const query = usp.toString();
    const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ""}${hash}`;
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(fallback);
    } else {
      fallback();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handle}
      className={`ks-btn ks-btn-muted ${compact ? "ks-btn-sm" : ""}`}
      style={{
        gap: compact ? "0.32rem" : "0.45rem",
        background: copied ? "rgba(201,168,76,0.16)" : "#ffffff",
        color: copied ? "#8a6a10" : "#2f315a",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      {copied ? "Link copied" : "Share Link"}
    </button>
  );
}

function ReleaseNumber({ number, type }) {
  return (
    <span style={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: type === "fix" ? "rgba(201,168,76,0.12)" : "rgba(47,49,90,0.08)",
      color: type === "fix" ? "#8a6a10" : "#2f315a",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: "0.68rem",
      fontWeight: 800,
      marginTop: 1,
    }}>
      {number}
    </span>
  );
}

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

function FeatureHighlights() {
  const gridRef = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.22 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div id="features" className="ac-section-tight ac-features-showcase" style={{ scrollMarginTop: 24, position: "relative", zIndex: 1 }}>
      <div className="content-wrap">
        <div ref={gridRef} className={`ac-features-grid${inView ? " is-in-view" : ""}`}>
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="ac-feature-card"
              style={{ "--feature-delay": `${index * 90}ms` }}
            >
              <span className="ac-feature-icon">
                <Img src={feature.icon} alt="" />
              </span>
              <span className="ac-feature-copy">
                <span className="ac-feature-title">{feature.title}</span>
                <span className="ac-feature-desc">{feature.desc}</span>
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditionTable({ selected = null, diffOnly = false }) {
  const cols = selected?.length ? selected : EDITIONS;
  const indexes = cols.map((col) => EDITIONS.indexOf(col));
  const visibleRows = EDITION_ROWS.filter(([, values]) => {
    if (!diffOnly) return true;
    const subset = indexes.map((i) => values[i]);
    return !subset.every((value) => value === subset[0]);
  });

  return (
    <div className="ks-panel" style={{ overflow: "hidden", boxShadow: "0 4px 20px rgba(47,49,90,0.05)" }}>
      <div style={{ overflowX: "auto", maxHeight: "min(72vh, 760px)", overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
          <thead>
            <tr style={{ background: "#2f315a" }}>
              <th style={{ position: "sticky", top: 0, zIndex: 3, minWidth: 190, padding: "0.7rem", color: "#ffffff", textAlign: "left" }}></th>
              {cols.map((edition) => (
                <th key={edition} style={{ position: "sticky", top: 0, zIndex: 3, minWidth: 130, padding: "0.7rem", color: "#ffffff", textAlign: "center", fontWeight: 800 }}>
                  {edition}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(([label, values], rowIndex) => (
              <tr key={label} style={{ background: rowIndex % 2 === 0 ? "#ffffff" : "#fafafb", borderBottom: "1px solid rgba(47,49,90,0.06)" }}>
                <td style={{ position: "sticky", left: 0, zIndex: 2, background: rowIndex % 2 === 0 ? "#ffffff" : "#fafafb", padding: "0.7rem", color: "#2f315a", fontWeight: 700 }}>
                  {label}
                </td>
                {indexes.map((index) => (
                  <td key={`${label}-${index}`} style={{ padding: "0.7rem", color: "#444", textAlign: "center", lineHeight: 1.45 }}>
                    {values[index]}
                  </td>
                ))}
              </tr>
            ))}
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
              <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", background: "#2f315a", color: "#c9a84c", padding: "0.18rem 0.6rem", borderRadius: 50 }}>
                Latest
              </span>
            )}
            {hasHighlights && (
              <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(201,168,76,0.12)", color: "#8a6a10", padding: "0.18rem 0.58rem", borderRadius: 50 }}>
                Highlights
              </span>
            )}
            <a
              href={release.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              style={{ color: "#8a6a10", fontSize: "0.66rem", fontWeight: 800, textDecoration: "none" }}
            >
              Official Note
            </a>
            <ShareLinkButton compact hash={`#cloud-release-${versionCode(release)}`} params={{ cr: versionCode(release) }} />
          </div>
          <div className="release-card-meta" style={{ fontSize: "0.78rem", color: "#a8abcc", marginTop: 2 }}>
            Released {fmtDate(release.date) || release.postedLabel || "from official help centre"}
          </div>
        </div>

        <div className="release-card-counts" style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: "#2f315a", fontWeight: 700 }}>{release.features.length} New</span>
          <span style={{ fontSize: "0.72rem", color: "#8a6a10", fontWeight: 700 }}>{release.fixes.length} Fix</span>
        </div>
        <svg className="release-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2" style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: "0 1.4rem 1.4rem", borderTop: "0.5px solid rgba(47,49,90,0.08)" }}>
          {hasHighlights && (
            <div style={{ marginTop: "1.1rem", marginBottom: "1.1rem", padding: "1rem", borderRadius: 12, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a6a10", marginBottom: "0.55rem" }}>
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
        <div style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: gold ? "#8a6a10" : "#2f315a" }}>
          {title}
        </div>
        {items.length > 0 && <CopyBtn onClick={copy} gold={gold} />}
      </div>
      {items.length === 0 && (
        <div style={{ fontSize: "0.82rem", color: "#a8abcc", lineHeight: 1.6 }}>
          No items listed in this official note.
        </div>
      )}
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.55rem" }}>
          <ReleaseNumber number={index + 1} type={type} />
          <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{item}</span>
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
  const [expanded, setExpanded] = useState(RELEASES[0]?.version || null);
  const [search, setSearch] = useState("");
  const trainingRef = useRef(null);
  const [trainingInView, setTrainingInView] = useState(false);

  useEffect(() => {
    const node = trainingRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setTrainingInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setTrainingInView(entry.isIntersecting)),
      { threshold: 0.22 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

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
      <SectionSidebar items={SIDEBAR_ITEMS} />

      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Cloud Accounting"
          title="AutoCount CloudAccounting"
          body="A secure browser-based accounting platform for Malaysian SMEs that need e-Invoice compliance, real-time access, document capture, and bank-connected bookkeeping without maintaining an office server."
          iconSrc="/images/products/cloudaccounting-icon.png"
          iconAlt="AutoCount CloudAccounting"
          backgroundImage="/images/products/autocount-accounting-hero.webp"
          primaryCta={{ label: "Start Free Trial", href: FREE_TRIAL_URL, target: "_blank" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
      {/* ── Feature highlights ── */}
      <div className="product-app-section product-app-section-paper product-app-section-clean">
        <FeatureHighlights />
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
        <SectionDivider icon={IconVideo} targetId="training" />
      </div>

      <div className="product-app-section product-app-section-mist product-app-section-from-paper product-app-section-to-ice">
        <div id="training" ref={trainingRef} className="ac-section-tight" style={{ padding: "4.5rem 0", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "2.4rem" }}>

            <h2 className="ks-section-title" style={{ marginBottom: "0.85rem" }}>
              Learn AutoCount CloudAccounting in Just 30 Minutes
            </h2>
            <p className="ks-body-text" style={{ maxWidth: 620, margin: "0 auto 1.35rem" }}>
              A fast orientation for owners and accounts teams who want to understand the workflow before starting a trial.
            </p>
            <a href={TRAINING_URL} target="_blank" rel="noreferrer" className="ks-btn ks-btn-brand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
              Watch on YouTube
            </a>
          </div>

          <div style={{
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(47,49,90,0.16)",
            border: "1px solid rgba(47,49,90,0.08)",
            opacity: trainingInView ? 1 : 0,
            transform: trainingInView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}>
            <div style={{ paddingBottom: "56.25%", position: "relative", background: "#0f1128" }}>
              <iframe
                src={TRAINING_EMBED}
                title="Learn AutoCount CloudAccounting in 30 Minutes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
        <SectionDivider icon={IconGrid} targetId="editions" />
      </div>

      <div id="editions" className="ac-section-tight product-app-section product-app-section-ice product-app-section-to-cloud" style={{ padding: "4.5rem 0 2rem 0", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.7rem" }}>
            <div className="ks-eyebrow" style={{ color: "#7AB317" }}>
              Plans for Different Business Sizes
            </div>
            <h2 className="ks-section-title" style={{ marginBottom: "0.85rem" }}>
              Comparing 5 Editions of CloudAccounting
            </h2>
            <p className="ks-body-text" style={{ maxWidth: 680, margin: "0 auto" }}>
              Use Lite for simple billing, move to Plus or Pro when stock and branch control become important, or choose Accountant when managing multiple client books.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.6rem" }}>
            <div className="ks-tab-list">
              {[["browse", "Browse All Editions"], ["compare", "Compare Editions"]].map(([mode, label]) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setEditionCompareMode(mode === "compare")}
                  className={`ks-tab-button ${(editionCompareMode ? "compare" : "browse") === mode ? "is-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {editionCompareMode && (
            <div style={{ maxWidth: 760, margin: "0 auto 1.5rem" }}>
              <div className="cloud-compare-selectors" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
                <EditionSelect label="Edition A" value={editionA} onChange={setEditionA} />
                <div style={{ textAlign: "center", fontSize: "1rem", fontWeight: 800, color: "#c9a84c", marginTop: "1.2rem" }}>VS</div>
                <EditionSelect label="Edition B" value={editionB} onChange={setEditionB} />
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

          <div className="ks-note-text" style={{ marginTop: "1rem", textAlign: "center" }}>
            Prices shown are monthly public-plan references excluding SST. Confirm current promotion and edition fit with KSL before subscription.
          </div>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
        <SectionDivider icon={IconLedger} targetId="releases" />
      </div>

      <div id="releases" className="ac-section-tight product-app-section product-app-section-cloud" style={{ padding: "2rem 0 4rem 0", scrollMarginTop: 24 }}>
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

            <div className="ks-tab-list" style={{ background: "#f0f0f5" }}>
              {[["browse", "Browse All"], ["compare", "Compare Versions"]].map(([mode, label]) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setCompareMode(mode === "compare")}
                  className={`ks-tab-button ${(compareMode ? "compare" : "browse") === mode ? "is-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
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
                {filtered.map((release) => (
                  <ReleaseCard
                    key={release.version}
                    release={release}
                    expanded={expanded === release.version}
                    onToggle={() => setExpanded(expanded === release.version ? null : release.version)}
                  />
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", borderRadius: 12, background: "rgba(47,49,90,0.04)", border: "1px solid rgba(47,49,90,0.08)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div className="ks-card-title">Official CloudAccounting release notes</div>
              <div className="ks-card-text" style={{ marginTop: 2 }}>Synced from AutoCount Cloud Accounting Help Centre forum topics.</div>
            </div>
            <a href={OFFICIAL_RELEASE_URL} target="_blank" rel="noreferrer" className="ks-btn ks-btn-sm ks-btn-brand">
              Official Forum
            </a>
          </div>
        </div>
      </div>

      <div style={{ background: "#2f315a", padding: "4rem 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 className="ks-section-title" style={{ color: "#ffffff", marginBottom: "0.75rem" }}>
            Move accounting work into the cloud with proper guidance.
          </h2>
          <p className="ks-body-text" style={{ color: "rgba(255,255,255,0.66)", maxWidth: 540, margin: "0 auto 1.75rem" }}>
            KSL can help you choose the right edition, start the free trial, and prepare the account book for daily use.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap" }}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="ks-btn ks-btn-primary ks-btn-lg">
              WhatsApp KSL Support
            </a>
            <a href={OFFICIAL_PRODUCT_URL} target="_blank" rel="noreferrer" className="ks-btn ks-btn-light ks-btn-lg">
              Official Product Page
            </a>
          </div>
        </div>
      </div>

      <Footer />
      </main>
    </div>
  );
}

function EditionSelect({ label, value, onChange }) {
  return (
    <div>
      <label className="ks-control-label">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="ks-field"
        style={{ padding: "0 0.85rem", cursor: "pointer" }}
      >
        {EDITIONS.map((edition) => <option key={edition} value={edition}>{edition}</option>)}
      </select>
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
        <ReleaseSelect label="From version" value={compareA} onChange={setCompareA} />
        <div style={{ textAlign: "center", fontSize: "1.3rem", color: "#c9a84c", marginTop: "1.2rem" }}>-&gt;</div>
        <ReleaseSelect label="To version" value={compareB} onChange={setCompareB} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
        <ShareLinkButton
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
          { label: "Bug fixes", value: allFixes.length, bg: "rgba(201,168,76,0.1)", color: "#8a6a10" },
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

function ReleaseSelect({ label, value, onChange }) {
  return (
    <div>
      <label className="ks-control-label">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="ks-field"
        style={{ padding: "0 0.85rem", cursor: "pointer" }}
      >
        {RELEASES.map((release) => (
          <option key={release.version} value={release.version}>{release.version} ({release.rev})</option>
        ))}
      </select>
    </div>
  );
}

function CompareList({ title, items, type, copy }) {
  const gold = type === "fix";
  return (
    <div className="ks-panel" style={{ padding: "1.4rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: "0.75rem" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: gold ? "#8a6a10" : "#2f315a" }}>
          {title}
        </div>
        {items.length > 0 && <CopyBtn onClick={copy} gold={gold} />}
      </div>
      {items.length === 0 && (
        <div style={{ fontSize: "0.82rem", color: "#a8abcc", lineHeight: 1.6 }}>No items listed in this range.</div>
      )}
      {items.map((item, index) => (
        <div key={`${item.rev}-${index}`} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: gold ? "rgba(201,168,76,0.12)" : "rgba(47,49,90,0.08)", color: gold ? "#8a6a10" : "#2f315a", flexShrink: 0, marginTop: 2 }}>
            {item.rev}
          </span>
          <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
