import { useEffect, useRef, useState } from "react";
import { Img } from "../Media.jsx";

const LAYOUT_CLASSES = [
  "ks-bento-layout-1",
  "ks-bento-layout-2",
  "ks-bento-layout-3",
  "ks-bento-layout-4",
  "ks-bento-layout-5",
  "ks-bento-layout-6",
];

const BENTO_CAROUSEL_STYLES = `
.ks-bento-carousel {
  position: relative;
}
.ks-bento-carousel-viewport {
}
.ks-bento-carousel-track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 1.5rem 0.5rem;
  margin: -1.5rem -0.5rem;
  scroll-behavior: auto;
  scroll-padding-left: 0;
  scrollbar-width: none;
  will-change: scroll-position;
}
.ks-bento-carousel-track.is-bento-animating {
  scroll-snap-type: none !important;
}
.ks-bento-carousel-track::-webkit-scrollbar {
  display: none;
}
.ks-bento-carousel-slide {
  flex: 0 0 calc(100% + min(18vw, 180px));
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 1401px) {
  .other-services-carousel .ks-bento-carousel-slide {
    flex: 0 0 max(100%, 1920px);
  }
}
.ks-bento-carousel-slide .ks-bento-card {
}
.other-services-carousel .ks-bento-carousel-slide.ks-bento {
  background: transparent !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 0.9fr) minmax(0, 0.9fr) !important;
}
.other-services-carousel .ks-bento-layout-1 { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
.other-services-carousel .ks-bento-layout-2 { grid-column: 2 !important; grid-row: 1 !important; }
.other-services-carousel .ks-bento-layout-3 { grid-column: 2 !important; grid-row: 2 !important; }
.other-services-carousel .ks-bento-layout-4 { grid-column: 3 !important; grid-row: 1 !important; }
.other-services-carousel .ks-bento-layout-5 { grid-column: 4 !important; grid-row: 1 !important; }
.other-services-carousel .ks-bento-layout-6 { grid-column: 3 / span 2 !important; grid-row: 2 !important; }
.other-services-carousel .ks-bento-card {
  background: #ffffff !important;
  border-color: rgba(47,49,90,0.1);
  box-shadow: none;
}
.other-services-carousel .ks-bento-card.is-empty {
  background: rgba(255,255,255,0.34) !important;
  border-color: rgba(47,49,90,0.08) !important;
  backdrop-filter: blur(0.5px);
}
.other-services-carousel .ks-bento-card.is-empty .ks-bento-placeholder {
  background: transparent !important;
}
.other-services-carousel .ks-bento-card.is-clickable:hover {
  background: #ffffff;
  box-shadow: none !important;
}
.ks-bento-carousel-controls {
  bottom: 1.5rem;
  display: flex;
  gap: 0.65rem;
  justify-content: flex-end;
  position: absolute;
  right: 1.5rem;
  z-index: 10;
}
@media (max-width: 1400px) {
    .other-services-carousel .ks-bento-carousel-track {
      gap: 1rem;
      scroll-padding-left: 0;
      -webkit-overflow-scrolling: touch;
      touch-action: auto;
      cursor: grab;
    }
    .other-services-carousel .ks-bento-carousel-slide {
      display: contents;
    }
    .other-services-carousel .ks-bento-card {
      flex: 0 0 85%;
      max-width: 340px;
      display: flex !important;
      flex-direction: column !important;
      min-height: 380px !important;
    }
    .other-services-carousel .ks-bento-card.is-clickable:hover,
    .other-services-carousel .ks-bento-card.is-clickable:active {
      transform: none !important;
    }
    .other-services-carousel .ks-bento-card.is-empty {
      display: none !important;
    }
    .other-services-carousel.is-sliding-next .ks-bento-card {
      animation: ks-bento-mobile-slide-next 460ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .other-services-carousel.is-sliding-prev .ks-bento-card {
      animation: ks-bento-mobile-slide-prev 460ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .other-services-carousel .ks-bento-card .ks-bento-media {
      flex: 1 1 50% !important;
      min-height: 180px !important;
      width: 100% !important;
    }
    .other-services-carousel .ks-bento-card .ks-bento-body {
      flex: 0 0 auto !important;
      padding: 1.25rem !important;
      width: 100% !important;
    }
    .ks-bento-carousel-track:not(.other-services-carousel *) {
      gap: 1rem;
    }
    .ks-bento-carousel-slide:not(.other-services-carousel *) {
      flex-basis: 350%;
    }
  }
@keyframes ks-bento-mobile-slide-next {
  0% { transform: translate3d(22px, 0, 0) scale(0.988); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes ks-bento-mobile-slide-prev {
  0% { transform: translate3d(-22px, 0, 0) scale(0.988); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .other-services-carousel.is-sliding-next .ks-bento-card,
  .other-services-carousel.is-sliding-prev .ks-bento-card {
    animation: none !important;
  }
}
`;

export function BentoGrid({ items = [], minItems = 4, imageFor, onOpen, onPreload, className = "" }) {
  const displayItems = normalizeBentoItems(items, minItems);

  return (
    <div className={`ks-bento${className ? ` ${className}` : ""}`}>
      {displayItems.slice(0, minItems).map((item, index) => (
        <BentoCard
          key={item.key || index}
          item={item}
          index={index}
          layoutClass={LAYOUT_CLASSES[index] || ""}
          image={imageFor ? imageFor(item) : item?.image}
          onOpen={onOpen}
          onPreload={onPreload}
          variant="grid"
        />
      ))}
    </div>
  );
}

export function BentoCarousel({
  items = [],
  minItems = 4,
  imageFor,
  onOpen,
  onPreload,
  className = "",
  controlsLabel = "Browse items",
  reveal = false,
}) {
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const animationRef = useRef(null);
  const slideTimerRef = useRef(null);
  const suppressClickRef = useRef(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [isRevealed, setIsRevealed] = useState(!reveal);
  const displayItems = normalizeBentoItems(items, minItems);
  const slides = chunkBentoItems(displayItems, minItems);
  const isOtherServices = className.split(/\s+/).includes("other-services-carousel");

  useEffect(() => () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (slideTimerRef.current) window.clearTimeout(slideTimerRef.current);
  }, []);

  useEffect(() => {
    if (!reveal || isRevealed) return undefined;
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsRevealed(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isRevealed, reveal]);

  const getMobileCardStep = (track) => {
    const card = track.querySelector(".ks-bento-card");
    if (!card) return track.clientWidth * 0.85;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const releaseTrackSnap = (track, delay = 90) => {
    window.setTimeout(() => {
      if (!animationRef.current) track.classList.remove("is-bento-animating");
    }, delay);
  };

  const animateTrackTo = (track, end, duration, holdSnapMs = 90) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      track.classList.remove("is-bento-animating");
    }
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const start = track.scrollLeft;
    const target = Math.max(0, Math.min(max, end));
    const delta = target - start;
    if (Math.abs(delta) < 1) {
      releaseTrackSnap(track, holdSnapMs);
      return;
    }

    track.classList.add("is-bento-animating");
    const startTime = performance.now();
    const easeInOutCubic = (t) => (
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    );

    const tick = (currentTime) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);
      track.scrollLeft = start + delta * easeInOutCubic(progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        track.scrollLeft = target;
        animationRef.current = null;
        releaseTrackSnap(track, holdSnapMs);
      }
    };

    animationRef.current = requestAnimationFrame(tick);
  };

  const scrollByBento = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    
    let distance;
    if (window.innerWidth <= 1400) {
      distance = getMobileCardStep(track);
    } else {
      const slide = track.querySelector(".ks-bento-carousel-slide");
      const slideWidth = slide?.getBoundingClientRect().width || track.clientWidth;
      distance = Math.min(track.clientWidth * 0.72, slideWidth * 0.34);
    }
    
    const duration = window.innerWidth <= 1400 ? 420 : 680;
    if (window.innerWidth <= 1400 && isOtherServices) {
      const nextDirection = direction > 0 ? "next" : "prev";
      setSlideDirection("");
      window.requestAnimationFrame(() => setSlideDirection(nextDirection));
      if (slideTimerRef.current) window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = window.setTimeout(() => setSlideDirection(""), duration + 120);
    }
    const target = track.scrollLeft + direction * distance;
    animateTrackTo(track, target, duration, window.innerWidth <= 1400 ? 140 : 90);
  };

  const handleClickCapture = (event) => {
    if (Date.now() <= suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`ks-bento-carousel${className ? ` ${className}` : ""}${slideDirection ? ` is-sliding-${slideDirection}` : ""}`}
      onClickCapture={handleClickCapture}
    >
      <style>{BENTO_CAROUSEL_STYLES}</style>
      <div className="ks-bento-carousel-viewport">
        <div
          className="ks-bento-carousel-track"
          ref={trackRef}
        >
          {slides.map((slideItems, slideIndex) => (
            <div className="ks-bento-carousel-slide ks-bento" key={`bento-slide-${slideIndex}`}>
              {slideItems.map((item, index) => (
                <BentoCard
                  key={item.key || `${slideIndex}-${index}`}
                  item={item}
                  index={index}
                  revealIndex={slideIndex * minItems + index}
                  reveal={reveal}
                  revealed={isRevealed}
                  layoutClass={LAYOUT_CLASSES[index] || ""}
                  image={imageFor ? imageFor(item) : item?.image}
                  onOpen={onOpen}
                  onPreload={onPreload}
                  variant="grid"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="ks-bento-carousel-controls" aria-label={controlsLabel}>
        <button type="button" className="ks-carousel-btn" onClick={() => scrollByBento(-1)} aria-label="Previous item">
          <ArrowIcon direction="left" />
        </button>
        <button type="button" className="ks-carousel-btn" onClick={() => scrollByBento(1)} aria-label="Next item">
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}

function normalizeBentoItems(items, minItems) {
  const displayItems = [...items];
  while (displayItems.length < minItems) {
    displayItems.push({ isEmpty: true, key: `empty-${displayItems.length}` });
  }
  return displayItems;
}

function chunkBentoItems(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(normalizeBentoItems(items.slice(i, i + size), size).slice(0, size));
  }
  return chunks;
}

function ArrowIcon({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export function BentoCard({ item, index, revealIndex = index, reveal = false, revealed = true, layoutClass = "", image, onOpen, onPreload, variant = "grid" }) {
  const isEmpty = item?.isEmpty;
  const linkHref = item?.route || item?.href || item?.cta?.href;
  const linkTarget = item?.target || item?.cta?.target || "_self";
  const clickable = !isEmpty && !!(item?.modal || linkHref);
  const shapeClass = index === 0 || index === 3 ? " is-tall" : " is-wide";

  const handleOpen = (e) => {
    if (clickable && onOpen) {
      handlePreload("high");
      if (linkHref && linkTarget !== "_blank") {
        e?.preventDefault();
        onOpen(item, index);
      } else if (!linkHref) {
        onOpen(item, index);
      }
    }
  };

  const handlePreload = (priority = "low") => {
    if (clickable && onPreload) {
      onPreload(item, index, priority);
    }
  };

  const CardTag = linkHref ? "a" : "article";
  const cardProps = linkHref ? {
    href: linkHref,
    target: linkTarget,
    rel: linkTarget === "_blank" ? "noreferrer" : undefined,
  } : {};

  return (
    <CardTag
      id={item?.modal ? `${item.modal}-card` : undefined}
      className={`ks-bento-card ${layoutClass}${shapeClass}${clickable ? " is-clickable" : ""}${isEmpty ? " is-empty" : ""}${reveal ? " ks-bento-card-reveal" : ""}${revealed ? " is-revealed" : ""}`}
      style={reveal ? { "--bento-reveal-delay": `${Math.min(revealIndex * 105, 735)}ms` } : undefined}
      onClick={clickable ? handleOpen : undefined}
      onPointerEnter={clickable ? () => handlePreload("low") : undefined}
      onPointerDown={clickable ? () => handlePreload("high") : undefined}
      onFocus={clickable ? () => handlePreload("low") : undefined}
      onKeyDown={clickable ? (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (!linkHref) {
          event.preventDefault();
          handleOpen(event);
        }
      } : undefined}
      role={clickable && !linkHref ? "button" : undefined}
      tabIndex={clickable && !linkHref ? 0 : undefined}
      aria-hidden={isEmpty ? "true" : undefined}
      {...cardProps}
    >
      <div className="ks-bento-media">
        {image && !isEmpty ? (
          <Img
            src={image}
            alt={item.title}
            className="ks-bento-img"
            protect={false}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="ks-bento-placeholder" />
        )}
      </div>
      <div className="ks-bento-body">
        {!isEmpty && (
          <>
            {item.badge && <span className="ks-bento-badge" style={{ marginBottom: "0.5rem", display: "inline-block", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#80c31e" }}>{item.badge}</span>}
            <h3 className="site-card-title ks-bento-title">{item.title}</h3>
            <p className="site-card-copy ks-bento-copy">{item.desc || item.description}</p>
            {clickable && (
              <span className="ks-learn-more ks-bento-link">
                {item?.cta?.label || "Learn more"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
          </>
        )}
      </div>
    </CardTag>
  );
}

