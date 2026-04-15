import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
 * PRODUCT IMAGE SLOTS
 * ───────────────────
 * To add a real product logo:
 *   1. Drop PNG into  src/assets/images/products/
 *   2. Import + assign in src/assets/assets.js (PRODUCT_IMAGES)
 *   3. Replace  img: null  below with the imported variable
 */
const PRODUCTS = [
  {
    name: "AutoCount Accounting",
    desc: "Malaysia's leading cloud and desktop accounting software. Full SST and e-Invoice ready.",
    img: null, placeholder: "🧾",
    gradient: "linear-gradient(135deg, #2f315a 0%, #4a4d85 100%)",
    route: "/products/autocount-accounting",
  },
  {
    name: "AutoCount POS",
    desc: "POS integrated with AutoCount Accounting. Real-time inventory and sales reporting.",
    img: null, placeholder: "🖥️",
    gradient: "linear-gradient(135deg, #1e2040 0%, #3a3d6b 100%)",
    route: null,
  },
  {
    name: "AutoCount Cloud Payroll",
    desc: "Automated payroll compliant with EPF, SOCSO, PCB, and EIS. Payslips in minutes.",
    img: null, placeholder: "☁️",
    gradient: "linear-gradient(135deg, #2a2f60 0%, #565a9e 100%)",
    route: null,
  },
  {
    name: "FeedMe POS",
    desc: "Cloud F&B POS with table management, kitchen display, and online ordering integration.",
    img: null, placeholder: "🍽️",
    gradient: "linear-gradient(135deg, #4a2e0a 0%, #a06c2a 100%)",
    route: null,
  },
];

export default function Products({ onContact }) {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  return (
    <section style={{ background: "#f5f5f8", padding: "6rem 0" }}>
      <div className="content-wrap">
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
          {PRODUCTS.map((p, i) => {
            const isHov = hovered === i;
            const clickable = !!p.route;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => p.route && navigate(p.route)}
                style={{
                  borderRadius: 16, overflow: "hidden",
                  border: `1px solid ${isHov ? "rgba(47,49,90,0.3)" : "rgba(47,49,90,0.11)"}`,
                  background: "#ffffff",
                  transform: isHov ? "translateY(-5px)" : "translateY(0)",
                  boxShadow: isHov ? "0 14px 36px rgba(47,49,90,0.11)" : "none",
                  transition: "transform 0.26s, box-shadow 0.26s, border-color 0.26s",
                  cursor: clickable ? "pointer" : "default",
                }}
              >
                {/* image / placeholder */}
                <div style={{ background: p.gradient, paddingBottom: "56%", position: "relative",
                  outline: p.img ? "none" : "2px dashed rgba(255,255,255,0.15)", outlineOffset: -6 }}>
                  {p.img
                    ? <img src={p.img} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "12%" }} />
                    : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <span style={{ fontSize: "2.6rem", opacity: 0.75 }}>{p.placeholder}</span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Upload logo</span>
                      </div>
                  }
                  {/* "View Details" badge on hover for clickable cards */}
                  {clickable && isHov && (
                    <div style={{
                      position: "absolute", bottom: 10, right: 10,
                      background: "rgba(201,168,76,0.9)", color: "#1e2040",
                      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em",
                      padding: "0.3rem 0.7rem", borderRadius: 50, textTransform: "uppercase",
                    }}>
                      View Details →
                    </div>
                  )}
                </div>

                <div style={{ padding: "1.35rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.5rem" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.82rem", color: "#6b6f91", lineHeight: 1.66 }}>{p.desc}</p>
                  {clickable && (
                    <span style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.78rem", fontWeight: 600, color: "#c9a84c", letterSpacing: "0.04em" }}>
                      Learn more →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onContact}
          style={{ marginTop: "2.5rem", background: "transparent", color: "#2f315a", border: "1.5px solid #2f315a", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}
          onMouseOver={e => { e.currentTarget.style.background = "#2f315a"; e.currentTarget.style.color = "#ffffff"; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2f315a"; }}
        >
          Contact Us About Software
        </button>
      </div>
    </section>
  );
}
