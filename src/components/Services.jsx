import { useState } from "react";
import { SERVICE_CONTACTS } from "../constants/contact.js";
import ServiceContactModal from "./ServiceContactModal.jsx";

/* ══════════════════════════════════════════════════════════════
 * SERVICES DATA
 * ──────────────────────────────────────────────────────────────
 * key      → matches SERVICE_CONTACTS key in contact.js
 * title    → card heading (with strikethrough style to match mockup)
 * desc     → card body text
 * icon     → SVG element (shown in icon box top-left and in modal)
 * ══════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    key: "taxation",
    title: "Taxation & Accounting",
    desc: "Full-scope accounting and tax services — bookkeeping, financial statements, corporate and individual tax filing, SST compliance, e-Invoice readiness, and LHDN liaison.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
  },
  {
    key: "secretarial",
    title: "Secretarial & Management",
    desc: "Company incorporation, SSM annual returns, board resolutions, corporate secretarial compliance, business process consulting, management reporting, and strategic advisory.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    key: "auditing",
    title: "Auditing",
    desc: "Independent financial audits and assurance services. Present accurate, credible financials to stakeholders, banks, and regulatory bodies with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    key: "hardware",
    title: "Computer Hardware & Technical",
    desc: "Computer hardware wholesale, IT infrastructure, networking solutions, and on-site technical support for SMEs across Pahang.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    key: "training",
    title: "Professional Training",
    desc: "Hands-on training programs for AutoCount software and accounting workflows. We equip your team with the skills to manage accounts efficiently.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    key: "accounting_pos",
    title: "Accounting & POS System Support",
    desc: "Authorized AutoCount dealer for Pahang. Full installation, configuration, licensing, training, and ongoing support for AutoCount Accounting and POS software.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h.01M12 12h.01M17 12h.01" />
      </svg>
    ),
  },
];

/* ── Individual service card ── */
function ServiceCard({ service, onContactClick }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#f5f5f8",
        borderRadius: 16,
        padding: "1.6rem",
        border: `1px solid ${hov ? "rgba(47,49,90,0.2)" : "rgba(47,49,90,0.07)"}`,
        boxShadow: hov ? "0 8px 28px rgba(47,49,90,0.09)" : "none",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 0.22s, box-shadow 0.22s, transform 0.22s",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Top row: icon + "Enquire Now" link */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        {/* Icon box */}
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: "#2f315a",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#ffffff", flexShrink: 0,
        }}>
          {service.icon}
        </div>

        {/* Enquire Now button */}
        <button
          onClick={() => onContactClick(service)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            background: "transparent",
            border: "1px solid rgba(47,49,90,0.18)",
            borderRadius: 50,
            padding: "0.35rem 0.9rem",
            fontSize: "0.75rem", fontWeight: 600,
            color: "#2f315a",
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.18s, border-color 0.18s",
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
          Enquire Now
        </button>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "0.97rem", fontWeight: 700,
        color: "#2f315a",
        marginBottom: "0.55rem",
        lineHeight: 1.3,
      }}>
        {service.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "0.85rem", color: "#6b6f91",
        lineHeight: 1.72, flex: 1,
      }}>
        {service.desc}
      </p>
    </div>
  );
}

/* ── Section ── */
export default function Services() {
  const [activeService, setActiveService] = useState(null);

  function handleContactClick(service) {
    const contact = SERVICE_CONTACTS[service.key] || null;
    setActiveService({ ...service, contact });
  }

  return (
    <>
      <section id="services" style={{ background: "#ffffff", padding: "6rem 0" }}>
        <div className="content-wrap">
          <div style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem",
          }}>
            What we do
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700,
            color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem",
          }}>
            Our Service Offerings
          </h2>
          <p style={{
            fontSize: "1rem", color: "#6b6f91", lineHeight: 1.75,
            maxWidth: 540, marginBottom: "3rem",
          }}>
            Accounting, secretarial, taxation, management, auditing, hardware
            wholesale, technical services, and training — all under one roof
            since 1981.
          </p>

          <div
            className="services-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.1rem" }}
          >
            {SERVICES.map(s => (
              <ServiceCard
                key={s.key}
                service={s}
                onContactClick={handleContactClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Per-service contact modal */}
      {activeService && (
        <ServiceContactModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}