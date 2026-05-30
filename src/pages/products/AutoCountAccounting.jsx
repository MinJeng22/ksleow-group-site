import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import ProductHero from "../../components/ProductHero.jsx";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import SectionDivider, { IconLedger, IconVideo, IconGrid, IconStar, IconHandshake } from "../../components/SectionDivider.jsx";
import ParticleBackground from "../../components/ParticleBackground.jsx";
import { Img } from "../../components/Media.jsx";
import autocountReleases from "../../content/autocountReleases.json";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
/* AutoCount Accounting page — product-aware WhatsApp link to KSL Support Team */
const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to learn more about AutoCount Accounting. Thank you."
)}`;
import { PRODUCT_IMAGES } from "../../assets/assets.js";

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
  fix: { bg: "rgba(128,195,30,0.12)", color: "#4a6e0e" },
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
        background: copied ? (gold ? "rgba(128,195,30,0.2)" : "rgba(47,49,90,0.12)") : "transparent",
        border: `1px solid ${gold ? "rgba(128,195,30,0.35)" : "rgba(47,49,90,0.18)"}`,
        borderRadius: 50, padding: "0.2rem 0.6rem",
        fontSize: "0.62rem", fontWeight: 600,
        color: copied ? (gold ? "#4a6e0e" : "#2f315a") : "#a8abcc",
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
        background: copied ? "rgba(128,195,30,0.18)" : (compact ? "transparent" : "rgba(47,49,90,0.06)"),
        border: `1px solid ${copied ? "rgba(128,195,30,0.4)" : "rgba(47,49,90,0.16)"}`,
        borderRadius: 50, padding: compact ? "0.2rem 0.6rem" : "0.4rem 0.9rem",
        fontSize: compact ? "0.62rem" : "0.74rem", fontWeight: 600,
        color: copied ? "#4a6e0e" : "#2f315a",
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
        border: "1px solid rgba(128,195,30,0.35)",
        borderRadius: 50,
        padding: "0.2rem 0.6rem",
        fontSize: "0.62rem",
        fontWeight: 600,
        color: "#2f315a",
        cursor: "pointer",
        fontFamily: "inherit",
        textDecoration: "none",
        transition: "all 0.2s",
      }}
      onMouseOver={(event) => {
        event.currentTarget.style.background = "rgba(128,195,30,0.12)";
        event.currentTarget.style.borderColor = "rgba(128,195,30,0.55)";
      }}
      onMouseOut={(event) => {
        event.currentTarget.style.background = "transparent";
        event.currentTarget.style.borderColor = "rgba(128,195,30,0.35)";
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
              <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "#2f315a", color: "#ffffff", padding: "0.18rem 0.6rem", borderRadius: 50 }}>
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
          <span style={{ fontSize: "0.72rem", color: "#2f315a", fontWeight: 600 }}>{r.features.length} New</span>
          <span style={{ fontSize: "0.72rem", color: "#4a6e0e", fontWeight: 600 }}>{r.fixes.length} Fix</span>
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
                <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a6e0e" }}>
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
    return <span style={{ display: "inline-block", width: 11, height: 11, borderRadius: "50%", background: "#80c31e" }} />;
  }
  if (value === "+") {
    return <span style={{ color: "#80c31e", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>+</span>;
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
    background: "#80c31e",
  };
  const stickyBookCell = {
    background: "#fafafb",
  };

  /* Pick subset of values for visible columns, optionally filter equal rows. */
  const filterRow = (values) => colIdx.map(i => values[i]);
  const rowDiffers = (values) => {
    const subset = filterRow(values);
    return !subset.every(v => v === subset[0]);
  };

  return (
    <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid rgba(47,49,90,0.08)", boxShadow: "0 4px 20px rgba(47,49,90,0.05)" }}>
      <div className="editions-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 3 }}>
            <tr style={{ background: "#80c31e" }}>
              <th style={{ ...stickyHeaderCell, padding: cellPad, textAlign: "left", color: "#ffffff", fontWeight: 600, minWidth: 190 }}></th>
              {cols.map(e => (
                <th key={e} style={{ ...stickyHeaderCell, padding: cellPad, color: "#ffffff", fontWeight: 700, textAlign: "center", minWidth: 86, lineHeight: 1.25 }}>{e}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "#fafafb", borderBottom: "1px solid rgba(47,49,90,0.08)" }}>
              <td style={{ ...stickyBookCell, padding: cellPad, color: "#2f315a", fontWeight: 500 }}>Default Account Book</td>
              {filterRow(EDITION_TABLE.defaultAccountBook).map((v, i) => (
                <td key={i} style={{ ...stickyBookCell, padding: cellPad, color: "#2f315a", fontWeight: 600, textAlign: "center" }}>{v}</td>
              ))}
            </tr>
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

/* AutoCount feature highlights. */
const FEATURES = [
  {
    icon: "/images/services/lhdn-logo.png",
    title: "SST & e-Invoice Ready",
    desc: "Prepared for Malaysia SST and LHDN MyInvois workflows, with accounting controls that help your team handle compliance work with less friction.",
  },
  {
    icon: "/images/icons/integration-icon.png",
    title: "Integrated Operations",
    desc: "Connect accounting with POS, inventory, payroll, and custom business workflows so daily transactions stay traceable from front counter to ledger.",
  },
  {
    icon: "/images/branding/ksl-logo-circle.webp",
    title: "Prompt Technical Support",
    desc: "KSL helps with setup, user guidance, troubleshooting, and practical usage questions so your team can keep operating without unnecessary downtime.",
  },
  {
    icon: "/images/icons/ac-plugin-icon.png",
    title: "Highly Extensible",
    desc: "Supports plugins, custom fields, scripting, and tailored automation, making AutoCount adaptable to the way your company actually works.",
  },
];

const BRAND_LOGOS = [
  "/images/brands/ac-brand-1.png",
  "/images/brands/ac-brand-2.png",
  "/images/brands/ac-brand-3.png",
  "/images/brands/ac-brand-4.png",
  "/images/brands/ac-brand-5.png",
  "/images/brands/ac-brand-6.png",
  "/images/brands/ac-brand-7.png",
  "/images/brands/ac-brand-8.png",
  "/images/brands/ac-brand-9.png",
  "/images/brands/ac-brand-10.png",
];

function FeatureHighlights() {
  const gridRef = useRef(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => setInView(e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  return (
    <div className="ac-section-wrapper" style={{ background: "#ffffff" }}>
      <div className="ac-container">
        <SectionDivider
          icon={IconStar}
          title="Highlights"
          subtitle="Why thousands choose AutoCount 2.2"
        />

        <div id="features" className="ac-section-tight ac-features-showcase" style={{ scrollMarginTop: 24, position: "relative", zIndex: 1 }}>
          <div className="content-wrap">
            <div ref={gridRef} className={`ac-features-grid${inView ? " is-in-view" : ""}`}>
              {FEATURES.map((f, i) => (
                <article
                  key={f.title}
                  className="ac-feature-card"
                  style={{ "--feature-delay": `${i * 90}ms` }}
                >
                  <span className="ac-feature-copy" style={{ position: "relative", zIndex: 2 }}>
                    <span className="ac-feature-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {f.icon && (
                        <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <img src={f.icon} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0) saturate(100%) invert(35%) sepia(21%) saturate(3065%) hue-rotate(204deg) brightness(97%) contrast(89%)" }} />
                        </div>
                      )}
                      {f.title}
                    </span>
                    <span className="ac-feature-desc">{f.desc}</span>
                  </span>
                </article>
              ))}
            </div>

            {/* Brand Marquee */}
            <div style={{ marginTop: "2rem", position: "relative" }}>
              <p style={{
                textAlign: "center", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em",
                color: "#6b6f91", textTransform: "uppercase", marginBottom: "2.5rem"
              }}>
                Over 240,000 businesses trust AutoCount to drive their growth
              </p>
              <div className="ac-brand-marquee-container" style={{
                maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                cursor: "pointer"
              }} onClick={() => setIsMarqueePaused(!isMarqueePaused)}>
                <div className="ac-brand-marquee" style={{ animationPlayState: isMarqueePaused ? "paused" : "running" }}>
                  {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((src, i) => (
                    <div key={i} className="ac-brand-item">
                      <img src={src} alt="Brand logo" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* AutoCount sidebar anchor items */
const AC_SIDEBAR_ITEMS = [
  { id: "features",      label: "Features",        icon: IconStar },
  { id: "training",      label: "Quick-Start Guide", icon: IconVideo },
  { id: "editions",      label: "Edition Compare", icon: IconGrid },
  { id: "releases",      label: "Release Notes",   icon: IconLedger },
  { id: "why-ksl",       label: "Why Choose Us",   icon: IconHandshake },
];

export default function AutoCountAccountingPage({ onContact }) {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(RELEASES[0]?.version || null);   /* first card open by default */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(RELEASES[RELEASES.length - 1].version); /* oldest */
  const [compareB, setCompareB] = useState(RELEASES[0].version);                   /* newest */
  const [visibleLimit, setVisibleLimit] = useState(5);
  const [trialOpen, setTrialOpen] = useState(false);
  /* Edition compare mode — same Browse/Compare pattern as Release Notes */
  const [editionCompareMode, setEditionCompareMode] = useState(false);
  const [editionA, setEditionA] = useState(EDITIONS[0]);                  /* Account Plus */
  const [editionB, setEditionB] = useState(EDITIONS[EDITIONS.length - 1]); /* Premium */
  const [editionDiffOnly, setEditionDiffOnly] = useState(false);



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
    <div id="page-autocount-accounting" className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <style>{`
        /* Local overrides for Start Free Trial (primary button) and Navigator focus */
        #page-autocount-accounting .ks-btn-primary {
          background: #80c31e !important;
          border-color: #80c31e !important;
          color: #ffffff !important;
        }
        #page-autocount-accounting .ks-btn-primary:hover {
          background: #8bc34a !important;
          border-color: #8bc34a !important;
        }
        #page-autocount-accounting .ac-sidebar button[style*="rgba(201, 168, 76"],
        #page-autocount-accounting .ac-sidebar button[style*="rgba(201,168,76"] {
          background: rgba(128,195,30,0.25) !important;
          color: #80c31e !important;
        }
        #page-autocount-accounting .ac-sidebar button svg {
          color: inherit !important;
        }
      `}</style>

      {/* Floating section sidebar — desktop only (≥1280px), hidden via media query otherwise */}
      <SectionSidebar items={AC_SIDEBAR_ITEMS} />

      {/* ── Hero banner — shared ProductHero component ── */}
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Software We Specialize In"
          title="AutoCount Accounting 2.2"
          body="Malaysia's leading SME accounting software — cloud-connected, SST & e-Invoice compliant, and deeply integrated with AutoCount POS and Payroll. As an authorized dealer, KSL Business Solutions provides full installation, configuration, training, and ongoing support."
          iconSrc={PRODUCT_IMAGES.autocountAccountingIcon}
          iconAlt="AutoCount Accounting"
          primaryCta={{ label: "Start Free Trial", onClick: () => setTrialOpen(true) }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">

      {/* ── Feature highlights ── */}
      <div className="product-app-section product-app-section-paper product-app-section-clean">
        <FeatureHighlights />
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
        <SectionDivider icon={IconVideo} color="#80c31e" targetId="training" />
      </div>

      {/* ══════════════════════════════════════════════════════════
       * LEARN AUTOCOUNT IN 60 MINUTES — WebGL Scroll Experience
       * ══════════════════════════════════════════════════════════ */}
      <div className="product-app-section product-app-section-mist product-app-section-from-paper product-app-section-to-ice">
        <div id="training">
          <AutoCountTrainingWebGL />
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
        <SectionDivider icon={IconGrid} color="#2f315a" targetId="editions" />
      </div>

      {/* ══════════════════════════════════════════════════════════
       * COMPARING 5 EDITIONS OF ACCOUNTING 2.2
       * ══════════════════════════════════════════════════════════ */}
      <div id="editions" className="ac-section-tight product-app-section product-app-section-ice product-app-section-to-cloud" style={{ padding: "4.5rem 0 2rem 0", scrollMarginTop: 24, overflow: "visible" }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>

            <h2 style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" }}>
              Comparing 5 Editions of Accounting 2.2
            </h2>
            <div style={{ display: "inline-flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", fontSize: "0.78rem", color: "#6b6f91" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#80c31e", display: "inline-block" }} />
                = included module
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#80c31e", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>+</span>
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
                <div style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: 700, color: "#80c31e", marginTop: "1.2rem" }}>VS</div>
                <div>
                  <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>Edition B</label>
                  <select value={editionB} onChange={e => setEditionB(e.target.value)}
                    style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                    {EDITIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              {editionA === editionB && (
                <p style={{ fontSize: "0.78rem", color: "#80c31e", textAlign: "center", marginTop: "0.65rem" }}>
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

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
        <SectionDivider icon={IconLedger} color="#4a6e0e" targetId="releases" />
      </div>

      {/* ── Release Notes ── */}
      <div id="releases" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-to-warm" style={{ padding: "2rem 0 4rem 0", scrollMarginTop: 24 }}>
        <div className="content-wrap">

          {/* ── Title + tab switcher ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>

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
                  <div style={{ textAlign: "center", fontSize: "1.3rem", color: "#80c31e", marginTop: "1.2rem" }}>→</div>
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
                    { label: "Bug fixes", val: allFixes.length, bg: "rgba(128,195,30,0.1)", col: "#4a6e0e" },
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
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a6e0e" }}>Bug Fixes ({allFixes.length})</div>
                      {allFixes.length > 0 && <CopyBtn onClick={() => copyCompare(allFixes, compareA, compareB, "fixes")} gold />}
                    </div>
                    {allFixes.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No bug fixes in this range.</div>}
                    {allFixes.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(128,195,30,0.12)", color: "#4a6e0e", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
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
              {filtered.slice(0, search ? filtered.length : visibleLimit).map((r) => (
                <ReleaseCard
                  key={r.version}
                  r={r}
                  expanded={expanded === r.version}
                  onToggle={() => setExpanded(expanded === r.version ? null : r.version)}
                />
              ))}
              {!search && visibleLimit < filtered.length && (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <button onClick={() => setVisibleLimit(prev => prev + 5)}
                    style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2f315a", background: "rgba(47,49,90,0.06)", border: "none", borderRadius: 50, padding: "0.5rem 1.25rem", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(47,49,90,0.1)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(47,49,90,0.06)"}
                  >
                    View more releases
                  </button>
                </div>
              )}
            </div>

          </>}

        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-cloud)", "--section-to": "var(--ks-page-warm)" }}>
        <SectionDivider icon={IconHandshake} targetId="why-ksl" />
      </div>
      <div id="why-ksl" className="product-app-section product-app-section-warm" style={{ padding: "4rem 0", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Why Choose Us?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", marginTop: "2rem", alignItems: "center" }}>
            
            <div style={{ paddingRight: "1rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#80c31e", marginBottom: "1.2rem" }}>
                7 Consecutive Years
              </div>
              <h3 style={{ fontSize: "clamp(1.6rem, 2.8vw, 2rem)", fontWeight: 800, color: "#2f315a", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                Pahang State Top AutoCount Dealer
              </h3>
              <p style={{ fontSize: "1.05rem", color: "#6b6f91", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Software is only as good as the people who set it up. KSL Business Solutions brings over 40 years of industry experience and has been awarded the Top AutoCount Dealer in Pahang State for 7 consecutive years.
              </p>
              <p style={{ fontSize: "0.95rem", color: "#6b6f91", lineHeight: 1.6 }}>
                Our deep technical knowledge, prompt on-site support, and dedicated training team ensure your business runs smoothly and successfully. We are proud to be the trusted partner for countless businesses across Pahang.
              </p>
            </div>
            
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 32px rgba(47,49,90,0.12)", background: "#ffffff", border: "1px solid rgba(47,49,90,0.06)" }}>
              <img 
                src="/images/autocount-awards-placeholder.png" 
                alt="7 Consecutive Years Pahang State Top AutoCount Dealer Trophies and Certificates"
                style={{ width: "100%", height: "auto", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(47,49,90,0.85)", backdropFilter: "blur(4px)", padding: "0.8rem", color: "#fff", fontSize: "0.8rem", textAlign: "center", fontWeight: 600 }}>
                Please replace placeholder with your actual trophies & certificates photo
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CTA band */}
      <div className="enquire-now-section">
        <ParticleBackground
          paused={false}
          backgroundStart="#f8f9fd"
          backgroundEnd="#eef1f8"
          lineRgb="47,49,90"
          dotRgb="201,168,76"
          highlightRgb="201,168,76"
          vignetteEnd="rgba(47,49,90,0.08)"
          densityScale={0.78}
          mobileDensityScale={2.2}
          lineAlphaScale={0.38}
          dotAlpha={0.6}
        />
        <div className="enquire-now-content content-wrap">
          <h2 className="enquire-now-heading">
            Ready to get started with AutoCount?
          </h2>
          <p className="enquire-now-body">
            KSL Business Solutions provides full AutoCount implementation,
            training, and support across Pahang.
          </p>
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-ghost-base btn-ghost-dark">
            Enquire Now
          </a>
        </div>
      </div>

      <Footer />
      </main>

      <AutoCountTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </div>
  );
}
