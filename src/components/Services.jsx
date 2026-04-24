import { useState } from "react";
import { SERVICE_CONTACTS } from "../constants/contact.js";

const SERVICES = [
  {
    key: "taxation",
    title: "Taxation & Accounting",
    desc: "Full-scope accounting and tax services — bookkeeping, financial statements, corporate and individual tax filing, SST compliance, e-Invoice readiness, and LHDN liaison.",
  },
  {
    key: "secretarial",
    title: "Secretarial & Management",
    desc: "Company incorporation, SSM annual returns, board resolutions, corporate secretarial compliance, business process consulting, management reporting, and strategic advisory.",
  },
  {
    key: "auditing",
    title: "Auditing",
    desc: "Independent financial audits and assurance services. Present accurate, credible financials to stakeholders, banks, and regulatory bodies with confidence.",
  },
  {
    key: "hardware",
    title: "Computer Hardware & Technical",
    desc: "Computer hardware wholesale, IT infrastructure, networking solutions, and on-site technical support for SMEs across Pahang.",
    dealer: {
      label: "Authorized Dealer",
      logos: [
        { src: "/sunmi-logo.png", alt: "Sunmi", h: 22 },
        { src: "/mdot-logo.png",  alt: "Mdot",  h: 20 },
      ],
    },
  },
  {
    key: "accounting_pos",
    title: "Accounting & POS System Support",
    desc: "Authorized AutoCount and FeedMe dealer for Pahang. Full installation, configuration, licensing, training, and ongoing support for AutoCount Accounting, POS, and FeedMe Smart POS.",
    dealer: {
      label: "Authorized Dealer",
      logos: [
        { src: "/autocount-logo.png", alt: "AutoCount", h: 22 },
        { src: "/feedme-logo.png",    alt: "FeedMe",    h: 22 },
      ],
    },
  },
];

/* ── Authorized Dealer badge with logos ── */
function DealerBadge({ dealer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <div style={{
        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "#c9a84c",
      }}>
        {dealer.label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        {dealer.logos.map((logo, i) => (
          <div key={logo.alt} style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo.src} alt={logo.alt}
              style={{ height: logo.h, maxWidth: 80, objectFit: "contain" }}
            />
            {i < dealer.logos.length - 1 && (
              <div style={{
                width: 1, height: 18,
                background: "rgba(47,49,90,0.2)",
                margin: "0 0.6rem",
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Flip card ── */
function ServiceCard({ service }) {
  const [flipped, setFlipped] = useState(false);
  const contact = SERVICE_CONTACTS[service.key] || {};
  const waLink = `https://wa.me/${contact.whatsapp || "60179052323"}?text=${encodeURIComponent(
    `Hi, I would like to enquire about your ${service.title} service. Thank you.`
  )}`;

  return (
    <div style={{ perspective: "1000px", height: 260 }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          borderRadius: 18, background: "#f5f5f8",
          border: "1px solid rgba(47,49,90,0.09)",
          padding: "1.4rem",
          display: "flex", flexDirection: "column",
        }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            {service.dealer
              ? <DealerBadge dealer={service.dealer} />
              : <div />
            }
            <button
              onClick={() => setFlipped(true)}
              style={{
                display: "inline-flex", alignItems: "center",
                background: "transparent",
                border: "1px solid rgba(47,49,90,0.18)",
                borderRadius: 50, padding: "0.35rem 0.9rem",
                fontSize: "0.75rem", fontWeight: 600, color: "#2f315a",
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.18s, color 0.18s, border-color 0.18s",
                flexShrink: 0, marginLeft: "0.5rem",
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#2f315a";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#2f315a";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#2f315a";
                e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)";
              }}
            >
              Enquire Now
            </button>
          </div>

          <h3 style={{ fontSize: "0.97rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.55rem", lineHeight: 1.3 }}>
            {service.title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#6b6f91", lineHeight: 1.72, flex: 1 }}>
            {service.desc}
          </p>
        </div>

        {/* ── BACK — Business card ── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 18, background: "#eef0f8",
          border: "1px solid rgba(47,49,90,0.12)",
          padding: "1.4rem",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between", overflow: "hidden",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2f315a" }}>
              {contact.label || service.title}
            </span>
            <button
              onClick={() => setFlipped(false)}
              style={{
                background: "transparent", border: "1px solid rgba(47,49,90,0.2)",
                borderRadius: 50, padding: "0.25rem 0.7rem",
                fontSize: "0.7rem", fontWeight: 600, color: "#2f315a",
                cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(47,49,90,0.08)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}
            >
              ← Back
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.65rem", margin: "0.75rem 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(47,49,90,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2f315a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#2f315a", fontWeight: 600 }}>{contact.phone || "017-905 2323"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(47,49,90,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2f315a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#2f315a", fontWeight: 400, wordBreak: "break-all" }}>{contact.email || "support@ksleow.com.my"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(47,49,90,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2f315a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.73rem", color: "#6b6f91", lineHeight: 1.55 }}>
                Taman Zabidin, Mentakab, Pahang
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a href={waLink} target="_blank" rel="noreferrer"
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                background: "#c9a84c", color: "#1e2040",
                borderRadius: 50, padding: "0.5rem 0",
                fontSize: "0.75rem", fontWeight: 700,
                textDecoration: "none", transition: "opacity 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
            <a href={`mailto:${contact.email || "support@ksleow.com.my"}`}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(47,49,90,0.08)", color: "#2f315a",
                border: "1px solid rgba(47,49,90,0.18)",
                borderRadius: 50, padding: "0.5rem 0",
                fontSize: "0.75rem", fontWeight: 600,
                textDecoration: "none", transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(47,49,90,0.15)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(47,49,90,0.08)"}
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <>
      <style>{`@keyframes cardFlip { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <section id="services" style={{ background: "#ffffff", padding: "6rem 0" }}>
        <div className="content-wrap">
          <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
            What we do
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Our Service Offerings
          </h2>
          <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.75, maxWidth: 540, marginBottom: "3rem" }}>
            Taxation, accounting, secretarial, management, auditing, hardware
            wholesale, technical services, and training — all under one roof
            since 1981.
          </p>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.1rem" }}>
            {SERVICES.map(s => (
              <ServiceCard key={s.key} service={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}