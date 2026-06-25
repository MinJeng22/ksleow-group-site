import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { PageSectionDivider } from "../../components/PageSections.jsx";
import {
  IconClipboard,
  IconDollar,
  IconGrid,
  IconLayers,
  IconStar,
  IconTrophy,
} from "../../components/SectionDivider.jsx";
import WhyChooseUs from "../../components/WhyChooseUs.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import FeatureShowcase from "../../components/FeatureShowcase.jsx";
import { CompareFeatureCell } from "../../components/CompareTable.jsx";

const POS_ACCENT = "#e49e25";
const POS_NAVY = "#2f315a";
const POS_HERO = "/images/products/autocount-pos-showcase.webp";
const POS_ICON = "/images/products/autocountpos.webp";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "Hi KSL Support Team, I am interested in AutoCount POS. I would like to arrange a demo or get a quotation. Thank you."
)}`;

const POS_SECTIONS = [
  { id: "features", label: "Advantages", icon: IconStar, color: POS_ACCENT },
  { id: "workflow", label: "Setup Flow", icon: IconClipboard, color: POS_ACCENT },
  { id: "editions", label: "Editions", icon: IconDollar, color: POS_NAVY },
  { id: "modules", label: "Modules", icon: IconLayers, color: POS_ACCENT },
  { id: "frontend", label: "Front End", icon: IconGrid, color: POS_NAVY },
  { id: "why-ksl", label: "Why Choose Us", icon: IconTrophy, color: POS_ACCENT },
];

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

const WORKFLOW = [
  {
    title: "Outlet discovery",
    desc: "We map your counters, account books, stock flow, hardware, users, and e-invoice requirements before quoting.",
  },
  {
    title: "License and module setup",
    desc: "POS edition, network users, backend modules, and front-end counters are configured around your actual operation.",
  },
  {
    title: "Hardware and data readiness",
    desc: "Barcode scanner, receipt printer, cash drawer, local database, item master, and account integration are checked before go-live.",
  },
  {
    title: "Training and support",
    desc: "Your team receives guided training, launch support, and practical troubleshooting after the system goes live.",
  },
];

const EDITION_COLUMNS = ["POS Basic", "POS Standard"];
const EDITION_ROWS = [
  { label: "One-Time Payment", values: ["RM 2,300", "RM 3,100"], type: "price" },
  { label: "Software", values: ["Included", "Included"] },
  { label: "Default Account Book", values: ["-", "3"] },
  { label: "Default E-Invoice Account Book", values: ["-", "1"] },
  { label: "No. of Concurrent Network User", values: ["-", "1 Full"] },
  { label: "Training Fee", values: ["Included", "Included"] },
  { label: "1 Year Support Fee", values: ["Included", "Included"] },
  { label: "Training Section", values: ["1", "1"] },
  { label: "Maximum Training Hours", values: ["3", "5"] },
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

const EXCLUDED_REBATE_ITEMS = [
  "Hardware, Service & Customize",
  "SQL Runtime license",
  "Unicart Plugin, AOTG",
  "3rd Party Product",
  "E-Invoice Module",
  "Other than Malaysia License",
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
  mobileWidth = 760,
}) {
  const columnCount = columns.length;
  const renderRow = (row) => {
    const priceRow = row.type === "price";
    return (
      <tr key={row.label} className={priceRow ? "ks-compare-tr-book" : "ks-compare-tr-data"}>
        <CompareFeatureCell className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"} style={{ fontWeight: 600 }}>
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
                  renderRow({ label, values, type: label === "Software" ? "price" : undefined })
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

function WorkflowGrid() {
  return (
    <div className="pos-workflow-grid">
      {WORKFLOW.map((item, index) => (
        <article key={item.title} className="pos-workflow-card">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </article>
      ))}
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

export default function AutoCountPOSPage({ onContact }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
        @media (max-width: 980px) {
          #page-autocount-pos .pos-workflow-grid,
          #page-autocount-pos .pos-addon-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #page-autocount-pos .pos-note-panel ul {
            grid-template-columns: 1fr;
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
          primaryCta={{ label: "Request Quotation", onClick: handleContact }}
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

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="workflow" />
        </div>

        <section id="workflow" className="product-app-section product-app-section-mist product-app-section-from-paper product-app-section-to-ice">
          <div className="content-wrap">
            <SectionIntro
              eyebrow="Setup Flow"
              title="A cleaner rollout from quotation to go-live"
              text="POS projects work best when license, counter hardware, stock flow, and accounting integration are planned together."
            />
            <WorkflowGrid />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="editions" />
        </div>

        <section id="editions" className="ac-section-tight product-app-section product-app-section-ice product-app-section-to-cloud" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              eyebrow="Editions & Pricing"
              title="POS Basic and POS Standard"
              text="Start with the edition that fits your outlet, then add users, account books, dongle, or e-invoice items when required."
            />
            <POSCompareTable columns={EDITION_COLUMNS} leftLabel="Edition" rows={EDITION_ROWS} mobileWidth={720} />
            <p className="ks-card-text" style={{ maxWidth: 1180, margin: "1rem auto 0", fontWeight: 700 }}>
              *Prices exclude 8% SST. 1 POS Counter A is included for any POS Edition purchase.
            </p>
            <AddOnGrid />
            <NotesPanel title="Excluded products from rebate scheme" items={EXCLUDED_REBATE_ITEMS} />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="modules" />
        </div>

        <section id="modules" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-to-warm" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              eyebrow="Accounting Modules"
              title="Backend modules available for POS projects"
              text="Use the same comparison table style as AutoCount Accounting so module availability, SRP, and add-ons stay easy to scan."
            />
            <div className="pos-legend">
              <span><POSMarker value="Included" /> included</span>
              <span><POSMarker value="+" /> optional add-on</span>
              <span><POSMarker value="-" /> not available</span>
            </div>
            <POSCompareTable
              columns={["SRP", "POS Basic", "POS Standard"]}
              leftLabel="Modules"
              sections={ACCOUNTING_MODULE_SECTIONS}
              accent={POS_ACCENT}
              mobileWidth={920}
            />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-cloud)", "--section-to": "var(--ks-page-warm)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="frontend" />
        </div>

        <section id="frontend" className="ac-section-tight product-app-section product-app-section-warm product-app-section-to-paper" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              eyebrow="Front End & Counter"
              title="Counter licenses, POS backend, and front-end add-ons"
              text="Plan your cashier counters together with POS backend modules, branch sync, mobile ordering, and standalone applications."
            />
            <POSCompareTable
              columns={["SRP", "POS Basic", "POS Standard"]}
              leftLabel="POS Modules"
              sections={POS_MODULE_SECTIONS}
              accent={POS_ACCENT}
              mobileWidth={840}
            />
            <NotesPanel title="POS module notes" items={POS_MODULE_NOTES} />

            <div style={{ height: "2.5rem" }} />

            <POSCompareTable
              columns={COUNTER_COLUMNS}
              leftLabel="POS Counter"
              rows={COUNTER_ROWS}
              accent={POS_NAVY}
              mobileWidth={760}
            />
            <div style={{ height: "1.5rem" }} />
            <POSCompareTable
              columns={["SRP", "A", "B", "Branch"]}
              leftLabel="POS Frontend Module"
              sections={FRONTEND_MODULE_SECTIONS}
              accent={POS_NAVY}
              mobileWidth={980}
            />
            <NotesPanel title="Front-end notes" items={FRONTEND_NOTES} />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-warm)", "--section-to": "var(--ks-page-paper)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="why-ksl" />
        </div>

        <div id="why-ksl" className="product-app-section product-app-section-paper product-app-section-clean">
          <WhyChooseUs themeColor={POS_ACCENT} />
        </div>

        <EnquireNowCTA
          heading="Ready to build your POS setup?"
          subheading="Talk to KSL for an AutoCount POS quotation, module advice, and counter implementation plan."
          buttonText="Contact Sales"
          onClick={handleContact}
          themeColor={POS_ACCENT}
        />

        <Footer />
      </main>
    </div>
  );
}
