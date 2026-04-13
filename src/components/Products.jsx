import { useState } from "react";

/* ── Product image slots ────────────────────────────────────────
 * To add a real product image/logo:
 *   1. Drop the file into src/assets/images/products/
 *   2. Import it in src/assets/assets.js as PRODUCT_IMAGES
 *   3. Replace the `img: null` entry below with the imported var
 * ─────────────────────────────────────────────────────────────*/
const PRODUCTS = [
  {
    name: "AutoCount Accounting",
    desc: "Malaysia's leading cloud and desktop accounting software. Full SST and e-Invoice ready. Ideal for SMEs across Pahang.",
    img: null,           /* ← replace with imported image variable */
    imgAlt: "AutoCount Accounting logo",
    gradient: "linear-gradient(135deg, #2f315a 0%, #4a4d85 100%)",
    placeholder: "🧾",
  },
  {
    name: "AutoCount POS",
    desc: "POS integrated with AutoCount Accounting. Real-time inventory, sales reporting, and seamless cashiering for retail and F&B.",
    img: null,
    imgAlt: "AutoCount POS logo",
    gradient: "linear-gradient(135deg, #1e2040 0%, #3a3d6b 100%)",
    placeholder: "🖥️",
  },
  {
    name: "AutoCount Cloud Payroll",
    desc: "Automated payroll compliant with EPF, SOCSO, PCB, and EIS. Generate payslips and statutory reports effortlessly.",
    img: null,
    imgAlt: "AutoCount Payroll logo",
    gradient: "linear-gradient(135deg, #2a2f60 0%, #565a9e 100%)",
    placeholder: "☁️",
  },
  {
    name: "FeedMe POS",
    desc: "Cloud F&B POS with table management, kitchen display, online ordering integration, and detailed sales analytics.",
    img: null,
    imgAlt: "FeedMe POS logo",
    gradient: "linear-gradient(135deg, #4a2e0a 0%, #a06c2a 100%)",
    placeholder: "🍽️",
  },
];

export default function Products({ onContact }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ background: "#f5f5f8", padding: "6rem var(--px)" }}>
      <div style={{
        fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem",
      }}>
        Our Products
      </div>
      <h2 style={{
        fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700,
        color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem",
      }}>
        Software We Specialize In
      </h2>
      <p style={{
        fontSize: "1rem", color: "#6b6f91", lineHeight: 1.75,
        maxWidth: 540, marginBottom: "3rem",
      }}>
        We are certified partners for Malaysia's leading accounting and business
        software solutions.
      </p>

      <div
        className="products-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}
      >
        {PRODUCTS.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderRadius: 16, overflow: "hidden",
              border: `1px solid ${hovered === i ? "rgba(47,49,90,0.3)" : "rgba(47,49,90,0.11)"}`,
              background: "#ffffff",
              transform: hovered === i ? "translateY(-5px)" : "translateY(0)",
              boxShadow: hovered === i ? "0 14px 36px rgba(47,49,90,0.11)" : "none",
              transition: "transform 0.26s, box-shadow 0.26s, border-color 0.26s",
            }}
          >
            {/* image slot — shows product logo if provided, else coloured placeholder */}
            <div style={{
              background: p.gradient,
              paddingBottom: "56%", position: "relative",
              /* dashed border hints that this area is replaceable */
              outline: p.img ? "none" : "2px dashed rgba(255,255,255,0.15)",
              outlineOffset: -6,
            }}>
              {p.img ? (
                <img
                  src={p.img}
                  alt={p.imgAlt}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "contain", padding: "12%",
                  }}
                />
              ) : (
                /* placeholder — remove once real image is provided */
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 6,
                }}>
                  <span style={{ fontSize: "2.6rem", opacity: 0.75 }}>{p.placeholder}</span>
                  <span style={{
                    fontSize: "0.62rem", color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    Upload logo
                  </span>
                </div>
              )}
            </div>

            <div style={{ padding: "1.35rem" }}>
              <h3 style={{
                fontSize: "0.95rem", fontWeight: 700,
                color: "#2f315a", marginBottom: "0.5rem",
              }}>
                {p.name}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#6b6f91", lineHeight: 1.66 }}>
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContact}
        style={{
          marginTop: "2.5rem",
          background: "transparent", color: "#2f315a",
          border: "1.5px solid #2f315a",
          padding: "0.72rem 1.9rem", borderRadius: 50,
          fontSize: "0.85rem", fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseOver={e => { e.currentTarget.style.background = "#2f315a"; e.currentTarget.style.color = "#ffffff"; }}
        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2f315a"; }}
      >
        Learn More
      </button>
    </section>
  );
}
