import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useDarkBg from "../hooks/useDarkBg";

/* ── Menu items ─────────────────────────────────────────── */
const MENU_ITEMS = [
  {
    label: "Home",
    path: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "AutoCount Accounting",
    path: "/products/autocount-accounting",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    label: "Cloud Accounting",
    path: "/products/autocount-cloud-accounting",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
      </svg>
    ),
  },
  {
    label: "FeedMe POS",
    path: "/products/feedme-pos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    label: "AC Plugins",
    path: "/apps/autocount-plugin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: "KS Omni",
    path: "/omni",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
];

/* ── CSS keyframes & styles ─────────────────────────────── */
const STYLES = `
/* ─── Menu & Search Container (Desktop/Tablet) ───────────── */
.top-right-controls {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
@media (min-width: 768px) {
  .top-right-controls {
    top: 1.6rem;
    right: 2rem;
  }
}
@media (max-width: 767px) {
  .top-right-controls { display: none !important; }
}

.menu-fab, .search-fab {
  display: flex;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  gap: 0.45rem;
  border-radius: 100px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.menu-fab {
  padding: 0 1.1rem 0 0.85rem;
}
.search-fab {
  padding: 0 1rem;
}

/* ─── Mobile floating bar ──────────────────────────────── */

.mobile-float-bar {
  display: none;
}
@media (max-width: 767px) {
  .mobile-float-bar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    align-items: center;
    height: 44px;
    box-sizing: border-box;
    gap: 4px;
    padding: 4px;
    border-radius: 100px;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .mobile-float-bar .mfb-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 0.35rem;
    border: none;
    background: none;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.55);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0 1rem;
    border-radius: 100px;
    transition: all 0.25s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .mobile-float-bar .mfb-btn:active {
    transform: scale(0.93);
    background: rgba(0,0,0,0.04);
  }
  .mobile-float-bar .mfb-divider {
    width: 0.5px;
    height: 20px;
    background: rgba(0,0,0,0.1);
    flex-shrink: 0;
  }
}

/* ─── Menu Overlay ─────────────────────────────────────── */
.menu-overlay-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transition: background 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease;
  pointer-events: none;
}
.menu-overlay-backdrop.is-open {
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
}

.menu-panel {
  position: fixed;
  z-index: 1101;
  border-radius: 24px;
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.15) 100%
  );
  backdrop-filter: blur(60px) saturate(2);
  -webkit-backdrop-filter: blur(60px) saturate(2);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 -1px 0 rgba(0, 0, 0, 0.03);
  padding: 12px;
  opacity: 0;
  transform: scale(0.92) translateY(-10px);
  transform-origin: top right;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.menu-panel.is-open {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

/* Desktop panel position */
@media (min-width: 768px) {
  .menu-panel {
    top: 4.6rem;
    right: 2rem;
    width: 260px;
  }
}

/* Mobile panel position */
@media (max-width: 767px) {
  .menu-panel {
    bottom: 80px;
    left: 16px;
    right: 16px;
    width: auto;
    transform-origin: bottom center;
    transform: scale(0.92) translateY(10px);
  }
  .menu-panel.is-open {
    transform: scale(1) translateY(0);
  }
}

.menu-panel-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: 0.005em;
  transition: all 0.2s ease;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}
.menu-panel-item:hover {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.menu-panel-item:active {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.6);
}
.menu-panel-item.is-active {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5);
}

.menu-panel-item-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
  box-shadow: 0 2px 6px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6);
  color: rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}
.menu-panel-item:hover .menu-panel-item-icon {
  background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.35));
  color: rgba(0, 0, 0, 0.7);
}
.menu-panel-item.is-active .menu-panel-item-icon {
  background: linear-gradient(135deg, rgba(47,49,90,0.12), rgba(47,49,90,0.04));
  color: #2f315a;
}

/* Hamburger animation */
.menu-hamburger { position: relative; width: 18px; height: 14px; }
.menu-hamburger span {
  display: block;
  position: absolute;
  height: 1.8px;
  width: 100%;
  background: currentColor;
  border-radius: 2px;
  left: 0;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-hamburger span:nth-child(1) { top: 0; }
.menu-hamburger span:nth-child(2) { top: 6px; width: 70%; }
.menu-hamburger span:nth-child(3) { top: 12px; }
.menu-hamburger.is-open span:nth-child(1) {
  top: 6px; transform: rotate(45deg);
}
.menu-hamburger.is-open span:nth-child(2) {
  opacity: 0; width: 0;
}
.menu-hamburger.is-open span:nth-child(3) {
  top: 6px; transform: rotate(-45deg);
}
`;

/* ── Component ──────────────────────────────────────────── */
export default function MenuButton({ onOpenSearch }) {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const panelRef = useRef(null);
  const fabRef = useRef(null);
  const mobileBarRef = useRef(null);
  
  const isDesktopDark = useDarkBg(fabRef);
  const isMobileDark = useDarkBg(mobileBarRef);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        fabRef.current && !fabRef.current.contains(e.target) &&
        !e.target.closest(".mobile-float-bar")
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  /* Close on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  if (pathname === "/omni") return null;

  const handleNav = (path) => {
    setOpen(false);
    if (path === "/" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Desktop/Tablet Controls ────────────────────────── */}
      <div className="top-right-controls" ref={fabRef}>
        <button
          className="search-fab lg-glass lg-glass-btn"
          onClick={onOpenSearch}
          aria-label="Search"
          style={{ color: isDesktopDark ? "#ffffff" : "rgba(0, 0, 0, 0.6)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Search</span>
        </button>

        <button
          className="menu-fab lg-glass lg-glass-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ color: isDesktopDark ? "#ffffff" : "rgba(0, 0, 0, 0.6)" }}
        >
          <div className={`menu-hamburger${open ? " is-open" : ""}`}>
            <span /><span /><span />
          </div>
          <span>Menu</span>
        </button>
      </div>

      {/* ── Mobile floating bar ───────────────────────── */}
      <div
        ref={mobileBarRef}
        className="mobile-float-bar lg-glass"
      >
        <button 
          className="mfb-btn" 
          onClick={onOpenSearch} 
          aria-label="Search"
          style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Search</span>
        </button>

        <div className="mfb-divider" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />

        <button 
          className="mfb-btn" 
          onClick={() => setOpen(!open)} 
          aria-label={open ? "Close menu" : "Open menu"}
          style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
        >
          <div className={`menu-hamburger${open ? " is-open" : ""}`} style={{ width: 14, height: 11 }}>
            <span style={{ height: 1.5 }} />
            <span style={{ height: 1.5, top: 4.5, width: "70%" }} />
            <span style={{ height: 1.5, top: 9 }} />
          </div>
          <span>Menu</span>
        </button>

        <div className="mfb-divider" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />

        <button 
          className="mfb-btn" 
          onClick={() => navigate(-1)} 
          aria-label="Back"
          style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* ── Backdrop ──────────────────────────────────── */}
      <div
        className={`menu-overlay-backdrop${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* ── Menu Panel ────────────────────────────────── */}
      <div
        ref={panelRef}
        className={`menu-panel${open ? " is-open" : ""}`}
        role="menu"
      >
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.path}
            className={`menu-panel-item${pathname === item.path ? " is-active" : ""}`}
            onClick={() => handleNav(item.path)}
            role="menuitem"
            style={{
              transitionDelay: open ? `${i * 0.03}s` : "0s",
            }}
          >
            <div className="menu-panel-item-icon">
              {item.icon}
            </div>
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
