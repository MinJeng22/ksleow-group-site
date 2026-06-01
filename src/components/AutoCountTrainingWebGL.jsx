import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const VIDEOS = [
  {
    id: 'ztmg4hvro6U',
    playlistId: 'PLuc8uVTiaUHO9pW9dW0vUgHDZOtzXuB2E',
    label: 'General Tutorial',
    description: "Skip the long manuals. AutoCount's quick-start guide covers everything you need to know to navigate AutoCount Accounting with confidence - from basic setup to daily transactions.",
    note: 'Quick-Start Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'dA9fzUg6OYU',
    playlistId: 'PLuc8uVTiaUHMTeJC2qWOJHE7QIxBmDSTx',
    label: 'e-Invoice Tutorial',
    description: 'Learn the AutoCount e-Invoice workflow for Malaysia, including setup checks, transaction preparation, submission flow, and the daily steps your accounts team should understand before going live.',
    note: 'e-Invoice Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    id: 'vFu1AgUT5rg',
    playlistId: 'PLuc8uVTiaUHO_rwRqZJPDmE7lRhwx_MS0',
    label: 'SST Tutorial',
    description: 'Review the SST workflow in AutoCount Accounting, including tax setup, transaction entry, taxable document handling, and reporting basics for smoother compliance work.',
    note: 'SST Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="17" r="1"/><line x1="14" y1="13" x2="10" y2="17"/></svg>
  }
];

const MORPH_OPEN_MS = 1350;
const MORPH_CLOSE_MS = 1450;
const MORPH_SETTLE_MS = 180;
const APPLE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const TABLET_SHADOW = '0 24px 60px rgba(15,17,40,0.2), inset 0 0 0 2px #2a2a2a, inset 0 0 12px rgba(0,0,0,1)';
const VIDEO_SHADOW = '0 24px 64px rgba(15,17,40,0.14)';
const thumbnailDecodeCache = new Map();

const getThumbnailUrl = (videoId) => `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

function preloadImage(src) {
  if (typeof window === 'undefined') return Promise.resolve();
  if (thumbnailDecodeCache.has(src)) return thumbnailDecodeCache.get(src);

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.loading = 'eager';
  image.src = src;
  const decodePromise = (image.decode ? image.decode() : Promise.resolve())
    .catch(() => undefined);
  thumbnailDecodeCache.set(src, decodePromise);
  return decodePromise;
}

function warmMorphImage(videoId) {
  const decodePromise = preloadImage(getThumbnailUrl(videoId));
  const maxWait = new Promise(resolve => window.setTimeout(resolve, 90));
  return Promise.race([decodePromise, maxWait]);
}

function toPlainRect(rect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function getExpandedRect(contentWrap, stageNode) {
  const wrapRect = contentWrap?.getBoundingClientRect();
  const stageRect = stageNode?.getBoundingClientRect() || wrapRect;
  const width = Math.max(280, wrapRect?.width || window.innerWidth - 56);
  const height = width * 9 / 16;

  return {
    left: wrapRect?.left || 28,
    top: stageRect?.top || 120,
    width,
    height,
  };
}

function getCollapsedTabletRect(contentWrap, stageNode) {
  const wrapRect = contentWrap?.getBoundingClientRect();
  const stageRect = stageNode?.getBoundingClientRect() || wrapRect;
  if (!wrapRect || !stageRect) return null;

  const isMobile = window.innerWidth <= 760;
  if (isMobile) {
    return {
      left: wrapRect.left,
      top: stageRect.top,
      width: wrapRect.width,
      height: wrapRect.width * 9 / 16,
    };
  }

  const gridGap = 40;
  const width = (wrapRect.width - gridGap) / 2;
  return {
    left: wrapRect.left,
    top: stageRect.top,
    width,
    height: width * 3 / 4,
  };
}

function easeOutQuint(value) {
  return 1 - Math.pow(1 - value, 5);
}

function isDesktopTabletRect(rect) {
  if (!rect?.width || !rect?.height) return false;
  return Math.abs(rect.height / rect.width - 0.75) < 0.06;
}

function getTabletInset(rect) {
  return isDesktopTabletRect(rect) ? `${(rect.width * 0.035).toFixed(3)}px` : '0px';
}

function getTabletOuterRadius(rect) {
  return isDesktopTabletRect(rect) ? 28 : 12;
}

function getTabletScreenRadius(rect) {
  return isDesktopTabletRect(rect) ? 10 : 10;
}

function MorphingTutorialPreview({ direction, videoId, startRect, endRect, onComplete, isSettling, playIconColor = '#2f315a' }) {
  const [active, setActive] = useState(false);
  const completedRef = useRef(false);
  const duration = direction === 'open' ? MORPH_OPEN_MS : MORPH_CLOSE_MS;
  const startCenterX = startRect.left + startRect.width / 2;
  const startCenterY = startRect.top + startRect.height / 2;
  const endCenterX = endRect.left + endRect.width / 2;
  const endCenterY = endRect.top + endRect.height / 2;
  const initialTransform = `translate3d(${startCenterX - endCenterX}px, ${startCenterY - endCenterY}px, 0) scale(${startRect.width / endRect.width}, ${startRect.height / endRect.height})`;
  const borderRadius = direction === 'open'
    ? (active ? 18 : getTabletOuterRadius(startRect))
    : (active ? getTabletOuterRadius(endRect) : 18);
  const screenInset = direction === 'open'
    ? (active ? '0px' : getTabletInset(startRect))
    : (active ? getTabletInset(endRect) : '0px');
  const screenRadius = direction === 'open'
    ? (active ? 18 : getTabletScreenRadius(startRect))
    : (active ? getTabletScreenRadius(endRect) : 18);
  const shellTransform = direction === 'open'
    ? (active
      ? 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)'
      : `${initialTransform} perspective(1200px) rotateX(7deg) rotateY(-6deg)`)
    : (active
      ? 'translate3d(0, 0, 0) scale(1, 1)'
      : initialTransform);
  // opacity is always in transition-property (see CSS), duration is 0ms normally
  // and 200ms when settling via .is-settling class — this avoids instant-jump bug
  // caused by changing transitionProperty and opacity in the same React render.

  const finishMorph = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let rafOne = 0;
    let rafTwo = 0;
    completedRef.current = false;
    const timer = window.setTimeout(finishMorph, duration + (direction === 'close' ? 180 : 140));

    rafOne = window.requestAnimationFrame(() => {
      rafTwo = window.requestAnimationFrame(() => setActive(true));
    });

    return () => {
      window.cancelAnimationFrame(rafOne);
      window.cancelAnimationFrame(rafTwo);
      window.clearTimeout(timer);
    };
  }, [duration, direction, finishMorph]);

  // Portal shadow: same position/animation as the shell, but rendered in document.body
  // (NOT inside the overlay). This puts it in the same compositing layer as the real
  // video frame, enabling a clean cross-fade between portal shadow (fading out)
  // and real frame shadow (fading in). boxShadow is always VIDEO_SHADOW.
  const portalShadow = createPortal(
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: endRect.left,
        top: endRect.top,
        width: endRect.width,
        height: endRect.height,
        borderRadius: `${borderRadius}px`,
        transform: shellTransform,
        boxShadow: VIDEO_SHADOW,
        pointerEvents: 'none',
        zIndex: 9998,
        // opacity always has a transition — reliably fires when isSettling changes
        opacity: isSettling ? 0 : 1,
        transition: `border-radius ${duration}ms ${APPLE_EASE}, transform ${duration}ms ${APPLE_EASE}, opacity 200ms ease`,
      }}
    />,
    document.body
  );

  return (
    <>
      {portalShadow}
      <div
        className="tutorial-morph-overlay"
        aria-hidden="true"
      >
        <div
          className={`tutorial-morph-shell${isSettling ? ' is-settling' : ''}`}
          data-direction={direction}
          data-active={active ? 'true' : 'false'}
          style={{
            left: `${endRect.left}px`,
            top: `${endRect.top}px`,
            width: `${endRect.width}px`,
            height: `${endRect.height}px`,
            borderRadius: `${borderRadius}px`,
            transform: shellTransform,
            '--morph-duration': `${duration}ms`,
            '--morph-ease': APPLE_EASE,
            boxShadow: 'none',
            opacity: isSettling ? 0 : 1,
          }}
          onTransitionEnd={event => {
            if (event.currentTarget !== event.target) return;
            if (isSettling && event.propertyName === 'opacity') { onComplete(); return; }
            if (!isSettling && event.propertyName === 'transform' && active) finishMorph();
          }}
        >
          <div
            className="tutorial-morph-screen"
            style={{
              inset: screenInset,
              borderRadius: `${screenRadius}px`,
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: APPLE_EASE,
            }}
          >
            <img
              className="tutorial-morph-image"
              src={getThumbnailUrl(videoId)}
              alt=""
              decoding="async"
              loading="eager"
              fetchPriority="high"
              crossOrigin="anonymous"
            />
            <div className="tutorial-morph-dim" />
            <div className="tutorial-morph-play tutorial-play-button">
              <svg className="tutorial-play-icon" width="24" height="24" viewBox="0 0 24 24" fill={playIconColor} aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AutoCountTrainingWebGL({ customVideos, themeColor = '#80c31e', themeHoverColor = '#8bc34a', activeTabBg = '#2f315a', playIconColor = '#2f315a', playBtnBg = '#e8c97a' }) {
  const videos = customVideos || VIDEOS;
  const [activeVideo, setActiveVideo] = useState(videos[0].id);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [iframeMounted, setIframeMounted] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [stageHeight, setStageHeight] = useState(null);
  const [stageTransitionMs, setStageTransitionMs] = useState(MORPH_OPEN_MS);
  const [morph, setMorph] = useState(null);
  const [morphSettling, setMorphSettling] = useState(false);
  const [stageConcealed, setStageConcealed] = useState(false);
  const [shadowIn, setShadowIn] = useState(false);
  const tabletRef = useRef(null);
  const openTargetRef = useRef(null);
  const collapseTargetRef = useRef(null);
  const videoRef = useRef(null);
  const videoFrameRef = useRef(null);
  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const contentWrapRef = useRef(null);
  const iframeReadyTimerRef = useRef(null);
  const stageHeightTimerRef = useRef(null);
  const stageHeightRafRef = useRef(0);
  const scrollFollowRafRef = useRef(0);
  const morphSettleTimerRef = useRef(null);
  const morphPaintRafRef = useRef(0);
  const lastClosedStageHeightRef = useRef(null);
  const preparingMorphRef = useRef(false);

  useEffect(() => {
    videos.forEach(video => {
      preloadImage(getThumbnailUrl(video.id));
    });
  }, []);

  useEffect(() => {
    preloadImage(getThumbnailUrl(activeVideo));
  }, [activeVideo]);

  useEffect(() => () => {
    window.clearTimeout(iframeReadyTimerRef.current);
    window.clearTimeout(stageHeightTimerRef.current);
    window.clearTimeout(morphSettleTimerRef.current);
    window.cancelAnimationFrame(stageHeightRafRef.current);
    window.cancelAnimationFrame(scrollFollowRafRef.current);
    window.cancelAnimationFrame(morphPaintRafRef.current);
  }, []);

  useEffect(() => {
    if (!morph) return undefined;

    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;
    const previousBody = {
      touchAction: bodyStyle.touchAction,
      overscrollBehavior: bodyStyle.overscrollBehavior,
    };
    const previousHtml = {
      overscrollBehavior: htmlStyle.overscrollBehavior,
      scrollbarGutter: htmlStyle.scrollbarGutter,
    };
    const stopScroll = event => event.preventDefault();
    const stopScrollKeys = event => {
      const blockedKeys = new Set([
        'ArrowDown',
        'ArrowUp',
        'PageDown',
        'PageUp',
        'Home',
        'End',
        ' ',
      ]);
      if (blockedKeys.has(event.key)) event.preventDefault();
    };

    bodyStyle.touchAction = 'none';
    bodyStyle.overscrollBehavior = 'none';
    htmlStyle.overscrollBehavior = 'none';
    htmlStyle.scrollbarGutter = 'stable';

    window.addEventListener('wheel', stopScroll, { passive: false });
    window.addEventListener('touchmove', stopScroll, { passive: false });
    window.addEventListener('keydown', stopScrollKeys, { passive: false });

    return () => {
      bodyStyle.touchAction = previousBody.touchAction;
      bodyStyle.overscrollBehavior = previousBody.overscrollBehavior;
      htmlStyle.overscrollBehavior = previousHtml.overscrollBehavior;
      htmlStyle.scrollbarGutter = previousHtml.scrollbarGutter;
      window.removeEventListener('wheel', stopScroll);
      window.removeEventListener('touchmove', stopScroll);
      window.removeEventListener('keydown', stopScrollKeys);
    };
  }, [morph]);

  useEffect(() => {
    if (!iframeMounted) return undefined;

    const fallbackTimer = window.setTimeout(() => {
      setIframeReady(true);
    }, 3400);

    return () => window.clearTimeout(fallbackTimer);
  }, [iframeMounted, activeVideo]);

  const releaseStageHeight = (delay = 260) => {
    window.clearTimeout(stageHeightTimerRef.current);
    stageHeightTimerRef.current = window.setTimeout(() => {
      setStageHeight(null);
    }, delay);
  };

  const animateStageHeight = (fromHeight, toHeight, duration) => {
    window.clearTimeout(stageHeightTimerRef.current);
    window.cancelAnimationFrame(stageHeightRafRef.current);
    setStageTransitionMs(duration);
    setStageHeight(Math.max(1, Math.round(fromHeight)));
    stageHeightRafRef.current = window.requestAnimationFrame(() => {
      stageHeightRafRef.current = window.requestAnimationFrame(() => {
        setStageHeight(Math.max(1, Math.round(toHeight)));
      });
    });
  };

  const getOpeningScrollPlan = (startHeight, endHeight, endRect) => {
    const heightDelta = Math.max(0, endHeight - startHeight);
    const viewportTarget = Math.max(
      window.scrollY,
      window.scrollY + endRect.top + endRect.height - window.innerHeight + 84
    );
    const targetScrollY = Math.max(
      window.scrollY,
      Math.min(window.scrollY + heightDelta, viewportTarget)
    );
    const startScrollY = window.scrollY;
    const scrollDelta = targetScrollY - startScrollY;

    return { startScrollY, scrollDelta };
  };

  const followOpeningScroll = ({ startScrollY, scrollDelta }) => {
    window.cancelAnimationFrame(scrollFollowRafRef.current);

    if (scrollDelta <= 1) return;

    const startTime = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - startTime) / MORPH_OPEN_MS);
      window.scrollTo(0, startScrollY + scrollDelta * easeOutQuint(progress));
      if (progress < 1) {
        scrollFollowRafRef.current = window.requestAnimationFrame(tick);
      }
    };

    scrollFollowRafRef.current = window.requestAnimationFrame(tick);
  };

  const completeMorph = () => {
    const currentMorph = morph;
    if (!currentMorph) return;

    window.cancelAnimationFrame(scrollFollowRafRef.current);
    window.clearTimeout(morphSettleTimerRef.current);
    window.cancelAnimationFrame(morphPaintRafRef.current);

    if (currentMorph.direction === 'open') {
      setPlayerOpen(true);
      setIframeMounted(true);
      setIframeReady(false);
      setStageConcealed(false);
      setStageHeight(null);
      // NOTE: setShadowIn(true) is intentionally DELAYED to the 2-RAF callback below.
      // If called here (same render as setPlayerOpen), the element is newly created with
      // shadow-in already applied — the browser has no "before" state, so the CSS
      // box-shadow transition never fires and the shadow pops in instantly at full opacity,
      // causing a double-shadow flash with the portal shadow.
      morphPaintRafRef.current = window.requestAnimationFrame(() => {
        morphPaintRafRef.current = window.requestAnimationFrame(() => {
          // Now the real frame is in the DOM. Add shadow-in here so the transition fires.
          // Simultaneously start the portal fade-out. Both are 200ms → cross-fade is 1x constant.
          setShadowIn(true);
          setMorphSettling(true);
          morphSettleTimerRef.current = window.setTimeout(() => {
            setMorph(null);
            setMorphSettling(false);
          }, 250);
        });
      });
      return;
    }

    setPlayerOpen(false);
    setShadowIn(false);
    setIframeMounted(false);
    setIframeReady(false);
    setStageConcealed(false);
    morphPaintRafRef.current = window.requestAnimationFrame(() => {
      morphPaintRafRef.current = window.requestAnimationFrame(() => {
        setMorph(null);
        setMorphSettling(false);
        releaseStageHeight(0);
      });
    });
  };

  const handlePlay = async () => {
    if (morph || preparingMorphRef.current) return;
    preparingMorphRef.current = true;

    if (window.innerWidth <= 900) {
      setPlayerOpen(true);
      setIframeMounted(true);
      preparingMorphRef.current = false;
      setTimeout(() => {
        if (stageRef.current) {
          stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    const tabletRect = tabletRef.current?.getBoundingClientRect();
    if (!tabletRect) {
      setPlayerOpen(true);
      setIframeMounted(true);
      preparingMorphRef.current = false;
      return;
    }

    const startRect = toPlainRect(tabletRect);
    const openTargetRect = openTargetRef.current?.getBoundingClientRect();
    const endRect = openTargetRect
      ? toPlainRect(openTargetRect)
      : getExpandedRect(contentWrapRef.current, stageRef.current);
    const currentStageHeight = stageRef.current?.getBoundingClientRect().height || startRect.height;
    const nextStageHeight = endRect.height;
    const openingScrollPlan = getOpeningScrollPlan(currentStageHeight, nextStageHeight, endRect);
    const morphEndRect = {
      ...endRect,
      top: endRect.top - openingScrollPlan.scrollDelta,
    };
    lastClosedStageHeightRef.current = currentStageHeight;
    await warmMorphImage(activeVideo);
    window.clearTimeout(iframeReadyTimerRef.current);
    animateStageHeight(currentStageHeight, nextStageHeight, MORPH_OPEN_MS);
    followOpeningScroll(openingScrollPlan);
    setStageConcealed(true);
    setIframeMounted(false);
    setIframeReady(false);
    setPlayerOpen(false);
    setMorph({ direction: 'open', videoId: activeVideo, startRect, endRect: morphEndRect });
    preparingMorphRef.current = false;
  };

  const handleClose = async () => {
    if (morph || preparingMorphRef.current) return;
    preparingMorphRef.current = true;

    if (window.innerWidth <= 900) {
      setPlayerOpen(false);
      setIframeMounted(false);
      setIframeReady(false);
      preparingMorphRef.current = false;
      return;
    }

    const startSource = videoFrameRef.current || videoRef.current;
    const startDomRect = startSource?.getBoundingClientRect();
    if (!startDomRect) {
      setPlayerOpen(false);
      setIframeMounted(false);
      setIframeReady(false);
      preparingMorphRef.current = false;
      return;
    }

    const startRect = toPlainRect(startDomRect);
    const fallbackWidth = Math.min(startRect.width * 0.44, 560);
    const collapseTargetRect = collapseTargetRef.current?.getBoundingClientRect();
    const endRect = collapseTargetRect
      ? toPlainRect(collapseTargetRect)
      : getCollapsedTabletRect(contentWrapRef.current, stageRef.current) || {
      left: startRect.left + startRect.width / 2 - fallbackWidth / 2,
      top: startRect.top + startRect.height / 2 - fallbackWidth * 3 / 8,
      width: fallbackWidth,
      height: fallbackWidth * 3 / 4,
    };
    const currentStageHeight = stageRef.current?.getBoundingClientRect().height || startRect.height;
    const nextStageHeight = lastClosedStageHeightRef.current || currentStageHeight;

    window.clearTimeout(iframeReadyTimerRef.current);
    await warmMorphImage(activeVideo);
    setMorph({ direction: 'close', videoId: activeVideo, startRect, endRect });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        animateStageHeight(currentStageHeight, nextStageHeight, MORPH_CLOSE_MS);
        setStageConcealed(true);
        setIframeMounted(false);
        setIframeReady(false);
        setPlayerOpen(false);
        preparingMorphRef.current = false;
      });
    });
  };

  const handleIframeLoad = () => {
    window.clearTimeout(iframeReadyTimerRef.current);
    iframeReadyTimerRef.current = window.setTimeout(() => {
      setIframeReady(true);
    }, 950);
  };

  const activeVideoMeta = videos.find(video => video.id === activeVideo) || videos[0];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        background: 'transparent',
        padding: 'var(--section-py) 0',
      }}
    >
      <style>{`
        .tutorial-play-button { --play-btn-bg: ${playBtnBg}; background: var(--play-btn-bg); }
        .training-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
        @media (max-width: 760px) { .training-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
        .tutorial-stage {
          position: relative;
          width: 100%;
        }
        .tutorial-stage-content {
          position: relative;
          z-index: 1;
        }
        .tutorial-stage.is-morphing .tutorial-stage-content {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        .tutorial-stage.is-morphing.is-closing .tutorial-stage-content {
          opacity: 1;
          visibility: visible;
          pointer-events: none;
        }
        .tutorial-measure-target {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          visibility: hidden;
          pointer-events: none;
          opacity: 0;
          z-index: -1;
        }
        .tutorial-measure-target .training-grid {
          width: 100%;
        }
        .tutorial-player-shell {
          position: relative;
          width: 100%;
          opacity: 1;
        }
        .tutorial-video-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 18px;
          overflow: hidden;
          background: #0f1128;
          box-shadow: 0 24px 64px rgba(15,17,40,0);
          transition: box-shadow 200ms ease;
          transform: translateZ(0);
        }
        .tutorial-video-frame.shadow-in {
          box-shadow: ${VIDEO_SHADOW};
        }
        .tutorial-video-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0;
          transition: opacity 820ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tutorial-video-frame.is-ready iframe {
          opacity: 1;
        }
        .tutorial-video-cover {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: #0f1128;
          opacity: 1;
          transition: opacity 860ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .tutorial-video-cover.is-hidden {
          opacity: 0;
        }
        .tutorial-video-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tutorial-video-cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.12);
        }
        .tutorial-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.9);
          color: #2f315a;
          padding: 0.48rem 1.05rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid rgba(47,49,90,0.08);
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 12px 28px rgba(15,17,40,0.12);
          transition: background 0.2s, transform 0.2s;
        }
        .tutorial-close-btn svg,
        .tutorial-tab-icon,
        .tutorial-play-icon {
          display: block;
          flex: 0 0 auto;
          overflow: visible;
        }
        .tutorial-play-button {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          padding-left: 4px;
          border-radius: 50%;
          background: var(--play-btn-bg, #e8c97a);
          box-shadow: 0 8px 24px rgba(232,201,122,0.4);
          box-sizing: border-box;
          line-height: 0;
        }
        .tutorial-close-btn:hover {
          background: #ffffff;
          transform: translateY(-1px);
        }
        .tutorial-copy-panel {
          align-self: stretch;
          display: flex;
          flex-direction: column;
        }
        .tutorial-stage.is-morphing.is-closing .tutorial-selector,
        .tutorial-stage.is-morphing.is-closing .tutorial-description,
        .tutorial-stage.is-morphing.is-closing .tutorial-actions {
          opacity: 0;
          transform: translate3d(0, 18px, 0) scale(0.985);
          animation: tutorial-copy-return 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        .tutorial-stage.is-morphing.is-closing .tutorial-selector {
          animation-delay: 100ms;
        }
        .tutorial-stage.is-morphing.is-closing .tutorial-description {
          animation-delay: 180ms;
        }
        .tutorial-stage.is-morphing.is-closing .tutorial-actions {
          animation-delay: 260ms;
        }
        @keyframes tutorial-copy-return {
          0% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.985);
          }
          72% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .tutorial-tablet-screen {
          flex: 1;
          border-radius: 10px;
          overflow: hidden;
          background: #0f1128;
          position: relative;
        }
        .tutorial-tablet-dim {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: grid;
          place-items: center;
        }
        .ipad-frame {
          aspect-ratio: 4/3;
          border-radius: 28px;
          background: #111;
          box-sizing: border-box;
          padding: 3.5%;
          box-shadow: ${TABLET_SHADOW};
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: stretch;
          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ipad-frame:hover {
          transform: scale(1.018);
        }
        .tutorial-morph-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: auto;
          contain: layout style paint;
          isolation: isolate;
          touch-action: none;
          overscroll-behavior: none;
        }
        .tutorial-morph-shell {
          position: fixed;
          overflow: hidden;
          background: #0f1128;
          transform-origin: center;
          backface-visibility: hidden;
          contain: layout paint style;
          will-change: border-radius, transform, opacity;
          /* opacity is always listed so the browser knows to animate it;
             during the main animation its duration is 0ms (instant);
             .is-settling switches it to 200ms for the handoff fade */
          transition-property: border-radius, transform, opacity;
          transition-duration: var(--morph-duration), var(--morph-duration), 0ms;
          transition-timing-function: var(--morph-ease), var(--morph-ease), ease;
        }
        .tutorial-morph-shell.is-settling {
          transition-duration: 0ms, 0ms, 200ms;
          transition-timing-function: linear, linear, ease;
        }
        .tutorial-morph-shell::before {
          content: "";
          position: absolute;
          inset: -30%;
          z-index: 3;
          background:
            linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.2) 42%, transparent 58%),
            radial-gradient(circle at 28% 18%, rgba(255,255,255,0.2), transparent 24%);
          opacity: 0.55;
          transform: translateX(-30%) rotate(2deg);
          transition: opacity 360ms ease;
          pointer-events: none;
        }
        .tutorial-morph-shell[data-direction="close"]::before {
          opacity: 0;
        }
        .tutorial-morph-shell[data-active="true"]::before {
          opacity: 0;
          transform: translateX(26%) rotate(2deg);
        }
        .tutorial-morph-screen {
          position: absolute;
          overflow: hidden;
          background: #0f1128;
          box-shadow: none;
          contain: paint;
          will-change: inset, border-radius;
          transition-property: inset, border-radius;
        }
        .tutorial-morph-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translateZ(0) scale(1.025);
          backface-visibility: hidden;
          will-change: transform;
          transition: transform var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tutorial-morph-shell[data-active="true"] .tutorial-morph-image {
          transform: translateZ(0) scale(1);
        }
        .tutorial-morph-dim {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          opacity: 1;
          transition: opacity var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tutorial-morph-shell[data-direction="close"] .tutorial-morph-dim,
        .tutorial-morph-shell[data-direction="open"][data-active="true"] .tutorial-morph-dim {
          opacity: 0.4;
        }
        .tutorial-morph-shell[data-direction="close"][data-active="true"] .tutorial-morph-dim {
          opacity: 1;
        }
        .tutorial-morph-play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          transition: transform var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease;
        }
        .tutorial-morph-shell[data-direction="close"] .tutorial-morph-play,
        .tutorial-morph-shell[data-direction="open"][data-active="true"] .tutorial-morph-play {
          transform: translate(-50%, -50%) scale(0.74);
          opacity: 0;
        }
        .tutorial-morph-shell[data-direction="close"][data-active="true"] .tutorial-morph-play {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        @media (max-width: 760px) {
          .ipad-frame {
            aspect-ratio: 16/9;
            padding: 0;
            background: transparent;
            box-shadow: 0 10px 30px rgba(15,17,40,0.1);
            border-radius: 12px;
          }
          .ipad-frame:hover { transform: none; }
          .tutorial-morph-play {
            width: 54px;
            height: 54px;
          }
          .tutorial-play-button {
            width: 54px;
            height: 54px;
          }
        }
      `}</style>
      <div className="content-wrap" ref={contentWrapRef}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: '#2f315a', lineHeight: 1.2, margin: 0,
          }}>
            AutoCount Accounting Quick-Start Guide
          </h2>
        </div>

        <div
          ref={stageRef}
          className={`tutorial-stage${stageConcealed ? ' is-morphing' : ''}${morph?.direction === 'close' ? ' is-closing' : ''}`}
          style={{
            height: stageHeight != null ? `${stageHeight}px` : undefined,
            overflow: (stageHeight != null && stageConcealed) ? 'hidden' : undefined,
            transition: stageHeight != null
              ? `height ${stageTransitionMs}ms ${APPLE_EASE}`
              : undefined,
          }}
        >
          <div className="tutorial-measure-target" aria-hidden="true">
            <div ref={openTargetRef} className="tutorial-video-frame" />
          </div>
          <div className="tutorial-measure-target" aria-hidden="true">
            <div className="training-grid">
              <div>
                <div ref={collapseTargetRef} className="ipad-frame">
                  <div className="tutorial-tablet-screen" />
                </div>
              </div>
              <div />
            </div>
          </div>
          <div className="tutorial-stage-content">
            {playerOpen ? (
              <div ref={videoRef} className="tutorial-player-shell">
                <div
                  ref={videoFrameRef}
                  className={`tutorial-video-frame${iframeReady ? ' is-ready' : ''}${shadowIn ? ' shadow-in' : ''}`}
                >
                  <button
                    className="tutorial-close-btn"
                    type="button"
                    onClick={handleClose}
                    disabled={Boolean(morph)}
                  >
                    <svg className="tutorial-close-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" y1="10" x2="21" y2="3" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    Minimize
                  </button>

                {iframeMounted && (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1${activeVideoMeta.playlistId ? '&list=' + activeVideoMeta.playlistId : ''}`}
                    title="AutoCount Training Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />
                )}

                  <div className={`tutorial-video-cover${iframeReady ? ' is-hidden' : ''}`}>
                    <img
                      src={getThumbnailUrl(activeVideo)}
                      alt=""
                      decoding="async"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="training-grid">
              <div>
                <div
                  ref={tabletRef}
                  className="ipad-frame"
                  onClick={handlePlay}
                  style={{
                    opacity: morph ? 0 : 1,
                    pointerEvents: morph ? 'none' : 'auto',
                  }}
                >
                  <div className="tutorial-tablet-screen">
                    <img
                      src={getThumbnailUrl(activeVideo)}
                      alt="AutoCount Tutorial"
                      loading="lazy"
                      crossOrigin="anonymous"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div className="tutorial-tablet-dim">
                      <div className="tutorial-play-button">
                        <svg className="tutorial-play-icon" width="24" height="24" viewBox="0 0 24 24" fill={playIconColor} aria-hidden="true">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="tutorial-copy-panel">
                <div className="tutorial-selector" style={{ display: videos.length <= 1 ? 'none' : 'flex' }} style={{
                  margin: '0 0 1.35rem',
                  width: '100%',
                  maxWidth: 480,
                  background: '#f2f2f7',
                  borderRadius: '20px',
                  padding: '6px',
                  display: 'flex',
                  gap: '6px'
                }}>
                  {videos.map(v => {
                    const isActive = activeVideo === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setActiveVideo(v.id)}
                        style={{
                          flex: 1,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                          padding: '12px 4px',
                          background: isActive ? activeTabBg : 'transparent',
                          color: isActive ? '#ffffff' : '#86868b',
                          border: 'none', borderRadius: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {v.icon}
                        <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 700 : 500, textAlign: 'center', lineHeight: 1.1 }}>
                          {v.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '2.5rem' }}>
                  <p className="tutorial-description" style={{
                    fontSize: '0.95rem', color: '#6b6f91', lineHeight: 1.8,
                    maxWidth: 480, marginBottom: '2.5rem', marginTop: 0,
                  }}>
                    {activeVideoMeta.description}
                  </p>
                  <div className="tutorial-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', maxWidth: 480 }}>
                    <button
                      onClick={handlePlay}
                      disabled={Boolean(morph)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: themeColor, color: '#fff', padding: '0.75rem 1.75rem',
                        borderRadius: 50, fontSize: '0.88rem', fontWeight: 600,
                        border: 'none', cursor: morph ? 'default' : 'pointer',
                        transition: 'transform 0.15s, background 0.15s'
                      }}
                      onMouseOver={e => { if (!morph) e.currentTarget.style.background = themeHoverColor; }}
                      onMouseOut={e => { if (!morph) e.currentTarget.style.background = themeColor; }}
                    >
                      <svg className="tutorial-play-icon" width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Watch on Youtube
                    </button>

                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {morph && (
        <MorphingTutorialPreview
          key={`${morph.direction}-${morph.videoId}`}
          direction={morph.direction}
          videoId={morph.videoId}
          startRect={morph.startRect}
          endRect={morph.endRect}
          onComplete={completeMorph}
          isSettling={morphSettling}
        />
      )}
    </section>
  );
}
