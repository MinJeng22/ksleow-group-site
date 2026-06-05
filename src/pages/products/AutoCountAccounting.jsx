import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import ProductHero from "../../components/ProductHero.jsx";
import WhyChooseUs from "../../components/WhyChooseUs.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import { PageSectionDivider, getSection } from "../../components/PageSections.jsx";
import { IconLedger, IconVideo, IconGrid, IconStar, IconTrophy } from "../../components/SectionDivider.jsx";
import { Img } from "../../components/Media.jsx";
import autocountReleases from "../../content/autocountReleases.json";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
import FeatureShowcase from "../../components/FeatureShowcase.jsx";
import { SegmentedControl, SelectField } from "../../components/FormControls.jsx";
import { CopyReleaseButton, ReleaseNumber, ShareLinkButton } from "../../components/ReleaseTools.jsx";
import { CompareFeatureCell, editionRowDiffers, filterEditionValues, getEditionColumnIndexes } from "../../components/CompareTable.jsx";
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
                <CopyReleaseButton onClick={() => copyToClipboard(r, "features")} />
              </div>
              {r.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseNumber number={i + 1} type="feature" />
                  <span className="ks-list-text">{f}</span>
                </div>
              ))}
            </div>
            {/* Bug Fixes */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a6e0e" }}>
                  Bug Fixes
                </div>
                <CopyReleaseButton onClick={() => copyToClipboard(r, "fixes")} gold />
              </div>
              {r.fixes.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseNumber number={i + 1} type="fix" />
                  <span className="ks-list-text">{f}</span>
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
 * Comparing 6 Editions of Accounting 2.2 — feature matrix
 * ──────────────────────────────────────────────────────────────
 * Marker codes:
 *   "●" = included module
 *   "+" = optional / paid add-on
 *   "−" = not available in this edition
 * Order of editions (columns): 1 Account Plus | Account Plus | Express Plus | Basic | Pro | Premium
 * ══════════════════════════════════════════════════════════════ */
const EDITIONS = ["1 Account Plus", "Account Plus", "Express Plus", "Basic", "Pro", "Premium"];
const EDITION_PRICES = {
  "1 Account Plus": "RM1600",
  "Account Plus": "RM2200",
  "Express Plus": "RM2800",
  "Basic": "RM4200",
  "Pro": "RM6000",
  "Premium": "RM9000",
};

/* Short codes used by the Share-Link URL params so the link stays
 * compact (e.g. ?em=c&ea=ap&eb=pm instead of editionA=Account+Plus). */
const EDITION_CODE = {
  "1 Account Plus": "1ap",
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
const MODULE_PRICES = {
  "Complete Sales": "RM600",
  "Complete Purchase": "RM600",
  "Complete Stock": "RM600",
  "Formula, UDF": "RM400",
  "Basic Multi-UOM": "RM600",
  "Budget & Advanced Financial Report": "RM600",
  "Activity Stream": "RM800",
  "Advanced Multi-UOM": "RM1200",
  "Advanced Quotation": "RM1200",
  "Consignment": "RM600",
  "FOC Quantity": "RM600",
  "Landing Cost": "RM600",
  "Multi Location": "RM600",
  "Recurrence (Sales & Purchase)": "RM1200",
  "Scripting": "RM600",
  "Filter by salesman": "RM1200",
  "Advance Item": "RM1200",
  "Item Batch": "RM1200",
  "Item Package / Item Template": "RM1200",
  "Multi-Dimensional Analysis": "RM1600",
  "Remote Credit Control": "RM1200",
  "Stock Assembly": "RM1200",
  "Advanced Multi-Currency": "RM1600",
  "API": "RM400",
  "Bonus Point": "RM2000",
  "Consolidated Financial Report": "RM4000",
  "Department": "RM1200",
  "Export Account": "RM400",
  "Export Stock": "RM800",
  "Filter by account": "RM1600",
  "Import Third Party Xml": "RM1600",
  "Multi-Dimensional Price Book": "RM1600",
  "Multi-Level Assembly": "RM2000",
  "Serial Number": "RM2000",
  "Stock Disassembly": "RM1600",
  "Unrealized Gain/Loss": "RM800",
  "Sales Order Processing": "RM6000",
  "Assembly Order Processing": "RM6000",
  "Intelligent Costing": "RM3000",
};
const EDITION_TABLE = {
  oneTimePayment: EDITIONS.map((edition) => EDITION_PRICES[edition]),
  defaultAccountBook: ["1", "3", "3", "5", "5", "5"],
  sections: [
    {
      name: "Modules",
      rows: [
        ["Plug-In",                            ["−", "●", "●", "●", "●", "●"]],
        ["SST, Project, Multi-Currency",       ["●", "●", "●", "●", "●", "●"]],
        ["GL, AR, AP, Recurrence GL",          ["●", "●", "●", "●", "●", "●"]],
        ["Budget & Advanced Financial Report", ["−", "+", "+", "●", "●", "●"]],
        ["Formula, UDF",                       ["−", "+", "+", "●", "●", "●"]],
        ["Simple Sales",                       ["●", "●", "●", "●", "●", "●"]],
        ["Simple Purchase",                    ["●", "●", "●", "●", "●", "●"]],
        ["Simple Stock",                       ["−", "−", "●", "●", "●", "●"]],
        ["Complete Sales",                     ["−", "+", "+", "●", "●", "●"]],
        ["Complete Purchase",                  ["−", "+", "+", "●", "●", "●"]],
        ["Complete Stock",                     ["−", "+", "+", "●", "●", "●"]],
        ["Basic Multi-UOM",                    ["−", "+", "+", "●", "●", "●"]],
        ["Activity Stream",                    ["−", "+", "+", "+", "●", "●"]],
        ["Advanced Multi-UOM",                 ["−", "+", "+", "+", "●", "●"]],
        ["Advanced Quotation",                 ["−", "+", "+", "+", "●", "●"]],
        ["Consignment",                        ["−", "+", "+", "+", "●", "●"]],
        ["FOC Quantity",                       ["−", "+", "+", "+", "●", "●"]],
        ["Landing Cost",                       ["−", "+", "+", "+", "●", "●"]],
        ["Multi Location",                     ["−", "+", "+", "+", "●", "●"]],
        ["Recurrence (Sales & Purchase)",      ["−", "+", "+", "+", "●", "●"]],
        ["Scripting",                          ["−", "+", "+", "+", "●", "●"]],
        ["Advance Item",                       ["−", "+", "+", "+", "+", "●"]],
        ["Filter by salesman",                 ["−", "+", "+", "+", "+", "●"]],
        ["Item Batch",                         ["−", "+", "+", "+", "+", "●"]],
        ["Item Package / Item Template",       ["−", "+", "+", "+", "+", "●"]],
        ["Multi-Dimensional Analysis",         ["−", "+", "+", "+", "+", "●"]],
        ["Remote Credit Control",              ["−", "+", "+", "+", "+", "●"]],
        ["Stock Assembly",                     ["−", "+", "+", "+", "+", "●"]],
      ],
    },
    {
      name: "Optional Module",
      rows: [
        ["Intelligent Costing",                ["−", "+", "+", "+", "+", "+"]],
        ["Advanced Multi-Currency",            ["−", "+", "+", "+", "+", "+"]],
        ["API",                                ["−", "+", "+", "+", "+", "+"]],
        ["Bonus Point",                        ["−", "+", "+", "+", "+", "+"]],
        ["Consolidated Financial Report",      ["−", "+", "+", "+", "+", "+"]],
        ["Department",                         ["−", "+", "+", "+", "+", "+"]],
        ["Export Account",                     ["−", "+", "+", "+", "+", "+"]],
        ["Export Stock",                       ["−", "+", "+", "+", "+", "+"]],
        ["Filter by account",                  ["−", "+", "+", "+", "+", "+"]],
        ["Import Third Party Xml",             ["−", "+", "+", "+", "+", "+"]],
        ["Multi-Dimensional Price Book",       ["−", "+", "+", "+", "+", "+"]],
        ["Multi-Level Assembly",               ["−", "+", "+", "+", "+", "+"]],
        ["Serial Number",                      ["−", "+", "+", "+", "+", "+"]],
        ["Stock Disassembly",                  ["−", "+", "+", "+", "+", "+"]],
        ["Unrealized Gain/Loss",               ["−", "+", "+", "+", "+", "+"]],
        ["Sales Order Processing",             ["−", "+", "+", "+", "+", "+"]],
        ["Assembly Order Processing",          ["−", "+", "+", "+", "+", "+"]],
      ],
    },
    {
      name: "POS Counter",
      rows: [
        ["POS A",      ["−", "+", "+", "+", "+", "+"]],
        ["POS B",      ["−", "+", "+", "+", "+", "+"]],
        ["POS Branch", ["−", "+", "+", "+", "+", "+"]],
      ],
    },
    {
      name: "POS Modules",
      rows: [
        ["POS Serial Number",  ["−", "+", "+", "+", "+", "+"]],
        ["POS Item Batch",     ["−", "+", "+", "+", "+", "+"]],
        ["POS Item Package",   ["−", "+", "+", "+", "+", "+"]],
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
  const cols = (selected && selected.length > 0) ? selected : EDITIONS;
  const colIdx = getEditionColumnIndexes(EDITIONS, selected);
  const filterRow = (values) => filterEditionValues(values, colIdx);
  const rowDiffers = (values) => editionRowDiffers(values, colIdx);

  return (
    <div className="ks-compare-panel">
      <div className="ks-compare-wrap">
        <table className="ks-compare-table" style={{ "--edition-count": cols.length }}>
          <colgroup>
            <col className="ks-compare-col-feature" width="31%" />
            {cols.map((edition) => (
              <col key={edition} className="ks-compare-col-edition" width={`${69 / cols.length}%`} />
            ))}
          </colgroup>
          <thead className="ks-compare-thead">
            <tr style={{ "--th-bg": "#80c31e" }}>
              <th className="ks-compare-th ks-compare-th-left">Module</th>
              {cols.map(e => (
                <th key={e} className="ks-compare-th">
                  <span className="ks-compare-edition-name">{e}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="ks-compare-tr-book">
              <td className="ks-compare-td-left ks-compare-td-book" style={{ background: "inherit", fontWeight: 500 }}>
                <span>One-Time Payment</span>
              </td>
              {filterRow(EDITION_TABLE.oneTimePayment).map((v, i) => (
                <td key={i} className="ks-compare-td-book">{v}</td>
              ))}
            </tr>
            <tr className="ks-compare-tr-book">
              <td className="ks-compare-td-left ks-compare-td-book" style={{ background: "inherit", fontWeight: 500 }}>Default Account Book</td>
              {filterRow(EDITION_TABLE.defaultAccountBook).map((v, i) => (
                <td key={i} className="ks-compare-td-book">{v}</td>
              ))}
            </tr>
            {EDITION_TABLE.sections.map((section) => {
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
                  {rows.map(([rowName, values], ri) => {
                    const visibleVals = filterRow(values);
                    return (
                      <tr key={rowName} className="ks-compare-tr-data">
                        <CompareFeatureCell style={{ fontWeight: 500 }} meta={MODULE_PRICES[rowName]}>
                          {rowName}
                        </CompareFeatureCell>
                        {visibleVals.map((v, vi) => (
                          <td key={vi} className="ks-compare-td-data">
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
    icon: "/images/icons/feature-integration.svg",
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

const FEATURE_PROMOS = [
  {
    src: "/images/promotions/ksl-referral-program.jpg",
    alt: "KSL Business Solutions referral program",
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
  "/images/brands/ac-brand-11.png",
  "/images/brands/ac-brand-12.png",
  "/images/brands/ac-brand-13.png",
  "/images/brands/ac-brand-14.png",
  "/images/brands/ac-brand-15.png",
];



/* AutoCount sidebar anchor items */
const AC_SECTIONS = [
  { id: "features", label: "Features", icon: IconStar, color: "#80c31e" },
  { id: "training", label: "Quick-Start Guide", icon: IconVideo, color: "#80c31e" },
  { id: "editions", label: "Edition Compare", icon: IconGrid, color: "#2f315a" },
  { id: "releases", label: "Release Notes", icon: IconLedger, color: "#4a6e0e" },
  { id: "why-ksl", label: "Why Choose Us", icon: IconTrophy, color: "#80c31e" },
];

export default function AutoCountAccountingPage({ onContact }) {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(null);   /* all closed by default */
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
      <SectionSidebar sections={AC_SECTIONS} themeColor="#80c31e" />

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
        <FeatureShowcase
          features={FEATURES}
          {/* promoSlides={FEATURE_PROMOS} */}
          brandLogos={BRAND_LOGOS}
          brandText="Over 240,000 businesses trust AutoCount to drive their growth"
          wrapper
        />
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
        <PageSectionDivider sections={AC_SECTIONS} id="training" />
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
        <PageSectionDivider sections={AC_SECTIONS} id="editions" />
      </div>

      {/* ══════════════════════════════════════════════════════════
       * COMPARING 6 EDITIONS OF ACCOUNTING 2.2
       * ══════════════════════════════════════════════════════════ */}
      <div id="editions" className="ac-section-tight product-app-section product-app-section-ice product-app-section-to-cloud" style={{ overflow: "visible" }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>

            <h2 style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" }}>
              Comparing 6 Editions of Accounting 2.2
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
            <SegmentedControl
              ariaLabel="Edition view mode"
              value={editionCompareMode ? "compare" : "browse"}
              onChange={(mode) => setEditionCompareMode(mode === "compare")}
              options={[
                { value: "browse", label: "Browse All Editions" },
                { value: "compare", label: "Compare Editions" },
              ]}
              style={{ background: "#ffffff", border: "1px solid rgba(47,49,90,0.08)" }}
            />
          </div>

          {/* Compare-mode controls: 2 dropdowns + diff-only toggle */}
          {editionCompareMode && (
            <div style={{ maxWidth: 720, margin: "0 auto 1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
                <SelectField
                  label="Edition A"
                  value={editionA}
                  onChange={setEditionA}
                  options={EDITIONS.map((edition) => ({ value: edition, label: edition }))}
                />
                <div style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: 700, color: "#80c31e", marginTop: "1.2rem" }}>VS</div>
                <SelectField
                  label="Edition B"
                  value={editionB}
                  onChange={setEditionB}
                  options={EDITIONS.map((edition) => ({ value: edition, label: edition }))}
                />
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
          <p className="ks-card-text" style={{ margin: "1rem 0 0", fontWeight: 700, textAlign: "left" }}>
            *Prices exclude 8% SST.
          </p>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
        <PageSectionDivider sections={AC_SECTIONS} id="releases" />
      </div>

      {/* ── Release Notes ── */}
      <div id="releases" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-to-warm">
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
                  <SelectField
                    label="From version"
                    value={compareA}
                    onChange={setCompareA}
                    options={RELEASES.map((release) => ({ value: release.version, label: `${release.version} (${release.rev})` }))}
                  />
                  <div style={{ textAlign: "center", fontSize: "1.3rem", color: "#80c31e", marginTop: "1.2rem" }}>→</div>
                  <SelectField
                    label="To version"
                    value={compareB}
                    onChange={setCompareB}
                    options={RELEASES.map((release) => ({ value: release.version, label: `${release.version} (${release.rev})` }))}
                  />
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
                      {allFeatures.length > 0 && <CopyReleaseButton onClick={() => copyCompare(allFeatures, compareA, compareB, "features")} />}
                    </div>
                    {allFeatures.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No new features in this range.</div>}
                    {allFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(47,49,90,0.08)", color: "#2f315a", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span className="ks-list-text">{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a6e0e" }}>Bug Fixes ({allFixes.length})</div>
                      {allFixes.length > 0 && <CopyReleaseButton onClick={() => copyCompare(allFixes, compareA, compareB, "fixes")} gold />}
                    </div>
                    {allFixes.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No bug fixes in this range.</div>}
                    {allFixes.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(128,195,30,0.12)", color: "#4a6e0e", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span className="ks-list-text">{f.text}</span>
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
      <WhyChooseUs section={getSection(AC_SECTIONS, "why-ksl")} />

      <EnquireNowCTA
        heading="Ready to get started with AutoCount?"
        body="KSL Business Solutions provides full AutoCount implementation, training, and support across Pahang."
        buttons={[{ label: "Enquire Now", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
      />

      <Footer />
      </main>

      <AutoCountTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </div>
  );
}
