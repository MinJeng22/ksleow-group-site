import { useRef } from "react";
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
  scroll-behavior: smooth;
  scroll-padding-left: 0;
  scrollbar-width: none;
  will-change: scroll-position;
}
.ks-bento-carousel-track::-webkit-scrollbar {
  display: none;
}
.ks-bento-carousel-slide {
  flex: 0 0 calc(100% + min(18vw, 180px));
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (min-width: 1181px) {
  .other-services-carousel .ks-bento-carousel-slide {
    flex: 0 0 max(100%, 1920px);
  }
}
.ks-bento-carousel-slide .ks-bento-card {
}
.other-services-carousel .ks-bento-carousel-slide.ks-bento {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 0.9fr) minmax(0, 0.9fr) !important;
}
.other-services-carousel .ks-bento-layout-1 { grid-column: 1; grid-row: 1 / span 2; }
.other-services-carousel .ks-bento-layout-2 { grid-column: 2; grid-row: 1; }
.other-services-carousel .ks-bento-layout-3 { grid-column: 2; grid-row: 2; }
.other-services-carousel .ks-bento-layout-4 { grid-column: 3; grid-row: 1; }
.other-services-carousel .ks-bento-layout-5 { grid-column: 4; grid-row: 1; }
.other-services-carousel .ks-bento-layout-6 { grid-column: 3 / span 2; grid-row: 2; }

@media (max-width: 1024px) {
  .other-services-carousel .ks-bento-layout-1 { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
  .other-services-carousel .ks-bento-layout-2 { grid-column: 2 !important; grid-row: 1 !important; }
  .other-services-carousel .ks-bento-layout-3 { grid-column: 2 !important; grid-row: 2 !important; }
  .other-services-carousel .ks-bento-layout-4 { grid-column: 3 !important; grid-row: 1 !important; }
  .other-services-carousel .ks-bento-layout-5 { grid-column: 4 !important; grid-row: 1 !important; }
  .other-services-carousel .ks-bento-layout-6 { grid-column: 3 / span 2 !important; grid-row: 2 !important; }
}
.other-services-carousel .ks-bento-card {
  border-color: rgba(47,49,90,0.1);
  box-shadow: 0 24px 60px rgba(47,49,90,0.08);
}
.other-services-carousel .ks-bento-card.is-empty {
  /* User wants empty cards to be visible as filled shapes to fill negative space */
  border-color: rgba(47,49,90,0.1);
}
.other-services-carousel .ks-bento-card.is-clickable:hover {
  background: #ffffff;
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
@media (min-width: 2400px) {
  .other-services-carousel .ks-bento-carousel-controls {
    display: none;
  }
}
@media (max-width: 1180px) {
  .ks-bento-carousel-slide {
    flex-basis: 220%;
  }
}
@media (max-width: 640px) {
  .ks-bento-carousel-track {
    gap: 1rem;
  }
  .ks-bento-carousel-slide {
    flex-basis: 350%;
  }
}
`;

export function BentoGrid({ items = [], minItems = 4, imageFor, onOpen, className = "" }) {
  const displayItems = normalizeBentoItems(items, minItems);

  return (
    <div className={`ks-bento${className ? ` ${className}` : ""}`}>
      {displayItems.slice(0, minItems).map((item, index) => (
        <BentoCard
          key={item.key || index}
          item={item}
          index={index}
          layoutClass={LAYOUT_CLASSES[index] || ""}
          image={imageFor?.(item)}
          onOpen={onOpen}
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
  className = "",
  controlsLabel = "Browse items",
}) {
  const trackRef = useRef(null);
  const displayItems = normalizeBentoItems(items, minItems);
  const slides = chunkBentoItems(displayItems, minItems);

  const scrollByBento = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector(".ks-bento-carousel-slide");
    const slideWidth = slide?.getBoundingClientRect().width || track.clientWidth;
    const distance = Math.min(track.clientWidth * 0.86, slideWidth * 0.38);
    
    // Manual JS smooth scroll to guarantee animation across all browsers
    const start = track.scrollLeft;
    const end = start + direction * distance;
    const duration = 450;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed < duration) {
        track.scrollLeft = start + (end - start) * easeOutCubic(elapsed / duration);
        requestAnimationFrame(animateScroll);
      } else {
        track.scrollLeft = end;
      }
    };
    requestAnimationFrame(animateScroll);
  };

  return (
    <div className={`ks-bento-carousel${className ? ` ${className}` : ""}`}>
      <style>{BENTO_CAROUSEL_STYLES}</style>
      <div className="ks-bento-carousel-viewport">
        <div className="ks-bento-carousel-track" ref={trackRef}>
          {slides.map((slideItems, slideIndex) => (
            <div className="ks-bento-carousel-slide ks-bento" key={`bento-slide-${slideIndex}`}>
              {slideItems.map((item, index) => (
                <BentoCard
                  key={item.key || `${slideIndex}-${index}`}
                  item={item}
                  index={index}
                  layoutClass={LAYOUT_CLASSES[index] || ""}
                  image={imageFor?.(item)}
                  onOpen={onOpen}
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

export function BentoCard({ item, index, layoutClass = "", image, onOpen, variant = "grid" }) {
  const isEmpty = item?.isEmpty;
  const clickable = !isEmpty && !!(item?.route || item?.modal || item?.href);
  const shapeClass = index === 0 || index === 3 ? " is-tall" : " is-wide";

  const handleOpen = () => {
    if (clickable) onOpen?.(item, index);
  };

  return (
    <article
      id={item?.modal ? `${item.modal}-card` : undefined}
      className={`ks-bento-card ${layoutClass}${shapeClass}${clickable ? " is-clickable" : ""}${isEmpty ? " is-empty" : ""}`}
      onClick={clickable ? handleOpen : undefined}
      onKeyDown={clickable ? (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleOpen();
      } : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-hidden={isEmpty ? "true" : undefined}
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
            <h3 className="site-card-title ks-bento-title">{item.title}</h3>
            <p className="site-card-copy ks-bento-copy">{item.desc}</p>
            {clickable && (
              <span className="ks-learn-more ks-bento-link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
          </>
        )}
      </div>
    </article>
  );
}
