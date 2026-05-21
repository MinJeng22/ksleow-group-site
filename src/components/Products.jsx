import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Img } from "./Media.jsx";
import productsContent from "../content/products.json";

const PRODUCTS = (productsContent.items || []).map(p => ({
  name:        p.name,
  desc:        p.desc,
  img:         p.image      || null,
  background:  p.background || null,
  placeholder: p.placeholder,
  gradient:    p.gradient,
  route:       p.route      || null,
}));

function Chevron({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "previous"
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

function CarouselControls({ onPrevious, onNext, className = "" }) {
  return (
    <div className={`products-carousel-controls ${className}`}>
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous software"
        className="products-carousel-button"
      >
        <Chevron direction="previous" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next software"
        className="products-carousel-button"
      >
        <Chevron direction="next" />
      </button>
    </div>
  );
}

function ProductCard({ product, productIndex, order, hovered, revealed, onHover, onLeave, onOpen }) {
  const isHov = hovered === productIndex;
  const clickable = !!product.route;

  return (
    <div
      onMouseEnter={() => onHover(productIndex)}
      onMouseLeave={onLeave}
      onClick={() => clickable && onOpen(product.route)}
      style={{
        borderRadius: 16, overflow: "hidden",
        border: `1px solid ${isHov ? "rgba(47,49,90,0.3)" : "rgba(47,49,90,0.11)"}`,
        background: "#ffffff",
        transition: "border-color 0.26s",
        cursor: clickable ? "pointer" : "default",
        height: "100%",
        minHeight: 380,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: product.gradient,
          paddingBottom: "56%",
          position: "relative",
          outline: (product.img || product.background) ? "none" : "2px dashed rgba(255,255,255,0.15)",
          outlineOffset: -6,
        }}
      >
        {product.background && (
          <>
            <Img
              src={product.background}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
          </>
        )}
        {product.img ? (
          <Img
            src={product.img}
            alt={product.name}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "contain", padding: "12%", zIndex: 2,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "scale(1)" : "scale(0.96)",
              transition: `opacity 0.8s ease ${order * 0.18}s, transform 0.8s ease ${order * 0.18}s`,
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 2 }}>
            <span style={{ fontSize: "2.6rem", opacity: 0.75 }}>{product.placeholder}</span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Upload logo</span>
          </div>
        )}
      </div>

      <div style={{ padding: "1.35rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.5rem", minHeight: "2.35em", display: "flex", alignItems: "flex-start" }}>
          {product.name}
        </h3>
        <p style={{ fontSize: "0.82rem", color: "#6b6f91", lineHeight: 1.66, marginBottom: 0 }}>
          {product.desc}
        </p>
        {clickable && (
          <div style={{ marginTop: "auto", paddingTop: "0.75rem", textAlign: "right" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#c9a84c", letterSpacing: "0.04em" }}>
              Learn more -&gt;
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Products({ onContact }) {
  const [hovered, setHovered] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    if (query.addEventListener) {
      query.addEventListener("change", sync);
      return () => query.removeEventListener("change", sync);
    }
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  const visibleCount = Math.min(isMobile ? 2 : 4, PRODUCTS.length);
  const canSlide = PRODUCTS.length > visibleCount;
  const visibleProducts = canSlide
    ? Array.from({ length: visibleCount }, (_, order) => {
        const productIndex = (startIndex + order) % PRODUCTS.length;
        return { product: PRODUCTS[productIndex], productIndex, order };
      })
    : PRODUCTS.map((product, productIndex) => ({ product, productIndex, order: productIndex }));
  const showPrevious = () => setStartIndex(i => (i - 1 + PRODUCTS.length) % PRODUCTS.length);
  const showNext = () => setStartIndex(i => (i + 1) % PRODUCTS.length);

  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef(null);
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") { setRevealed(true); return undefined; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setRevealed(e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="home-section products-section"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f4f6fb",
        padding: "6rem 0",
      }}
    >
      <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="products-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
              {productsContent.eyebrow}
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              {productsContent.heading}
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.75, margin: 0 }}>
              {productsContent.intro}
            </p>
          </div>
        </div>

        <div className="products-carousel-shell" style={{ position: "relative" }}>
          {canSlide && (
            <CarouselControls
              className="products-carousel-controls-side"
              onPrevious={showPrevious}
              onNext={showNext}
            />
          )}
          <div
            ref={gridRef}
            className="products-grid"
            style={{ display: "grid", gridTemplateColumns: `repeat(${visibleCount}, 1fr)`, gridAutoRows: "1fr", minHeight: 380, gap: "1.25rem" }}
          >
            {visibleProducts.map(({ product, productIndex, order }) => (
              <ProductCard
                key={product.name}
                product={product}
                productIndex={productIndex}
                order={order}
                hovered={hovered}
                revealed={revealed}
                onHover={setHovered}
                onLeave={() => setHovered(null)}
                onOpen={navigate}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
