import { CONTACT } from "../constants/contact.js";
import careers from "../content/careers.json";

export default function Careers() {
  return (
    <div style={{
      background: "#ffffff",
      padding: "5rem 0",
      borderTop: "0.5px solid rgba(47,49,90,0.1)",
    }}>
      <div
        className="content-wrap"
        style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <div style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem",
          }}>
            {careers.eyebrow}
          </div>
          <h2 style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 700,
            color: "#2f315a", marginBottom: "0.75rem", lineHeight: 1.35,
          }}>
            {careers.heading}
          </h2>
          <p style={{ color: "#6b6f91", fontSize: "0.95rem", lineHeight: 1.75 }}>
            {careers.body}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
          {/* Primary — career enquiry */}
          <a
            href={`mailto:${CONTACT.email}?subject=Career Enquiry`}
            style={{
              background: "#2f315a", color: "#ffffff",
              padding: "0.82rem 2.2rem", borderRadius: 50,
              fontSize: "0.9rem", fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
            onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
          >
            {careers.careerButtonLabel || careers.buttonLabel || "Join Our Team"}
          </a>

          {/* Secondary — partnership enquiry */}
          <a
            href={`mailto:${careers.partnerEmail || CONTACT.email}?subject=Partnership Enquiry`}
            style={{
              background: "transparent", color: "#2f315a",
              border: "1.5px solid #2f315a",
              padding: "0.82rem 2.2rem", borderRadius: 50,
              fontSize: "0.9rem", fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#2f315a";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#2f315a";
            }}
          >
            {careers.partnerButtonLabel || "Partner with Us"}
          </a>
        </div>
      </div>
    </div>
  );
}
