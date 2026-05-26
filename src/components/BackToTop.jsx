import { useState, useEffect, useRef } from "react";
import useDarkBg from "../hooks/useDarkBg";

/**
 * BackToTop — Apple Liquid Glass style.
 * On desktop/tablet: fixed bottom-right circle.
 * On mobile: rendered inside the FloatingBar, so this component hides itself.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef(null);
  const isDark = useDarkBg(btnRef);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .back-to-top-glass {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 500;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 0.5px solid rgba(255, 255, 255, 0.45);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          backdrop-filter: blur(40px) saturate(1.8);
          -webkit-backdrop-filter: blur(40px) saturate(1.8);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(0, 0, 0, 0.04);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition:
            opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.25s ease,
            background 0.25s ease,
            color 0.35s ease;
        }
        .back-to-top-glass:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.15) 100%
          );
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.12),
            0 2px 6px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        .back-to-top-glass:active {
          transform: translateY(1px) scale(0.95);
        }
        /* Hide on mobile — FloatingBar handles it */
        @media (max-width: 767px) {
          .back-to-top-glass {
            display: none !important;
          }
        }
      `}</style>
      <button
        ref={btnRef}
        className="back-to-top-glass"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.85)",
          pointerEvents: visible ? "auto" : "none",
          color: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.55)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
