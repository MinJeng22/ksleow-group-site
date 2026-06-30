import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useDarkBg from "../hooks/useDarkBg";
import { SearchIcon, BackIcon, MenuIcon, ToTopIcon, ScrollDownIcon } from "./icons";
import { navigateBackWithRouteFeedback, navigateWithRouteFeedback, preloadImages, preloadRouteAssets } from "../utils/routeTransitions.js";

/* ── Mega Menu Data ─────────────────────────────────────── */
const MEGA_MENU = [
  {
    title: "Service Pillars",
    items: [
      { label: "Taxation & Accounting",         scrollTo: "#service-taxation", icon: "calculator" },
      { label: "Secretarial & Management",      scrollTo: "#service-secretarial", icon: "files" },
      { label: "Auditing",                      scrollTo: "#service-auditing", icon: "shield" },
      { label: "Computer Hardware & Technical", scrollTo: "#service-hardware", icon: "cpu" },
      { label: "Software Training & Support",   scrollTo: "#service-software", icon: "graduation" },
      { label: "Webinar & Workshops",           scrollTo: "#service-webinar", icon: "video" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "AutoCount Accounting",      path: "/products/autocount-accounting", icon: "monitor" },
      { label: "FeedMe POS",                path: "/products/feedme-pos", icon: "fork" },
      { label: "AutoCount CloudAccounting", path: "/products/autocount-cloud-accounting", icon: "cloud" },
      { label: "AutoCount POS",             path: "", icon: "cash-register" },
      { label: "ServerLink",                path: "/products/serverlink", icon: "laptop" },
      { label: "AutoCount HRMS",            path: "/products/autocount-hrms", icon: "users" },
      { label: "AutoCount OneSale",         path: "/products/autocount-onesale", icon: "smartphone" },
    ],
  },
  {
    title: "Other Services",
    items: [
      { label: "AutoCount Plugin",                path: "/apps/autocount-plugin", icon: "puzzle" },
      { label: "Printing / Advertising / Design", scrollTo: "#supaprintz-card", icon: "printer" },
      { label: "SiteGiant Integration",           scrollTo: "#sitegiant-card", icon: "link" },
      { label: "KS Omni (AI Assistant)",           path: "/omni", icon: "chat" },
    ],
  },
];

const OTHER_SERVICE_MODAL_ASSETS = {
  supaprintz: [
    "/images/partners/supaprintz-desktop.webp",
    "/images/partners/supaprintz-desktop.webp",
  ],
  sitegiant: ["/images/other-services/sitegiant.webp"],
};

function NavIcon({ name, size = 16 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (name) {
    case "briefcase":
      return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></svg>;
    case "boxes":
      return <svg {...common}><path d="m7 16 5 3 5-3" /><path d="m7 8 5-3 5 3" /><path d="m7 8 5 3 5-3" /><path d="M7 8v8" /><path d="M17 8v8" /><path d="M12 11v8" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></svg>;
    case "calculator":
      return <svg {...common}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8" /><path d="M8 11h.01" /><path d="M12 11h.01" /><path d="M16 11h.01" /><path d="M8 15h.01" /><path d="M12 15h.01" /><path d="M16 15h.01" /></svg>;
    case "files":
      return <svg {...common}><path d="M15 2H7a2 2 0 0 0-2 2v13" /><path d="M9 6h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></svg>;
    case "cpu":
      return <svg {...common}><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" /><path d="M20 9h3" /><path d="M20 15h3" /><path d="M1 9h3" /><path d="M1 15h3" /></svg>;
    case "graduation":
      return <svg {...common}><path d="m22 10-10-5-10 5 10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></svg>;
    case "video":
      return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>;
    case "monitor":
      return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>;
    case "pos":
      return <svg {...common}><path d="M6 2h12v8H6z" /><path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M8 14h.01M12 14h.01M16 14h.01" /></svg>;
    case "cloud":
      return <svg {...common}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" /></svg>;
    case "terminal":
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m8 9 3 3-3 3" /><path d="M13 15h3" /></svg>;
    case "server":
      return <svg {...common}><rect x="4" y="3" width="16" height="7" rx="2" /><rect x="4" y="14" width="16" height="7" rx="2" /><path d="M8 6h.01M8 17h.01" /></svg>;
    case "users":
      return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "cart":
      return <svg {...common}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2 2h3l2.6 13.5a2 2 0 0 0 2 1.5H18a2 2 0 0 0 2-1.6L21 8H6" /></svg>;
    case "printer":
      return <svg {...common}><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>;
    case "plug":
      return <svg {...common}><path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" /></svg>;
    case "link":
      return <svg {...common}><path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" /><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" /></svg>;
    case "image":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10.5" r="1.5" /><path d="m21 15-5-5L5 19" /></svg>;
    case "bot":
      return <svg {...common}><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4" /><path d="M8 12h.01M16 12h.01" /><path d="M9 16h6" /></svg>;
    case "chat":
      return <svg {...common}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>;
    case "blocks":
      return <svg {...common}><rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/></svg>;
    case "puzzle":
      return <svg {...common}><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.611c-.941.941-2.469.941-3.408 0L8.73 19.73a.98.98 0 0 1-.276-.837c.07-.47.48-.802.925-.968a2.5 2.5 0 1 0-3.214-3.214c-.166-.446-.497-.855-.968-.925a.979.979 0 0 1-.837.276L2.748 11.9a2.41 2.41 0 0 1 0-3.408l1.568-1.568c.23-.23.556-.338.878-.289.467.071.796.471.961.908a2.5 2.5 0 1 0 3.226-3.226c-.437-.165-.837-.494-.908-.961a.978.978 0 0 1 .289-.878l1.568-1.568c.941-.941 2.469-.941 3.408 0l1.568 1.568c.23.23.556.338.878.289.467-.071.796-.471.961-.908a2.5 2.5 0 1 0 3.226 3.226c.165.437.494.837.961.908Z" /></svg>;
    case "fork":
      return <svg {...common}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
    case "smartphone":
      return <svg {...common}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>;
    case "cash-register":
      return <svg {...common}><rect width="18" height="6" x="3" y="15" rx="2" /><path d="M5 15V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7" /><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M9 11h.01M12 11h.01M15 11h.01" /></svg>;
    case "laptop":
      return <svg {...common}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="m12 8 4 4-4 4" /><path d="M8 12h8" /></svg>;
  }
}

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
  background:
    radial-gradient(circle at 50% 8%, rgba(201,168,76,0.16), transparent 34%),
    rgba(15, 17, 40, 0.22);
  backdrop-filter: blur(12px) saturate(1.08);
  -webkit-backdrop-filter: blur(12px) saturate(1.08);
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
  border-radius: 26px;
  padding: 18px;
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
    top: 4.55rem;
    right: 2rem;
    width: min(660px, calc(100vw - 48px));
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }
}

/* Mobile panel: stacked accordion */
@media (max-width: 767px) {
  .menu-panel {
    bottom: 80px;
    left: 12px;
    right: 12px;
    width: auto;
    transform-origin: bottom center;
    transform: scale(0.92) translateY(10px);
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: min(68vh, 560px);
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
  min-width: 0;
  padding: 0 0.18rem;
}

@media (min-width: 768px) {
  .menu-column:not(:last-child) {
    border-right: 1px solid rgba(47, 49, 90, 0.08);
    padding-right: 0.78rem;
  }
  .menu-column:not(:first-child) {
    padding-left: 0.34rem;
  }
}

.menu-column-title {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(47, 49, 90, 0.08);
  border-radius: 0;
  box-sizing: border-box;
  color: #2f315a;
  cursor: default;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  gap: 0.46rem;
  justify-content: space-between;
  min-height: 40px;
  padding: 0.34rem 0.3rem 0.58rem;
  margin-bottom: 0.35rem;
  user-select: none;
  width: 100%;
}

.menu-column-title-main {
  align-items: center;
  display: inline-flex;
  flex: 1;
  gap: 0.52rem;
  min-width: 0;
}

.menu-parent-text {
  color: #2f315a;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1.15;
  overflow: hidden;
  text-align: left;
  text-transform: uppercase;
  text-overflow: ellipsis;
}

.menu-parent-count {
  align-items: center;
  color: #2f315a;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 800;
  height: auto;
  justify-content: center;
  min-width: auto;
  padding: 0;
}

.menu-title-actions {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  gap: 0.38rem;
  margin-left: 0.5rem;
}

.accordion-chevron-wrap {
  align-items: center;
  background: rgba(47, 49, 90, 0.08);
  border: 1px solid rgba(47, 49, 90, 0.08);
  border-radius: 50%;
  color: rgba(47, 49, 90, 0.68);
  display: none;
  flex-shrink: 0;
  height: 30px;
  justify-content: center;
  width: 30px;
}

/* Mobile accordion behavior */
@media (max-width: 767px) {
  .menu-column {
    border-bottom: 1px solid rgba(47,49,90,0.08);
    margin-bottom: 0.45rem;
    padding: 0 0 0.45rem;
  }
  .menu-column:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .menu-column-title {
    cursor: pointer;
    min-height: 50px;
    padding: 0.45rem 0.24rem 0.5rem;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .accordion-chevron-wrap {
    display: inline-flex;
  }
  .menu-column-title .accordion-chevron {
    transition: transform 0.3s ease;
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
  .accordion-chevron-wrap {
    display: none;
  }
}

/* ─── Menu Sub-item ────────────────────────────────────── */
.menu-sub-item {
  align-items: center;
  display: flex;
  gap: 0.52rem;
  width: 100%;
  padding: 0.58rem 0.34rem;
  border-radius: 13px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(47, 49, 90, 0.7);
  text-align: left;
  text-decoration: none !important;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  line-height: 1.35;
}
.menu-sub-icon {
  align-items: center;
  color: rgba(47, 49, 90, 0.54);
  display: inline-flex;
  flex-shrink: 0;
  height: 24px;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  width: 24px;
}
.menu-sub-label {
  min-width: 0;
}
@media (hover: hover) and (pointer: fine) {
  .menu-sub-item:hover {
    background: rgba(255, 255, 255, 0.68);
    color: #2f315a;
    box-shadow: 0 8px 18px rgba(47,49,90,0.07);
  }
  .menu-sub-item:hover .menu-sub-icon {
    color: #9a7615;
    transform: scale(1.02);
  }
}
.menu-sub-item.is-active .menu-sub-icon {
  color: #9a7615;
  transform: scale(1.02);
}
.menu-sub-item:active {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.82);
}
.menu-sub-item.is-active {
  background: rgba(255, 255, 255, 0.78);
  color: #2f315a;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px rgba(201,168,76,0.2);
}
@media (min-width: 768px) and (max-width: 1023px) {
  .menu-panel {
    top: 4.2rem;
    right: 1.2rem;
    width: min(620px, calc(100vw - 32px));
    padding: 14px;
  }
  .menu-sub-item {
    font-size: 0.74rem;
    padding: 0.5rem 0.28rem;
  }
  .menu-parent-text {
    font-size: 0.66rem;
  }
}
@media (max-width: 767px) {
  .menu-panel {
    border-radius: 24px;
    padding: 12px;
  }
  .menu-sub-item {
    min-height: 40px;
    font-size: 0.8rem;
  }
  .menu-column-body {
    padding-top: 0.28rem;
  }
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
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
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
  const [isHomeHeroTop, setIsHomeHeroTop] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollY = window.scrollY;
        const isTop = scrollY < 10;
        const shouldShowScrollTop = scrollY > 400;
        setIsHomeHeroTop(prev => (prev === isTop ? prev : isTop));
        setShowScrollTop(prev => (prev === shouldShowScrollTop ? prev : shouldShowScrollTop));
      });
    };
    onScroll(); // Sync initial state after hydration
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setHasHistory(Boolean(window.history.state && window.history.state.idx > 0));
  }, [pathname]);

  useEffect(() => {
    const handleOpenMenu = () => setOpen(true);
    const handleToggleMenu = () => setOpen(prev => !prev);
    const handleHoverEnter = () => {
      if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches) {
        clearTimeout(hoverTimeoutRef.current);
        setOpen(true);
        window.dispatchEvent(new Event("closeOmniQR"));
      }
    };
    const handleHoverLeave = () => {
      if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches) {
        hoverTimeoutRef.current = setTimeout(() => setOpen(false), 200);
      }
    };
    const handleCloseMenu = () => setOpen(false);
    window.addEventListener("openGlobalMenu", handleOpenMenu);
    window.addEventListener("closeGlobalMenu", handleCloseMenu);
    window.addEventListener("toggleGlobalMenu", handleToggleMenu);
    window.addEventListener("globalMenuEnter", handleHoverEnter);
    window.addEventListener("globalMenuLeave", handleHoverLeave);
    return () => {
      window.removeEventListener("openGlobalMenu", handleOpenMenu);
      window.removeEventListener("closeGlobalMenu", handleCloseMenu);
      window.removeEventListener("toggleGlobalMenu", handleToggleMenu);
      window.removeEventListener("globalMenuEnter", handleHoverEnter);
      window.removeEventListener("globalMenuLeave", handleHoverLeave);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("globalMenuStateChange", { detail: open }));
    if (open) {
      document.body.classList.add("has-mobile-menu-open");
    } else {
      document.body.classList.remove("has-mobile-menu-open");
    }
  }, [open]);

  /* Close on outside click (mobile) */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        fabRef.current && !fabRef.current.contains(e.target) &&
        !e.target.closest(".mobile-float-bar") &&
        !e.target.closest(".menu-fab") &&
        !e.target.closest(".mfb-btn")
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

  /* ── Hover handlers (desktop only) ── */
  const handleMenuEnter = () => {
    if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches) {
      clearTimeout(hoverTimeoutRef.current);
      setOpen(true);
    }
  };
  const handleMenuLeave = () => {
    if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches) {
      hoverTimeoutRef.current = setTimeout(() => setOpen(false), 200);
    }
  };

  /* ── Menu item action handler ── */
  const handleMenuAction = (item) => {
    setOpen(false);
    preloadMenuItem(item, "high");

    if (item.path) {
      navigateWithRouteFeedback(navigate, item.path);
      return;
    }

    if (item.scrollTo) {
      const doScroll = (attempt = 0) => {
        const el = document.querySelector(item.scrollTo);
        if (el) {
          const rect = el.getBoundingClientRect();
          const centerOffset = Math.max(20, (window.innerHeight - rect.height) / 2);
          const top = Math.max(0, rect.top + window.scrollY - centerOffset);
          window.scrollTo({ top, behavior: "smooth" });
        } else if (attempt < 12) {
          window.setTimeout(() => doScroll(attempt + 1), 90);
          return;
        }
          
          if (item.scrollTo === '#supaprintz-card') {
            setTimeout(() => window.dispatchEvent(new CustomEvent('openOtherServiceModal', { detail: 'supaprintz' })), 500);
          } else if (item.scrollTo === '#sitegiant-card') {
            setTimeout(() => window.dispatchEvent(new CustomEvent('openOtherServiceModal', { detail: 'sitegiant' })), 500);
          }


      };

      if (pathname === "/") {
        doScroll();
      } else {
        navigateWithRouteFeedback(navigate, "/", { delay: 180, scrollTop: false });
        setTimeout(doScroll, 520);
      }
    }
  };

  /* ── Mobile accordion toggle ── */
  const toggleMobileSection = (index) => {
    const isExpanding = !expandedMobile.includes(index);
    setExpandedMobile((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

    if (isExpanding && window.innerWidth < 768) {
      setTimeout(() => {
        const panel = panelRef.current;
        const column = panel?.querySelector(`[data-menu-column="${index}"]`);
        if (!panel || !column) return;
        panel.scrollTo({
          top: Math.max(0, column.offsetTop - 8),
          behavior: "smooth",
        });
      }, 80);
    }
  };

  const isHomeHero = pathname === "/" && isHomeHeroTop;
  const mobileActionMode = hasHistory && !isHomeHero ? "back" : null;

  const scrollForMore = () => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
  };

  const handleMobileBack = () => {
    navigateBackWithRouteFeedback(navigate);
  };

  const preloadMenuItem = (item, priority = "low") => {
    if (item.path) {
      preloadRouteAssets(item.path, priority);
      return;
    }

    if (item.scrollTo === "#supaprintz-card") {
      preloadImages(OTHER_SERVICE_MODAL_ASSETS.supaprintz, priority);
    } else if (item.scrollTo === "#sitegiant-card") {
      preloadImages(OTHER_SERVICE_MODAL_ASSETS.sitegiant, priority);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style suppressHydrationWarning>{STYLES}</style>

      {/* ── Desktop/Tablet Controls ────────────────────────── */}
      <div 
        className="top-right-controls" 
        ref={fabRef}
        style={hideBar ? { opacity: 0, transform: "translateY(-15px)", pointerEvents: "none", transition: "all 0.3s ease" } : (pathname === "/omni" ? { display: "none" } : { transition: "all 0.3s ease" })}
      >
        <button
          className="search-fab lg-glass lg-glass-btn"
          onClick={onOpenSearch}
          aria-label="Search"
          style={{ color: isDesktopDark ? "#ffffff" : "rgba(0, 0, 0, 0.6)" }}
        >
          <SearchIcon />
          <span>Search</span>
        </button>

        <button
          className="menu-fab lg-glass lg-glass-btn"
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
          onClick={() => {
            // Only toggle via click on touch devices or small screens
            if (window.innerWidth < 1024 || !window.matchMedia("(hover: hover)").matches) {
              setOpen(!open);
            }
          }}
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
          style={hideBar ? { opacity: 0, transform: "translateY(-15px)", pointerEvents: "none", transition: "all 0.3s ease" } : (pathname === "/omni" ? { display: "none" } : { transition: "all 0.3s ease" })}
        >
          <button
            className="back-fab lg-glass lg-glass-btn"
            onClick={() => navigateBackWithRouteFeedback(navigate)}
            aria-label="Back"
            style={{ color: isLeftDesktopDark ? "#ffffff" : "rgba(0, 0, 0, 0.6)" }}
          >
            <BackIcon />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* ── Mobile floating bar ───────────────────────── */}
      <div
        ref={mobileBarRef}
        className={`mobile-float-bar lg-glass${showScrollTop && mobileActionMode === "back" ? " has-scrolltop" : ""}`}
        style={pathname === "/omni" ? { display: "none" } : ((hideBar || open) ? { opacity: 0, transform: "translateY(150%)", pointerEvents: "none" } : undefined)}
      >
        {mobileActionMode && (
          <>
            <button
              className="mfb-btn mfb-action"
              data-mode={mobileActionMode}
              onClick={handleMobileBack}
              aria-label="Back"
              style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
            >
              <span className="mfb-action-icon" aria-hidden="true">
                <BackIcon />
              </span>
              <span className="mfb-action-label">Back</span>
            </button>
            <div className="mfb-divider" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
          </>
        )}

        {pathname === "/omni" && (
          <>
            <div className="mfb-btn" style={{ padding: "0 0.25rem", gap: "0.4rem", color: isMobileDark ? "#ffffff" : "#2f315a", pointerEvents: "none" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(201,168,76,0.5)", flexShrink: 0 }}>
                <img src="/images/branding/ksl-logo-circle.webp" alt="KSL" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>KS Omni</span>
            </div>
            <div className="mfb-divider" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
            
            <button 
              className="mfb-btn omni-qr-btn-group" 
              onClick={() => window.dispatchEvent(new Event("toggleOmniQR"))} 
              aria-label="Open on Phone"
              style={{ color: isMobileDark ? "#e1c87d" : "#a17f1e" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 14h1v1h-1zM18 14h2v2h-2zM14 19h3v2h-1v-1h-2zM21 19v2h-1v-1" />
              </svg>
              <span>Phone</span>
            </button>
            <div className="mfb-divider omni-qr-btn-group" style={{ background: isMobileDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
          </>
        )}

        <button 
          className="mfb-btn" 
          onClick={onOpenSearch} 
          aria-label="Search"
          style={{ color: isMobileDark ? "#ffffff" : "rgba(0, 0, 0, 0.55)" }}
        >
          <SearchIcon />
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
                {isHomeHero ? <ScrollDownIcon /> : <ToTopIcon />}
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
        className={`menu-panel ks-nav-glass-panel${open ? " is-open" : ""}`}
        role="menu"
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
      >
        {MEGA_MENU.map((column, ci) => (
          <div key={ci} className="menu-column" data-menu-column={ci}>
            <button
              type="button"
              className={`menu-column-title${expandedMobile.includes(ci) ? " is-expanded" : ""}`}
              onClick={() => toggleMobileSection(ci)}
              aria-expanded={expandedMobile.includes(ci)}
            >
              <span className="menu-parent-count">{column.items.length}</span>
              <span className="menu-column-title-main">
                <span className="menu-parent-text">{column.title}</span>
              </span>
              <span className="menu-title-actions">
                <span className="accordion-chevron-wrap">
                  <svg className="accordion-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </span>
            </button>
            <div className={`menu-column-body${expandedMobile.includes(ci) ? " is-expanded" : ""}`}>
              {column.items.map((item, ii) => (
                <a
                  key={ii}
                  href={item.path || (item.scrollTo ? `/${item.scrollTo}` : '#')}
                  className={`menu-sub-item${item.path === pathname ? " is-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuAction(item);
                  }}
                  onMouseEnter={() => preloadMenuItem(item)}
                  onPointerDown={() => preloadMenuItem(item, "high")}
                  onFocus={() => preloadMenuItem(item)}
                  role="menuitem"
                >
                  <span className="menu-sub-icon"><NavIcon name={item.icon} size={14} /></span>
                  <span className="menu-sub-label">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

