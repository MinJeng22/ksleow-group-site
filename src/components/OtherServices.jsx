import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Img } from "./Media.jsx";
import { CASE_IMAGES } from "../assets/assets.js";
import { CONTACT } from "../constants/contact.js";
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
const SUPAPRINTZ_MODAL_IMAGES = [
  "/images/partners/supaprintz-desktop.png",
  "/images/partners/supaprintz-tablet.jpg",
];
const SITEGIANT_PARTNER = {
  name: "Sitegiant",
  category: "E-COMMERCE & AUTOCOUNT INTEGRATION",
  image: "/images/other-services/sitegiant.png",
  whatsappUrl: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi! I'm interested in Sitegiant Integration. Could you provide more details?")}`,
  websiteUrl: "https://sitegiant.my/",
  headline: "Connect your online sales channels with AutoCount",
  intro: "Bring marketplace orders, stock movement, and business reporting closer together with a cleaner e-commerce workflow.",
  benefits: [
    ["Marketplace order sync", "Centralize online orders from marketplaces and webstore channels so your team can process them faster."],
    ["Inventory confidence", "Keep stock visibility tighter across sales channels and reduce manual checks before fulfilment."],
    ["AutoCount-ready workflow", "Prepare e-commerce transactions for smoother accounting, stock, and back-office follow-up."],
    ["Room to scale", "Support campaigns, product updates, and multi-channel selling without rebuilding the workflow each time."],
  ],
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

const ExternalLinkIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
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

function PartnerModal({
  open,
  onClose,
  variant,
  titleId,
  closeLabel,
  bannerDesktop,
  bannerMobile,
  bannerAlt,
  colors,
  children,
  actions,
}) {
  if (!open) return null;
  return (
    <div
      className={`partner-modal-backdrop ${variant}-modal-backdrop`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className={`partner-modal-shell partner-modal--${variant}`}
        onClick={(event) => event.stopPropagation()}
        style={{
          "--partner-accent": colors.accent,
          "--partner-text": colors.text,
          "--partner-whatsapp": colors.whatsapp,
          "--partner-secondary": colors.secondary,
          "--partner-secondary-shadow": colors.secondaryShadow,
        }}
      >
        <div className="partner-modal-banner-frame">
          <picture>
            {bannerDesktop && <source media="(min-width: 641px)" srcSet={bannerDesktop} />}
            <img
              className="partner-modal-banner"
              src={bannerMobile || bannerDesktop}
              alt={bannerAlt}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>

        <div className="partner-modal-body">
          {children}
          <div className="partner-modal-actions">
            {actions.map((action) => (
              <a
                key={action.label}
                className={`partner-modal-action partner-modal-action--${action.kind || "secondary"}`}
                href={action.href}
                target="_blank"
                rel="noreferrer"
              >
                {action.icon}
                {action.label}
              </a>
            ))}
          </div>
        </div>
        <button
          className="partner-modal-close"
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SupaprintzPartnerModal({ open, onClose }) {
  return (
    <PartnerModal
      open={open}
      onClose={onClose}
      variant="supaprintz"
      titleId="supaprintz-modal-title"
      closeLabel="Close Supaprintz partner details"
      bannerDesktop={SUPAPRINTZ_MODAL_IMAGES[0]}
      bannerMobile={SUPAPRINTZ_MODAL_IMAGES[1]}
      bannerAlt="Supaprintz.my Printing Advertising Design"
      colors={{
        accent: SUPAPRINTZ_COLORS.orange,
        text: SUPAPRINTZ_COLORS.navy,
        whatsapp: SUPAPRINTZ_COLORS.whatsapp,
        secondary: SUPAPRINTZ_COLORS.facebook,
        secondaryShadow: "rgba(24,119,242,0.2)",
      }}
      actions={[
        {
          label: "Chat on WhatsApp",
          href: SUPAPRINTZ_PARTNER.whatsappUrl,
          kind: "whatsapp",
          icon: <WhatsAppIcon />,
        },
        {
          label: "Visit Facebook",
          href: SUPAPRINTZ_PARTNER.facebookUrl,
          kind: "secondary",
          icon: <FacebookIcon />,
        },
      ]}
    >
      <p id="supaprintz-modal-title" className="partner-modal-title">
        {SUPAPRINTZ_PARTNER.category}
      </p>
      {[
        ["Address", SUPAPRINTZ_PARTNER.address],
        ["Phone", SUPAPRINTZ_PARTNER.phone],
        ["Email", SUPAPRINTZ_PARTNER.email],
      ].map(([label, value]) => (
        <div className="partner-modal-detail-row" key={label}>
          <div className="partner-modal-detail-label">{label}</div>
          <div className="partner-modal-detail-value">{value}</div>
        </div>
      ))}
    </PartnerModal>
  );
}

function SitegiantPartnerModal({ open, onClose }) {
  return (
    <PartnerModal
      open={open}
      onClose={onClose}
      variant="sitegiant"
      titleId="sitegiant-modal-title"
      closeLabel="Close Sitegiant integration details"
      bannerDesktop={SITEGIANT_PARTNER.image}
      bannerMobile={SITEGIANT_PARTNER.image}
      bannerAlt="Sitegiant Integration"
      colors={{
        accent: "#6bbf59",
        text: "#1a2542",
        whatsapp: SUPAPRINTZ_COLORS.whatsapp,
        secondary: "#2f315a",
        secondaryShadow: "rgba(47,49,90,0.22)",
      }}
      actions={[
        {
          label: "Chat on WhatsApp",
          href: SITEGIANT_PARTNER.whatsappUrl,
          kind: "whatsapp",
          icon: <WhatsAppIcon />,
        },
        {
          label: "Visit Sitegiant Website",
          href: SITEGIANT_PARTNER.websiteUrl,
          kind: "secondary",
          icon: <ExternalLinkIcon />,
        },
      ]}
    >
      <div className="partner-modal-eyebrow">{SITEGIANT_PARTNER.category}</div>
      <h3 id="sitegiant-modal-title" className="partner-modal-title">
        {SITEGIANT_PARTNER.headline}
      </h3>
      <p className="partner-modal-intro">{SITEGIANT_PARTNER.intro}</p>
      <div className="partner-modal-benefit-list">
        {SITEGIANT_PARTNER.benefits.map(([title, copy]) => (
          <div className="partner-modal-benefit" key={title}>
            <div className="partner-modal-benefit-title">{title}</div>
            <div className="partner-modal-benefit-copy">{copy}</div>
          </div>
        ))}
      </div>
    </PartnerModal>
  );
}

export default function OtherServices({ onContact }) {
  const navigate = useNavigate();
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [sitegiantOpen, setSitegiantOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#supaprintz-card') {
        setPartnerOpen(true);
      } else if (window.location.hash === '#sitegiant-card') {
        setSitegiantOpen(true);
      }
    };
    handleHash(); // Run on mount
    window.addEventListener('hashchange', handleHash);

    const handleCustomOpen = (e) => {
      if (e.detail === 'supaprintz') setPartnerOpen(true);
      if (e.detail === 'sitegiant') setSitegiantOpen(true);
    };
    window.addEventListener('openOtherServiceModal', handleCustomOpen);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('openOtherServiceModal', handleCustomOpen);
    };
  }, []);


  useEffect(() => {
    [...SUPAPRINTZ_MODAL_IMAGES, SITEGIANT_PARTNER.image].forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!partnerOpen && !sitegiantOpen) return;
    document.body.classList.add("partner-modal-open", "has-active-modal");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setPartnerOpen(false);
        setSitegiantOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("partner-modal-open", "has-active-modal");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [partnerOpen, sitegiantOpen]);

  const displayCases = [...CASES];
  while (displayCases.length < 4) {
    displayCases.push({ isEmpty: true, key: `empty-${displayCases.length}` });
  }

  return (
    <>
    <section id="other-services" className="home-section" style={{ position: "relative", overflow: "hidden", background: "#f5f5f8", padding: "var(--section-py) 0" }}>

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
          const opensSitegiantModal = c.modal === "sitegiant";
          const clickable = !!c.route || opensPartnerModal || opensSitegiantModal;
          return (
            <div
              id={c.modal ? `${c.modal}-card` : undefined}
              key={c.key || i}
              onClick={clickable ? () => {
                if (opensPartnerModal) setPartnerOpen(true);
                else if (opensSitegiantModal) setSitegiantOpen(true);
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
                display: "flex", flexDirection: "column", height: "100%",
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
              <div className="site-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 className="site-card-title" style={{ marginBottom: "0.55rem" }}>
                  {c.title}
                </h3>
                <p className="site-card-copy" style={{ marginBottom: 0 }}>
                  {c.desc}
                </p>
                {clickable && (
                  <div style={{ marginTop: "auto", paddingTop: "0.75rem", textAlign: "right" }}>
                    <span className="ks-learn-more">
                      Learn more
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {otherServicesContent.ctaLabel && (
        <button
          onClick={onContact}
          className="btn-ghost-base btn-ghost-dark"
          style={{ marginTop: "2.5rem" }}
        >
          {otherServicesContent.ctaLabel}
        </button>
      )}
    </div>
    </section>
    <SupaprintzPartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    <SitegiantPartnerModal open={sitegiantOpen} onClose={() => setSitegiantOpen(false)} />
    </>
  );
}
