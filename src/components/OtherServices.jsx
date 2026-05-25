import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Img } from "./Media.jsx";
import { CASE_IMAGES } from "../assets/assets.js";
import otherServicesContent from "../content/otherServices.json";

const CASES = (otherServicesContent.items || []).filter((item) => {
  return !!(item?.title && item?.desc);
});
const SUPAPRINTZ_PARTNER = {
  name: "Supaprintz.my",
  category: "ONE STOP PRINTING HUB @ TEMERLOH",
  address: "No. 8, Ground Floor, Jalan Dagang Utama, Dynaton Bukit Angin, 28000",
  phone: "011-5585 9576",
  email: "suparintz.my@gmail.com",
  banner: "/images/partners/supaprintz.my-banner.png",
  whatsappUrl: "https://wa.me/601155859576",
  facebookUrl: "https://www.facebook.com/supaprintz.my",
};
const SUPAPRINTZ_COLORS = {
  yellow: "#ffc10e",
  navy: "#1d1848",
  orange: "#ef4e23",
  whatsapp: "#25D366",
  facebook: "#1877F2",
};

const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.955.931-1.955 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
  </svg>
);

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

function SupaprintzPartnerModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      className="supaprintz-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="supaprintz-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.68)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
    >
      <div
        className="supaprintz-modal-shell"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          width: "min(460px, 100%)",
          maxHeight: "92vh",
          borderRadius: 26,
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 36px 100px rgba(10,11,24,0.36)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{`
          @media (max-width: 1024px) and (min-width: 641px) {
            .supaprintz-modal-shell {
              flex-direction: row !important;
              width: min(840px, 92vw) !important;
              height: auto !important;
            }
            .supaprintz-modal-banner-frame {
              flex: 1 !important;
              aspect-ratio: auto !important;
              border-bottom: none !important;
              border-right: 6px solid #f26522 !important;
            }
            .supaprintz-modal-banner {
              height: 100% !important;
              object-fit: cover !important;
            }
            .supaprintz-modal-body {
              flex: 1.25 !important;
              overflow-y: auto !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
            }
            .supaprintz-modal-close {
              background: #f1f2f6 !important;
              color: #1a2542 !important;
              border: none !important;
            }
          }
          @media (max-width: 640px) {
            .supaprintz-modal-backdrop {
              align-items: flex-start !important;
              padding: 0.75rem !important;
              overflow-y: auto !important;
            }
            .supaprintz-modal-shell {
              width: 100% !important;
              max-height: none !important;
              border-radius: 18px !important;
              margin: 0.35rem 0 !important;
            }
            .supaprintz-modal-banner-frame {
              aspect-ratio: 16 / 10 !important;
              flex-shrink: 0 !important;
            }
            .supaprintz-modal-body {
              padding: 1.15rem !important;
            }
            .supaprintz-detail-row {
              grid-template-columns: 1fr !important;
              gap: 0.25rem !important;
              padding: 0.75rem 0 !important;
            }
            .supaprintz-modal-actions {
              flex-direction: column !important;
              gap: 0.6rem !important;
              margin-top: 1.1rem !important;
            }
            .supaprintz-modal-actions a {
              width: 100% !important;
              flex-basis: auto !important;
            }
            .supaprintz-modal-close {
              top: 10px !important;
              right: 10px !important;
              width: 34px !important;
              height: 34px !important;
            }
          }
        `}</style>
        <div className="supaprintz-modal-banner-frame" style={{
          position: "relative",
          background: "transparent",
          borderBottom: `6px solid ${SUPAPRINTZ_COLORS.orange}`,
          aspectRatio: "16 / 9",
          lineHeight: 0,
          overflow: "hidden",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          margin: "-1px -1px 0",
        }}>
          <picture>
            <source media="(min-width: 641px) and (max-width: 1024px)" srcSet="/images/partners/supaprintz-tablet.png" />
            <img
              className="supaprintz-modal-banner"
              src="/images/partners/supaprintz-desktop.png"
              alt="Supaprintz.my Printing Advertising Design"
              style={{
                display: "block",
                width: "100%",
                height: "calc(100% + 10px)",
                objectFit: "cover",
                objectPosition: "center",
                transform: "translateY(-6px)",
              }}
            />
          </picture>
          <button
            className="supaprintz-modal-close"
            type="button"
            aria-label="Close Supaprintz partner details"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `1px solid ${SUPAPRINTZ_COLORS.navy}`,
              background: "rgba(255,255,255,0.92)",
              color: SUPAPRINTZ_COLORS.navy,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 24px rgba(29,24,72,0.18)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="supaprintz-modal-body" style={{ padding: "1.6rem 2rem 2rem", overflowY: "auto", minHeight: 0 }}>
          <p style={{
            color: SUPAPRINTZ_COLORS.navy,
            fontSize: "clamp(1.15rem, 4vw, 1.5rem)",
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.9rem",
          }}>
            {SUPAPRINTZ_PARTNER.category}
          </p>
          {[
            ["Address", SUPAPRINTZ_PARTNER.address],
            ["Phone", SUPAPRINTZ_PARTNER.phone],
            ["Email", SUPAPRINTZ_PARTNER.email],
          ].map(([label, value]) => (
            <div className="supaprintz-detail-row" key={label} style={{
              display: "grid",
              gridTemplateColumns: "88px 1fr",
              gap: "1rem",
              padding: "0.95rem 0",
              borderBottom: "1px solid rgba(47,49,90,0.08)",
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: SUPAPRINTZ_COLORS.orange, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {label}
              </div>
              <div style={{ fontSize: "0.95rem", color: SUPAPRINTZ_COLORS.navy, lineHeight: 1.55, fontWeight: 650 }}>
                {value}
              </div>
            </div>
          ))}

          <div className="supaprintz-modal-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a
              href={SUPAPRINTZ_PARTNER.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                flex: "1 1 150px",
                minHeight: 44,
                borderRadius: 50,
                background: SUPAPRINTZ_COLORS.whatsapp,
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.86rem",
                fontWeight: 800,
                boxShadow: "0 14px 28px rgba(37,211,102,0.22)",
              }}
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
            <a
              href={SUPAPRINTZ_PARTNER.facebookUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                flex: "1 1 150px",
                minHeight: 44,
                borderRadius: 50,
                background: SUPAPRINTZ_COLORS.facebook,
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.86rem",
                fontWeight: 800,
                boxShadow: "0 14px 28px rgba(24,119,242,0.2)",
              }}
            >
              <FacebookIcon />
              Visit Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OtherServices({ onContact }) {
  const navigate = useNavigate();
  const [partnerOpen, setPartnerOpen] = useState(false);

  useEffect(() => {
    if (!partnerOpen) return;
    document.body.classList.add("supaprintz-modal-open");
    const onKeyDown = (event) => {
      if (event.key === "Escape") setPartnerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("supaprintz-modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [partnerOpen]);

  const displayCases = [...CASES];
  while (displayCases.length < 4) {
    displayCases.push({ isEmpty: true, key: `empty-${displayCases.length}` });
  }

  return (
    <>
    <section className="home-section" style={{ position: "relative", overflow: "hidden", background: "#f5f5f8", padding: "6rem 0" }}>

    <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>
      {/* header */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem",
        }}>
          {otherServicesContent.eyebrow}
        </div>
        <h2 style={{
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700,
          color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem",
        }}>
          {otherServicesContent.heading}
        </h2>
        <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.78 }}>
          {otherServicesContent.intro}
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
        {displayCases.map((c, i) => {
          if (c.isEmpty) {
            return (
              <div key={c.key} className="other-services-empty-card" style={{ opacity: 0, pointerEvents: "none" }} />
            );
          }
          const imgSrc = c.image || CASE_IMAGES[c.key];
          const meta   = CARD_META[i] || CARD_META[CARD_META.length - 1];
          const opensPartnerModal = c.modal === "supaprintz";
          const clickable = !!c.route || opensPartnerModal;
          return (
            <div
              key={c.key || i}
              onClick={clickable ? () => {
                if (opensPartnerModal) setPartnerOpen(true);
                else navigate(c.route);
              } : undefined}
              style={{
                borderRadius: 16, overflow: "hidden",
                background: "#ffffff",
                border: "1px solid rgba(47,49,90,0.1)",
                cursor: clickable ? "pointer" : "default",
                opacity: 1,
                transform: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={clickable ? e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)" : undefined}
              onMouseLeave={clickable ? e => e.currentTarget.style.borderColor = "rgba(47,49,90,0.1)" : undefined}
            >
              {/* image / placeholder */}
              <div style={{ position: "relative", paddingBottom: "48%", background: meta.accent }}>
                {imgSrc ? (
                  <Img src={imgSrc} alt={c.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: meta.iconColor, opacity: 0.5 }}>
                    {ICONS[i] || ICONS[ICONS.length - 1]}
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
            </div>
          );
        })}
      </div>

      {otherServicesContent.ctaLabel && (
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
          {otherServicesContent.ctaLabel}
        </button>
      )}
    </div>
    </section>
    <SupaprintzPartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </>
  );
}
