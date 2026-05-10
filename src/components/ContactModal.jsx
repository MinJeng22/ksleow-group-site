import { LOGO_NAV as LOGO } from "../assets/assets.js";
import { CONTACT, WA_LINK } from "../constants/contact.js";

/* ── Inline SVG icons ── */
const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function ContactModal({ open, onClose }) {
  if (!open) return null;

  /* Strip non-digits for tel: link */
  const telHref = `tel:${CONTACT.phone.replace(/\D/g, "")}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(10,11,20,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "modalOverlayIn 0.25s ease",
      }}
    >
      <style>{`
        @keyframes modalOverlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.94) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes accentSweep {
          from { transform: translateX(-100%) }
          to   { transform: translateX(0) }
        }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#ffffff", borderRadius: 24,
          padding: "2.75rem 2.25rem 2rem",
          maxWidth: 440, width: "100%",
          boxShadow: "0 32px 80px rgba(10,11,20,0.4), 0 4px 20px rgba(10,11,20,0.15)",
          animation: "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* ── Top accent bar — brand gradient ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 4,
          background: "linear-gradient(90deg, #2f315a 0%, #c9a84c 50%, #2f315a 100%)",
          animation: "accentSweep 0.8s ease",
        }} />

        {/* ── Close button (top-right) ── */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(47,49,90,0.06)",
            border: "none", borderRadius: "50%",
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#6b6f91", cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "#2f315a"; e.currentTarget.style.color = "#ffffff"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(47,49,90,0.06)"; e.currentTarget.style.color = "#6b6f91"; }}
        >
          <CloseIcon />
        </button>

        {/* ── Logo (centred, large) ── */}
        <div style={{ textAlign: "center", marginBottom: "1.4rem" }}>
          <img
            src={LOGO}
            alt="KSL Business Solutions"
            style={{ height: 78, maxWidth: "82%", objectFit: "contain", display: "inline-block" }}
          />
        </div>

        {/* ── Heading block ── */}
        <div style={{ textAlign: "center", marginBottom: "1.6rem" }}>
          <div style={{
            display: "inline-block",
            fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "#c9a84c",
            marginBottom: "0.6rem",
          }}>
            We're Here to Help
          </div>
          <h2 style={{
            fontSize: "1.55rem", fontWeight: 700,
            color: "#2f315a", marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}>
            Get in Touch
          </h2>
          <p style={{
            fontSize: "0.86rem", color: "#6b6f91",
            lineHeight: 1.6,
            maxWidth: 320, margin: "0 auto",
          }}>
            Reach out and our team will get back to you as soon as possible.
          </p>
        </div>

        {/* ── Contact info card ── */}
        <div style={{
          background: "linear-gradient(135deg, #f5f5f8 0%, #fafafe 100%)",
          border: "1px solid rgba(47,49,90,0.06)",
          borderRadius: 14,
          padding: "1.1rem 1.25rem",
          marginBottom: "1.4rem",
          fontSize: "0.84rem", color: "#444",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", marginBottom: "0.85rem" }}>
            <span style={{ color: "#c9a84c", marginTop: 3, flexShrink: 0 }}><PinIcon /></span>
            <span style={{ lineHeight: 1.55 }}>{CONTACT.address}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <span style={{ color: "#c9a84c", flexShrink: 0 }}><PhoneIcon /></span>
            <a href={telHref} style={{ color: "#444", textDecoration: "none" }}>{CONTACT.phone}</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <span style={{ color: "#c9a84c", flexShrink: 0 }}><MailIcon /></span>
            <a href={`mailto:${CONTACT.email}`} style={{ color: "#444", textDecoration: "none" }}>{CONTACT.email}</a>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {/* WhatsApp */}
          <a
            href={WA_LINK} target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              background: "#25D366", color: "#ffffff",
              padding: "0.85rem 1.4rem", borderRadius: 12,
              fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none",
              fontFamily: "inherit",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 14px rgba(37,211,102,0.28)",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,211,102,0.42)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,211,102,0.28)"; }}
          >
            <WhatsAppIcon />
            <span>WhatsApp Us</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${CONTACT.email}`}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              background: "#2f315a", color: "#ffffff",
              padding: "0.85rem 1.4rem", borderRadius: 12,
              fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none",
              fontFamily: "inherit",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#3d4075"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#2f315a"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <MailIcon />
            <span>Email Us</span>
          </a>

          {/* Facebook */}
          <a
            href={CONTACT.facebook} target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              background: "#1877F2", color: "#ffffff",
              padding: "0.85rem 1.4rem", borderRadius: 12,
              fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none",
              fontFamily: "inherit",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 14px rgba(24,119,242,0.25)",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(24,119,242,0.4)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(24,119,242,0.25)"; }}
          >
            <FacebookIcon />
            <span>Visit Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
}
