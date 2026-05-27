import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_INDEX = [
  {
    title: "Home",
    path: "/",
    keywords: "home, main, ksl, k.s. leow group, accounting firm",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "AutoCount Accounting",
    path: "/products/autocount-accounting",
    keywords: "autocount, accounting, software, ledger, invoice, system, finance, business",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "AutoCount Cloud Accounting",
    path: "/products/autocount-cloud-accounting",
    keywords: "cloud, accounting, online, web, remote, anytime, anywhere",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
  },
  {
    title: "FeedMe POS",
    path: "/products/feedme-pos",
    keywords: "fnb, pos, restaurant, cafe, ordering, point of sale, qr order, food",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    title: "AutoCount Plugins",
    path: "/apps/autocount-plugin",
    keywords: "plugins, extensions, add-on, customize, autocount, app",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Sales2DO App",
    path: "/apps/sales2do",
    keywords: "sales2do, mobile, sales, ordering, delivery, agent, app",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "KS Omni",
    path: "/omni",
    keywords: "ks omni, ai, chatbot, omnichannel, whatsapp, customer service, support",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    title: "Quotation Viewer",
    path: "/quotation",
    keywords: "quotation, invoice, billing, viewer, price, pricing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const SUGGESTED_PATHS = [
  "/products/autocount-accounting",
  "/products/autocount-cloud-accounting",
  "/apps/autocount-plugin",
  "/omni",
];

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const queryText = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!queryText) return [];
    return SEARCH_INDEX.filter((item) =>
      item.title.toLowerCase().includes(queryText) ||
      item.keywords.toLowerCase().includes(queryText)
    );
  }, [queryText]);

  const suggested = useMemo(() => (
    SUGGESTED_PATHS
      .map((path) => SEARCH_INDEX.find((item) => item.path === path))
      .filter(Boolean)
  ), []);

  const visibleResults = queryText ? results : suggested;
  const hasResults = visibleResults.length > 0;

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setSelectedIndex(0);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < visibleResults.length - 1 ? prev + 1 : prev));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }
      if (event.key === "Enter" && hasResults && visibleResults[selectedIndex]) {
        event.preventDefault();
        openResult(visibleResults[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasResults, selectedIndex, visibleResults, onClose]);

  const openResult = (item) => {
    navigate(item.path);
    window.scrollTo({ top: 0, behavior: "instant" });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        .search-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.6rem;
          background:
            radial-gradient(circle at 18% 18%, rgba(201,168,76,0.22), transparent 30%),
            radial-gradient(circle at 86% 8%, rgba(47,49,90,0.32), transparent 34%),
            rgba(12, 13, 28, 0.62);
          backdrop-filter: blur(18px) saturate(1.2);
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
          animation: searchBackdropIn 0.24s ease both;
        }
        .search-modal {
          width: min(920px, calc(100vw - 48px));
          max-height: min(76dvh, 680px);
          display: grid;
          grid-template-columns: minmax(230px, 0.78fr) minmax(0, 1.45fr);
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.88);
          box-shadow:
            0 34px 100px rgba(11, 12, 28, 0.35),
            inset 0 1px 0 rgba(255,255,255,0.9);
          animation: searchModalIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .search-aside {
          position: relative;
          display: flex;
          min-height: 440px;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.35rem;
          color: #ffffff;
          background:
            linear-gradient(150deg, rgba(47,49,90,0.98), rgba(27,29,64,0.96)),
            radial-gradient(circle at top right, rgba(201,168,76,0.32), transparent 42%);
        }
        .search-aside::after {
          content: "";
          position: absolute;
          inset: auto -28% -24% 18%;
          height: 190px;
          border-radius: 999px;
          background: rgba(201,168,76,0.16);
          filter: blur(26px);
          pointer-events: none;
        }
        .search-brand {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .search-brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          box-shadow: 0 16px 32px rgba(0,0,0,0.22);
        }
        .search-brand-title {
          display: block;
          font-size: 0.98rem;
          font-weight: 800;
          line-height: 1.15;
        }
        .search-brand-subtitle {
          display: block;
          color: rgba(255,255,255,0.62);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin-top: 0.15rem;
        }
        .search-aside-copy {
          position: relative;
          z-index: 1;
          margin: 2.2rem 0;
        }
        .search-kicker {
          color: var(--gold-light);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .search-aside-copy h2 {
          color: #ffffff;
          font-size: clamp(1.45rem, 3vw, 2rem);
          line-height: 1.08;
          margin: 0.5rem 0 0.65rem;
        }
        .search-aside-copy p {
          color: rgba(255,255,255,0.66);
          font-size: 0.82rem;
          line-height: 1.7;
        }
        .search-hints {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .search-hint {
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          color: rgba(255,255,255,0.7);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.35rem 0.58rem;
        }
        .search-main {
          display: flex;
          min-width: 0;
          flex-direction: column;
          padding: 1.15rem;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.94), rgba(250,250,253,0.88));
        }
        .search-topbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.25rem 0.25rem 1rem;
        }
        .search-field-shell {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          min-height: 56px;
          border-radius: 18px;
          border: 1px solid rgba(47,49,90,0.1);
          background: #ffffff;
          box-shadow: 0 12px 32px rgba(47,49,90,0.08);
          padding: 0 1rem;
        }
        .search-icon {
          color: rgba(47,49,90,0.42);
          flex-shrink: 0;
        }
        .search-input {
          min-width: 0;
          flex: 1;
          border: 0;
          background: transparent;
          color: var(--brand);
          font-size: clamp(1.05rem, 2.2vw, 1.32rem);
          font-weight: 650;
          outline: none;
        }
        .search-input::placeholder {
          color: rgba(47,49,90,0.35);
        }
        .search-close-btn {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(47,49,90,0.1);
          border-radius: 50%;
          background: #ffffff;
          color: rgba(47,49,90,0.58);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .search-close-btn:hover {
          background: rgba(47,49,90,0.06);
          color: var(--brand);
          transform: translateY(-1px);
        }
        .search-section-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgba(47,49,90,0.52);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 0 0.3rem 0.65rem;
          text-transform: uppercase;
        }
        .search-count {
          color: var(--gold);
          letter-spacing: 0.06em;
        }
        .search-results {
          min-height: 0;
          max-height: 520px;
          overflow-y: auto;
          padding: 0.15rem 0.2rem 0.35rem;
        }
        .search-result-item {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.9rem;
          width: 100%;
          margin-bottom: 0.45rem;
          padding: 0.82rem;
          border: 1px solid transparent;
          border-radius: 18px;
          background: transparent;
          color: var(--brand);
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.22s ease,
            background 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }
        .search-result-item.is-selected,
        .search-result-item:hover {
          transform: translateY(-1px);
          border-color: rgba(201,168,76,0.28);
          background: #ffffff;
          box-shadow: 0 16px 34px rgba(47,49,90,0.1);
        }
        .search-result-icon {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          background: rgba(47,49,90,0.07);
          color: var(--brand);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .search-result-title {
          display: block;
          color: var(--brand);
          font-size: 0.96rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .search-result-path {
          display: block;
          color: rgba(47,49,90,0.48);
          font-size: 0.74rem;
          font-weight: 600;
          margin-top: 0.18rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .search-result-arrow {
          color: rgba(47,49,90,0.28);
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .search-result-item:hover .search-result-arrow,
        .search-result-item.is-selected .search-result-arrow {
          color: var(--gold);
          transform: translateX(2px);
        }
        .search-empty {
          display: grid;
          place-items: center;
          min-height: 240px;
          border: 1px dashed rgba(47,49,90,0.14);
          border-radius: 20px;
          color: rgba(47,49,90,0.5);
          font-size: 0.92rem;
          font-weight: 650;
          text-align: center;
          padding: 2rem;
        }
        @keyframes searchBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes searchModalIn {
          from { opacity: 0; transform: translateY(18px) scale(0.965); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 1024px) {
          .search-modal {
            width: min(760px, calc(100vw - 36px));
            grid-template-columns: 1fr;
            max-height: min(82dvh, 720px);
          }
          .search-aside {
            min-height: auto;
            padding: 1.1rem;
          }
          .search-aside-copy {
            display: none;
          }
          .search-hints {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .search-backdrop {
            align-items: flex-end;
            padding: 0;
          }
          .search-modal {
            width: 100%;
            max-height: min(88dvh, 720px);
            border-radius: 26px 26px 0 0;
            border-bottom: 0;
            grid-template-columns: 1fr;
          }
          .search-aside {
            padding: 1rem 1rem 0.8rem;
          }
          .search-brand-logo {
            width: 42px;
            height: 42px;
          }
          .search-main {
            padding: 0.85rem;
          }
          .search-topbar {
            padding-bottom: 0.8rem;
          }
          .search-field-shell {
            min-height: 50px;
            border-radius: 16px;
            padding: 0 0.85rem;
          }
          .search-close-btn {
            width: 38px;
            height: 38px;
          }
          .search-result-item {
            border-radius: 16px;
            padding: 0.74rem;
            gap: 0.72rem;
          }
          .search-result-icon {
            width: 40px;
            height: 40px;
            border-radius: 13px;
          }
          .search-result-title {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="search-backdrop" onClick={onClose}>
        <div className="search-modal" role="dialog" aria-modal="true" aria-label="Global search" onClick={(event) => event.stopPropagation()}>
          <aside className="search-aside">
            <div className="search-brand">
              <img className="search-brand-logo" src="/images/branding/ksl-logo-circle.webp" alt="K.S. Leow Group" />
              <span>
                <span className="search-brand-title">K.S. Leow Group</span>
                <span className="search-brand-subtitle">Search the website</span>
              </span>
            </div>
            <div className="search-aside-copy">
              <span className="search-kicker">Command Search</span>
              <h2>Jump straight to what matters.</h2>
              <p>Find software pages, plugins, AI tools, quotations, and key business services faster.</p>
            </div>
            <div className="search-hints" aria-hidden="true">
              <span className="search-hint">Esc closes</span>
              <span className="search-hint">Enter opens</span>
              <span className="search-hint">Arrows move</span>
            </div>
          </aside>

          <main className="search-main">
            <div className="search-topbar">
              <div className="search-field-shell">
                <svg className="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search products, apps, services..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <button className="search-close-btn" type="button" onClick={onClose} aria-label="Close search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="search-section-label">
              <span>{queryText ? "Search results" : "Suggested destinations"}</span>
              <span className="search-count">{hasResults ? visibleResults.length : 0}</span>
            </div>

            <div className="search-results">
              {hasResults ? (
                visibleResults.map((item, index) => (
                  <button
                    key={`${item.path}-${index}`}
                    type="button"
                    className={`search-result-item${index === selectedIndex ? " is-selected" : ""}`}
                    onClick={() => openResult(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="search-result-icon">{item.icon}</span>
                    <span>
                      <span className="search-result-title">{item.title}</span>
                      <span className="search-result-path">{item.path}</span>
                    </span>
                    <span className="search-result-arrow"><ArrowIcon /></span>
                  </button>
                ))
              ) : (
                <div className="search-empty">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
