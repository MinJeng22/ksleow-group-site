import { CASE_IMAGES } from "../assets/assets.js";

const CASES = [
  {
    key: "networking",
    tag: "IT Networking · Infrastructure",
    title: "Mentakab Mall Network Architecture Design & Deployment",
    desc: "Designed and deployed a structured, scalable network infrastructure for Mentakab Mall — covering enterprise Wi-Fi, structured cabling, VLAN segmentation, and centralized management.",
    accent: "rgba(201,168,76,0.15)",
    large: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" width="52" height="52">
        <rect x="2" y="2" width="6" height="6" rx="1"/>
        <rect x="16" y="2" width="6" height="6" rx="1"/>
        <rect x="9" y="16" width="6" height="6" rx="1"/>
        <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
        <path d="M12 13v3"/>
      </svg>
    ),
  },
  {
    key: "plugin",
    tag: "AutoCount · Plugin Development",
    title: "Custom Sales2DO Plugin for AutoCount Accounting",
    desc: "Developed a bespoke Sales2DO integration plugin extending AutoCount's core functionality, enabling automated sales order workflows and real-time DO generation for a Pahang distributor.",
    accent: "rgba(47,49,90,0.35)",
    large: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" width="44" height="44">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2"/>
      </svg>
    ),
  },
];

export default function CaseStudies({ onContact }) {
  return (
    <section style={{ background: "#2f315a", padding: "6rem var(--px)" }}>
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
          Success Stories
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          Case Studies
        </h2>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.75, maxWidth: 540 }}>
          Real projects, real results — see how we have helped Pahang businesses modernize their operations with the right technology.
        </p>
      </div>
      <div className="cases-grid" style={{ display: "grid", gridTemplateColumns: "6fr 5fr", gap: "1.25rem" }}>
        {CASES.map((c) => {
          const imgSrc = CASE_IMAGES[c.key];
          return (
            <div key={c.key} style={{ borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ position: "relative", paddingBottom: c.large ? "52%" : "58%", background: c.accent }}>
                {imgSrc
                  ? <img src={imgSrc} alt={c.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
                  : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 }}>{c.icon}</div>
                }
              </div>
              <div style={{ padding: "1.4rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "0.55rem" }}>{c.tag}</div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#ffffff", lineHeight: 1.45, marginBottom: "0.6rem" }}>{c.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onContact}
        style={{ marginTop: "2.5rem", border: "1.5px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.82)", padding: "0.7rem 1.9rem", borderRadius: 50, fontSize: "0.85rem", fontWeight: 500, background: "transparent", cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.2s" }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.color = "#ffffff"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.color = "rgba(255,255,255,0.82)"; }}
      >
        Discuss Your Project
      </button>
    </section>
  );
}
