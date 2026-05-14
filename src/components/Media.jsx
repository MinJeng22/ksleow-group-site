/* ══════════════════════════════════════════════════════════════
 * Media — protected <img> and <video> wrappers
 *
 * Two concerns rolled into one place:
 *
 *   1. Load speed
 *      • <img> default to loading="lazy" + decoding="async" so off-
 *        screen images don't block first paint.
 *      • <video> default to preload="metadata" — only the size/duration
 *        header is fetched up front; the body downloads when play starts.
 *      • Optional `priority` prop opts an above-the-fold image out of
 *        lazy mode and adds fetchPriority="high".
 *
 *   2. Casual anti-download
 *      • Right-click "Save image as…" → suppressed (onContextMenu).
 *      • Drag-to-desktop → suppressed (draggable={false}).
 *      • Native video controls download button → suppressed
 *        (controlsList="nodownload") on Chromium browsers.
 *      • Picture-in-picture → disabled for videos.
 *
 *      Caveat: these stop casual saves. A determined visitor can still
 *      grab assets via DevTools Network tab or a screen capture. For
 *      truly private media you'd need a signed-URL server endpoint;
 *      these wrappers are the right level of friction for public
 *      marketing pages.
 *
 *   YouTube exception: YouTube <iframe> embeds are out-of-scope on
 *   purpose. They live on youtube.com, have their own protections,
 *   and trying to wrap them only breaks the player.
 * ══════════════════════════════════════════════════════════════ */

const noContextMenu = (e) => e.preventDefault();
const noDrag        = (e) => e.preventDefault();

/* ── <Img /> — drop-in replacement for <img>
 *
 *   <Img src="..." alt="..." />              lazy + decode-async (default)
 *   <Img src="..." alt="..." priority />     eager + fetchPriority high
 *
 * All other native <img> props pass through (width / height / style / className…).
 */
export function Img({
  src, alt = "", priority = false,
  loading: loadingProp,
  decoding: decodingProp,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loadingProp ?? (priority ? "eager" : "lazy")}
      decoding={decodingProp ?? "async"}
      fetchPriority={priority ? "high" : "low"}
      draggable={false}
      onContextMenu={noContextMenu}
      onDragStart={noDrag}
      {...rest}
    />
  );
}

/* ── <Vid /> — drop-in replacement for <video>
 *
 *   <Vid src="..." />                 preload metadata, no download UI
 *   <Vid src="..." poster="..." />    same + custom poster image
 *
 * Pass any native <video> attrs through. `controls` is opt-in: if you
 * don't pass it, the player has no native controls (suitable for the
 * Sales2DO Tutorial Video case where overlay buttons handle play/pause).
 *
 * If you do pass controls, the download item is stripped via
 * controlsList="nodownload".
 */
export function Vid({
  src, poster,
  preload: preloadProp,
  ...rest
}) {
  return (
    <video
      src={src}
      poster={poster}
      preload={preloadProp ?? "metadata"}
      playsInline
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      onContextMenu={noContextMenu}
      {...rest}
    />
  );
}
