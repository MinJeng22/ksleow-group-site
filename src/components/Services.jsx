import { useState } from "react";

const SERVICES = [
  {
    title: "AutoCount Software",
    desc: "Authorized AutoCount dealer for Pahang. Full installation, configuration, licensing, and ongoing support for accounting and POS software tailored to your business.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
  },
  {
    title: "Technical Services",
    desc: "Expert technical support, system troubleshooting, upgrades, and maintenance. Our team ensures your software runs smoothly at all times with minimal downtime.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
      </svg>
    ),
  },
  {
    title: "Professional Training",
    desc: "Hands-on training programs for AutoCount software and accounting workflows. We equip your team with the skills to manage accounts efficiently and accurately.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    title: "IT Hardware & Networking",
    desc: "End-to-end networking solutions for SMEs — from network design and structured cabling to hardware procurement, Wi-Fi deployment, and on-site troubleshooting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <rect x="2" y="2" width="6" height="6" rx="1"/>
        <rect x="16" y="2" width="6" height="6" rx="1"/>
        <rect x="9" y="16" width="6" height="6" rx="1"/>
        <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
        <path d="M12 13v3"/>
      </svg>
    ),
  },
  {
    title: "AutoCount Plugin Development",
    desc: "Custom plugin and module development for AutoCount Accounting. We build tailored add-ons to extend AutoCount's functionality to fit your unique business workflows.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    title: "FeedMe POS Support",
    desc: "Authorized FeedMe POS setup and support for F&B businesses. We handle installation, staff training, menu configuration, and ongoing technical assistance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="services" style={{ background: "#ffffff", padding: "6rem var(--px)" }}>
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
        From accounting software and IT networking to plugin development and staff training —
        we cover every business technology need.
      </p>

      <div
        className="services-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
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
                borderRadius: 16, padding: "2rem",
                border: `1px solid ${active ? "#2f315a" : "transparent"}`,
                transition: "background 0.3s, border-color 0.3s",
                cursor: "default",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: active ? "#c9a84c" : "#2f315a",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.2rem", transition: "background 0.3s",
                color: "#ffffff",
              }}>
                {s.icon}
              </div>
              <h3 style={{
                fontSize: "0.97rem", fontWeight: 600,
                color: active ? "#ffffff" : "#2f315a",
                marginBottom: "0.6rem", transition: "color 0.3s",
              }}>
                {s.title}
              </h3>
              <p style={{
                fontSize: "0.86rem",
                color: active ? "rgba(255,255,255,0.7)" : "#6b6f91",
                lineHeight: 1.72, transition: "color 0.3s",
              }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
