import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Img } from "./Media.jsx";
import productsContent from "../content/products.json";

const PRODUCTS = (productsContent.items || []).map(p => ({
  name:        p.name,
  desc:        p.desc,
  img:         p.image      || null,
  background:  p.background || null,   /* lifestyle photo behind the logo */
  placeholder: p.placeholder,
  gradient:    p.gradient,
  route:       p.route      || null,
}));

export default function Products({ onContact }) {
  const [hovered, setHovered] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const visibleCount = Math.min(4, PRODUCTS.length);
  const canSlide = PRODUCTS.length > visibleCount;
  const visibleProducts = canSlide
    ? Array.from({ length: visibleCount }, (_, order) => {
        const productIndex = (startIndex + order) % PRODUCTS.length;
        return { product: PRODUCTS[productIndex], productIndex, order };
      })
    : PRODUCTS.map((product, productIndex) => ({ product, productIndex, order: productIndex }));
  const showPrevious = () => setStartIndex(i => (i - 1 + PRODUCTS.length) % PRODUCTS.length);
  const showNext = () => setStartIndex(i => (i + 1) % PRODUCTS.length);

  /* Reveal cards one-by-one (Accounting → FeedMe) the first time the
   * grid enters the viewport. Plays once; doesn't reverse on scroll-up. */
  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef(null);
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setRevealed(true); return; }
    /* Replayable: toggle both ways so the logo stagger plays every
     * time the grid scrolls back into view. */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setRevealed(e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className="home-section products-section" style={{ background: "#2f315a", padding: "6rem 0" }}>
      <div className="content-wrap">
        <div className="products-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
              {productsContent.eyebrow}
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              {productsContent.heading}
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
              {productsContent.intro}
            </p>
          </div>
          {canSlide && (
            <div className="products-carousel-controls" style={{ display: "flex", gap: "0.65rem", flexShrink: 0 }}>
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous software"
                style={{
                  width: 42, height: 42, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.28)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff", cursor: "pointer",
                  fontSize: "1.3rem", lineHeight: 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, border-color 0.2s, color 0.2s",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#c9a84c";
                  e.currentTarget.style.borderColor = "#c9a84c";
                  e.currentTarget.style.color = "#1e2040";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                {"<"}
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next software"
                style={{
                  width: 42, height: 42, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.28)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff", cursor: "pointer",
                  fontSize: "1.3rem", lineHeight: 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, border-color 0.2s, color 0.2s",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#c9a84c";
                  e.currentTarget.style.borderColor = "#c9a84c";
                  e.currentTarget.style.color = "#1e2040";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                {">"}
              </button>
            </div>
          )}
        </div>

        <div ref={gridRef} className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "1fr", gap: "1.25rem" }}>
          {visibleProducts.map(({ product: p, productIndex, order }) => {
            const isHov = hovered === productIndex;
            const clickable = !!p.route;
            return (
              <div
                key={p.name}
                onMouseEnter={() => setHovered(productIndex)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => p.route && navigate(p.route)}
                style={{
                  borderRadius: 16, overflow: "hidden",
                  border: `1px solid ${isHov ? "rgba(47,49,90,0.3)" : "rgba(47,49,90,0.11)"}`,
                  background: "#ffffff",
                  transition: "border-color 0.26s",
                  cursor: clickable ? "pointer" : "default",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* 3-layer composition:
                 *   1. base — gradient/flat color (fallback when no background photo)
                 *   2. lifestyle background photo (object-fit: cover)
                 *   3. semi-transparent black overlay so the logo on top
                 *      reads cleanly regardless of the photo's contrast
                 *   4. logo image (or emoji placeholder) on top, zIndex 2
                 */}
                <div style={{ background: p.gradient, paddingBottom: "56%", position: "relative",
                  outline: (p.img || p.background) ? "none" : "2px dashed rgba(255,255,255,0.15)", outlineOffset: -6 }}>
                  {p.background && (
                    <>
                      <Img src={p.background} alt=""
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div aria-hidden="true"
                        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
                    </>
                  )}
                  {p.img
                    ? <Img src={p.img} alt={p.name}
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%",
                          objectFit: "contain", padding: "12%", zIndex: 2,
                          /* Logo fades in left → right (Accounting first,
                           * FeedMe last) the first time the grid scrolls
                           * into view. Card background photo stays in
                           * place; only the logo on top reveals. */
                          opacity: revealed ? 1 : 0,
                          transform: revealed ? "scale(1)" : "scale(0.96)",
                          transition: `opacity 0.8s ease ${order * 0.18}s, transform 0.8s ease ${order * 0.18}s`,
                        }} />
                    : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 2 }}>
                        <span style={{ fontSize: "2.6rem", opacity: 0.75 }}>{p.placeholder}</span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Upload logo</span>
                      </div>
                  }
                </div>

                <div style={{ padding: "1.35rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.5rem", minHeight: "2.35em", display: "flex", alignItems: "flex-start" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.82rem", color: "#6b6f91", lineHeight: 1.66, marginBottom: 0 }}>{p.desc}</p>
                  {clickable && (
                    <div style={{ marginTop: "auto", paddingTop: "0.75rem", textAlign: "right" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#c9a84c", letterSpacing: "0.04em" }}>
                        Learn more →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
