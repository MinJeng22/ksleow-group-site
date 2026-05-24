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

function getViewportWidth() {
  return typeof window === "undefined" ? 1440 : window.innerWidth;
}

function getCarouselCount(width) {
  if (width <= 640) return 3;
  if (width <= 900) return 4;
  if (width <= 1180) return 5;
  return 5;
}

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

function ProductCard({ product, productIndex, order, hovered, revealed, animateReveal, onHover, onLeave, onOpen }) {
  const isHov = hovered === productIndex;
  const clickable = !!product.route;

  return (
    <div
      onMouseEnter={() => onHover(productIndex)}
      onMouseLeave={onLeave}
      onClick={() => clickable && onOpen(product.route)}
      className="product-card"
      style={{
        borderRadius: 0, overflow: "hidden",
        border: `1px solid ${isHov ? "rgba(47,49,90,0.3)" : "rgba(47,49,90,0.11)"}`,
        background: "#ffffff",
        transition: "border-color 0.26s",
        cursor: clickable ? "pointer" : "default",
        height: "100%",
        minHeight: 350,
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
              priority
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
          </>
        )}
        {product.img ? (
          <Img
            src={product.img}
            alt={product.name}
            priority
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "contain", padding: "12%", zIndex: 2,
              opacity: revealed ? 1 : 0,
              transform: revealed
                ? `translateY(0px) scale(${isHov ? 1.08 : 1})`
                : "translateY(30px) scale(0.85)",
              transition: animateReveal
                ? `opacity 0.7s ease ${order * 0.15}s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${order * 0.15}s`
                : "transform 0.28s ease",
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 600, color: "#c9a84c", letterSpacing: "0.04em" }}>
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
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
  const [progressIndex, setProgressIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth);
  const [revealSettled, setRevealSettled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const sync = () => setViewportWidth(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const visibleCount = Math.min(getCarouselCount(viewportWidth), PRODUCTS.length);
  const renderCount = Math.min(visibleCount + 1, PRODUCTS.length + 1);
  const canSlide = PRODUCTS.length > 1;
  const visibleProducts = Array.from({ length: renderCount }, (_, order) => {
    const productIndex = (startIndex + order - 1 + PRODUCTS.length) % PRODUCTS.length;
    return { product: PRODUCTS[productIndex], productIndex, order };
  });
  const startSlide = (direction) => {
    if (!canSlide || slideDirection) return;
    setSlideDirection(direction);
    setProgressIndex(i => (
      direction === "next"
        ? (i + 1) % PRODUCTS.length
        : (i - 1 + PRODUCTS.length) % PRODUCTS.length
    ));
  };
  const showPrevious = () => startSlide("previous");
  const showNext = () => startSlide("next");
  const finishSlide = () => {
    if (!slideDirection) return;
    setStartIndex(i => (
      slideDirection === "next"
        ? (i + 1) % PRODUCTS.length
        : (i - 1 + PRODUCTS.length) % PRODUCTS.length
    ));
    setSlideDirection(null);
  };

  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null || slideDirection) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) showPrevious(); else showNext();
  };

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return undefined;
    let settleTimer;
    const revealOnce = () => {
      setRevealed(true);
      settleTimer = window.setTimeout(() => setRevealSettled(true), 1300);
    };
    if (typeof IntersectionObserver === "undefined") {
      revealOnce();
      return () => window.clearTimeout(settleTimer);
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          revealOnce();
          io.disconnect();
        }
      }),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  return (
    <section
      className="home-section products-section"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0f1128",
        padding: "6rem 0",
      }}
    >
      <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="products-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
              {productsContent.eyebrow}
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              {productsContent.heading}
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0 }}>
              {productsContent.intro}
            </p>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {canSlide && (
            <CarouselControls
              className="products-carousel-controls-side"
              onPrevious={showPrevious}
              onNext={showNext}
            />
          )}
          <div 
            className="products-carousel-shell"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: "pan-y" }}
          >
            <div
              ref={gridRef}
              className={`products-grid products-grid-carousel${slideDirection ? ` is-sliding-${slideDirection}` : ""}`}
              onAnimationEnd={finishSlide}
              style={{
                "--products-render-count": renderCount,
                display: "grid",
                gridTemplateColumns: `repeat(${renderCount}, 1fr)`,
                gridAutoRows: "1fr",
                height: 435,
                gap: "0.9rem",
              }}
            >
            {visibleProducts.map(({ product, productIndex, order }) => (
              <ProductCard
                key={`${product.name}-${productIndex}-${order}`}
                product={product}
                productIndex={productIndex}
                order={order}
                hovered={hovered}
                revealed={revealed}
                animateReveal={!revealSettled}
                onHover={setHovered}
                onLeave={() => setHovered(null)}
                onOpen={navigate}
              />
            ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "160px", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
            <div style={{ 
              position: "absolute",
              top: 0, left: 0, bottom: 0,
              width: `${100 / PRODUCTS.length}%`, 
              background: "#c9a84c",
              borderRadius: "2px",
              transform: `translateX(${progressIndex * 100}%)`,
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)" 
            }} />
          </div>
        </div>

      </div>
    </section>
  );
}
