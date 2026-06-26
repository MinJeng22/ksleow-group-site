import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { PageSectionDivider, getSection } from "../../components/PageSections.jsx";
import WhyChooseUs from "../../components/WhyChooseUs.jsx";
import {
  IconDollar,
  IconGrid,
  IconLedger,
  IconStar,
  IconTrophy,
  IconDatabase,
  IconRegister,
} from "../../components/SectionDivider.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import FeatureShowcase from "../../components/FeatureShowcase.jsx";
import { CompareFeatureCell } from "../../components/CompareTable.jsx";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import useFavicon from "../../hooks/useFavicon.js";
import { runWithProgressFeedback } from "../../utils/routeTransitions.js";
import posReleases from "../../content/autocountPosReleases.json";
import { CopyReleaseButton, HighlightText, ReleaseNumber, ShareLinkButton, writeClipboard } from "../../components/ReleaseTools.jsx";

const POS_ACCENT = "#e49e25";
const POS_NAVY = "#2f315a";
const POS_HERO = "/images/products/autocount-pos-showcase.webp";
const POS_ICON = "/images/products/autocount-pos.webp";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "Hi KS Support Team, I am interested in AutoCount POS. I would like to arrange a demo or get a quotation. Thank you."
)}`;

const POS_SECTIONS = [
  { id: "features", label: "Advantages", icon: IconStar, color: POS_ACCENT },
  { id: "editions", label: "Backend", icon: IconDatabase, color: POS_NAVY },
  { id: "frontend", label: "Front End", icon: IconRegister, color: POS_NAVY },
  { id: "releases", label: "Release Notes", icon: IconLedger, color: "#b97812" },
  { id: "why-ksl", label: "Why Choose Us", icon: IconTrophy, color: POS_ACCENT },
];

const POS_RELEASES = posReleases;

const FEATURES = [
  {
    icon: "/images/icons/feature-device.svg",
    title: "Counter-ready POS operation",
    desc: "Built for day-to-day cashier work with fast billing, barcode scanning, receipt printing, cash drawer support, and clear end-of-day closing.",
  },
  {
    icon: "/images/icons/feature-integration.svg",
    title: "Connected to AutoCount Accounting",
    desc: "Sales, stock movement, payment collections, and outlet reports stay aligned with your backend accounting workflow.",
  },
  {
    icon: "/images/icons/feature-bank.svg",
    title: "Retail, branch, and F&B options",
    desc: "Choose the right counter license and add POS modules such as branch sync, POS stock, POS account, price checker, and eWaiter apps.",
  },
  {
    icon: "/images/branding/ksl-logo-circle.webp",
    title: "KSL implementation support",
    desc: "We help with setup planning, hardware readiness, module selection, user training, and post-live support for your cashier team.",
  },
];





const EDITION_COLUMNS = ["POS Basic", "POS Standard"];
const EDITION_ROWS = [
  { label: "One-Time Payment", values: ["RM 2,300", "RM 3,100"], type: "price" },
  { label: "Software", values: ["Included", "Included"] },
  { label: "POS Counter A", values: ["1 Included", "1 Included"] },
  { label: "Default Account Book", values: ["-", "3"] },
  { label: "Default E-Invoice Account Book", values: ["-", "1"] },
  { label: "No. of Concurrent Network User", values: ["-", "1 Full"] },
];

const ADDON_GROUPS = [
  {
    title: "Additional Network User",
    rows: [
      ["1 Full Network User", "RM 800"],
      ["1 Account Network User", "RM 400"],
      ["1 Stock Network User", "RM 600"],
    ],
  },
  {
    title: "Account Books & Dongle",
    rows: [
      ["Unlimited account book", "RM 3,000"],
      ["Account Book", "RM 300"],
      ["All in one Dongle", "RM 400"],
    ],
    note: "Dongle is suitable for users facing internet connection issues.",
  },
  {
    title: "E-Invoice",
    rows: [
      ["1 Account Book", "RM 900"],
      ["1 Account Book (INT) USD", "RM 200"],
      ["1 Account Book Cash Sales QR2E per Year", "RM 240"],
      ["1 Counter POS QR2E per Year", "RM 180"],
    ],
  },
];

const ACCOUNTING_MODULE_SECTIONS = [
  {
    name: "Accounting Modules",
    rows: [
      ["SST, Project, Multi-Currency", "-", "-", "-"],
      ["GL, AR, AP, Recurrence GL", "-", "-", "-"],
      ["Simple Purchase", "-", "-", "-"],
      ["Simple Stock", "-", "-", "-"],
      ["Simple Sales", "RM 400", "+", "+"],
      ["Complete Sales", "RM 600", "+", "+"],
      ["Complete Purchase", "RM 600", "+", "+"],
      ["Complete Stock", "RM 600", "+", "+"],
      ["UDF/Formula", "RM 400", "Included", "Included"],
      ["Basic Multi-UOM", "RM 600", "+", "+"],
      ["Budget/Advanced Financial Report", "RM 600", "+", "+"],
      ["Activity Stream", "RM 800", "+", "+"],
      ["Advanced Multi-UOM", "RM 1,200", "+", "+"],
      ["Advanced Quotation", "RM 1,200", "+", "+"],
      ["Consignment", "RM 600", "+", "+"],
      ["FOC Quantity", "RM 600", "+", "+"],
      ["Landing Cost", "RM 600", "+", "+"],
      ["Multi-Location", "RM 600", "+", "+"],
      ["Recurrence (Sales and Purchase)", "RM 1,200", "+", "+"],
      ["Scripting", "RM 600", "+", "+"],
      ["Filter by salesman", "RM 1,200", "+", "+"],
      ["Advanced Item", "RM 1,200", "+", "+"],
      ["Item Batch", "RM 1,200", "+", "+"],
      ["Item Package / Item Template", "RM 1,200", "+", "+"],
      ["Multi-Dimensional Analysis", "RM 1,600", "+", "+"],
      ["Remote Credit Control", "RM 1,200", "+", "+"],
      ["Stock Assembly", "RM 1,200", "+", "+"],
    ],
  },
  {
    name: "Optional Modules",
    rows: [
      ["Advanced Multi-Currency", "RM 1,600", "+", "+"],
      ["API", "RM 400", "+", "+"],
      ["Bonus Point", "RM 2,000", "+", "+"],
      ["Consolidated Financial Report", "RM 4,000", "+", "+"],
      ["Department", "RM 1,200", "+", "+"],
      ["Export Account", "RM 400", "+", "+"],
      ["Export Stock", "RM 800", "+", "+"],
      ["Filter by account", "RM 1,600", "+", "+"],
      ["Import Third Party Xml", "RM 1,600", "+", "+"],
      ["Multi-Dimensional Price Book", "RM 1,600", "+", "+"],
      ["Multi-Level Assembly", "RM 2,000", "+", "+"],
      ["Serial Number", "RM 2,000", "+", "+"],
      ["Stock Disassembly", "RM 1,600", "+", "+"],
      ["Unrealized Gain/Loss", "RM 800", "+", "+"],
      ["Sales Order Processing", "RM 6,000", "-", "-"],
      ["Assembly Order Processing", "RM 6,000", "-", "-"],
      ["Intelligent Costing", "RM 3,000", "-", "+"],
    ],
  },
];

const POS_MODULE_SECTIONS = [
  {
    name: "POS Modules",
    rows: [
      ["POS Backend", "RM 600", "Included", "Included"],
      ["POS Stock", "RM 800", "+", "Included"],
      ["POS Account", "RM 1,200", "+", "+"],
      ["POS Serial Number", "RM 1,000", "+", "+"],
      ["POS Item Batch", "RM 600", "+", "+"],
      ["POS Item Package", "RM 600", "+", "+"],
    ],
  },
];

const POS_MODULE_NOTES = [
  "POS Backend includes POS Multi-Location, POS Multi-UOM, and POS Advance Multi-UOM.",
  "POS modules apply to POS Edition or Accounting Edition with add-on POS Counter only.",
  "If using Account Plus, Express Plus, Basic, Pro, or Premium Edition with POS Counter, POS Backend module is included.",
];

const COUNTER_COLUMNS = ["A", "B", "Branch"];
const COUNTER_ROWS = [
  { label: "Software", values: ["RM 2,300", "RM 1,300", "RM 2,900"], type: "price" },
  { label: "Support", values: ["1 Year", "1 Year", "1 Year"] },
  { label: "Local Database", values: ["Included", "-", "Included"] },
];

const FRONTEND_MODULE_SECTIONS = [
  {
    name: "POS Frontend Module",
    rows: [
      ["Branch Sync", "RM 600", "+", "-", "Included"],
      ["RemoteHQ / GIT / AR Payment", "RM 500", "+", "+", "+"],
      ["POS Sales Order", "RM 600", "+", "+", "+"],
      ["Mall Submission", "RM 600", "+", "+", "+"],
    ],
  },
  {
    name: "Standalone Application",
    rows: [
      ["Price Checker (Per Device)", "RM 500", "+", "-", "+"],
      ["eWaiter Apps (Per User)", "RM 700", "+", "-", "+"],
    ],
  },
  {
    name: "Dongle",
    rows: [["POS Dongle", "RM 200", "+", "+", "+"]],
  },
];

const FRONTEND_NOTES = [
  "Branch Sync over internet via VPN, Port Forwarding, or Service Bus requires this module.",
  "RemoteHQ requires 1 AutoCount Backend User.",
  "POS Sales Order is for POS Retail only. eWaiter Apps is for POS F&B only.",
  "POS Dongle is suitable for users facing internet connection issues.",
];

function POSMarker({ value, price = false }) {
  if (price) {
    return <span className="pos-price-value">{value}</span>;
  }
  if (value === "+") {
    return <span className="pos-marker pos-marker-plus">+</span>;
  }
  if (value === "Included") {
    return <span className="pos-marker pos-marker-included">Included</span>;
  }
  if (!value || value === "-") {
    return <span className="pos-marker pos-marker-muted">-</span>;
  }
  return <span>{value}</span>;
}

function POSCompareTable({
  columns,
  leftLabel,
  rows,
  sections,
  accent = POS_ACCENT,
  inlinePrice = false,
  mobileWidth = 760,
}) {
  const columnCount = columns.length;
  const renderRow = (row) => {
    const priceRow = row.type === "price";
    return (
      <tr key={row.label} className={priceRow ? "ks-compare-tr-book" : "ks-compare-tr-data"}>
        <CompareFeatureCell className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"} style={{ fontWeight: 600 }} meta={row.meta}>
          {row.label}
        </CompareFeatureCell>
        {row.values.map((value, index) => (
          <td key={`${row.label}-${index}`} className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"}>
            <POSMarker value={value} price={priceRow} />
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="ks-compare-panel pos-compare-panel">
      <div className="ks-compare-wrap">
        <table
          className="ks-compare-table"
          style={{
            "--edition-count": columnCount,
            "--mobile-table-width": `${mobileWidth}px`,
          }}
        >
          <colgroup>
            <col className="ks-compare-col-feature" width={columnCount > 2 ? "32%" : "38%"} />
            {columns.map((column) => (
              <col key={column} className="ks-compare-col-edition" width={`${(columnCount > 2 ? 68 : 62) / columnCount}%`} />
            ))}
          </colgroup>
          <thead className="ks-compare-thead">
            <tr style={{ "--th-bg": accent }}>
              <th className="ks-compare-th ks-compare-th-left">{leftLabel}</th>
              {columns.map((column) => (
                <th key={column} className="ks-compare-th">
                  <span className="ks-compare-edition-name">{column}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="ks-compare-tbody">
            {rows?.map(renderRow)}
            {sections?.map((section) => (
              <React.Fragment key={section.name}>
                <tr className="ks-compare-tr-section">
                  <td colSpan={columnCount + 1} className="ks-compare-td-section">
                    {section.name}
                  </td>
                </tr>
                {section.rows.map(([label, ...values]) =>
                  renderRow({
                    label,
                    meta: inlinePrice ? values[0] : null,
                    values: inlinePrice ? values.slice(1) : values,
                    type: label === "Software" ? "price" : undefined,
                  })
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddOnGrid() {
  return (
    <div className="pos-addon-grid">
      {ADDON_GROUPS.map((group) => (
        <article key={group.title} className="pos-addon-card">
          <h3>{group.title}</h3>
          <div className="pos-addon-rows">
            {group.rows.map(([label, value]) => (
              <div key={label} className="pos-addon-row">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          {group.note && <p>{group.note}</p>}
        </article>
      ))}
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="pos-section-intro">
      <div className="ks-eyebrow" style={{ color: POS_ACCENT }}>
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}



function NotesPanel({ title, items }) {
  return (
    <aside className="pos-note-panel">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

const posReleaseCode = (release) => String(release.version || "").replace(/\./g, "-");

function copyPosRelease(release, type) {
  const label = type === "fixes" ? "Bug Fixes" : "Enhancements";
  const items = release[type] || [];
  const text = [
    `AutoCount POS ${release.version} - ${label}`,
    release.date ? `Release Date: ${release.date}` : "",
    "",
    ...items.map((item, index) => `${index + 1}. ${item}`),
    "",
    release.releasePdfUrl ? `Official PDF: ${release.releasePdfUrl}` : "",
  ].filter(Boolean).join("\n");
  writeClipboard(text);
}

function POSReleaseList({ title, items, type, release, search }) {
  const isFix = type === "fixes";
  return (
    <div className="pos-release-list">
      <div className="pos-release-list-head">
        <h4>{title}</h4>
        {items.length > 0 && (
          <CopyReleaseButton variant="button" gold={isFix} onClick={() => copyPosRelease(release, type)} />
        )}
      </div>
      {items.length === 0 ? (
        <p className="pos-release-empty">No items listed in this official note.</p>
      ) : (
        <div className="pos-release-items">
          {items.map((item, index) => (
            <div key={`${release.version}-${type}-${index}`} className="pos-release-item">
              <ReleaseNumber number={index + 1} type={isFix ? "fix" : "feature"} fixColor={POS_ACCENT} fixBg="rgba(228, 158, 37, 0.13)" />
              <span className="ks-list-text"><HighlightText text={item} search={search} /></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function POSReleaseCard({ release, expanded, onToggle, search }) {
  const isLatest = release === POS_RELEASES[0];
  const releaseId = `pos-release-${posReleaseCode(release)}`;
  const hasHighlights = !!release.highlightsUrl;
  const meta = [
    release.dbVer && `Backend DB ${release.dbVer.replace(/\.$/, "")}`,
    release.posDbVer && `POS DB ${release.posDbVer.replace(/\.$/, "")}`,
    release.frontendDbVer && `Frontend DB ${release.frontendDbVer.replace(/\.$/, "")}`,
    release.server && `Server ${release.server.replace(/\.$/, "")}`,
  ].filter(Boolean);

  return (
    <article id={releaseId} className={`pos-release-card${expanded ? " is-expanded" : ""}`}>
      <button type="button" className="pos-release-card-head" onClick={onToggle}>
        <span className="pos-release-main">
          <span className="pos-release-title-row">
            <strong>{release.version}</strong>
            <em>{release.rev}</em>
            {isLatest && <i>Latest</i>}
            {hasHighlights && <i className="is-highlight">Highlights</i>}
          </span>
          <span className="pos-release-meta">
            Released {release.date || "from official release note"}
            {release.lastModified ? ` - Updated ${release.lastModified}` : ""}
          </span>
        </span>
        <span className="pos-release-counts" aria-label="Release note item counts">
          <b>{release.features.length} Enhancements</b>
          <b>{release.fixes.length} Fixes</b>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="pos-release-detail">
          <div className="pos-release-actions">
            {release.releasePdfUrl && <a href={release.releasePdfUrl} target="_blank" rel="noreferrer">Official PDF</a>}
            {hasHighlights && <a href={release.highlightsUrl} target="_blank" rel="noreferrer">Highlight PDF</a>}
            <ShareLinkButton variant="button" compact hash={`#${releaseId}`} params={{ pr: posReleaseCode(release) }} title="Copy a shareable link to this POS release note" />
          </div>

          {meta.length > 0 && (
            <div className="pos-release-meta-grid">
              {meta.map((item) => <span key={item}>{item}</span>)}
            </div>
          )}

          <div className="pos-release-detail-grid">
            <POSReleaseList title="Enhancements" items={release.features} type="features" release={release} search={search} />
            <POSReleaseList title="Bug Fixes" items={release.fixes} type="fixes" release={release} search={search} />
          </div>
        </div>
      )}
    </article>
  );
}

function POSReleaseNotesSection({ search, setSearch, expanded, setExpanded, visibleLimit, setVisibleLimit }) {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? POS_RELEASES.filter((release) => {
        const haystack = [
          release.version,
          release.rev,
          release.date,
          release.lastModified,
          release.dbVer,
          release.posDbVer,
          release.frontendDbVer,
          release.server,
          ...(release.features || []),
          ...(release.fixes || []),
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      })
    : POS_RELEASES;
  const shown = filtered.slice(0, visibleLimit);
  const latest = POS_RELEASES[0];
  const highlightCount = POS_RELEASES.filter((release) => release.highlightsUrl).length;

  return (
    <section id="releases" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-to-paper">
      <div className="content-wrap">
        <div className="pos-release-toolbar">
          <div>
            <h2>Official Release Notes</h2>
          </div>
          <div className="pos-release-search">
            <input
              type="search"
              style={{ outline: "none" }}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleLimit(5);
              }}
              placeholder="Search POS release notes..."
              aria-label="Search AutoCount POS release notes"
            />
          </div>
        </div>

        <div className="pos-release-source">
          Source: <a href="https://wiki.autocountsoft.com/wiki/Category:AutoCount_Pos_5.2:_Release_Note" target="_blank" rel="noreferrer">AutoCount POS 5.2 official release note category</a>
        </div>

        {shown.length === 0 ? (
          <div className="pos-release-empty-panel">No POS releases match "{search}".</div>
        ) : (
          <div className="pos-release-stack">
            {shown.map((release) => (
              <POSReleaseCard
                key={release.version}
                release={release}
                expanded={expanded === release.version || search.trim() !== ""}
                onToggle={() => setExpanded(expanded === release.version ? null : release.version)}
                search={search}
              />
            ))}
          </div>
        )}

        {filtered.length > visibleLimit && (
          <button type="button" className="ks-btn ks-btn-muted pos-release-more" onClick={() => setVisibleLimit((limit) => limit + 5)}>
            View more releases
          </button>
        )}
      </div>
    </section>
  );
}


export default function AutoCountPOSPage({ onContact }) {
  useFavicon(POS_ICON);
  const [trialOpen, setTrialOpen] = useState(false);
  const [releaseSearch, setReleaseSearch] = useState("");
  const [expandedRelease, setExpandedRelease] = useState(null);
  const [releaseVisibleLimit, setReleaseVisibleLimit] = useState(5);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedRelease = POS_RELEASES.find((release) => posReleaseCode(release) === params.get("pr"));
    if (sharedRelease) {
      setExpandedRelease(sharedRelease.version);
    }

    const scrollTarget = window.location.hash || (sharedRelease ? `#pos-release-${posReleaseCode(sharedRelease)}` : "");
    if (scrollTarget) {
      const timer = window.setTimeout(() => {
        const el = document.querySelector(scrollTarget);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    return undefined;
  }, []);

  const handleContact = () => {
    if (onContact) onContact();
  };

  return (
    <div id="page-autocount-pos" className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <style>{`
        #page-autocount-pos {
          --pos-accent: ${POS_ACCENT};
          --pos-navy: ${POS_NAVY};
          background:
            linear-gradient(
              180deg,
              var(--ks-page-paper) 0%,
              var(--ks-page-paper) 18%,
              var(--ks-page-mist) 34%,
              var(--ks-page-ice) 52%,
              var(--ks-page-cloud) 70%,
              var(--ks-page-warm) 86%,
              var(--ks-page-paper) 100%
            );
        }
        #page-autocount-pos .ks-btn-primary {
          background: var(--pos-accent) !important;
          border-color: var(--pos-accent) !important;
          color: #ffffff !important;
        }
        #page-autocount-pos .ks-btn-primary:hover {
          background: #f0ad32 !important;
          border-color: #f0ad32 !important;
        }
        #page-autocount-pos .product-hero {
          --product-hero-overlay: linear-gradient(90deg, rgba(22, 24, 38, 0.8), rgba(22, 24, 38, 0.46), rgba(22, 24, 38, 0.28));
        }
        #page-autocount-pos .pos-section-intro {
          max-width: 780px;
          margin: 0 auto 2.5rem;
          text-align: center;
        }
        #page-autocount-pos .pos-section-intro h2 {
          margin: 0.55rem 0 0;
          color: var(--pos-navy);
          font-size: clamp(1.55rem, 3vw, 2.35rem);
          line-height: 1.15;
          font-weight: 760;
        }
        #page-autocount-pos .pos-section-intro p {
          margin: 0.9rem auto 0;
          max-width: 680px;
          color: #6b6f91;
          font-size: 0.98rem;
          line-height: 1.75;
        }
        #page-autocount-pos .pos-workflow-grid,
        #page-autocount-pos .pos-addon-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }
        #page-autocount-pos .pos-workflow-card,
        #page-autocount-pos .pos-addon-card,
        #page-autocount-pos .pos-note-panel {
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 18px 45px rgba(47, 49, 90, 0.07);
        }
        #page-autocount-pos .pos-workflow-card {
          padding: 1.25rem;
        }
        #page-autocount-pos .pos-workflow-card span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 999px;
          background: rgba(228, 158, 37, 0.13);
          color: var(--pos-accent);
          font-size: 0.82rem;
          font-weight: 800;
        }
        #page-autocount-pos .pos-workflow-card h3,
        #page-autocount-pos .pos-addon-card h3,
        #page-autocount-pos .pos-note-panel h3 {
          margin: 1rem 0 0.55rem;
          color: var(--pos-navy);
          font-size: 1rem;
          line-height: 1.3;
        }
        #page-autocount-pos .pos-workflow-card p,
        #page-autocount-pos .pos-addon-card p,
        #page-autocount-pos .pos-note-panel li {
          color: #6b6f91;
          font-size: 0.9rem;
          line-height: 1.65;
        }
        #page-autocount-pos .pos-addon-card {
          padding: 1.15rem;
        }
        #page-autocount-pos .pos-addon-card h3 {
          margin-top: 0;
        }
        #page-autocount-pos .pos-addon-rows {
          display: grid;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-addon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid rgba(47, 49, 90, 0.08);
          padding-top: 0.55rem;
          color: #4f536f;
          font-size: 0.9rem;
        }
        #page-autocount-pos .pos-addon-row strong,
        #page-autocount-pos .pos-price-value {
          color: #2f315a;
          font-weight: 780;
        }
        #page-autocount-pos .pos-compare-panel {
          max-width: 1180px;
          margin: 0 auto;
        }
        #page-autocount-pos .pos-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.5rem;
          min-height: 1.5rem;
          border-radius: 999px;
          font-weight: 780;
          line-height: 1;
        }
        #page-autocount-pos .pos-marker-plus {
          color: var(--pos-accent);
          background: rgba(228, 158, 37, 0.11);
        }
        #page-autocount-pos .pos-marker-included {
          min-width: auto;
          min-height: 0;
          padding: 0.38rem 0.65rem;
          background: rgba(22, 161, 75, 0.11);
          color: #14823c;
          font-size: 0.74rem;
          letter-spacing: 0;
        }
        #page-autocount-pos .pos-marker-muted {
          color: #a2a6b8;
          background: rgba(47, 49, 90, 0.04);
        }
        #page-autocount-pos .pos-note-panel {
          max-width: 1180px;
          margin: 1rem auto 0;
          padding: 1rem 1.15rem;
        }
        #page-autocount-pos .pos-note-panel h3 {
          margin-top: 0;
        }
        #page-autocount-pos .pos-note-panel ul {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.45rem 1rem;
          margin: 0;
          padding-left: 1.1rem;
        }
        #page-autocount-pos .pos-legend {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          color: #6b6f91;
          font-size: 0.82rem;
          margin: -0.75rem 0 1.5rem;
        }
        #page-autocount-pos .pos-release-toolbar {
          align-items: flex-end;
          display: flex;
          gap: 1.25rem;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        #page-autocount-pos .pos-release-toolbar h2 {
          color: var(--pos-navy);
          font-size: clamp(1.45rem, 2.7vw, 2.15rem);
          font-weight: 780;
          line-height: 1.18;
          margin: 0.45rem 0 0.45rem;
        }
        #page-autocount-pos .pos-release-toolbar p,
        #page-autocount-pos .pos-release-source {
          color: #6b6f91;
          font-size: 0.86rem;
          line-height: 1.6;
          margin: 0;
        }
        #page-autocount-pos .pos-release-source {
          margin-bottom: 1.25rem;
        }
        #page-autocount-pos .pos-release-source a,
        #page-autocount-pos .pos-release-actions a {
          color: var(--pos-accent);
          font-weight: 780;
          text-decoration: none;
        }
        #page-autocount-pos .pos-release-search {
          flex: 0 1 360px;
        }
        #page-autocount-pos .pos-release-search input {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.13);
          border-radius: 999px;
          color: var(--pos-navy);
          font: inherit;
          min-height: 46px;
          outline: none;
          padding: 0 1rem;
          width: 100%;
        }
        #page-autocount-pos .pos-release-search input:focus {
          border-color: rgba(228, 158, 37, 0.65);
          box-shadow: 0 0 0 4px rgba(228, 158, 37, 0.12);
        }
        #page-autocount-pos .pos-release-stack {
          display: grid;
          gap: 0.85rem;
        }
        #page-autocount-pos .pos-release-card {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 14px;
          box-shadow: 0 18px 45px rgba(47, 49, 90, 0.06);
          overflow: hidden;
          scroll-margin-top: 28px;
        }
        #page-autocount-pos .pos-release-card.is-expanded {
          border-color: rgba(228, 158, 37, 0.42);
        }
        #page-autocount-pos .pos-release-card-head {
          align-items: center;
          background: transparent;
          border: 0;
          color: inherit;
          cursor: pointer;
          display: flex;
          font: inherit;
          gap: 1rem;
          padding: 1.05rem 1.25rem;
          text-align: left;
          width: 100%;
        }
        #page-autocount-pos .pos-release-card.is-expanded .pos-release-card-head {
          background: #fffaf0;
        }
        #page-autocount-pos .pos-release-card-head svg {
          color: #a8abcc;
          flex-shrink: 0;
          transform: rotate(0);
          transition: transform 0.2s ease;
        }
        #page-autocount-pos .pos-release-card.is-expanded .pos-release-card-head svg {
          transform: rotate(180deg);
        }
        #page-autocount-pos .pos-release-main {
          flex: 1 1 auto;
          min-width: 0;
        }
        #page-autocount-pos .pos-release-title-row,
        #page-autocount-pos .pos-release-actions,
        #page-autocount-pos .pos-release-meta-grid {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-release-title-row strong {
          color: var(--pos-navy);
          font-size: 0.98rem;
          font-weight: 850;
        }
        #page-autocount-pos .pos-release-title-row em {
          color: #a8abcc;
          font-size: 0.72rem;
          font-style: normal;
          font-weight: 780;
        }
        #page-autocount-pos .pos-release-title-row i {
          background: var(--pos-navy);
          border-radius: 999px;
          color: #ffffff;
          font-size: 0.6rem;
          font-style: normal;
          font-weight: 850;
          letter-spacing: 0.08em;
          padding: 0.18rem 0.58rem;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-release-title-row i.is-highlight {
          background: rgba(228, 158, 37, 0.15);
          color: #b97812;
        }
        #page-autocount-pos .pos-release-meta {
          color: #8b8fa7;
          display: block;
          font-size: 0.78rem;
          margin-top: 0.25rem;
        }
        #page-autocount-pos .pos-release-counts {
          display: flex;
          flex-shrink: 0;
          gap: 0.65rem;
        }
        #page-autocount-pos .pos-release-counts b {
          color: var(--pos-navy);
          font-size: 0.72rem;
          font-weight: 780;
          white-space: nowrap;
        }
        #page-autocount-pos .pos-release-detail {
          border-top: 1px solid rgba(47, 49, 90, 0.08);
          padding: 1rem 1.25rem 1.3rem;
        }
        #page-autocount-pos .pos-release-actions {
          margin-bottom: 0.9rem;
        }
        #page-autocount-pos .pos-release-actions a {
          background: rgba(228, 158, 37, 0.1);
          border-radius: 999px;
          font-size: 0.74rem;
          padding: 0.45rem 0.75rem;
        }
        #page-autocount-pos .pos-release-meta-grid {
          margin-bottom: 1rem;
        }
        #page-autocount-pos .pos-release-meta-grid span {
          background: rgba(47, 49, 90, 0.055);
          border-radius: 999px;
          color: #5f647d;
          font-size: 0.72rem;
          font-weight: 760;
          padding: 0.36rem 0.68rem;
        }
        #page-autocount-pos .pos-release-detail-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #page-autocount-pos .pos-release-list-head {
          align-items: center;
          display: flex;
          gap: 0.75rem;
          justify-content: space-between;
          margin-bottom: 0.8rem;
        }
        #page-autocount-pos .pos-release-list-head h4 {
          color: var(--pos-navy);
          font-size: 0.82rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          margin: 0;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-release-items {
          display: grid;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-release-item {
          align-items: flex-start;
          display: flex;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-release-empty,
        #page-autocount-pos .pos-release-empty-panel {
          color: #9a9eb5;
          font-size: 0.86rem;
          line-height: 1.6;
          margin: 0;
        }
        #page-autocount-pos .pos-release-empty-panel {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.08);
          border-radius: 12px;
          padding: 1rem;
        }
        #page-autocount-pos .pos-release-more {
          display: flex;
          margin: 1.35rem auto 0;
        }
        #page-autocount-pos .pos-why-ksl {
          background:
            radial-gradient(circle at 14% 20%, rgba(228, 158, 37, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(47, 49, 90, 0.08), transparent 32%),
            linear-gradient(180deg, #fff9ed 0%, #fffdf8 48%, #fff7e7 100%);
          overflow: hidden;
          padding: clamp(4rem, 7vw, 6.25rem) 0;
          position: relative;
        }
        #page-autocount-pos .pos-why-ksl::before {
          background:
            linear-gradient(120deg, rgba(228, 158, 37, 0.12), transparent 42%),
            repeating-linear-gradient(90deg, rgba(47, 49, 90, 0.045) 0 1px, transparent 1px 84px);
          content: "";
          inset: 0;
          opacity: 0.68;
          pointer-events: none;
          position: absolute;
        }
        #page-autocount-pos .pos-why-layout {
          align-items: stretch;
          display: grid;
          gap: clamp(1.35rem, 3vw, 3rem);
          grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
          position: relative;
          z-index: 1;
        }
        #page-autocount-pos .pos-why-copy {
          align-self: center;
        }
        #page-autocount-pos .pos-why-copy h2 {
          color: var(--pos-navy);
          font-size: clamp(1.85rem, 3.6vw, 3.15rem);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.08;
          margin: 0.65rem 0 1rem;
          max-width: 620px;
        }
        #page-autocount-pos .pos-why-copy p {
          color: #626783;
          font-size: clamp(0.98rem, 1.25vw, 1.08rem);
          line-height: 1.75;
          margin: 0;
          max-width: 600px;
        }
        #page-autocount-pos .pos-why-stats {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: 1.65rem 0;
        }
        #page-autocount-pos .pos-why-stats span {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(228, 158, 37, 0.18);
          border-radius: 8px;
          color: #747891;
          display: grid;
          gap: 0.18rem;
          padding: 0.9rem;
        }
        #page-autocount-pos .pos-why-stats strong {
          color: var(--pos-navy);
          font-size: 0.98rem;
        }
        #page-autocount-pos .pos-why-cta {
          min-width: 190px;
        }
        #page-autocount-pos .pos-why-board {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 18px;
          box-shadow: 0 28px 76px rgba(47, 49, 90, 0.11);
          display: grid;
          gap: 1rem;
          padding: clamp(1rem, 2vw, 1.45rem);
        }
        #page-autocount-pos .pos-why-flow {
          background: #2f315a;
          border-radius: 14px;
          color: #fff;
          display: grid;
          gap: 0.35rem;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          padding: 0.65rem;
        }
        #page-autocount-pos .pos-why-flow span {
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          font-size: 0.78rem;
          font-weight: 800;
          gap: 0.3rem;
          justify-content: center;
          min-height: 82px;
          text-align: center;
        }
        #page-autocount-pos .pos-why-flow i {
          color: #f0c36f;
          font-size: 0.68rem;
          font-style: normal;
          letter-spacing: 0.12em;
        }
        #page-autocount-pos .pos-why-cards {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        #page-autocount-pos .pos-why-card {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.09);
          border-radius: 14px;
          min-height: 240px;
          padding: 1.1rem;
        }
        #page-autocount-pos .pos-why-card span {
          color: var(--pos-accent);
          display: block;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.12em;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-why-card h3 {
          color: var(--pos-navy);
          font-size: 1.05rem;
          line-height: 1.3;
          margin: 0 0 0.65rem;
        }
        #page-autocount-pos .pos-why-card p {
          color: #6b6f91;
          font-size: 0.9rem;
          line-height: 1.65;
          margin: 0;
        }
        @media (max-width: 980px) {
          #page-autocount-pos .pos-workflow-grid,
          #page-autocount-pos .pos-addon-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #page-autocount-pos .pos-note-panel ul {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-release-toolbar,
          #page-autocount-pos .pos-release-card-head,
          #page-autocount-pos .pos-release-detail-grid {
            align-items: stretch;
            flex-direction: column;
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-release-search {
            flex-basis: auto;
            width: 100%;
          }
          #page-autocount-pos .pos-release-counts {
            flex-wrap: wrap;
          }
          #page-autocount-pos .pos-why-layout,
          #page-autocount-pos .pos-why-cards {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-why-card {
            min-height: auto;
          }
        }
        @media (max-width: 640px) {
          #page-autocount-pos .pos-workflow-grid,
          #page-autocount-pos .pos-addon-grid {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-section-intro {
            text-align: left;
          }
          #page-autocount-pos .pos-why-ksl {
            padding: 3.5rem 0;
          }
          #page-autocount-pos .pos-why-stats,
          #page-autocount-pos .pos-why-flow {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-why-flow span {
            align-items: center;
            flex-direction: row;
            justify-content: flex-start;
            min-height: 52px;
            padding: 0 0.8rem;
          }
        }
      `}</style>

      <SectionSidebar sections={POS_SECTIONS} themeColor={POS_ACCENT} />

      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Software We Specialize In"
          title="AutoCount POS"
          body="A fast, practical point of sale system for retail counters, branch outlets, and F&B operations. KSL helps you connect front-end cashier work with AutoCount backend accounting, inventory, e-invoice, and reporting."
          iconSrc={POS_ICON}
          iconAlt="AutoCount POS"
          backgroundImage={POS_HERO}
          primaryCta={{ label: "Start Free Trial", onClick: () => runWithProgressFeedback(() => setTrialOpen(true), { assets: ["/images/branding/ksleow-gold.webp"] }) }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <div
          id="features"
          className="product-app-section product-app-section-paper product-app-section-clean"
          style={{
            "--feature-strip-bg": "linear-gradient(180deg, #f0ad32 0%, #d68b16 100%)",
            "--feature-strip-shadow": "0 0 16px rgba(228, 158, 37, 0.36)",
          }}
        >
          <FeatureShowcase features={FEATURES} wrapper />
        </div>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-ice)", marginTop: "-1.5rem" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="editions" />
        </div>

        <section id="editions" className="ac-section-tight product-app-section product-app-section-ice product-app-section-from-paper product-app-section-to-warm" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              title="Backend Editions, Pricing & Modules"
            />
            
            <div className="pos-legend">
              <span><POSMarker value="Included" /> included</span>
              <span><POSMarker value="+" /> optional add-on</span>
              <span><POSMarker value="-" /> not available</span>
            </div>
            
            <POSCompareTable
              columns={EDITION_COLUMNS}
              leftLabel="Edition / Module"
              rows={EDITION_ROWS}
              sections={[...POS_MODULE_SECTIONS, ...ACCOUNTING_MODULE_SECTIONS]}
              accent={POS_ACCENT}
              inlinePrice
              mobileWidth={760}
            />
            <p className="ks-card-text" style={{ maxWidth: 1180, margin: "1rem auto 0", fontWeight: 700 }}>
              *Prices exclude 8% SST.
            </p>
            <div style={{ height: "2.5rem" }} />
            <AddOnGrid />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-warm)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="frontend" />
        </div>

        <section id="frontend" className="ac-section-tight product-app-section product-app-section-warm product-app-section-to-paper" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              title="Front End & Counter"
            />
            
            <NotesPanel title="POS module notes" items={POS_MODULE_NOTES} />

            <div style={{ height: "2.5rem" }} />

            <POSCompareTable
              columns={COUNTER_COLUMNS}
              leftLabel="POS Counter & Add-ons"
              rows={COUNTER_ROWS}
              sections={FRONTEND_MODULE_SECTIONS}
              accent={POS_NAVY}
              inlinePrice
              mobileWidth={820}
            />
            <NotesPanel title="Front-end notes" items={FRONTEND_NOTES} />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-warm)", "--section-to": "var(--ks-page-cloud)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="releases" />
        </div>

        <POSReleaseNotesSection
          search={releaseSearch}
          setSearch={setReleaseSearch}
          expanded={expandedRelease}
          setExpanded={setExpandedRelease}
          visibleLimit={releaseVisibleLimit}
          setVisibleLimit={setReleaseVisibleLimit}
        />

        <WhyChooseUs section={getSection(POS_SECTIONS, "why-ksl")} sectionFrom="var(--ks-page-cloud)" sectionTo="var(--ks-page-paper)" />

        <EnquireNowCTA
          heading="Ready to build your POS setup?"
          body="Talk to KS Support Team for an AutoCount POS quotation, module advice, and counter implementation plan."
          buttons={[{ label: "Contact Sales", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
        />

        <Footer />
      </main>

      <AutoCountTrialModal
        open={trialOpen}
        onClose={() => setTrialOpen(false)}
        productName="AutoCount POS"
        supportMessage="HI KS Support Team, I would like to start the AutoCount POS Free Trial and schedule an installation session. I can prepare AnyDesk / UltraViewer."
        stats={[
          { label: "Trial Limit", value: "200 transactions limitation" },
          { label: "Setup Time", value: "~45 Minutes" },
          { label: "Support", value: "Remote Install" },
        ]}
        checklist={[
          <>Confirm whether you run a <strong>Retail</strong> or <strong>F&B</strong> business.</>,
          <>Install or prepare <strong>AnyDesk</strong> / <strong>UltraViewer</strong> for remote access.</>,
          <>Reserve around <strong>45 minutes</strong> for POS setup and basic checking.</>,
          <>Message our Support Team to arrange a suitable installation time.</>
        ]}
      />
    </div>
  );
}
