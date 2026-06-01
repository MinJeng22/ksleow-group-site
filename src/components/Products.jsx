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

function getActualVisibleCount(width) {
  if (width <= 640) return 1;
  if (width <= 900) return 2;
  if (width <= 1180) return 3;
  return 4;
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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isHov) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: x * 2 - 1, y: y * 2 - 1 });
  };

  const handleMouseLeave = () => {
    onLeave();
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseEnter={() => onHover(productIndex)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
          paddingBottom: "56%",
          position: "relative",
          overflow: "hidden",
          outline: (product.img || product.background) ? "none" : "2px dashed rgba(255,255,255,0.15)",
          outlineOffset: -6,
          perspective: "800px",
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{
          position: "absolute", inset: -4,
          background: product.gradient,
          transform: isHov 
            ? `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0px)` 
            : "translate3d(0px, 0px, 0px)",
          transition: isHov ? "transform 0.15s ease-out" : "transform 0.35s ease",
          zIndex: 0,
        }}>
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
        </div>

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
                ? isHov 
                  ? `translate3d(${mousePos.x * 3}px, ${mousePos.y * 3}px, 10px) scale(1.02) rotateX(${mousePos.y * -1.5}deg) rotateY(${mousePos.x * 1.5}deg)`
                  : "translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg)"
                : "translate3d(0px, 16px, 0px) scale(0.96) rotateX(0deg) rotateY(0deg)",
              transition: (!revealed) 
                ? "none" 
                : animateReveal && !isHov
                  ? `opacity 0.55s cubic-bezier(0.25, 0.1, 0.25, 1) ${order * 0.06}s, transform 0.6s cubic-bezier(0.22, 0.68, 0.35, 1) ${order * 0.06}s`
                  : isHov ? "transform 0.15s ease-out, filter 0.15s ease-out" : "transform 0.35s ease, filter 0.35s ease",
              filter: isHov 
                ? `drop-shadow(${mousePos.x * -2}px ${mousePos.y * -2 + 4}px 6px rgba(0,0,0,0.15))` 
                : "drop-shadow(0px 2px 4px rgba(0,0,0,0.06))",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 2 }}>
            <span style={{ fontSize: "2.6rem", opacity: 0.75 }}>{product.placeholder}</span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Upload logo</span>
          </div>
        )}
      </div>

      <div className="site-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 className="site-card-title" style={{
          marginBottom: "0.55rem",
          minHeight: "2.35em",
          display: "flex",
          alignItems: "flex-start",
        }}>
          {product.name}
        </h3>
        <p className="site-card-copy" style={{ marginBottom: 0 }}>
          {product.desc}
        </p>
        {clickable && (
          <div style={{ marginTop: "auto", paddingTop: "0.75rem", textAlign: "right" }}>
            <span className="ks-learn-more">
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
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const sync = () => setViewportWidth(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const visibleCount = Math.min(getCarouselCount(viewportWidth), PRODUCTS.length);
  const renderCount = Math.min(visibleCount + 2, PRODUCTS.length + 2);
  const canSlide = PRODUCTS.length > 1;
  const visibleProducts = Array.from({ length: renderCount }, (_, order) => {
    const productIndex = (startIndex + order - 2 + PRODUCTS.length) % PRODUCTS.length;
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

  useEffect(() => {
    let interval;
    if (isPlaying && canSlide && !slideDirection) {
      interval = setInterval(() => {
        showNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, canSlide, slideDirection]);

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
          if (e.intersectionRatio >= 0.15) {
            setRevealed(true);
            setRevealSettled(false);
            window.clearTimeout(settleTimer);
            settleTimer = window.setTimeout(() => setRevealSettled(true), 1300);
          }
        } else {
          setRevealed(false);
          setRevealSettled(false);
          window.clearTimeout(settleTimer);
        }
      }),
      { threshold: [0, 0.15] }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  return (
    <section
      id="products"
      className="home-section products-section"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0f1128",
        padding: "var(--section-py) 0",
      }}
    >
      <style>{`
        @keyframes products-autoplay-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
      <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="products-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <div style={{ maxWidth: 760 }}>
            <div className="ks-eyebrow" style={{ marginBottom: "0.75rem" }}>
              {productsContent.eyebrow}
            </div>
            <h2 className="ks-section-title ks-section-title-lg" style={{ color: "#ffffff", marginBottom: "0.75rem" }}>
              {productsContent.heading}
            </h2>
            <p className="ks-body-text" style={{ color: "rgba(255,255,255,0.72)", margin: 0 }}>
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
                onOpen={(route) => route ? navigate(route) : null}
              />
            ))}
            </div>
          </div>
        </div>


        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "14px" }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: "10px", 
            background: "rgba(255,255,255,0.06)", padding: "0 18px", height: "var(--btn-h-lg)", borderRadius: "var(--radius-pill)"
          }}>
            {PRODUCTS.map((_, i) => {
              const actualVisible = getActualVisibleCount(viewportWidth);
              const isActive = i === progressIndex;
              const isVisible = (() => {
                for (let j = 0; j < actualVisible; j++) {
                  if ((progressIndex + j) % PRODUCTS.length === i) return true;
                }
                return false;
              })();

              return (
              <div
                key={i}
                style={{
                  width: isActive ? "40px" : "16px",
                  height: "8px",
                  borderRadius: "4px",
                  background: isVisible && !isActive ? "#ffffff" : "rgba(255,255,255,0.2)",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {isActive && (
                  <div
                    key={`progress-${progressIndex}-${isPlaying ? 'play' : 'pause'}`}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      background: "#ffffff",
                      borderRadius: "3px",
                      width: "100%",
                      animation: isPlaying ? "products-autoplay-progress 3000ms linear forwards" : "none"
                    }}
                  />
                )}
              </div>
            )})}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "var(--btn-h-lg)", height: "var(--btn-h-lg)", borderRadius: "50%",
              background: "rgba(255,255,255,0.06)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#ffffff",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "translateX(1.5px)" }}>
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
