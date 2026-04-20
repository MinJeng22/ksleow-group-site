import { useNavigate } from "react-router-dom";
import { CASE_IMAGES } from "../assets/assets.js";

/* 4 case studies — first 2 use real images (replaceable via assets.js),
   last 2 are fictional but plausible given KSL's service portfolio.      */
const CASES = [
  {
    key: "networking",
    tag: "IT Networking · Infrastructure",
    title: "Mentakab Mall Network Architecture Design & Deployment",
    desc: "Designed and deployed a scalable enterprise network for Mentakab Mall — covering structured cabling, VLAN segmentation, Wi-Fi 6 access points, and a centralised management dashboard.",
  },
  {
    key: "plugin",
    tag: "AutoCount · Plugin Development",
    title: "Custom Sales2DO Plugin for AutoCount Accounting",
    desc: "Built a bespoke Sales2DO module extending AutoCount's core — enabling automated order-to-delivery-order conversion, real-time stock updates, and approval workflows for a Pahang distributor.",
  },
  {
    key: "erp",
    tag: "ERP Integration · Manufacturing",
    title: "AutoCount ERP Integration for a Temerloh Food Manufacturer",
    desc: "Integrated AutoCount Accounting with a production planning module for a local food manufacturer, synchronising raw-material procurement, batch costing, and finished-goods inventory in real time.",
  },
  {
    key: "warehouse",
    tag: "IT Networking · Smart Warehouse",
    title: "Smart Warehouse Networking & Barcode System for Kuantan Logistics Firm",
    desc: "Deployed an industrial-grade wireless mesh network across a 20,000 sq ft warehouse, integrated with AutoCount's inventory module and handheld barcode scanners for real-time stock accuracy.",
  },
];

/* accent colours and placeholder icons for each card */
const CARD_META = [
  { accent: "rgba(201,168,76,0.14)", iconColor: "#c9a84c" },
  { accent: "rgba(47,49,90,0.30)",   iconColor: "#7b7fb8" },
  { accent: "rgba(25,80,60,0.28)",   iconColor: "#4caf8a" },
  { accent: "rgba(120,50,20,0.28)",  iconColor: "#c9813e" },
];

const ICONS = [
  /* network */
  <svg key="net" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/>
    <rect x="9" y="16" width="6" height="6" rx="1"/>
    <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M12 13v3"/>
  </svg>,
  /* code */
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2"/>
  </svg>,
  /* erp */
  <svg key="erp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 9h6M9 12h6M9 15h4"/>
  </svg>,
  /* warehouse */
  <svg key="wh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>,
];

export default function CaseStudies({ onContact }) {
  const navigate = useNavigate();
  return (
    <section style={{ background: "#f5f5f8", padding: "6rem 0" }}>
    <div className="content-wrap">
      {/* header */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem",
        }}>
          Success Stories
        </div>
        <h2 style={{
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700,
          color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem",
        }}>
          Case Studies
        </h2>
        <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.78, maxWidth: 540 }}>
          Real projects, real results — see how we have helped Pahang businesses
          modernise their operations with the right technology.
        </p>
      </div>

      {/* 4-col desktop → 2-col tablet → 1-col mobile (matches Products grid) */}
      <div
        className="cases-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
        }}
      >
        {CASES.map((c, i) => {
          const imgSrc = CASE_IMAGES[c.key];
          const meta   = CARD_META[i];
          /* Last 2 cards are empty placeholders */
          const isEmpty = i >= 2;
          return (
            <div
              key={c.key}
              onClick={!isEmpty && c.key === "plugin" ? () => navigate("/apps/sales2do") : undefined}
              style={{
                borderRadius: 16, overflow: "hidden",
                background: isEmpty ? "rgba(47,49,90,0.02)" : "#ffffff",
                border: `1px solid ${isEmpty ? "rgba(47,49,90,0.04)" : "rgba(47,49,90,0.1)"}`,
                cursor: !isEmpty && c.key === "plugin" ? "pointer" : "default",
                transition: "border-color 0.2s",
                minHeight: isEmpty ? 200 : "auto",
              }}
              onMouseEnter={!isEmpty && c.key === "plugin" ? e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)" : undefined}
              onMouseLeave={!isEmpty && c.key === "plugin" ? e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" : undefined}
            >
              {!isEmpty && (
                <>
                  {/* image / placeholder */}
                  <div style={{ position: "relative", paddingBottom: "48%", background: meta.accent }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={c.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: meta.iconColor, opacity: 0.5 }}>
                        {ICONS[i]}
                      </div>
                    )}
                  </div>
                  {/* body */}
                  <div style={{ padding: "1.4rem" }}>
                    <div style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.1em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      {c.tag}
                    </div>
                    <h3 style={{ fontSize: "0.93rem", fontWeight: 600, color: "#2f315a", lineHeight: 1.45, marginBottom: "0.55rem" }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: "0.81rem", color: "#6b6f91", lineHeight: 1.72 }}>
                      {c.desc}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onContact}
        style={{
          marginTop: "2.5rem",
          border: "1.5px solid rgba(47,49,90,0.28)", color: "rgba(47,49,90,0.7)",
          padding: "0.72rem 1.9rem", borderRadius: 50,
          fontSize: "0.85rem", fontWeight: 500,
          background: "transparent", cursor: "pointer", fontFamily: "inherit",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "#2f315a"; e.currentTarget.style.color = "#2f315a"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(47,49,90,0.28)"; e.currentTarget.style.color = "rgba(47,49,90,0.7)"; }}
      >
        Discuss Your Project
      </button>
    </div>
    </section>
  );
}