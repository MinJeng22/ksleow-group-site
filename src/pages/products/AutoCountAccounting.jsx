import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import ProductHero from "../../components/ProductHero.jsx";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import { Img } from "../../components/Media.jsx";
import autocountReleases from "../../content/autocountReleases.json";
/* AutoCount Accounting page — product-aware WhatsApp link to KSL Support Team */
const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to learn more about AutoCount Accounting. Thank you."
)}`;
import { PRODUCT_IMAGES } from "../../assets/assets.js";

/* Feature-highlight icons — string paths to public/images/icons/ so
 * they can be swapped via CMS / dropped into the folder without
 * touching this file. */
const ICON_EINVOICE    = "/images/services/lhdn-logo.png";
const ICON_INTEGRATION = "/images/icons/integration-icon.png";
const ICON_FAVICON     = "/images/branding/ksl-logo-circle.webp";
const ICON_AC_PLUGIN   = "/images/icons/ac-plugin-icon.png";

/* ═══════════════════════════════════════════════════════════════
 * AUTOCOUNT ACCOUNTING — PRODUCT PAGE
 *
 * RELEASE NOTE DATA
 * ─────────────────
 * Release notes are stored in src/content/autocountReleases.json and
 * refreshed by scripts/update-autocount-releases.mjs from the official
 * AutoCount Wiki.
 * ═══════════════════════════════════════════════════════════════ */
const RELEASES = autocountReleases;

/* ── Feature pill colours by type ── */
const TAG = {
  feature: { bg: "rgba(47,49,90,0.08)", color: "#2f315a" },
  fix: { bg: "rgba(201,168,76,0.12)", color: "#8a6a10" },
};

/* ── Copy release notes to clipboard (WhatsApp format) ── */
function copyToClipboard(r, type) {
  const lines = type === "features" ? r.features : r.fixes;
  const header = type === "features"
    ? `*AutoCount ${r.version} — New Features*`
    : `*AutoCount ${r.version} — Bug Fixes*`;
  const text = header + "\n" + lines.map(l => `• ${l}`).join("\n");
  navigator.clipboard.writeText(text).catch(() => { });
}

/* ── Copy compare-mode results (array of {ver, rev, text}) ── */
function copyCompare(items, fromVer, toVer, type) {
  const header = type === "features"
    ? `*AutoCount New Features (${fromVer} → ${toVer})*`
    : `*AutoCount Bug Fixes (${fromVer} → ${toVer})*`;
  const text = header + "\n" + items.map(f => `[${f.rev}] • ${f.text}`).join("\n");
  navigator.clipboard.writeText(text).catch(() => { });
}

function ReleaseNumber({ number, type }) {
  const t = TAG[type];
  return (
    <span style={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: t.bg,
      color: t.color,
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.68rem",
      fontWeight: 800,
      lineHeight: 1,
      marginTop: 1,
    }}>
      {number}
    </span>
  );
}

/* ── Copy button ── */
function CopyBtn({ onClick, gold }) {
  const [copied, setCopied] = React.useState(false);
  function handle() {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handle}
      title="Copy for WhatsApp"
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.3rem",
        background: copied ? (gold ? "rgba(201,168,76,0.2)" : "rgba(47,49,90,0.12)") : "transparent",
        border: `1px solid ${gold ? "rgba(201,168,76,0.35)" : "rgba(47,49,90,0.18)"}`,
        borderRadius: 50, padding: "0.2rem 0.6rem",
        fontSize: "0.62rem", fontWeight: 600,
        color: copied ? (gold ? "#8a6a10" : "#2f315a") : "#a8abcc",
        cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Copied" : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ── ShareLinkButton ──
 * Builds a fully-qualified URL that, when opened, reproduces the
 * current compare-mode state and scrolls the visitor to the right
 * section. Copies it to the clipboard with a short "Copied!" hint.
 *
 *   params  { editionMode, editionA, ... }  — query params to include
 *   hash    "#editions" | "#releases"        — scroll target
 */
function ShareLinkButton({ params, hash, compact = false, title = "Copy a shareable link to this comparison" }) {
  const [copied, setCopied] = React.useState(false);
  function handle(event) {
    event?.stopPropagation();
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== false && v !== "") {
        usp.set(k, v === true ? "1" : String(v));
      }
    });
    const url = `${window.location.origin}${window.location.pathname}?${usp.toString()}${hash}`;
    // Try native clipboard first; fall back to a hidden textarea for
    // non-secure contexts.
    const writeFallback = () => {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(writeFallback);
    } else {
      writeFallback();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handle}
      title={title}
      style={{
        display: "inline-flex", alignItems: "center", gap: compact ? "0.3rem" : "0.4rem",
        background: copied ? "rgba(201,168,76,0.18)" : (compact ? "transparent" : "rgba(47,49,90,0.06)"),
        border: `1px solid ${copied ? "rgba(201,168,76,0.4)" : "rgba(47,49,90,0.16)"}`,
        borderRadius: 50, padding: compact ? "0.2rem 0.6rem" : "0.4rem 0.9rem",
        fontSize: compact ? "0.62rem" : "0.74rem", fontWeight: 600,
        color: copied ? "#8a6a10" : "#2f315a",
        cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s",
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Link copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Share Link
        </>
      )}
    </button>
  );
}

function ReleaseAssetLink({ url }) {
  if (!url) return null;
  const stopHeaderToggle = (event) => {
    event.stopPropagation();
  };
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Open highlights PDF"
      onClick={stopHeaderToggle}
      onKeyDown={stopHeaderToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        background: "transparent",
        border: "1px solid rgba(201,168,76,0.35)",
        borderRadius: 50,
        padding: "0.2rem 0.6rem",
        fontSize: "0.62rem",
        fontWeight: 600,
        color: "#8a6a10",
        cursor: "pointer",
        fontFamily: "inherit",
        textDecoration: "none",
        transition: "all 0.2s",
      }}
      onMouseOver={(event) => {
        event.currentTarget.style.background = "rgba(201,168,76,0.12)";
        event.currentTarget.style.borderColor = "rgba(201,168,76,0.55)";
      }}
      onMouseOut={(event) => {
        event.currentTarget.style.background = "transparent";
        event.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      Highlights
    </a>
  );
}

function ReleaseCard({ r, expanded, onToggle }) {
  const isLatest = r === RELEASES[0];
  const releaseRev = revNumber(r);
  return (
    <div id={`release-${releaseRev}`} className="release-card" style={{
      borderRadius: 14,
      border: `1px solid ${expanded ? "rgba(47,49,90,0.22)" : "rgba(47,49,90,0.1)"}`,
      background: "#ffffff",
      overflow: "hidden",
      transition: "border-color 0.2s",
      scrollMarginTop: 28,
    }}>
      {/* Header row */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onToggle();
        }}
        className="release-card-header"
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: "1rem", padding: "1.1rem 1.4rem",
          background: expanded ? "#f8f8fb" : "transparent",
          border: "none", cursor: "pointer", fontFamily: "inherit",
          textAlign: "left", transition: "background 0.2s",
          userSelect: "none",
        }}
      >
        {/* Version + date */}
        <div className="release-card-main" style={{ flex: 1, minWidth: 0 }}>
          <div className="release-card-title-row" style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="release-card-version" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a" }}>{r.version}</span>
            <span className="release-card-rev" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#a8abcc", letterSpacing: "0.04em" }}>{r.rev}</span>
          </div>
          <div className="release-card-actions" style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.42rem" }}>
            {isLatest && (
              <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "#2f315a", color: "#c9a84c", padding: "0.18rem 0.6rem", borderRadius: 50 }}>
                Latest
              </span>
            )}
            <ReleaseAssetLink url={r.highlightsUrl} />
            <ShareLinkButton
              compact
              title={`Copy a shareable link to ${r.version}`}
              hash={`#release-${releaseRev}`}
              params={{ vr: releaseRev }}
            />
          </div>
          <div className="release-card-meta" style={{ fontSize: "0.78rem", color: "#a8abcc", marginTop: 2 }}>
            Released {r.date} · DB {r.dbVer} · Server {r.server}
          </div>
        </div>
        {/* counts */}
        <div className="release-card-counts" style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: "#2f315a", fontWeight: 600 }}>✦ {r.features.length} New</span>
          <span style={{ fontSize: "0.72rem", color: "#8a6a10", fontWeight: 600 }}>⬡ {r.fixes.length} Fix</span>
        </div>
        {/* chevron */}
        <svg className="release-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2"
          style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: "0 1.4rem 1.4rem", borderTop: "0.5px solid rgba(47,49,90,0.08)" }}>
          <div className="release-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1.1rem" }}>
            {/* New Features */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2f315a" }}>
                  New Features
                </div>
                <CopyBtn onClick={() => copyToClipboard(r, "features")} />
              </div>
              {r.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseNumber number={i + 1} type="feature" />
                  <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
            {/* Bug Fixes */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a6a10" }}>
                  Bug Fixes
                </div>
                <CopyBtn onClick={() => copyToClipboard(r, "fixes")} gold />
              </div>
              {r.fixes.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseNumber number={i + 1} type="fix" />
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

/* ══════════════════════════════════════════════════════════════
 * Comparing 5 Editions of Accounting 2.2 — feature matrix
 * ──────────────────────────────────────────────────────────────
 * Marker codes:
 *   "●" = included module
 *   "+" = optional / paid add-on
 *   "−" = not available in this edition
 * Order of editions (columns): Account Plus | Express Plus | Basic | Pro | Premium
 * ══════════════════════════════════════════════════════════════ */
const EDITIONS = ["Account Plus", "Express Plus", "Basic", "Pro", "Premium"];

/* Short codes used by the Share-Link URL params so the link stays
 * compact (e.g. ?em=c&ea=ap&eb=pm instead of editionA=Account+Plus). */
const EDITION_CODE = {
  "Account Plus": "ap",
  "Express Plus": "xp",
  "Basic":        "b",
  "Pro":          "p",
  "Premium":      "pm",
};
const CODE_TO_EDITION = Object.fromEntries(
  Object.entries(EDITION_CODE).map(([name, code]) => [code, name])
);

/* Pull just the numeric portion of a "Rev N" string so version selects
 * can be shared as ?va=36 instead of va=2.2.25.36 — much shorter. */
const revNumber  = (r) => String(r.rev).replace(/^Rev\s*/i, "").trim();
const findByRev  = (n) => RELEASES.find(r => revNumber(r) === String(n));
const EDITION_TABLE = {
  defaultAccountBook: ["3", "3", "5", "5", "5"],
  sections: [
    {
      name: "Modules",
      rows: [
        ["Plug-In",                            ["●", "●", "●", "●", "●"]],
        ["SST, Project, Multi-Currency",       ["●", "●", "●", "●", "●"]],
        ["GL, AR, AP, Recurrence GL",          ["●", "●", "●", "●", "●"]],
        ["Budget & Advanced Financial Report", ["+", "+", "●", "●", "●"]],
        ["Formula, UDF",                       ["+", "+", "●", "●", "●"]],
        ["Simple Sales",                       ["●", "●", "●", "●", "●"]],
        ["Simple Purchase",                    ["●", "●", "●", "●", "●"]],
        ["Simple Stock",                       ["−", "●", "●", "●", "●"]],
        ["Complete Sales",                     ["+", "+", "●", "●", "●"]],
        ["Complete Purchase",                  ["+", "+", "●", "●", "●"]],
        ["Complete Stock",                     ["+", "+", "●", "●", "●"]],
        ["Basic Multi-UOM",                    ["+", "+", "●", "●", "●"]],
        ["Activity Stream",                    ["+", "+", "+", "●", "●"]],
        ["Advanced Multi-UOM",                 ["+", "+", "+", "●", "●"]],
        ["Advanced Quotation",                 ["+", "+", "+", "●", "●"]],
        ["Consignment",                        ["+", "+", "+", "●", "●"]],
        ["FOC Quantity",                       ["+", "+", "+", "●", "●"]],
        ["Landing Cost",                       ["+", "+", "+", "●", "●"]],
        ["Multi Location",                     ["+", "+", "+", "●", "●"]],
        ["Recurrence (Sales & Purchase)",      ["+", "+", "+", "●", "●"]],
        ["Scripting",                          ["+", "+", "+", "●", "●"]],
        ["Advance Item",                       ["+", "+", "+", "+", "●"]],
        ["Filter by salesman",                 ["+", "+", "+", "+", "●"]],
        ["Item Batch",                         ["+", "+", "+", "+", "●"]],
        ["Item Package / Item Template",       ["+", "+", "+", "+", "●"]],
        ["Multi-Dimensional Analysis",         ["+", "+", "+", "+", "●"]],
        ["Remote Credit Control",              ["+", "+", "+", "+", "●"]],
        ["Stock Assembly",                     ["+", "+", "+", "+", "●"]],
      ],
    },
    {
      name: "Optional Module",
      rows: [
        ["Intelligent Costing",                ["+", "+", "+", "+", "+"]],
        ["Advanced Multi-Currency",            ["+", "+", "+", "+", "+"]],
        ["API",                                ["+", "+", "+", "+", "+"]],
        ["Bonus Point",                        ["+", "+", "+", "+", "+"]],
        ["Consolidated Financial Report",      ["+", "+", "+", "+", "+"]],
        ["Department",                         ["+", "+", "+", "+", "+"]],
        ["Export Account",                     ["+", "+", "+", "+", "+"]],
        ["Export Stock",                       ["+", "+", "+", "+", "+"]],
        ["Filter by account",                  ["+", "+", "+", "+", "+"]],
        ["Import Third Party Xml",             ["+", "+", "+", "+", "+"]],
        ["Multi-Dimensional Price Book",       ["+", "+", "+", "+", "+"]],
        ["Multi-Level Assembly",               ["+", "+", "+", "+", "+"]],
        ["Serial Number",                      ["+", "+", "+", "+", "+"]],
        ["Stock Disassembly",                  ["+", "+", "+", "+", "+"]],
        ["Unrealized Gain/Loss",               ["+", "+", "+", "+", "+"]],
        ["Sales Order Processing",             ["+", "+", "+", "+", "+"]],
        ["Assembly Order Processing",          ["+", "+", "+", "+", "+"]],
      ],
    },
    {
      name: "POS Counter",
      rows: [
        ["POS A",      ["+", "+", "+", "+", "+"]],
        ["POS B",      ["+", "+", "+", "+", "+"]],
        ["POS Branch", ["+", "+", "+", "+", "+"]],
      ],
    },
    {
      name: "POS Modules",
      rows: [
        ["POS Serial Number",  ["+", "+", "+", "+", "+"]],
        ["POS Item Batch",     ["+", "+", "+", "+", "+"]],
        ["POS Item Package",   ["+", "+", "+", "+", "+"]],
      ],
    },
  ],
};

function EditionMarker({ value }) {
  if (value === "●") {
    return <span style={{ display: "inline-block", width: 11, height: 11, borderRadius: "50%", background: "#7AB317" }} />;
  }
  if (value === "+") {
    return <span style={{ color: "#7AB317", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>+</span>;
  }
  return <span style={{ color: "#9aa", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>−</span>;
}

function EditionsTable({ selected = null, diffOnly = false }) {
  /* selected: optional array of edition names to render (otherwise all 5).
     diffOnly: when true (compare mode), hide rows whose values are identical
     across the selected editions. */
  const cellPad = "0.62rem 0.58rem";
  const cols = (selected && selected.length > 0) ? selected : EDITIONS;
  const colIdx = cols.map(c => EDITIONS.indexOf(c));
  const stickyHeaderCell = {
    position: "sticky",
    top: 0,
    zIndex: 3,
    background: "#7AB317",
  };
  const stickyBookCell = {
    position: "sticky",
    top: 42,
    zIndex: 2,
    background: "#fafafb",
  };

  /* Pick subset of values for visible columns, optionally filter equal rows. */
  const filterRow = (values) => colIdx.map(i => values[i]);
  const rowDiffers = (values) => {
    const subset = filterRow(values);
    return !subset.every(v => v === subset[0]);
  };

  return (
    <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid rgba(47,49,90,0.08)", overflow: "hidden", boxShadow: "0 4px 20px rgba(47,49,90,0.05)" }}>
      <div style={{ overflowX: "auto", maxHeight: "min(72vh, 760px)", overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
          <thead>
            <tr style={{ background: "#7AB317" }}>
              <th style={{ ...stickyHeaderCell, padding: cellPad, textAlign: "left", color: "#ffffff", fontWeight: 600, minWidth: 190 }}></th>
              {cols.map(e => (
                <th key={e} style={{ ...stickyHeaderCell, padding: cellPad, color: "#ffffff", fontWeight: 700, textAlign: "center", minWidth: 86, lineHeight: 1.25 }}>{e}</th>
              ))}
            </tr>
            <tr style={{ background: "#fafafb", borderBottom: "1px solid rgba(47,49,90,0.08)" }}>
              <td style={{ ...stickyBookCell, padding: cellPad, color: "#2f315a", fontWeight: 500 }}>Default Account Book</td>
              {filterRow(EDITION_TABLE.defaultAccountBook).map((v, i) => (
                <td key={i} style={{ ...stickyBookCell, padding: cellPad, color: "#2f315a", fontWeight: 600, textAlign: "center" }}>{v}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {EDITION_TABLE.sections.map((section) => {
              const rows = diffOnly
                ? section.rows.filter(([, values]) => rowDiffers(values))
                : section.rows;
              if (rows.length === 0) return null;
              return (
                <React.Fragment key={section.name}>
                  <tr style={{ background: "#eaeaef" }}>
                    <td colSpan={cols.length + 1} style={{ padding: "0.55rem 0.85rem", color: "#6b6f91", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {section.name}
                    </td>
                  </tr>
                  {rows.map(([rowName, values], ri) => {
                    const visibleVals = filterRow(values);
                    return (
                      <tr key={rowName} style={{ background: ri % 2 === 0 ? "#ffffff" : "#fafafb", borderBottom: "1px solid rgba(47,49,90,0.05)" }}>
                        <td style={{ padding: cellPad, color: "#2f315a" }}>{rowName}</td>
                        {visibleVals.map((v, vi) => (
                          <td key={vi} style={{ padding: cellPad, textAlign: "center" }}>
                            <EditionMarker value={v} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Feature highlights — replayable scroll-in stagger ──
 * Four cards with image icons (emoji fallback for any icon not yet
 * uploaded). Cards fade up + scale in left → right with a 130 ms
 * stagger every time the section enters the viewport. */
const FEATURES = [
  { icon: ICON_EINVOICE,    title: "SST & e-Invoice",          desc: "Fully compliant with LHDN MyInvois and Malaysia SST requirements" },
  { icon: ICON_INTEGRATION, title: "Integrated",               desc: "Seamlessly linked with AutoCount POS, Cloud Payroll modules, and your custom ERP systems." },
  { icon: ICON_FAVICON,     title: "Prompt Technical Support", desc: "Fast response times and expert troubleshooting from the KSL team during business days to keep your operations running smoothly." },
  { icon: ICON_AC_PLUGIN,   title: "Highly Extensible",        desc: "Fully supports C# & .NET plugins, custom fields, and scripting to adapt to your unique business workflows." },
];

function FeatureHighlights() {
  const gridRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    /* Replayable: toggle both ways so the stagger runs each time the
     * grid scrolls into view. */
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => setInView(e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div id="features" className="ac-section-tight" style={{ background: "#ffffff", padding: "3rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)", scrollMarginTop: 24, position: "relative", zIndex: 1 }}>
      <div className="content-wrap">
        <div ref={gridRef} className="ac-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: "1.25rem", borderRadius: 12,
              background: "#f8f8fb",
              border: "1px solid rgba(47,49,90,0.07)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
              transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.13}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.13}s`,
            }}>
              <div style={{
                width: 44, height: 44,
                marginBottom: "0.7rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Img src={f.icon} alt=""
                  style={{ maxWidth: 40, maxHeight: 40, objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.35rem" }}>{f.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#6b6f91", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* AutoCount sidebar anchor items */
const AC_SIDEBAR_ITEMS = [
  { id: "features",  label: "Features"        },
  { id: "training",  label: "60-Min Training" },
  { id: "editions",  label: "Edition Compare" },
  { id: "releases",  label: "Release Notes"   },
];

export default function AutoCountAccountingPage({ onContact }) {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(RELEASES[0]?.version || null);   /* first card open by default */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(RELEASES[RELEASES.length - 1].version); /* oldest */
  const [compareB, setCompareB] = useState(RELEASES[0].version);                   /* newest */
  const [trialOpen, setTrialOpen] = useState(false);
  /* Edition compare mode — same Browse/Compare pattern as Release Notes */
  const [editionCompareMode, setEditionCompareMode] = useState(false);
  const [editionA, setEditionA] = useState(EDITIONS[0]);                  /* Account Plus */
  const [editionB, setEditionB] = useState(EDITIONS[EDITIONS.length - 1]); /* Premium */
  const [editionDiffOnly, setEditionDiffOnly] = useState(false);

  /* Replayable on-view reveal for the YouTube training section. */
  const trainingRef = useRef(null);
  const [trainingInView, setTrainingInView] = useState(false);
  useEffect(() => {
    const node = trainingRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setTrainingInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => setTrainingInView(e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  /* ── Init from URL ───────────────────────────────────────────────
   * Read query params on mount. Anyone landing on a shared link gets
   * the compare mode + selections pre-applied AND the page auto-
   * scrolls to the right section. Falls back to top-of-page when no
   * params are present (original behaviour).
   *
   * Short-code param schema (current):
   *   em = c                       switch Editions to Compare mode
   *   ea = ap | xp | b | p | pm    left edition code   (see EDITION_CODE)
   *   eb = ap | xp | b | p | pm    right edition code
   *   ed = 1                       "show only rows that differ" on
   *   vm = c                       switch Releases to Compare mode
   *   va = <rev number>            "From version" by rev number (e.g. 36)
   *   vb = <rev number>            "To version"   by rev number
   *   #editions / #releases / #... scroll target (URL hash)
   *
   * Long-name params from older shared links are still accepted as a
   * fallback (editionMode / editionA / editionB / editionDiff / vMode /
   * vA / vB), so links shared before the short-code switch keep working.
   * ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Editions section — short codes first, then long-name fallback.
    const eaCode = params.get("ea");
    const ebCode = params.get("eb");
    const eaName = (eaCode && CODE_TO_EDITION[eaCode]) || params.get("editionA");
    const ebName = (ebCode && CODE_TO_EDITION[ebCode]) || params.get("editionB");
    const em     = params.get("em") || params.get("editionMode");
    if (em === "c" || em === "compare" || eaName || ebName) {
      setEditionCompareMode(true);
      if (eaName && EDITIONS.includes(eaName)) setEditionA(eaName);
      if (ebName && EDITIONS.includes(ebName)) setEditionB(ebName);
      if (params.get("ed") === "1" || params.get("editionDiff") === "1") {
        setEditionDiffOnly(true);
      }
    }

    // Releases section — short codes first, then long-name fallback.
    const vaCode = params.get("va");
    const vbCode = params.get("vb");
    const vaRel  = (vaCode && findByRev(vaCode)) ||
                   (params.get("vA") && RELEASES.find(r => r.version === params.get("vA")));
    const vbRel  = (vbCode && findByRev(vbCode)) ||
                   (params.get("vB") && RELEASES.find(r => r.version === params.get("vB")));
    const vm     = params.get("vm") || params.get("vMode");
    if (vm === "c" || vm === "compare" || vaRel || vbRel) {
      setCompareMode(true);
      if (vaRel) setCompareA(vaRel.version);
      if (vbRel) setCompareB(vbRel.version);
    }

    const releaseHashMatch = window.location.hash.match(/^#release-(\d+)$/);
    const sharedRelease =
      (params.get("vr") && findByRev(params.get("vr"))) ||
      (params.get("version") && RELEASES.find(r => r.version === params.get("version"))) ||
      (releaseHashMatch && findByRev(releaseHashMatch[1]));
    if (sharedRelease) {
      setCompareMode(false);
      setExpanded(sharedRelease.version);
    }

    // Scroll: if URL has a hash, scroll there; otherwise top of page.
    const scrollTarget = window.location.hash || (sharedRelease ? `#release-${revNumber(sharedRelease)}` : "");
    if (scrollTarget) {
      // Tiny delay so the state-driven sections finish first paint
      const t = setTimeout(() => {
        const el = document.querySelector(scrollTarget);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const filtered = RELEASES.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.version.includes(q) || r.rev.toLowerCase().includes(q) ||
      r.features.some(f => f.toLowerCase().includes(q)) ||
      r.fixes.some(f => f.toLowerCase().includes(q))
    );
  });
  const highlightCount = RELEASES.filter(r => r.highlightsUrl).length;

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      {/* Floating section sidebar — desktop only (≥1280px), hidden via media query otherwise */}
      <SectionSidebar items={AC_SIDEBAR_ITEMS} />

      {/* ── Hero banner — shared ProductHero component ── */}
      <ProductHero
        eyebrow="Software We Specialize In"
        title="AutoCount Accounting 2.2"
        body="Malaysia's leading SME accounting software — cloud-connected, SST & e-Invoice compliant, and deeply integrated with AutoCount POS and Payroll. As an authorized dealer, KSL Business Solutions provides full installation, configuration, training, and ongoing support."
        iconSrc={PRODUCT_IMAGES.autocountAccountingIcon}
        iconAlt="AutoCount Accounting"
        primaryCta={{ label: "Start Free Trial", onClick: () => setTrialOpen(true) }}
        secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
      />

      {/* ── Feature highlights ── */}
      <FeatureHighlights />


      {/* ══════════════════════════════════════════════════════════
       * LEARN AUTOCOUNT IN 60 MINUTES — Vertical stacked layout
       * ══════════════════════════════════════════════════════════ */}
      <div id="training" ref={trainingRef} className="ac-section-tight" style={{ background: "#ffffff", padding: "4.5rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          {/* Section header — no animation, only the video below reveals on scroll */}
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
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
            opacity: trainingInView ? 1 : 0,
            transform: trainingInView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
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

      {/* ══════════════════════════════════════════════════════════
       * COMPARING 5 EDITIONS OF ACCOUNTING 2.2
       * ══════════════════════════════════════════════════════════ */}
      <div id="editions" className="ac-section-tight" style={{ background: "#f5f5f8", padding: "4.5rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7AB317", marginBottom: "0.6rem" }}>
              Modules Available in Each Edition
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" }}>
              Comparing 5 Editions of Accounting 2.2
            </h2>
            <div style={{ display: "inline-flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", fontSize: "0.78rem", color: "#6b6f91" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7AB317", display: "inline-block" }} />
                = included module
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#7AB317", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>+</span>
                = available optional (add-on) module
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#9aa", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>−</span>
                = module not available
              </span>
            </div>
          </div>

          {/* Mode toggle — Browse All / Compare Editions */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", background: "#ffffff", borderRadius: 50, padding: 4, gap: 2, border: "1px solid rgba(47,49,90,0.08)" }}>
              {[["browse", "Browse All Editions"], ["compare", "Compare Editions"]].map(([mode, label]) => (
                <button key={mode}
                  onClick={() => setEditionCompareMode(mode === "compare")}
                  style={{
                    fontSize: "0.78rem", fontWeight: 600,
                    padding: "0.45rem 1.2rem", borderRadius: 50, border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                    background: (editionCompareMode ? "compare" : "browse") === mode ? "#2f315a" : "transparent",
                    color: (editionCompareMode ? "compare" : "browse") === mode ? "#ffffff" : "#6b6f91",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* Compare-mode controls: 2 dropdowns + diff-only toggle */}
          {editionCompareMode && (
            <div style={{ maxWidth: 720, margin: "0 auto 1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
                <div>
                  <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>Edition A</label>
                  <select value={editionA} onChange={e => setEditionA(e.target.value)}
                    style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                    {EDITIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: 700, color: "#c9a84c", marginTop: "1.2rem" }}>VS</div>
                <div>
                  <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>Edition B</label>
                  <select value={editionB} onChange={e => setEditionB(e.target.value)}
                    style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                    {EDITIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              {editionA === editionB && (
                <p style={{ fontSize: "0.78rem", color: "#c9a84c", textAlign: "center", marginTop: "0.65rem" }}>
                  Pick two different editions to see how they differ.
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.25rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#6b6f91", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={editionDiffOnly}
                    onChange={e => setEditionDiffOnly(e.target.checked)}
                    style={{ accentColor: "#2f315a", cursor: "pointer" }}
                  />
                  Show only rows where the two editions differ
                </label>
                <ShareLinkButton
                  hash="#editions"
                  params={{
                    em: "c",
                    ea: EDITION_CODE[editionA],
                    eb: EDITION_CODE[editionB],
                    ed: editionDiffOnly,
                  }}
                />
              </div>
            </div>
          )}

          <EditionsTable
            selected={editionCompareMode ? [editionA, editionB] : null}
            diffOnly={editionCompareMode && editionA !== editionB && editionDiffOnly}
          />
        </div>
      </div>

      {/* ── Release Notes ── */}
      <div id="releases" className="ac-section-tight" style={{ padding: "4rem 0", scrollMarginTop: 24 }}>
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
                {RELEASES.length} revisions · {highlightCount} highlights · Rev {revNumber(RELEASES[RELEASES.length - 1])} → Rev {revNumber(RELEASES[0])} · Newest first
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
                    color: (compareMode ? "compare" : "browse") === mode ? "#ffffff" : "#6b6f91",
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
            const between = olderIdx === newerIdx
              ? [newer]
              : RELEASES.slice(newerIdx, olderIdx);
            const allFeatures = between.flatMap(r => r.features.map(f => ({ ver: r.version, rev: r.rev, text: f })));
            const allFixes = between.flatMap(r => r.fixes.map(f => ({ ver: r.version, rev: r.rev, text: f })));
            return (
              <div>
                {/* Selectors */}
                <div className="release-compare-selectors" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>From version</label>
                    <select value={compareA} onChange={e => setCompareA(e.target.value)}
                      style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                      {RELEASES.map(r => <option key={r.version} value={r.version}>{r.version} ({r.rev})</option>)}
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

                {/* Summary bar + share link */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.6rem" }}>
                  <ShareLinkButton
                    hash="#releases"
                    params={{
                      vm: "c",
                      va: revNumber(RELEASES.find(r => r.version === compareA) || {}),
                      vb: revNumber(RELEASES.find(r => r.version === compareB) || {}),
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                  {[
                    { label: "Revisions covered", val: between.length, bg: "rgba(47,49,90,0.06)", col: "#2f315a" },
                    { label: "New features", val: allFeatures.length, bg: "rgba(47,49,90,0.06)", col: "#2f315a" },
                    { label: "Bug fixes", val: allFixes.length, bg: "rgba(201,168,76,0.1)", col: "#8a6a10" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, minWidth: 120, background: s.bg, borderRadius: 12, padding: "1rem 1.25rem" }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Changelog between the two versions */}
                <div className="release-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2f315a" }}>New Features ({allFeatures.length})</div>
                      {allFeatures.length > 0 && <CopyBtn onClick={() => copyCompare(allFeatures, compareA, compareB, "features")} />}
                    </div>
                    {allFeatures.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No new features in this range.</div>}
                    {allFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(47,49,90,0.08)", color: "#2f315a", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a6a10" }}>Bug Fixes ({allFixes.length})</div>
                      {allFixes.length > 0 && <CopyBtn onClick={() => copyCompare(allFixes, compareA, compareB, "fixes")} gold />}
                    </div>
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
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
              {filtered.map((r) => (
                <ReleaseCard
                  key={r.version}
                  r={r}
                  expanded={expanded === r.version}
                  onToggle={() => setExpanded(expanded === r.version ? null : r.version)}
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
          <a href={WA_LINK} target="_blank" rel="noreferrer"
            style={{ display: "inline-block", background: "#c9a84c", color: "#1e2040", padding: "0.85rem 2.5rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", fontFamily: "inherit", transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Enquire Now
          </a>
        </div>
      </div>

      <Footer />

      <AutoCountTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </div>
  );
}
