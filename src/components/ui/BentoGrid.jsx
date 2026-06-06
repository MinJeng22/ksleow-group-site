import { useRef } from "react";
import { Img } from "../Media.jsx";

const LAYOUT_CLASSES = [
  "ks-bento-left",
  "ks-bento-mid-top",
  "ks-bento-mid-bottom",
  "ks-bento-right-1",
  "ks-bento-right-2",
];

const BENTO_CAROUSEL_STYLES = `
.ks-bento-carousel {
  position: relative;
  padding-bottom: 4.25rem;
}
.ks-bento-carousel-viewport {
  margin-right: calc(-1 * min(4vw, 3rem));
  overflow: hidden;
}
@media (min-width: 1181px) {
  .other-services-carousel .ks-bento-carousel-controls {
    display: none;
  }
}
.ks-bento-carousel-track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 1rem min(4vw, 3rem) 1rem 0;
  margin-top: -1rem;
  scroll-behavior: smooth;
  scroll-padding-left: 0;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  will-change: scroll-position;
}
.ks-bento-carousel-track::-webkit-scrollbar {
  display: none;
}
.ks-bento-carousel-slide {
  flex: 0 0 calc(100% + min(18vw, 180px));
  scroll-snap-align: start;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (min-width: 1181px) {
  .other-services-carousel .ks-bento-carousel-slide {
    flex: 1 1 auto;
  }
}
.ks-bento-carousel-track:active .ks-bento-carousel-slide {
  transform: scale(0.995);
}
.ks-bento-carousel-slide .ks-bento-card {
  scroll-snap-align: none;
}
.other-services-carousel .ks-bento-carousel-slide.ks-bento {
  grid-template-columns: minmax(0, 1.38fr) minmax(0, 1.78fr) minmax(0, 0.94fr) minmax(0, 0.94fr) !important;
}
@media (max-width: 1024px) {
  .other-services-carousel .ks-bento-left {
    grid-column: 1 !important;
    grid-row: 1 / span 2 !important;
  }
  .other-services-carousel .ks-bento-mid-top {
    grid-column: 2 !important;
    grid-row: 1 !important;
  }
  .other-services-carousel .ks-bento-mid-bottom {
    grid-column: 2 !important;
    grid-row: 2 !important;
  }
  .other-services-carousel .ks-bento-right-1 {
    grid-column: 3 !important;
    grid-row: 1 / span 2 !important;
  }
  .other-services-carousel .ks-bento-right-2 {
    grid-column: 4 !important;
    grid-row: 1 / span 2 !important;
  }
}
.other-services-carousel .ks-bento-card {
  background:
    linear-gradient(145deg, rgba(255,255,255,0.96), rgba(250,248,241,0.94));
  border-color: rgba(47,49,90,0.1);
  box-shadow: 0 24px 60px rgba(47,49,90,0.08);
}
.other-services-carousel .ks-bento-card.is-empty {
  background: transparent;
  border-color: rgba(47,49,90,0.06);
}
.other-services-carousel .ks-bento-card.is-clickable:hover {
  background:
    linear-gradient(145deg, rgba(255,255,255,1), rgba(255,250,235,0.98));
}
.ks-bento-carousel-controls {
  bottom: 0;
  display: flex;
  gap: 0.65rem;
  justify-content: flex-end;
  position: absolute;
  right: 0;
}
@media (max-width: 1180px) {
  .ks-bento-carousel-slide {
    flex-basis: 180%;
  }
}
@media (max-width: 640px) {
  .ks-bento-carousel {
    padding-bottom: 3.75rem;
  }
  .ks-bento-carousel-viewport {
    margin-right: -1rem;
  }
  .ks-bento-carousel-track {
    gap: 1rem;
    padding-right: 1rem;
  }
  .ks-bento-carousel-slide {
    flex-basis: 250%;
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
