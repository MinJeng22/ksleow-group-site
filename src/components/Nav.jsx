import { useState, useEffect } from "react";
import { LOGO_NAV } from "../assets/assets.js";

/* ── NAV LOGO
 * To swap: replace  src/assets/logos/logo-nav.png
 * Natural logo colours are used here (no filter).                  */

export default function Nav({ onContact }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");

    /* If there is no #hero section on this page (e.g. product pages),
     * always show the nav bar. */
    if (!heroEl) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(14px)",
      borderBottom: "0.5px solid rgba(47,49,90,0.12)",
      boxShadow: "0 2px 24px rgba(47,49,90,0.06)",
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease",
      pointerEvents: visible ? "auto" : "none",
    }}>
      {/* inner content constrained by content-wrap for consistent negative space */}
      <div className="content-wrap" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "0.75rem", paddingBottom: "0.75rem",
      }}>
        <a
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
          style={{ display: "inline-block", lineHeight: 0 }}
        >
          <img
            src={LOGO_NAV}
            alt="KSL Business Solutions"
            style={{ height: 40, objectFit: "contain" }}
          />
        </a>
        <button
          onClick={onContact}
          style={{
            background: "#2f315a", color: "#ffffff",
            padding: "0.52rem 1.5rem", borderRadius: 50,
            fontSize: "0.85rem", fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "0.01em", transition: "background 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
          onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
        >
          Contact Us
        </button>
      </div>
    </nav>
  );
}
