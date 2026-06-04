export default function CarouselProgress({
  count,
  activeIndex,
  visibleCount = 1,
  isPlaying = false,
  durationMs = 3000,
  tone = "dark",
  showPlayToggle = false,
  onTogglePlay,
  onSelect,
  getTitle,
  playLabel = "Start autoplay",
  pauseLabel = "Pause autoplay",
  className = "",
}) {
  const total = Math.max(0, count || 0);
  if (total <= 0) return null;

  const active = ((activeIndex % total) + total) % total;
  const visible = Math.max(1, Math.min(visibleCount, total));
  const isVisible = (index) => {
    for (let offset = 0; offset < visible; offset += 1) {
      if ((active + offset) % total === index) return true;
    }
    return false;
  };

  return (
    <div className={`carousel-progress carousel-progress-${tone}${className ? ` ${className}` : ""}`}>
      <div className="carousel-progress-track" role="tablist" aria-label="Carousel progress">
        {Array.from({ length: total }, (_, index) => {
          const selected = index === active;
          const marker = (
            <span
              className={`carousel-progress-marker${selected ? " is-active" : ""}${isVisible(index) && !selected ? " is-visible" : ""}`}
            >
              {selected && (
                <span
                  key={`progress-${active}-${isPlaying ? "play" : "pause"}`}
                  className="carousel-progress-fill"
                  style={{
                    animationDuration: `${durationMs}ms`,
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                />
              )}
            </span>
          );

          if (!onSelect) {
            return <span key={index}>{marker}</span>;
          }

          return (
            <button
              key={index}
              type="button"
              className="carousel-progress-dot-button"
              onClick={() => onSelect(index)}
              title={getTitle?.(index)}
              aria-label={getTitle?.(index) || `Go to item ${index + 1}`}
              aria-selected={selected}
              role="tab"
            >
              {marker}
            </button>
          );
        })}
      </div>

      {showPlayToggle && (
        <button
          type="button"
          className="carousel-progress-toggle"
          onClick={onTogglePlay}
          aria-label={isPlaying ? pauseLabel : playLabel}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
          ) : (
            <svg className="carousel-progress-play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
