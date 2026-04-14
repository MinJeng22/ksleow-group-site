import { CONTACT } from "../constants/contact.js";

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
            Join Us
          </div>
          <h2 style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 700,
            color: "#2f315a", marginBottom: "0.75rem", lineHeight: 1.35,
          }}>
            "Alone we can do so little, together we can do so much."
          </h2>
          <p style={{ color: "#6b6f91", fontSize: "0.95rem", lineHeight: 1.75 }}>
            We are always looking for dedicated individuals to grow with us.
            Join Pahang's leading business solutions team and make a real impact.
          </p>
        </div>

        <a
          href={`mailto:${CONTACT.email}`}
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
          Join The Team
        </a>
      </div>
    </div>
  );
}
