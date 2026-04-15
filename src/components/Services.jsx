import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* Services aligned with K.S. Leow Group's actual offerings from Hero description */
const SERVICES = [
  {
    title: "Accounting",
    desc: "Full-scope accounting services — bookkeeping, financial statements, management accounts, and AutoCount software implementation tailored to your business.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
  },
  {
    title: "Secretarial",
    desc: "Company incorporation, SSM annual returns, board resolutions, and full corporate secretarial compliance to keep your business properly governed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: "Taxation",
    desc: "Corporate and individual tax filing, SST compliance, e-Invoice readiness, and LHDN liaison. Stay compliant and stress-free with our tax consultants.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    title: "Management",
    desc: "Business process consulting, management reporting, budgeting, and strategic advisory to help owners make informed decisions and grow sustainably.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    title: "Auditing",
    desc: "Independent financial audits and assurance services. Present accurate, credible financials to stakeholders, banks, and regulatory bodies with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    title: "Computer Hardware & Technical",
    desc: "Computer hardware wholesale, IT infrastructure, networking solutions, and on-site technical support for SMEs across Pahang.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: "Professional Training",
    desc: "Hands-on training programs for AutoCount software and accounting workflows. We equip your team with the skills to manage accounts efficiently.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    title: "AutoCount Plugin Development",
    desc: "Custom plugin and module development extending AutoCount's core functionality — tailored add-ons built for your unique business workflows.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2"/>
      </svg>
    ),
  },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);

  return (
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
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}
        >
          {SERVICES.map((s, i) => {
            const active = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: active ? "#2f315a" : "#f5f5f8",
                  borderRadius: 16, padding: "1.75rem",
                  border: `1px solid ${active ? "#2f315a" : "transparent"}`,
                  transition: "background 0.3s, border-color 0.3s",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: active ? "#c9a84c" : "#2f315a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.1rem", transition: "background 0.3s",
                  color: "#ffffff",
                }}>
                  {s.icon}
                </div>
                <h3 style={{
                  fontSize: "0.93rem", fontWeight: 600,
                  color: active ? "#ffffff" : "#2f315a",
                  marginBottom: "0.55rem", transition: "color 0.3s",
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: "0.83rem",
                  color: active ? "rgba(255,255,255,0.7)" : "#6b6f91",
                  lineHeight: 1.7, transition: "color 0.3s",
                }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
