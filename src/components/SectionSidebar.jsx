import { useState, useEffect, useRef } from "react";

/**
 * SectionSidebar — floating right-rail anchor nav for long product pages.
 *
 * Props:
 *   items: [{ id, label }]   anchor IDs and visible labels
 *
 * Behaviour:
 *   • Scroll listener picks the section closest to the top of the viewport
 *     and marks it active. (Uses scroll position rather than IntersectionObserver
 *     because the latter fires multiple times during smooth-scroll, causing
 *     the active highlight to flicker.)
 *   • Clicking a button locks the active state to the clicked id for 900ms,
 *     so the smooth-scroll doesn't briefly re-highlight intermediate sections.
 *   • Visual styling never changes font-weight on active — only colour and
 *     background — so the row width stays constant and the panel doesn't jump.
 *
 * Hidden on screens < 1280px via the .ac-sidebar media query in global.css.
 */
export default function SectionSidebar({ items }) {
  const [active, setActive] = useState(items[0]?.id || "");
  const lockedRef = useRef(false);
  const lockTimerRef = useRef(null);

  useEffect(() => {
    function update() {
      if (lockedRef.current) return;
      // Find the section whose top is closest to (but above) the viewport
      // top + 55% buffer. That section is the one the user is "in".
      const probe = window.innerHeight * 0.55;
      let bestId = items[0]?.id;
      let bestTop = -Infinity;
      for (const s of items) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - probe <= 0 && top > bestTop) {
          bestTop = top;
          bestId = s.id;
        }
      }
      setActive(prev => {
        if (prev !== bestId) {
          window.dispatchEvent(new CustomEvent("sectionChange", { detail: bestId }));
        }
        return bestId;
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  function go(id) {
    setActive(prev => {
      if (prev !== id) {
        window.dispatchEvent(new CustomEvent("sectionChange", { detail: id }));
      }
      return id;
    });
    lockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => { lockedRef.current = false; }, 900);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 100, behavior: "smooth" });
    }
  }

  return (
    <nav className="ac-sidebar" style={{
      position: "fixed",
      top: "50%", right: 24,
      transform: "translateY(-50%)",
      zIndex: 150,
      display: "flex", flexDirection: "column", gap: 4,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(47,49,90,0.1)",
      borderRadius: 14,
      padding: "0.75rem 0.5rem",
      boxShadow: "0 8px 28px rgba(47,49,90,0.12)",
      minWidth: 168,
    }}>
      {items.map(s => {
        const isActive = active === s.id;
        return (
          <button key={s.id} onClick={() => go(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0.5rem 0.85rem",
              border: "none",
              background: isActive ? "rgba(201,168,76,0.15)" : "transparent",
              color: isActive ? "#a17f1e" : "#6b6f91",
              /* Constant font-weight prevents layout shift between states */
              fontWeight: 600,
              fontSize: "0.78rem",
              borderRadius: 8, cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              transition: "background 0.18s, color 0.18s",
            }}
            onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "rgba(47,49,90,0.05)"; }}
            onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
              flexShrink: 0,
              color: isActive ? "#c9a84c" : "#cfd0e0",
              transition: "color 0.18s, transform 0.18s",
              transform: isActive ? "translateX(2px)" : "translateX(0)",
            }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {s.label}
          </button>
        );
      })}
    </nav>
  );
}
