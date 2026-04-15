import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { WA_LINK } from "../../constants/contact.js";
import { PRODUCT_IMAGES } from "../../assets/assets.js";

/* ═══════════════════════════════════════════════════════════════
 * AUTOCOUNT ACCOUNTING — PRODUCT PAGE
 *
 * RELEASE NOTE DATA
 * ─────────────────
 * Each entry in RELEASES represents one AutoCount 2.2 revision.
 * Format:
 *   version:  "2.2.X.Y"   full version string
 *   rev:      "Rev N"      short revision label shown in timeline
 *   date:     release date (string)
 *   dbVer:    database version upgraded to
 *   server:   required AutoCount Server version
 *   features: string[] — new feature bullet points
 *   fixes:    string[] — bug fix bullet points
 *
 * TO ADD A NEW RELEASE: prepend a new object to the top of the array.
 * The timeline renders newest first automatically.
 * ═══════════════════════════════════════════════════════════════ */
const RELEASES = [
  {
    version: "2.2.25.36", rev: "Rev 36", date: "2026-01-07",
    dbVer: "2.2.91", server: "2.2.13.11",
    features: [
      "New e-Invoice 1.1 format support for LHDN submission",
      "Batch e-Invoice cancellation from document listing",
      "Enhanced multi-currency revaluation report",
    ],
    fixes: [
      "Fixed credit note amount rounding on tax invoice",
      "Resolved slow loading on large customer statement",
      "Fixed print preview crash on dual-monitor setups",
    ],
  },
  {
    version: "2.2.25.34", rev: "Rev 34", date: "2025-10-10",
    dbVer: "2.2.90", server: "2.2.13.9",
    features: [
      "e-Invoice self-billed support for import purchases",
      "New consolidated e-Invoice monthly submission mode",
      "AR/AP ageing report now supports custom date buckets",
    ],
    fixes: [
      "Fixed bank reconciliation discrepancy on forex transactions",
      "Resolved stock transfer negative quantity issue",
      "Fixed missing tax code on recurring journal entries",
    ],
  },
  {
    version: "2.2.22.30", rev: "Rev 30", date: "2025-07-29",
    dbVer: "2.2.87", server: "2.2.13.6",
    features: [
      "MyInvois portal direct submission with QR code display",
      "New project costing module with budget vs actual dashboard",
      "Consignment stock tracking improvements",
    ],
    fixes: [
      "Fixed incorrect GST calculation on mixed-supply invoices",
      "Resolved duplicate entry on auto-payment posting",
      "Fixed export to Excel freezing on large datasets",
    ],
  },
  {
    version: "2.2.19.27", rev: "Rev 27", date: "2025-05-08",
    dbVer: "2.2.84", server: "2.2.13.4",
    features: [
      "New digital signature field on payment vouchers",
      "Improved stock reorder point alert with email notification",
      "Drill-down capability from P&L to source journal entries",
    ],
    fixes: [
      "Fixed posting date override not saving on batch invoice",
      "Resolved cash flow statement missing intercompany transfers",
      "Fixed user permission not restricting cost price view",
    ],
  },
  {
    version: "2.2.18.25", rev: "Rev 25", date: "2025-04-10",
    dbVer: "2.2.83", server: "2.2.13.3",
    features: [
      "Mandatory e-Invoice for businesses above RM 25M threshold",
      "New bulk import for chart of accounts via Excel template",
      "Support for SST rate adjustment effective Q2 2025",
    ],
    fixes: [
      "Fixed outstanding SO report showing cancelled orders",
      "Resolved rounding difference on multicurrency payment",
      "Fixed barcode scanner lag on item search in POS mode",
    ],
  },
  {
    version: "2.2.14.20", rev: "Rev 20", date: "2024-12-18",
    dbVer: "2.2.79", server: "2.2.13.1",
    features: [
      "Initial e-Invoice (MyInvois) integration for LHDN compliance",
      "New cloud backup scheduler with S3 storage support",
      "Redesigned dashboard with customisable widget layout",
    ],
    fixes: [
      "Fixed payroll calculation error for part-time employees",
      "Resolved debtors aging grouping for overdue > 180 days",
      "Fixed PDF invoice missing logo on certain printer drivers",
    ],
  },
  {
    version: "2.2.10.15", rev: "Rev 15", date: "2024-06-20",
    dbVer: "2.2.74", server: "2.2.12.5",
    features: [
      "New intercompany consolidation reporting module",
      "Enhanced stock valuation with FIFO/weighted average toggle",
      "Mobile approval workflow for purchase orders",
    ],
    fixes: [
      "Fixed statement of accounts formatting on A5 paper",
      "Resolved issue with deleted users retaining session access",
      "Fixed tax summary report double-counting on credit notes",
    ],
  },
  {
    version: "2.2.6.10", rev: "Rev 10", date: "2023-11-15",
    dbVer: "2.2.68", server: "2.2.11.2",
    features: [
      "Service Tax 8% rate support (effective March 2024)",
      "New batch email invoices with custom SMTP configuration",
      "Improved multi-branch stock transfer workflow",
    ],
    fixes: [
      "Fixed purchase return posting to wrong creditor account",
      "Resolved sorting issue in stock card detailed report",
      "Fixed UOM conversion rounding on delivery order",
    ],
  },
  {
    version: "2.2.3.5", rev: "Rev 5", date: "2023-04-01",
    dbVer: "2.2.62", server: "2.2.10.1",
    features: [
      "New SST tax code wizard for easy configuration",
      "Cloud sync status indicator in main toolbar",
      "Added bulk statement email dispatch from AR module",
    ],
    fixes: [
      "Fixed year-end closing leaving unbalanced retained earnings",
      "Resolved font rendering issue on Chinese Windows locale",
      "Fixed bank import parser failing on CIMB CSV format",
    ],
  },
  {
    version: "2.2.1.3", rev: "Rev 3", date: "2022-10-01",
    dbVer: "2.2.55", server: "2.2.9.0",
    features: [
      "Initial release of AutoCount Accounting 2.2 series",
      "New ribbon-based UI replacing legacy toolbar",
      "64-bit engine for improved performance on modern hardware",
    ],
    fixes: [
      "Fixed migration issue from AutoCount 2.1 payroll module",
      "Resolved display glitch on Windows 11 high-DPI screens",
      "Fixed access control not applying to report designer",
    ],
  },
];

/* ── Feature pill colours by type ── */
const TAG = {
  feature: { bg: "rgba(47,49,90,0.08)", color: "#2f315a", label: "New" },
  fix:     { bg: "rgba(201,168,76,0.12)", color: "#8a6a10", label: "Fix" },
};

function ReleaseBadge({ type }) {
  const t = TAG[type];
  return (
    <span style={{
      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "0.18rem 0.55rem",
      borderRadius: 50, background: t.bg, color: t.color,
      flexShrink: 0,
    }}>
      {t.label}
    </span>
  );
}

function ReleaseCard({ r, expanded, onToggle }) {
  const isLatest = r === RELEASES[0];
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${expanded ? "rgba(47,49,90,0.22)" : "rgba(47,49,90,0.1)"}`,
      background: "#ffffff",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: "1rem", padding: "1.1rem 1.4rem",
          background: expanded ? "#f8f8fb" : "transparent",
          border: "none", cursor: "pointer", fontFamily: "inherit",
          textAlign: "left", transition: "background 0.2s",
        }}
      >
        {/* Version + date */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a" }}>{r.version}</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#a8abcc", letterSpacing: "0.04em" }}>{r.rev}</span>
            {isLatest && (
              <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "#2f315a", color: "#c9a84c", padding: "0.18rem 0.6rem", borderRadius: 50 }}>
                Latest
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#a8abcc", marginTop: 2 }}>
            Released {r.date} · DB {r.dbVer} · Server {r.server}
          </div>
        </div>
        {/* counts */}
        <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: "#2f315a", fontWeight: 600 }}>✦ {r.features.length} New</span>
          <span style={{ fontSize: "0.72rem", color: "#8a6a10", fontWeight: 600 }}>⬡ {r.fixes.length} Fix</span>
        </div>
        {/* chevron */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2"
          style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: "0 1.4rem 1.4rem", borderTop: "0.5px solid rgba(47,49,90,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1.1rem" }}>
            {/* New Features */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2f315a", marginBottom: "0.65rem" }}>
                New Features
              </div>
              {r.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseBadge type="feature" />
                  <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
            {/* Bug Fixes */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a6a10", marginBottom: "0.65rem" }}>
                Bug Fixes
              </div>
              {r.fixes.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseBadge type="fix" />
                  <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AutoCountAccountingPage({ onContact }) {
  const navigate = useNavigate();

  /* Fix 5: always start at top of page when navigating here */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const [expanded, setExpanded] = useState(0);   /* first card open by default */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [compareMode, setCompareMode]  = useState(false);
  const [compareA, setCompareA] = useState(RELEASES[RELEASES.length - 1].version); /* oldest */
  const [compareB, setCompareB] = useState(RELEASES[0].version);                   /* newest */

  const filtered = RELEASES.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.version.includes(q) || r.rev.toLowerCase().includes(q) ||
      r.features.some(f => f.toLowerCase().includes(q)) ||
      r.fixes.some(f => f.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      {/* ── Hero banner ── */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "4rem" }}>
        <div className="content-wrap">
          <button
            onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            ← Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "2.5rem", flexWrap: "wrap" }}>
            {/* icon — replace via src/assets/images/products/autocount-accounting-icon.png */}
            <div style={{ width: 80, height: 80, borderRadius: 18, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", flexShrink: 0, overflow: "hidden" }}>
              {PRODUCT_IMAGES.autocountAccountingIcon
                ? <img src={PRODUCT_IMAGES.autocountAccountingIcon} alt="AutoCount Accounting" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                : <span>🧾</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                Software We Specialize In
              </div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "1rem" }}>
                AutoCount Accounting 2.2
              </h1>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 600, marginBottom: "1.5rem" }}>
                Malaysia's leading SME accounting software — cloud-connected, SST & e-Invoice compliant,
                and deeply integrated with AutoCount POS and Payroll. As an authorized dealer,
                KSL Business Solutions provides full installation, configuration, training, and ongoing support.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  onClick={onContact}
                  style={{ background: "#c9a84c", color: "#1e2040", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}
                >
                  Get a Quote
                </button>
                <a
                  href={WA_LINK} target="_blank" rel="noreferrer"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature highlights ── */}
      <div style={{ background: "#ffffff", padding: "3rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" }}>
        <div className="content-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {[
              { icon: "✅", title: "SST & e-Invoice", desc: "Fully compliant with LHDN MyInvois and Malaysia SST requirements" },
              { icon: "☁️", title: "Cloud-Connected", desc: "Real-time sync across branches with AutoCount cloud server" },
              { icon: "🔗", title: "Integrated", desc: "Seamlessly linked with AutoCount POS and Cloud Payroll modules" },
              { icon: "🛠️", title: "Supported Locally", desc: "KSL provides installation, training, and on-site support in Pahang" },
            ].map((f, i) => (
              <div key={i} style={{ padding: "1.25rem", borderRadius: 12, background: "#f8f8fb", border: "1px solid rgba(47,49,90,0.07)" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>{f.icon}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.35rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b6f91", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
       * LEARN AUTOCOUNT IN 60 MINUTES — Vertical stacked layout
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#ffffff", padding: "4.5rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" }}>
        <div className="content-wrap">
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.6rem",
            }}>
              Free Training
            </div>
            <h2 style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700,
              color: "#2f315a", lineHeight: 1.2, marginBottom: "0.9rem",
            }}>
              Learn AutoCount Accounting in Just 60 Minutes
            </h2>
            <p style={{
              fontSize: "0.95rem", color: "#6b6f91", lineHeight: 1.8,
              maxWidth: 560, margin: "0 auto 1.5rem",
            }}>
              Skip the long manuals. AutoCount's 60-minute guide covers
              everything you need to know to navigate AutoCount Accounting
              with confidence — from basic setup to daily transactions.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#2f315a", color: "#ffffff",
                  padding: "0.75rem 1.75rem", borderRadius: 50,
                  fontSize: "0.88rem", fontWeight: 600,
                  textDecoration: "none", transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
                onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                Watch on YouTube
              </a>
              <span style={{
                display: "inline-flex", alignItems: "center",
                fontSize: "0.82rem", color: "#a8abcc", fontWeight: 500,
                padding: "0.75rem 1rem",
              }}>
                Free · 60 min · By AutoCount
              </span>
            </div>
          </div>

          {/* Full-width embed */}
          <div style={{
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(47,49,90,0.16)",
            border: "1px solid rgba(47,49,90,0.08)",
          }}>
            <div style={{ paddingBottom: "56.25%", position: "relative", background: "#0f1128" }}>
              <iframe
                src="https://www.youtube.com/embed/ztmg4hvro6U"
                title="Learn AutoCount Accounting in 60 Minutes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Release Notes ── */}
      <div style={{ padding: "4rem 0" }}>
        <div className="content-wrap">

          {/* ── Title + tab switcher ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                Changelog
              </div>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#2f315a" }}>
                Release Notes — Ver 2.2
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#6b6f91", marginTop: "0.35rem" }}>
                {RELEASES.length} revisions · Rev 3 → Rev 36 · Newest first
              </p>
            </div>
            {/* Mode toggle */}
            <div style={{ display: "flex", background: "#f0f0f5", borderRadius: 50, padding: 4, gap: 2 }}>
              {[["browse", "Browse All"], ["compare", "Compare Versions"]].map(([mode, label]) => (
                <button key={mode}
                  onClick={() => setCompareMode(mode === "compare")}
                  style={{
                    fontSize: "0.78rem", fontWeight: 600,
                    padding: "0.4rem 1.1rem", borderRadius: 50, border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                    background: (compareMode ? "compare" : "browse") === mode ? "#2f315a" : "transparent",
                    color:      (compareMode ? "compare" : "browse") === mode ? "#ffffff" : "#6b6f91",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* ── COMPARE MODE ── */}
          {compareMode && (() => {
            const rA = RELEASES.find(r => r.version === compareA);
            const rB = RELEASES.find(r => r.version === compareB);
            const idxA = RELEASES.indexOf(rA);
            const idxB = RELEASES.indexOf(rB);
            const older = idxA > idxB ? rA : rB;
            const newer = idxA > idxB ? rB : rA;
            /* collect all items from older→newer (exclusive) */
            const olderIdx = RELEASES.indexOf(older);
            const newerIdx = RELEASES.indexOf(newer);
            const between = RELEASES.slice(newerIdx, olderIdx + 1);
            const allFeatures = between.flatMap(r => r.features.map(f => ({ ver: r.version, rev: r.rev, text: f })));
            const allFixes    = between.flatMap(r => r.fixes.map(f    => ({ ver: r.version, rev: r.rev, text: f })));
            return (
              <div>
                {/* Selectors */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>From version</label>
                    <select value={compareA} onChange={e => setCompareA(e.target.value)}
                      style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                      {RELEASES.slice().reverse().map(r => <option key={r.version} value={r.version}>{r.version} ({r.rev})</option>)}
                    </select>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "1.3rem", color: "#c9a84c", marginTop: "1.2rem" }}>→</div>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>To version</label>
                    <select value={compareB} onChange={e => setCompareB(e.target.value)}
                      style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                      {RELEASES.map(r => <option key={r.version} value={r.version}>{r.version} ({r.rev})</option>)}
                    </select>
                  </div>
                </div>

                {/* Summary bar */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                  {[
                    { label: "Revisions covered", val: between.length, bg: "rgba(47,49,90,0.06)", col: "#2f315a" },
                    { label: "New features",       val: allFeatures.length, bg: "rgba(47,49,90,0.06)", col: "#2f315a" },
                    { label: "Bug fixes",          val: allFixes.length,    bg: "rgba(201,168,76,0.1)", col: "#8a6a10" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, minWidth: 120, background: s.bg, borderRadius: 12, padding: "1rem 1.25rem" }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Changelog between the two versions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2f315a", marginBottom: "1rem" }}>New Features ({allFeatures.length})</div>
                    {allFeatures.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No new features in this range.</div>}
                    {allFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(47,49,90,0.08)", color: "#2f315a", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a6a10", marginBottom: "1rem" }}>Bug Fixes ({allFixes.length})</div>
                    {allFixes.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No bug fixes in this range.</div>}
                    {allFixes.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(201,168,76,0.12)", color: "#8a6a10", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── BROWSE MODE ── */}
          {!compareMode && <>
            {/* Search + collapse */}
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2"
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search version or keyword…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", paddingLeft: 30, paddingRight: 12, height: 36, borderRadius: 50, border: "1px solid rgba(47,49,90,0.18)", fontSize: "0.82rem", fontFamily: "inherit", color: "#2f315a", outline: "none" }}
                />
              </div>
              <button onClick={() => setExpanded(null)}
                style={{ fontSize: "0.78rem", color: "#6b6f91", background: "transparent", border: "1px solid rgba(47,49,90,0.15)", borderRadius: 50, padding: "0.35rem 0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                Collapse all
              </button>
            </div>

          {/* Release cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "#a8abcc", fontSize: "0.9rem" }}>
                No releases match "{search}"
              </div>
            )}
            {filtered.map((r, i) => (
              <ReleaseCard
                key={r.version}
                r={r}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
              />
            ))}
          </div>

          </>}

          {/* Official link */}
          <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", borderRadius: 12, background: "rgba(47,49,90,0.04)", border: "1px solid rgba(47,49,90,0.08)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2f315a" }}>Full release notes on AutoCount Wiki</div>
              <div style={{ fontSize: "0.78rem", color: "#6b6f91", marginTop: 2 }}>Detailed technical documentation including database upgrade notes and server requirements.</div>
            </div>
            <a
              href="https://wiki.autocountsoft.com/wiki/Category:AutoCount_Accounting_2.2:Release_Note"
              target="_blank" rel="noreferrer"
              style={{ background: "#2f315a", color: "#ffffff", padding: "0.6rem 1.4rem", borderRadius: 50, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
              onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
            >
              Official Wiki →
            </a>
          </div>
        </div>
      </div>

      {/* CTA band */}
      <div style={{ background: "#2f315a", padding: "4rem 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
            Ready to get started with AutoCount?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 1.75rem" }}>
            KSL Business Solutions provides full AutoCount implementation,
            training, and support across Pahang.
          </p>
          <button
            onClick={onContact}
            style={{ background: "#c9a84c", color: "#1e2040", padding: "0.85rem 2.5rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Contact Us Today
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
