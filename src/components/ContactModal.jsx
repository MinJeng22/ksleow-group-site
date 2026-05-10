import branding from "../content/branding.json";
import { CONTACT, WA_LINK } from "../constants/contact.js";

/* Use the same small icon as the service-card backs */
const HEADER_LOGO_SRC = "/favicon.png";
const CARD_BACK_BG = branding.serviceCardBack || "/service-card-back.png";

/* ── Inline SVG icons ── */
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* Single contact line — same gold-chip + label pattern as the service card back */
function ContactLine({ icon, label, href }) {
  const inner = (
    <>
      <div style={{
        width: 26, height: 26, borderRadius: 7,
        background: "rgba(201,168,76,0.15)",
        border: "1px solid rgba(201,168,76,0.32)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: "0.84rem",
        color: "#ffffff",
        fontWeight: 500,
        lineHeight: 1.5,
        wordBreak: "break-word",
        minWidth: 0,
      }}>
        {label}
      </span>
    </>
  );
  const baseStyle = {
    display: "flex", alignItems: "flex-start", gap: "0.65rem",
    textDecoration: "none",
  };
  return href
    ? <a href={href} style={baseStyle}>{inner}</a>
    : <div style={baseStyle}>{inner}</div>;
}

export default function ContactModal({ open, onClose }) {
  if (!open) return null;

  const telHref = `tel:${CONTACT.phone.replace(/\D/g, "")}`;
  const mailHref = `mailto:${CONTACT.email}`;

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
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#20255a",
          borderRadius: 24,
          maxWidth: 440, width: "100%",
          color: "#ffffff",
          boxShadow: "0 32px 80px rgba(10,11,20,0.45), 0 4px 20px rgba(10,11,20,0.18)",
          animation: "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric background — same image as service-card backs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${CARD_BACK_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            pointerEvents: "none",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 3,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "50%",
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ffffff", cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        >
          <CloseIcon />
        </button>

        {/* ── Header strip — same compact pattern as card back ── */}
        <div style={{ position: "relative", zIndex: 1, padding: "1.5rem 1.6rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={HEADER_LOGO_SRC} alt="KSL" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#e8c97a", marginBottom: 2,
            }}>
              We're Here to Help
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.25 }}>
              K.S. Leow Group
            </div>
          </div>
        </div>

        {/* ── Contact rows — gold-chip icons, same as card back ── */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 1.6rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <ContactLine icon={<PhoneIcon />} label={CONTACT.phone} href={telHref} />
          <ContactLine icon={<MailIcon />} label={CONTACT.email} href={mailHref} />
          <ContactLine icon={<PinIcon />} label={CONTACT.address} />
        </div>

        {/* ── Bottom CTA buttons — WhatsApp + Email side-by-side ── */}
        <div style={{
          position: "relative", zIndex: 1,
          padding: "0.4rem 1.6rem 1.5rem",
          display: "flex", gap: "0.55rem",
        }}>
          {/* WhatsApp — gold pill */}
          <a
            href={WA_LINK} target="_blank" rel="noreferrer"
            style={{
              flex: 1,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
              background: "#c9a84c", color: "#1e2040",
              borderRadius: 50, padding: "0.7rem 1rem",
              fontSize: "0.82rem", fontWeight: 700,
              textDecoration: "none", transition: "background 0.2s",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#e8c97a"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#c9a84c"; }}
          >
            <WhatsAppIcon />
            WhatsApp
          </a>

          {/* Email — ghost outline */}
          <a
            href={mailHref}
            style={{
              flex: 1,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
              background: "rgba(255,255,255,0.06)", color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 50, padding: "0.65rem 1rem",
              fontSize: "0.82rem", fontWeight: 600,
              textDecoration: "none",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
          >
            <MailIcon />
            <span style={{ color: "#ffffff" }}>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
