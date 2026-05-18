import { LOGO_FOOTER as LOGO } from "../assets/assets.js";

const SUPPORT_WHATSAPP = "60169902279";
const SUPPORT_MESSAGE = "Hi Elise, I would like to start the AutoCount Accounting 2.2 Free Trial and schedule an installation session. I can prepare AnyDesk / UltraViewer. I want to try ... edition.";
const SUPPORT_WA_LINK = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(SUPPORT_MESSAGE)}`;

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function AutoCountTrialModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(10,11,24,0.68)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(560px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: 26,
          background: "#ffffff",
          boxShadow: "0 36px 100px rgba(10,11,24,0.36)",
          animation: "modalIn 0.26s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`
          @keyframes modalIn{from{opacity:0;transform:translateY(14px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        `}</style>

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.12)",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </button>

        <div style={{
          background: "linear-gradient(135deg, #2f315a 0%, #202242 100%)",
          color: "#ffffff",
          padding: "2rem 2rem 1.8rem",
          borderRadius: "26px 26px 0 0",
          overflow: "hidden",
          position: "relative",
        }}>
          <img src={LOGO} alt="K.S. Leow Group" style={{ height: 64, objectFit: "contain", display: "block", margin: "0 auto 1.35rem" }} />
          <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: "#e8c97a", marginBottom: "0.55rem", textAlign: "center" }}>
            AutoCount Accounting 2.2
          </div>
          <h2 style={{ fontSize: "clamp(1.65rem, 4vw, 2.15rem)", fontWeight: 800, lineHeight: 1.13, marginBottom: 0, textAlign: "center" }}>
            Start your Free Trial
          </h2>
        </div>

        <div style={{ padding: "1.6rem 2rem 2rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.35rem",
          }}>
            <InfoTile label="Trial Limit" value="500 Transactions" />
            <InfoTile label="Setup Time" value="~30 Minutes" />
            <InfoTile label="Support" value="Remote Install" />
          </div>

          <div style={{
            border: "1px solid rgba(47,49,90,0.1)",
            borderRadius: 18,
            padding: "1.05rem",
            background: "#f8f8fb",
            marginBottom: "1.25rem",
          }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2f315a", marginBottom: "0.75rem" }}>
              Please prepare before installation
            </div>
            <ChecklistItem>Confirm which <strong>edition</strong> you want to try.</ChecklistItem>
            <ChecklistItem>Install or prepare <strong>AnyDesk</strong> / <strong>UltraViewer</strong> for remote access.</ChecklistItem>
            <ChecklistItem>Reserve around <strong>30 minutes</strong> for setup and basic checking.</ChecklistItem>
            <ChecklistItem>Message our Support Team to arrange a suitable installation time.</ChecklistItem>
          </div>

          <a
            href={SUPPORT_WA_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "100%",
              minHeight: 48,
              borderRadius: 999,
              background: "#25D366",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.55rem",
              fontSize: "0.92rem",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 12px 28px rgba(37,211,102,0.24)",
            }}
          >
            <WhatsAppIcon />
            WhatsApp Our Support Team
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div style={{
      minHeight: 88,
      borderRadius: 16,
      border: "1px solid rgba(201,168,76,0.28)",
      background: "rgba(201,168,76,0.09)",
      padding: "0.85rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b7b23", marginBottom: "0.35rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.86rem", fontWeight: 800, lineHeight: 1.25, color: "#2f315a" }}>
        {value}
      </div>
    </div>
  );
}

function ChecklistItem({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginBottom: "0.6rem", color: "#4b4f72", fontSize: "0.86rem", lineHeight: 1.62 }}>
      <span style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#2f315a",
        color: "#e8c97a",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}>
        <CheckIcon />
      </span>
      <span>{children}</span>
    </div>
  );
}
