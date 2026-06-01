import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_INDEX = [
  {
    title: "Home",
    path: "/",
    keywords: "home, main, ksl, k.s. leow group, accounting firm",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    title: "AutoCount Accounting",
    path: "/products/autocount-accounting",
    keywords: "autocount, accounting, software, ledger, invoice, system, finance, business",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  {
    title: "AutoCount Cloud Accounting",
    path: "/products/autocount-cloud-accounting",
    keywords: "cloud, accounting, online, web, remote, anytime, anywhere",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
      </svg>
    )
  },
  {
    title: "AutoCount Plugins",
    path: "/apps/autocount-plugin",
    keywords: "plugins, extensions, add-on, customize, autocount, app",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="14" y="3" rx="1"/>
        <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>
      </svg>
    )
  },
  {
    title: "Sales2DO App",
    path: "/apps/sales2do",
    keywords: "sales2do, mobile, sales, ordering, delivery, agent, app",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    )
  },
  {
    title: "KS Omni",
    path: "/omni",
    keywords: "ks omni, ai, chatbot, omnichannel, whatsapp, customer service, support",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
      </svg>
    )
  },
  {
    title: "Quotation Viewer",
    path: "/quotation",
    keywords: "quotation, invoice, billing, viewer, price, pricing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  }
];

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim() === "" 
    ? [] 
    : SEARCH_INDEX.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.keywords.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          navigate(results[selectedIndex].path);
          window.scrollTo({ top: 0, behavior: "instant" });
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, onClose, navigate]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .search-backdrop {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 10vh 1.25rem 1.25rem;
        }
        .search-modal {
          width: min(680px, 100%);
          border-radius: 24px;
          overflow: hidden;
          animation: ksNavPanelIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .search-header {
          display: flex;
          align-items: center;
          padding: 1.05rem 1.25rem;
          border-bottom: 1px solid rgba(47,49,90,0.08);
          gap: 0.9rem;
        }
        .search-icon {
          color: rgba(47,49,90,0.48);
        }
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: clamp(1.05rem, 2.1vw, 1.32rem);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
          color: #2f315a;
          font-weight: 560;
          outline: none;
        }
        .search-input::placeholder {
          color: rgba(47,49,90,0.34);
          font-weight: 460;
        }
        .search-close-btn {
          flex-shrink: 0;
        }
        .search-results {
          max-height: min(48vh, 420px);
          overflow-y: auto;
          padding: 0.6rem;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1rem;
          margin: 0.25rem;
          border-radius: 16px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          background: transparent;
        }
        .search-result-item.is-selected {
          background: #ffffff;
          border-color: rgba(201,168,76,0.24);
          box-shadow: 0 12px 28px rgba(47,49,90,0.09);
        }
        .search-result-item:hover {
          background: rgba(255,255,255,0.82);
          transform: translateY(-1px);
        }
        .search-result-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: rgba(47,49,90,0.06);
          box-shadow: inset 0 0 0 1px rgba(47,49,90,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2f315a;
        }
        .search-result-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .search-result-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          color: #2f315a;
        }
        .search-result-path {
          font-size: 0.8rem;
          color: rgba(47,49,90,0.48);
        }
        .search-empty {
          padding: 3rem 2rem;
          text-align: center;
          color: rgba(47,49,90,0.48);
          font-size: 0.95rem;
        }
        
        /* Mobile adjustment */
        @media (max-width: 767px) {
          .search-backdrop {
            padding: 0.75rem;
            align-items: flex-start;
          }
          .search-modal {
            width: 100%;
            max-width: 100%;
            border-radius: 22px;
          }
          .search-input {
            font-size: 1rem;
          }
          .search-header {
            padding: 0.85rem 0.95rem;
          }
          .search-results {
            max-height: min(58vh, 430px);
            padding: 0.45rem;
          }
          .search-result-item {
            padding: 0.75rem;
            border-radius: 14px;
          }
          .search-result-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
          }
        }
      `}</style>
      
      <div className="search-backdrop ks-nav-modal-backdrop" onClick={onClose}>
        <div className="search-modal ks-nav-glass-panel" onClick={e => e.stopPropagation()}>
          <div className="search-header">
            <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              ref={inputRef}
              type="text" 
              className="search-input" 
              placeholder="Search Pages"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="search-close-btn ks-nav-close-btn" onClick={onClose} aria-label="Close search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="search-results">
            {query.trim() === "" ? (
              <div className="search-empty">
                Type anything to start searching...
              </div>
            ) : results.length > 0 ? (
              results.map((item, index) => (
                <div 
                  key={item.path} 
                  className={`search-result-item ${index === selectedIndex ? 'is-selected' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    window.scrollTo({ top: 0, behavior: "instant" });
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="search-result-icon">
                    {item.icon}
                  </div>
                  <div className="search-result-text">
                    <span className="search-result-title">{item.title}</span>
                    <span className="search-result-path">{item.path}</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              ))
            ) : (
              <div className="search-empty">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
