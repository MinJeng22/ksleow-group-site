import React, { useMemo, useState } from "react";
import Footer from "../components/Footer";
import galleryData from "../content/gallery.json";

const FALLBACK_IMAGE = "/images/branding/service-card-back.webp";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCategoryLabel(categories, value) {
  return categories.find((category) => category.value === value)?.label || value || "Gallery";
}

function normalizeItem(item) {
  const photos = Array.isArray(item.photos) ? item.photos.filter((photo) => photo?.image) : [];
  const cover = item.cover || photos[0]?.image || FALLBACK_IMAGE;

  return {
    ...item,
    cover,
    photos: photos.length
      ? photos
      : [
          {
            image: cover,
            caption: item.title,
            alt: item.title,
          },
        ],
  };
}

export default function GalleryPage() {
  const categories = galleryData.categories?.length
    ? galleryData.categories
    : [
        { label: "All", value: "all" },
        { label: "Activities", value: "activity" },
        { label: "Team Building", value: "team-building" },
      ];
  const [activeCategory, setActiveCategory] = useState(categories[0]?.value || "all");
  const [selectedItem, setSelectedItem] = useState(null);

  const items = useMemo(
    () => (galleryData.items || []).map(normalizeItem),
    []
  );

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <main className="gallery-page">
      <style>{GALLERY_STYLES}</style>

      <section className="gallery-hero">
        <div className="gallery-hero__inner">
          <p className="section-eyebrow">{galleryData.eyebrow || "Company Gallery"}</p>
          <h1>{galleryData.heading || "Moments From Our Team"}</h1>
          <p>{galleryData.intro}</p>

          <div className="gallery-filter" aria-label="Gallery categories">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                className={category.value === activeCategory ? "is-active" : ""}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-grid-section" aria-labelledby="gallery-heading">
        <div className="gallery-grid-head">
          <div>
            <p className="section-eyebrow">Albums</p>
            <h2 id="gallery-heading">Company Activities & Team Building</h2>
          </div>
          <span>{visibleItems.length} album{visibleItems.length === 1 ? "" : "s"}</span>
        </div>

        {visibleItems.length ? (
          <div className="gallery-grid">
            {visibleItems.map((item, index) => (
              <button
                className={`gallery-card gallery-card--${index % 5}`}
                type="button"
                key={`${item.title}-${index}`}
                onClick={() => setSelectedItem(item)}
              >
                <span className="gallery-card__media">
                  <img src={item.cover} alt={item.title} loading={index < 4 ? "eager" : "lazy"} />
                  <span className="gallery-card__count">{item.photos.length} photo{item.photos.length === 1 ? "" : "s"}</span>
                </span>
                <span className="gallery-card__body">
                  <span className="gallery-card__meta">
                    {getCategoryLabel(categories, item.category)}
                    {item.date ? ` - ${formatDate(item.date)}` : ""}
                  </span>
                  <strong>{item.title}</strong>
                  {item.location ? <span>{item.location}</span> : null}
                  {item.description ? <small>{item.description}</small> : null}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="gallery-empty">No albums in this category yet. Add photos from Decap CMS when ready.</p>
        )}
      </section>

      {selectedItem ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selectedItem.title}>
          <button className="gallery-lightbox__backdrop" type="button" onClick={() => setSelectedItem(null)} aria-label="Close gallery" />
          <div className="gallery-lightbox__panel">
            <button className="gallery-lightbox__close" type="button" onClick={() => setSelectedItem(null)} aria-label="Close">
              &times;
            </button>
            <div className="gallery-lightbox__header">
              <p className="section-eyebrow">{getCategoryLabel(categories, selectedItem.category)}</p>
              <h2>{selectedItem.title}</h2>
              <p>
                {[formatDate(selectedItem.date), selectedItem.location].filter(Boolean).join(" - ")}
              </p>
            </div>
            <div className="gallery-lightbox__photos">
              {selectedItem.photos.map((photo, index) => (
                <figure key={`${photo.image}-${index}`}>
                  <img src={photo.image} alt={photo.alt || photo.caption || selectedItem.title} />
                  {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </main>
  );
}

const GALLERY_STYLES = `
.gallery-page {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(47, 49, 90, 0.08) 0%, rgba(246, 247, 252, 0.96) 34%, #fff 100%);
  color: #2f315a;
}

.gallery-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(7rem, 11vw, 10rem) clamp(1.2rem, 5vw, 5rem) clamp(3rem, 7vw, 5.5rem);
  background:
    radial-gradient(circle at 15% 18%, rgba(211, 177, 86, 0.24), transparent 28rem),
    linear-gradient(135deg, #25264f 0%, #333763 52%, #f5f0df 100%);
  color: #fff;
}

.gallery-hero::after {
  content: "";
  position: absolute;
  inset: auto -10% -40% 30%;
  height: 24rem;
  background: rgba(255, 255, 255, 0.14);
  filter: blur(70px);
  transform: rotate(-8deg);
  pointer-events: none;
}

.gallery-hero__inner,
.gallery-grid-section {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100vw - 2.4rem));
  margin: 0 auto;
}

.gallery-hero .section-eyebrow {
  color: #d3b156;
}

.gallery-hero h1 {
  max-width: 760px;
  margin: 0.35rem 0 1rem;
  color: #fff;
  font-size: clamp(2.6rem, 7vw, 6rem);
  line-height: 0.92;
  letter-spacing: 0;
}

.gallery-hero p:not(.section-eyebrow) {
  max-width: 720px;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(1rem, 2vw, 1.22rem);
  line-height: 1.8;
}

.gallery-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 2rem;
}

.gallery-filter button {
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 999px;
  padding: 0.82rem 1.15rem;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  backdrop-filter: blur(18px);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.gallery-filter button:hover,
.gallery-filter button.is-active {
  transform: translateY(-2px);
  background: #d3b156;
  color: #25264f;
}

.gallery-grid-section {
  padding: clamp(3rem, 7vw, 5.5rem) 0;
}

.gallery-grid-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.gallery-grid-head h2 {
  margin: 0.2rem 0 0;
  font-size: clamp(1.9rem, 4vw, 3.4rem);
  line-height: 1;
}

.gallery-grid-head span {
  display: inline-flex;
  align-items: center;
  min-height: 2.7rem;
  border-radius: 999px;
  padding: 0 1rem;
  border: 1px solid rgba(47, 49, 90, 0.1);
  background: #fff;
  color: rgba(47, 49, 90, 0.72);
  font-weight: 800;
  box-shadow: 0 14px 40px rgba(32, 34, 70, 0.08);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.gallery-empty {
  margin: 0;
  border: 1px dashed rgba(47, 49, 90, 0.2);
  border-radius: 22px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.68);
  color: rgba(47, 49, 90, 0.68);
  font-weight: 800;
}

.gallery-card {
  grid-column: span 4;
  display: grid;
  min-height: 25rem;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(47, 49, 90, 0.1);
  border-radius: 24px;
  background: #fff;
  color: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 18px 60px rgba(32, 34, 70, 0.08);
  transition: transform 0.28s ease, border-color 0.28s ease;
}

.gallery-card:hover {
  transform: translateY(-5px);
  border-color: rgba(211, 177, 86, 0.45);
}

.gallery-card--0,
.gallery-card--4 {
  grid-column: span 6;
}

.gallery-card__media {
  position: relative;
  display: block;
  min-height: 15rem;
  overflow: hidden;
  background: #ececf3;
}

.gallery-card__media img {
  width: 100%;
  height: 100%;
  min-height: 15rem;
  object-fit: cover;
  display: block;
  transform: scale(1.01);
  transition: transform 0.5s ease;
}

.gallery-card:hover .gallery-card__media img {
  transform: scale(1.05);
}

.gallery-card__count {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  border-radius: 999px;
  padding: 0.52rem 0.82rem;
  background: rgba(24, 25, 50, 0.72);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  backdrop-filter: blur(14px);
}

.gallery-card__body {
  display: grid;
  gap: 0.45rem;
  padding: 1.25rem;
}

.gallery-card__meta {
  color: #b08d2d;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.gallery-card strong {
  color: #2f315a;
  font-size: 1.35rem;
  line-height: 1.15;
}

.gallery-card span:not(.gallery-card__media):not(.gallery-card__count):not(.gallery-card__body):not(.gallery-card__meta) {
  color: rgba(47, 49, 90, 0.65);
  font-weight: 700;
}

.gallery-card small {
  color: rgba(47, 49, 90, 0.68);
  font-size: 0.95rem;
  line-height: 1.6;
}

.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 3vw, 2rem);
}

.gallery-lightbox__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(12, 13, 30, 0.68);
  backdrop-filter: blur(14px);
}

.gallery-lightbox__panel {
  position: relative;
  z-index: 1;
  width: min(1080px, 100%);
  max-height: min(88vh, 900px);
  overflow: auto;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 28px 100px rgba(0, 0, 0, 0.3);
}

.gallery-lightbox__close {
  position: sticky;
  top: 1rem;
  float: right;
  z-index: 2;
  width: 2.8rem;
  height: 2.8rem;
  margin: 1rem 1rem 0 0;
  border: 1px solid rgba(47, 49, 90, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: #2f315a;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(14px);
}

.gallery-lightbox__header {
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-bottom: 1px solid rgba(47, 49, 90, 0.1);
}

.gallery-lightbox__header h2 {
  margin: 0.25rem 0 0.4rem;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.98;
}

.gallery-lightbox__header p:not(.section-eyebrow) {
  margin: 0;
  color: rgba(47, 49, 90, 0.64);
  font-weight: 700;
}

.gallery-lightbox__photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: clamp(1rem, 3vw, 2rem);
}

.gallery-lightbox__photos figure {
  margin: 0;
  overflow: hidden;
  border-radius: 18px;
  background: #f1f2f7;
}

.gallery-lightbox__photos img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.gallery-lightbox__photos figcaption {
  padding: 0.85rem 1rem;
  color: rgba(47, 49, 90, 0.68);
  font-size: 0.92rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .gallery-card,
  .gallery-card--0,
  .gallery-card--4 {
    grid-column: span 6;
  }
}

@media (max-width: 640px) {
  .gallery-hero {
    padding-top: 6.4rem;
  }

  .gallery-grid-head {
    align-items: start;
    flex-direction: column;
  }

  .gallery-card,
  .gallery-card--0,
  .gallery-card--4 {
    grid-column: 1 / -1;
    min-height: auto;
  }

  .gallery-lightbox__photos {
    grid-template-columns: 1fr;
  }
}
`;
