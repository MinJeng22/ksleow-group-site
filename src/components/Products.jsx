import { useState } from "react";
import { WA_LINK } from "../constants/contact.js";

const PRODUCTS = [
  {
    name: "AutoCount Accounting",
    desc: "Malaysia's leading cloud and desktop accounting software. Full SST and e-Invoice ready. Ideal for SMEs across Pahang and beyond.",
    emoji: "🧾",
    gradient: "linear-gradient(135deg, #2f315a 0%, #4a4d85 100%)",
  },
  {
    name: "AutoCount POS",
    desc: "Point-of-sale integrated with AutoCount Accounting. Real-time inventory, sales reporting, and seamless cashiering for retail and F&B businesses.",
    emoji: "🖥️",
    gradient: "linear-gradient(135deg, #1e2040 0%, #3a3d6b 100%)",
  },
  {
    name: "AutoCount Cloud Payroll",
    desc: "Automated payroll processing compliant with EPF, SOCSO, PCB, and EIS. Generate payslips and statutory reports effortlessly.",
    emoji: "☁️",
    gradient: "linear-gradient(135deg, #2f315a 0%, #5a5e9a 100%)",
  },
  {
    name: "FeedMe POS",
    desc: "Cloud-based restaurant and F&B POS with table management, kitchen display system, online ordering integration, and detailed sales analytics.",
    emoji: "🍽️",
    gradient: "linear-gradient(135deg, #4a2e0a 0%, #a06c2a 100%)",
  },
];

export default function Products({ onContact }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ background: "#f5f5f8", padding: "6rem var(--px)" }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
        Our Products
      </div>
      <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem" }}>
        Software We Specialize In
      </h2>
      <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.75, maxWidth: 540, marginBottom: "3rem" }}>
        We are certified partners for Malaysia's leading accounting and business software solutions.
      </p>
      <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {PRODUCTS.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderRadius: 16, overflow: "hidden",
              border: `1px solid ${hovered === i ? "rgba(47,49,90,0.35)" : "rgba(47,49,90,0.12)"}`,
              background: "#ffffff",
              transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hovered === i ? "0 12px 32px rgba(47,49,90,0.12)" : "none",
              transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
            }}
          >
            <div style={{ background: p.gradient, paddingBottom: "55%", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", opacity: 0.8 }}>
                {p.emoji}
              </div>
            </div>
            <div style={{ padding: "1.4rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.5rem" }}>{p.name}</h3>
              <p style={{ fontSize: "0.82rem", color: "#6b6f91", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onContact}
        style={{ marginTop: "2.5rem", background: "transparent", color: "#2f315a", border: "1.5px solid #2f315a", padding: "0.7rem 1.9rem", borderRadius: 50, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}
        onMouseOver={e => { e.currentTarget.style.background = "#2f315a"; e.currentTarget.style.color = "#ffffff"; }}
        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2f315a"; }}
      >
        Learn More
      </button>
    </section>
  );
}
