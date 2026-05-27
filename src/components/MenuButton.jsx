import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useDarkBg from "../hooks/useDarkBg";

/* ── Mega Menu Data ─────────────────────────────────────── */
const MEGA_MENU = [
  {
    title: "Service Pillars",
    items: [
      { label: "Taxation & Accounting",         scrollTo: "#services" },
      { label: "Secretarial & Management",      scrollTo: "#services" },
      { label: "Auditing",                      scrollTo: "#services" },
      { label: "Computer Hardware & Technical",  scrollTo: "#services" },
      { label: "Software Training & Support",   scrollTo: "#services" },
      { label: "Webinar & Workshops",           scrollTo: "#services" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "AutoCount Accounting",     path: "/products/autocount-accounting" },
      { label: "FeedMe POS",               path: "/products/feedme-pos" },
      { label: "AutoCount CloudAccounting", path: "/products/autocount-cloud-accounting" },
      { label: "AutoCount POS",            scrollTo: "#products" },
      { label: "ServerLink",               scrollTo: "#products" },
      { label: "AutoCount HRMS",           scrollTo: "#products" },
      { label: "AutoCount OneSale",        scrollTo: "#products" },
    ],
  },
  {
    title: "Other Services",
    items: [
      { label: "Printing / Advertising / Design", scrollTo: "#other-services" },
      { label: "AutoCount Plugin",                 path: "/apps/autocount-plugin" },
      { label: "SiteGiant Integration",            scrollTo: "#other-services" },
      { label: "AI Assistant (KS Omni)",           path: "/omni" },
    ],
  },
];

/* ── MenuGlyph icon ─────────────────────────────────────── */
function MenuGlyph({ open, size = 17 }) {
  return (
    <svg
      className={`menu-glyph${open ? " is-open" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1.6" />
          <rect x="14" y="4" width="6" height="6" rx="1.6" />
          <rect x="4" y="14" width="6" height="6" rx="1.6" />
          <rect x="14" y="14" width="6" height="6" rx="1.6" />
        </>
      )}
    </svg>
  );
}

/* ── CSS ─────────────────────────────────────────────────── */
const STYLES = `
/* ─── Desktop/Tablet Controls ───────────────────────────── */
.top-right-controls {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 8px;
  align-items: center;
  top: 1.6rem;
  right: 2rem;
}
.top-left-controls {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 8px;
  align-items: center;
  top: 1.6rem;
  left: 2rem;
}
@media (min-width: 768px) and (max-width: 1023px) {
  .top-right-controls {
    top: 1.2rem;
    right: 2rem;
  }
  .top-left-controls {
    top: 1.2rem;
    left: 2rem;
  }
}
@media (max-width: 767px) {
  .top-right-controls, .top-left-controls { display: none !important; }
}

.menu-fab, .search-fab, .back-fab {
  display: flex;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  border-radius: 100px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.menu-fab {
  padding: 0 1.1rem 0 0.85rem;
}
.search-fab, .back-fab {
  padding: 0 1rem;
}

/* ─── Mobile floating bar ──────────────────────────────── */

.mobile-float-bar {
  display: none;
}
@media (max-width: 767px) {
  .mobile-float-bar {
    position: fixed;
    bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    width: max-content;
    box-sizing: border-box;
    gap: 4px;
    padding: 4px;
    border-radius: 100px;
    transition:
      opacity 0.35s ease,
      transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.35s ease;
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
    font-size: 0.76rem;
    font-weight: 600;
    padding: 0 0.6rem;
    border-radius: 100px;
    transition:
      background 0.25s ease,
      color 0.25s ease,
      opacity 0.25s ease,
      padding 0.35s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .mobile-float-bar .mfb-btn:active {
    background: rgba(0,0,0,0.04);
  }
  .mobile-float-bar .mfb-divider {
    width: 0.5px;
    height: 20px;
    background: rgba(0,0,0,0.1);
    flex-shrink: 0;
  }
  .mobile-float-bar .mfb-action {
    min-width: 82px;
    max-width: 102px;
    overflow: hidden;
  }
  .mobile-float-bar .mfb-action-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
  }
  .mobile-float-bar .mfb-action-label {
    display: inline-block;
    min-width: 34px;
    text-align: left;
    transition: opacity 0.22s ease;
  }
  @media (max-width: 360px) {
    .mobile-float-bar {
      max-width: calc(100vw - 72px);
      gap: 2px;
      padding: 3px;
    }
    .mobile-float-bar .mfb-btn {
      padding: 0 0.62rem;
      font-size: 0.72rem;
      gap: 0.28rem;
    }
    .mobile-float-bar .mfb-action {
      min-width: 72px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .mobile-float-bar,
    .mobile-float-bar .mfb-btn,
    .mobile-float-bar.has-scrolltop,
    .mobile-float-bar .mfb-action,
    .mobile-float-bar.has-scrolltop .mfb-action[data-mode="back"] {
      animation: none !important;
      transition: none !important;
    }
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
/* No backdrop overlay needed on desktop — hover-leave handles close */
@media (min-width: 768px) {
  .menu-overlay-backdrop { display: none !important; }
}

/* ─── Mega Menu Panel ──────────────────────────────────── */
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
  padding: 16px;
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

/* Desktop panel: 3-column grid */
@media (min-width: 768px) {
  .menu-panel {
    top: 4.6rem;
    right: 2rem;
    width: min(620px, calc(100vw - 48px));
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4px;
  }
}

/* Mobile panel: stacked accordion */
@media (max-width: 767px) {
  .menu-panel {
    bottom: 80px;
    left: 16px;
    right: 16px;
    width: auto;
    transform-origin: bottom center;
    transform: scale(0.92) translateY(10px);
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 65vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .menu-panel.is-open {
    transform: scale(1) translateY(0);
  }
}

/* ─── Menu Column ──────────────────────────────────────── */
.menu-column {
  display: flex;
  flex-direction: column;
}

.menu-column-title {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(0, 0, 0, 0.35);
  padding: 0.55rem 0.7rem 0.35rem;
  user-select: none;
}

/* Mobile accordion behavior */
@media (max-width: 767px) {
  .menu-column {
    border-bottom: 0.5px solid rgba(0,0,0,0.06);
  }
  .menu-column:last-child {
    border-bottom: none;
  }
  .menu-column-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0.7rem;
    font-size: 0.72rem;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .menu-column-title .accordion-chevron {
    transition: transform 0.3s ease;
    opacity: 0.4;
  }
  .menu-column-title.is-expanded .accordion-chevron {
    transform: rotate(180deg);
  }
  .menu-column-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .menu-column-body.is-expanded {
    max-height: 400px;
  }
}
/* Desktop: always show body, hide chevron */
@media (min-width: 768px) {
  .menu-column-title .accordion-chevron {
    display: none;
  }
}

/* ─── Menu Sub-item ────────────────────────────────────── */
.menu-sub-item {
  display: block;
  width: 100%;
  padding: 0.48rem 0.7rem;
  border-radius: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  text-align: left;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  line-height: 1.35;
}
.menu-sub-item:hover {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.9);
}
.menu-sub-item:active {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.6);
}
.menu-sub-item.is-active {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
}

/* ─── Menu Glyph icon ──────────────────────────────────── */
.menu-glyph {
  flex-shrink: 0;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}
.menu-glyph.is-open {
  transform: rotate(90deg) scale(0.92);
}
`;

/* ── Component ──────────────────────────────────────────── */
export default function MenuButton({ onOpenSearch, hideBar }) {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState([0]);
  const panelRef = useRef(null);
  const fabRef = useRef(null);
  const leftFabRef = useRef(null);
  const mobileBarRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const isDesktopDark = useDarkBg(fabRef);
  const isLeftDesktopDark = useDarkBg(leftFabRef);
  const isMobileDark = useDarkBg(mobileBarRef);

  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on outside click (mobile) */
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

  /* Cleanup hover timeout */
  useEffect(() => {
    return () => clearTimeout(hoverTimeoutRef.current);
  }, []);

  if (pathname === "/omni") return null;

  /* ── Hover handlers (desktop only) ── */
  const handleMenuEnter = () => {
    if (window.innerWidth >= 1024) {
      clearTimeout(hoverTimeoutRef.current);
      setOpen(true);
    }
  };
  const handleMenuLeave = () => {
    if (window.innerWidth >= 1024) {
      hoverTimeoutRef.current = setTimeout(() => setOpen(false), 200);
    }
  };

  /* ── Menu item action handler ── */
  const handleMenuAction = (item) => {
    setOpen(false);

    if (item.path) {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (item.scrollTo) {
      const doScroll = () => {
        const el = document.querySelector(item.scrollTo);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top, behavior: "smooth" });
        }
      };

      if (pathname === "/") {
        doScroll();
      } else {
        navigate("/");
        setTimeout(doScroll, 400);
      }
    }
  };

  /* ── Mobile accordion toggle ── */
  const toggleMobileSection = (index) => {
    setExpandedMobile((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const hasHistory = window.history.state && window.history.state.idx > 0;
  const isHomeHero = pathname === "/" && scrollY < 10;
  const mobileActionMode = hasHistory ? "back" : null;

  const scrollForMore = () => {
    const distance = window.innerHeight * 0.9;
    const duration = 260;
    const startY = window.scrollY;
    const t0 = performance.now();
    const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOut(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const handleMobileBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Desktop/Tablet Controls ────────────────────────── */}
      <div 
        className="top-right-controls" 
        ref={fabRef}
        style={hideBar ? { opacity: 0, transform: "translateY(-15px)", pointerEvents: "none", transition: "all 0.3s ease" } : { transition: "all 0.3s ease" }}
      >
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
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
          onClick={() => { if (window.innerWidth < 1024) setOpen(!open); }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ color: isDesktopDark ? "#ffffff" : "rgba(0, 0, 0, 0.6)" }}
        >
          <MenuGlyph open={open} />
          <span>Menu</span>
        </button>
      </div>

      {hasHistory && (
        <div 
          className="top-left-controls" 
          ref={leftFabRef}
          style={hideBar ? { opacity: 0, transform: "translateY(-15px)", pointerEvents: "none", transition: "all 0.3s ease" } : { transition: "all 0.3s ease" }}
        >
          <button
            className="back-fab lg-glass lg-glass-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
            style={{ color: isLeftDesktopDark ? "#ffffff" : "rgba(0, 0, 0, 0.6)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Back</span>
          </button>
        </div>
      )}

      {/* ── Mobile floating bar ───────────────────────── */}
      <div
        ref={mobileBarRef}
        className={`mobile-float-bar lg-glass${showScrollTop && mobileActionMode === "back" ? " has-scrolltop" : ""}`}
        style={hideBar ? { opacity: 0, transform: "translateY(150%)", pointerEvents: "none" } : undefined}
      >
        {mobileActionMode && (
          <>
            <button
              key={mobileActionMode}
              className="mfb-btn mfb-action"
              data-mode={mobileActionMode}
              onClick={handleMobileBack}
              aria-label="Back"
              style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
            >
              <span className="mfb-action-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </span>
              <span className="mfb-action-label">Back</span>
            </button>
            <div className="mfb-divider" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
          </>
        )}

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
          <MenuGlyph open={open} size={15} />
          <span>Menu</span>
        </button>

        {(isHomeHero || showScrollTop) && (
          <>
            <div className="mfb-divider" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
            <button
              key={isHomeHero ? "scroll" : "top"}
              data-mode={isHomeHero ? "scroll" : "top"}
              className="mfb-btn mfb-action"
              onClick={isHomeHero ? scrollForMore : () => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label={isHomeHero ? "Scroll for more" : "To Top"}
              style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
            >
              <span className="mfb-action-icon" aria-hidden="true">
                {isHomeHero ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                )}
              </span>
              <span className="mfb-action-label">{isHomeHero ? "Scroll" : "To Top"}</span>
            </button>
          </>
        )}
      </div>

      {/* ── Backdrop (mobile only) ─────────────────────── */}
      <div
        className={`menu-overlay-backdrop${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* ── Mega Menu Panel ────────────────────────────── */}
      <div
        ref={panelRef}
        className={`menu-panel${open ? " is-open" : ""}`}
        role="menu"
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
      >
        {MEGA_MENU.map((column, ci) => (
          <div key={ci} className="menu-column">
            <div
              className={`menu-column-title${expandedMobile.includes(ci) ? " is-expanded" : ""}`}
              onClick={() => toggleMobileSection(ci)}
            >
              <span>{column.title}</span>
              <svg className="accordion-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div className={`menu-column-body${expandedMobile.includes(ci) ? " is-expanded" : ""}`}>
              {column.items.map((item, ii) => (
                <button
                  key={ii}
                  className={`menu-sub-item${item.path === pathname ? " is-active" : ""}`}
                  onClick={() => handleMenuAction(item)}
                  role="menuitem"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
