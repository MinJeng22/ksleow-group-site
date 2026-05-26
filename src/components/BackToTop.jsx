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
          width: 40px;
          height: 40px;
          border-radius: 50%;
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
        /* Mobile sizing */
        @media (max-width: 767px) {
          .back-to-top-glass {
            bottom: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
      <button
        ref={btnRef}
        className="back-to-top-glass lg-glass lg-glass-btn"
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
