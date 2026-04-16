import { LOGO_NAV } from "../assets/assets.js";
import { CONTACT, WA_LINK } from "../constants/contact.js";

export default function ContactModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(10,11,20,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff", borderRadius: 20,
          padding: "2.5rem", maxWidth: 420, width: "100%",
          boxShadow: "0 40px 90px rgba(0,0,0,0.28)",
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}`}</style>

        <img src={LOGO_NAV} alt="KSL Business Solutions" style={{ height: 38, marginBottom: "1.5rem", objectFit: "contain" }} />

        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.45rem" }}>
          Get in Touch
        </h2>
        <p style={{ fontSize: "0.88rem", color: "#6b6f91", marginBottom: "1.75rem", lineHeight: 1.68 }}>
          Reach out and our team will get back to you as soon as possible.
        </p>

        {/* contact info strip */}
        <div style={{
          background: "#f5f5f8", borderRadius: 12,
          padding: "1rem 1.25rem", marginBottom: "1.5rem",
          fontSize: "0.82rem", color: "#6b6f91", lineHeight: 2,
        }}>
          <div>📍 {CONTACT.address}</div>
          <div>📞 {CONTACT.phone}</div>
          <div>✉️ {CONTACT.email}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#25D366", color: "#ffffff",
              padding: "0.85rem 1.5rem", borderRadius: 50,
              fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", textAlign: "center",
              fontFamily: "inherit", transition: "opacity 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            WhatsApp — {CONTACT.phone}
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            style={{
              background: "#2f315a", color: "#ffffff",
              padding: "0.85rem 1.5rem", borderRadius: 50,
              fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", textAlign: "center",
              fontFamily: "inherit", transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
            onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
          >
            Email Us
          </a>

          <a
            href={CONTACT.facebook}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#1877F2", color: "#ffffff",
              padding: "0.85rem 1.5rem", borderRadius: 50,
              fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", textAlign: "center",
              fontFamily: "inherit", transition: "opacity 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Facebook Page
          </a>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "1.25rem", width: "100%",
            background: "transparent", border: "none",
            color: "#6b6f91", fontSize: "0.85rem",
            cursor: "pointer", fontFamily: "inherit",
            padding: "0.4rem",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
