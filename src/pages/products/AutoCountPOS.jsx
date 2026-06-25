import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { Img } from "../../components/Media.jsx";
import { PageSectionDivider, getSection } from "../../components/PageSections.jsx";
import { IconVideo, IconGrid, IconStar, IconTrophy, IconRocket } from "../../components/SectionDivider.jsx";
import WhyChooseUs from "../../components/WhyChooseUs.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import FeatureShowcase from "../../components/FeatureShowcase.jsx";
import ProductPromotionBento from "../../components/ProductPromotionBento.jsx";
import { CompareFeatureCell, editionRowDiffers, filterEditionValues, getEditionColumnIndexes } from "../../components/CompareTable.jsx";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I am interested in AutoCount POS. I would like to arrange a demo or get a quotation. Thank you."
)}`;

const POS_SECTIONS = [
  { id: "features", label: "Features", icon: IconStar, color: "#e49e25" },
  { id: "editions", label: "Retail vs F&B", icon: IconGrid, color: "#2f315a" },
  { id: "why-ksl", label: "Why Choose Us", icon: IconTrophy, color: "#e49e25" },
];

const FEATURES = [
  {
    icon: "/images/icons/feature-device.svg",
    title: "Offline Point of Sale",
    desc: "Designed to keep your business running. Even if your internet connection drops, cashiers can continue to ring up sales and print receipts without interruption.",
  },
  {
    icon: "/images/icons/feature-bank.svg",
    title: "Real-Time Accounting Sync",
    desc: "Fully integrated with AutoCount Accounting. Daily sales, cash collections, and inventory levels synchronize directly to your backend accounts seamlessly.",
  },
  {
    icon: "/images/icons/feature-scan.svg",
    title: "Hardware Integration",
    desc: "Plug-and-play compatibility with barcode scanners, receipt printers, cash drawers, customer displays, and weighing scales.",
  },
  {
    icon: "/images/services/company-secretary.svg",
    title: "Multiple Outlet Management",
    desc: "Manage pricing, promotions, memberships, and inventory across all your retail branches centrally from HQ.",
  },
];

const EDITIONS = ["Retail POS", "F&B POS"];
const EDITION_CODE = {
  "Retail POS": "retail",
  "F&B POS": "fnb",
};
const CODE_TO_EDITION = Object.fromEntries(
  Object.entries(EDITION_CODE).map(([name, code]) => [code, name])
);

const POS_EDITION_TABLE = {
  topRows: [
    ["Best For", ["Minimarts, Hardware Stores, Pharmacies, Boutiques", "Restaurants, Cafes, Food Trucks, Kopitiams"]],
    ["Touch Screen UI", ["Optimized", "Highly Optimized"]],
    ["Barcode Scanning", ["Advanced (Multi-UOM, Serial Numbers)", "Standard"]],
  ],
  sections: [
    {
      name: "CORE POS FEATURES",
      rows: [
        ["Hold Bill / Recall Bill", ["+", "+"]],
        ["Multiple Payment Methods & E-Wallets", ["+", "+"]],
        ["Promotions & Mix-and-Match", ["+", "+"]],
        ["Member Point Accumulation & Redemption", ["+", "+"]],
        ["End of Day Closing & Cash Float", ["+", "+"]],
      ],
    },
    {
      name: "F&B SPECIFIC MODULES",
      rows: [
        ["Table Layout Management", ["", "+"]],
        ["Kitchen Receipt Printing", ["", "+"]],
        ["Set Meals & Modifiers (Add-ons, Less Sugar)", ["", "+"]],
        ["Merge Table / Split Bill", ["", "+"]],
      ],
    },
    {
      name: "BACKEND INTEGRATION",
      rows: [
        ["Live Inventory Deduction", ["+", "+"]],
        ["HQ Centralized Pricing Control", ["+", "+"]],
        ["Automatic GL Posting", ["+", "+"]],
      ],
    }
  ],
};

function POSEditionsTable() {
  const [selectedEditions, setSelectedEditions] = useState(["retail", "fnb"]);
  // FIRST argument is allEditions, SECOND is selected
  const selectedIndexes = getEditionColumnIndexes(Object.values(EDITION_CODE), selectedEditions);

  const EditionMarker = ({ value }) => {
    if (value === "+") return <span style={{ color: "#e49e25", fontSize: "1.2rem", fontWeight: "bold" }}>✓</span>;
    if (!value) return <span style={{ color: "#d1d5db" }}>-</span>;
    return <span>{value}</span>;
  };

  return (
    <div className="compare-table-wrapper" style={{ margin: "2rem auto", maxWidth: 1200 }}>
      <div className="table-controls" style={{
        display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "flex-end", marginBottom: "1rem", alignItems: "center"
      }}>
        <div style={{ marginRight: "auto", fontWeight: 600, color: "#2f315a" }}>
          Compare POS Solutions
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="feature-col-header" style={{ width: "30%" }}>Feature</th>
              {selectedIndexes.map((idx) => {
                const code = Object.values(EDITION_CODE)[idx];
                const name = CODE_TO_EDITION[code];
                return (
                  <th key={name} className="edition-col-header">
                    <div className="edition-name" style={{ color: "#e49e25" }}>{name}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {POS_EDITION_TABLE.topRows.map(([label, values], i) => (
              <tr key={`top-${i}`} className="top-row">
                <td className="feature-cell" style={{ fontWeight: 600 }}>{label}</td>
                {filterEditionValues(values, selectedIndexes).map((val, idx) => (
                  <td key={idx} className="value-cell" style={{ textAlign: "center" }}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}

            {POS_EDITION_TABLE.sections.map((section) => (
              <React.Fragment key={section.name}>
                <tr className="section-header-row">
                  <td colSpan={selectedIndexes.length + 1} className="section-header-cell" style={{ background: "#f8f9fa", fontWeight: 600, paddingTop: "1.5rem", paddingBottom: "0.5rem", color: "#2f315a" }}>
                    {section.name}
                  </td>
                </tr>
                {section.rows.map(([featureName, values], idx) => {
                  const activeVals = filterEditionValues(values, selectedIndexes);
                  const isDiff = editionRowDiffers(values, selectedIndexes);
                  return (
                    <tr key={idx} className={`feature-row ${isDiff ? "diff-row" : ""}`}>
                      <td className="feature-cell">{featureName}</td>
                      {activeVals.map((val, i) => (
                        <td key={i} className="value-cell" style={{ textAlign: "center" }}>
                          <EditionMarker value={val} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AutoCountPOSPage({ onContact }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="product-page-layout">
      <style>{`
        .pos-bg-accents {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          overflow: hidden; pointer-events: none; z-index: 0;
        }
        .pos-glow {
          position: absolute;
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(228,158,37,0.06) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
        }
        .product-app-content {
          background: #fafafa;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Floating section sidebar */}
      <SectionSidebar sections={POS_SECTIONS} themeColor="#e49e25" />

      {/* Hero banner */}
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Software We Specialize In"
          title="AutoCount POS"
          body="A fast, robust, and fully integrated Point of Sale system. Whether you run a retail chain or an F&B outlet, AutoCount POS perfectly bridges your front-desk sales with your backend accounting."
          iconSrc="/images/products/autocountpos.webp"
          iconAlt="AutoCount POS"
          primaryCta={{ label: "Request Quotation", onClick: () => onContact && onContact("AutoCount POS Demo") }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <div className="pos-bg-accents">
          <div className="pos-glow" style={{ top: "-200px", left: "-200px" }} />
          <div className="pos-glow" style={{ top: "30%", right: "-300px", background: "radial-gradient(circle, rgba(47,49,90,0.04) 0%, transparent 70%)" }} />
          <div className="pos-glow" style={{ bottom: "10%", left: "10%" }} />
        </div>

        {/* Features */}
        <section id={POS_SECTIONS[0].id} className="content-wrap" style={{ paddingTop: "6rem", paddingBottom: "4rem", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="ks-eyebrow" style={{ color: "#e49e25", marginBottom: "1rem" }}>{getSection(POS_SECTIONS, "features").label}</div>
            <h2 className="ks-section-title ks-section-title-lg" style={{ color: "#2f315a", maxWidth: 800, margin: "0 auto" }}>
              Powerful Point of Sale for <span style={{ color: "#e49e25" }}>Seamless Operations</span>
            </h2>
          </div>
          <FeatureShowcase features={FEATURES} layout="grid" iconColor="#e49e25" />
        </section>

        <PageSectionDivider />

        {/* Editions Comparison */}
        <section id={POS_SECTIONS[1].id} className="content-wrap" style={{ paddingTop: "5rem", paddingBottom: "6rem", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="ks-eyebrow" style={{ color: "#e49e25", marginBottom: "1rem" }}>{getSection(POS_SECTIONS, "editions").label}</div>
            <h2 className="ks-section-title ks-section-title-lg" style={{ color: "#2f315a" }}>
              Choose the Right Setup
            </h2>
            <p className="ks-body-text" style={{ maxWidth: 700, margin: "1rem auto 0", color: "#666" }}>
              Tailored workflows for both Retail and Food & Beverage industries.
            </p>
          </div>
          <POSEditionsTable />
        </section>

        <PageSectionDivider />

        {/* Why Choose Us */}
        <section id={POS_SECTIONS[2].id} className="content-wrap" style={{ paddingTop: "6rem", paddingBottom: "6rem", position: "relative", zIndex: 1 }}>
          <WhyChooseUs themeColor="#e49e25" />
        </section>

        {/* Bottom CTA */}
        <EnquireNowCTA 
          heading="Ready to upgrade your cashier system?"
          subheading="Talk to our POS specialists to arrange a hardware and software demo."
          buttonText="Contact Sales"
          onClick={() => onContact && onContact("AutoCount POS Demo")}
          themeColor="#e49e25"
        />

        <Footer />
      </main>
    </div>
  );
}
