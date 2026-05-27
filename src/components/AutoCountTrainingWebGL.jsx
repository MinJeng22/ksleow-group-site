import React, { useEffect, useRef, useState } from 'react';

const VIDEOS = [
  {
    id: 'ztmg4hvro6U',
    playlistId: 'PLuc8uVTiaUHO9pW9dW0vUgHDZOtzXuB2E',
    label: 'General Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'dA9fzUg6OYU',
    playlistId: 'PLuc8uVTiaUHMTeJC2qWOJHE7QIxBmDSTx',
    label: 'e-Invoice Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    id: 'vFu1AgUT5rg',
    playlistId: 'PLuc8uVTiaUHO_rwRqZJPDmE7lRhwx_MS0',
    label: 'SST Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="17" r="1"/><line x1="14" y1="13" x2="10" y2="17"/></svg>
  }
];

const getThumbnailUrl = (videoId) => `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
const CLOTH_REVEAL_DURATION_MS = 8000;

let threeModulePromise = null;

function loadThreeModule() {
  if (!threeModulePromise) {
    threeModulePromise = import('three');
  }
  return threeModulePromise;
}

function preloadImage(src) {
  if (typeof window === 'undefined') return;
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = src;
}

function preloadRevealAssets(videoId) {
  preloadImage(getThumbnailUrl(videoId));
  loadThreeModule().catch(() => {});
}

function createFallbackTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#20255a');
  gradient.addColorStop(1, '#0f1128');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e8c97a';
  ctx.beginPath();
  ctx.moveTo(570, 280);
  ctx.lineTo(570, 440);
  ctx.lineTo(710, 360);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.font = '700 44px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AutoCount Tutorial', canvas.width / 2, 510);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function UnfurlingClothReveal({ videoId, direction = 'open', onComplete }) {
  const mountRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    setCanvasReady(false);

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const timer = window.setTimeout(() => onCompleteRef.current?.(), CLOTH_REVEAL_DURATION_MS);
      return () => window.clearTimeout(timer);
    }

    let disposed = false;
    let frameId = 0;
    let finishTimer = 0;
    let finished = false;
    let renderer = null;
    let geometry = null;
    let material = null;
    const cleanup = [];

    (async () => {
      try {
        const THREE = await loadThreeModule();
        if (disposed) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 100);
        camera.position.set(0, 0, 4.25);

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        mount.appendChild(renderer.domElement);
        setCanvasReady(true);

        const clothWidth = 3.4;
        const clothHeight = clothWidth * 9 / 16;
        geometry = new THREE.PlaneGeometry(clothWidth, clothHeight, 72, 40);
        const basePositions = geometry.attributes.position.array.slice();
        material = new THREE.MeshStandardMaterial({
          map: createFallbackTexture(THREE),
          side: THREE.DoubleSide,
          roughness: 0.72,
          metalness: 0.02,
          transparent: true,
          opacity: 0.98,
        });
        const cloth = new THREE.Mesh(geometry, material);
        scene.add(cloth);

        const ambient = new THREE.AmbientLight(0xffffff, 1.9);
        const key = new THREE.DirectionalLight(0xffffff, 1.6);
        key.position.set(2.3, 2.2, 4);
        scene.add(ambient, key);

        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(
          getThumbnailUrl(videoId),
          (texture) => {
            if (disposed) {
              texture.dispose();
              return;
            }
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(renderer?.capabilities.getMaxAnisotropy() || 1, 8);
            texture.needsUpdate = true;
            material?.map?.dispose?.();
            material.map = texture;
            material.needsUpdate = true;
          },
          undefined,
          () => {}
        );

        const setSize = () => {
          if (!renderer) return;
          const rect = mount.getBoundingClientRect();
          const nextWidth = Math.max(1, rect.width);
          const nextHeight = Math.max(1, rect.height);
          renderer.setSize(nextWidth, nextHeight, false);
          camera.aspect = nextWidth / nextHeight;
          camera.updateProjectionMatrix();
        };
        setSize();
        window.addEventListener('resize', setSize, { passive: true });
        cleanup.push(() => window.removeEventListener('resize', setSize));

        const easeOutBack = (t) => {
          const c1 = 1.42;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        const easeInOut = (t) => t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const duration = CLOTH_REVEAL_DURATION_MS;
        const start = performance.now();

        const animate = (now) => {
          if (disposed || !geometry || !renderer || !material) return;

          const elapsed = now - start;
          const t = Math.min(elapsed / duration, 1);
          const motion = direction === 'close' ? 1 - easeInOut(t) : Math.min(Math.max(easeOutBack(t), 0), 1.035);
          const settle = direction === 'close' ? t : Math.max(0, (t - 0.72) / 0.28);
          const wave = direction === 'close'
            ? (0.15 + easeInOut(t) * 0.9)
            : (1 - easeInOut(t)) * (1 - settle * 0.55);
          const positions = geometry.attributes.position.array;

          for (let i = 0; i < positions.length; i += 3) {
            const x = basePositions[i];
            const y = basePositions[i + 1];
            const u = x / clothWidth + 0.5;
            const v = y / clothHeight + 0.5;
            const reveal = Math.min(1, Math.max(0, motion - u * 0.08));
            const widthScale = 0.24 + 0.76 * reveal;
            const heightScale = 0.34 + 0.66 * reveal;
            const edgeCurl = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
            const ripple = Math.sin((u * 3.8 + t * 2.1) * Math.PI) * Math.sin((v + 0.18) * Math.PI);

            positions[i] = x * widthScale + ripple * wave * 0.085;
            positions[i + 1] = y * heightScale + Math.sin((u * 1.6 + t) * Math.PI) * wave * 0.12;
            positions[i + 2] = edgeCurl * wave * 0.52 + ripple * wave * 0.16 - (1 - reveal) * 0.18;
          }

          geometry.attributes.position.needsUpdate = true;
          geometry.computeVertexNormals();

          cloth.rotation.x = -0.24 * wave;
          cloth.rotation.y = 0.12 * wave;
          cloth.rotation.z = -0.035 * wave;
          cloth.scale.setScalar(direction === 'close'
            ? 0.9 + 0.1 * (1 - easeInOut(t))
            : 0.9 + 0.1 * easeInOut(t));

          renderer.render(scene, camera);

          if (t < 1) {
            frameId = window.requestAnimationFrame(animate);
          } else if (!finished) {
            finished = true;
            finishTimer = window.setTimeout(() => onCompleteRef.current?.(), 120);
          }
        };
        frameId = window.requestAnimationFrame(animate);
      } catch {
        if (!disposed && !finished) {
          finished = true;
          finishTimer = window.setTimeout(() => onCompleteRef.current?.(), CLOTH_REVEAL_DURATION_MS);
        }
      }
    })();

    return () => {
      disposed = true;
      finished = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(finishTimer);
      cleanup.forEach((fn) => fn());
      if (renderer?.domElement?.parentNode === mount) mount.removeChild(renderer.domElement);
      geometry?.dispose();
      material?.map?.dispose?.();
      material?.dispose();
      renderer?.dispose();
    };
  }, [direction, videoId]);

  return (
    <div className="cloth-reveal-stage" data-direction={direction} ref={mountRef}>
      <img
        className="cloth-reveal-fallback-image"
        data-direction={direction}
        data-ready={canvasReady ? 'true' : 'false'}
        src={getThumbnailUrl(videoId)}
        alt=""
        aria-hidden="true"
        decoding="async"
        crossOrigin="anonymous"
      />
      <div className="cloth-reveal-label">
        {direction === 'close' ? 'Closing tutorial...' : 'Opening tutorial...'}
      </div>
    </div>
  );
}

export default function AutoCountTrainingWebGL() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0].id);
  const [showIframe, setShowIframe] = useState(false);
  const [clothMode, setClothMode] = useState(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const preload = () => preloadRevealAssets(activeVideo);
    const idleId = window.requestIdleCallback?.(preload, { timeout: 1800 });
    const timer = idleId ? 0 : window.setTimeout(preload, 900);

    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timer) window.clearTimeout(timer);
    };
  }, [activeVideo]);

  const handlePlay = () => {
    if (clothMode) return;
    preloadRevealAssets(activeVideo);
    setClothMode('open');
    setShowIframe(false);
    setTimeout(() => {
      if (videoRef.current) {
        const y = videoRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleClose = () => {
    if (clothMode) return;
    setShowIframe(false);
    setClothMode('close');
  };

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
        .training-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center; }
        @media (max-width: 760px) { .training-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
        @keyframes videoExpand {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes videoShrink {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(20px); }
        }
        @keyframes clothStageOpen {
          0% { opacity: 0; transform: perspective(900px) rotateX(10deg) rotateY(-7deg) scale(0.58); filter: saturate(0.82); }
          52% { opacity: 1; transform: perspective(900px) rotateX(-4deg) rotateY(3deg) scale(1.025); }
          100% { opacity: 1; transform: perspective(900px) rotateX(0) rotateY(0) scale(1); filter: saturate(1); }
        }
        @keyframes clothStageClose {
          0% { opacity: 1; transform: perspective(900px) rotateX(0) rotateY(0) scale(1); }
          52% { opacity: 0.95; transform: perspective(900px) rotateX(9deg) rotateY(-5deg) scale(0.72); }
          100% { opacity: 0.68; transform: perspective(900px) rotateX(18deg) rotateY(-11deg) scale(0.42); }
        }
        @keyframes clothFallbackOpen {
          0% { clip-path: polygon(38% 30%, 62% 28%, 66% 62%, 34% 64%); transform: perspective(900px) rotateX(18deg) rotateY(-11deg) scale(0.52); filter: blur(1px) saturate(0.82); }
          48% { clip-path: polygon(8% 16%, 94% 9%, 88% 84%, 12% 91%); transform: perspective(900px) rotateX(-5deg) rotateY(4deg) scale(1.02); filter: blur(0.2px) saturate(1); }
          100% { clip-path: inset(0 round 18px); transform: perspective(900px) rotateX(0) rotateY(0) scale(1); filter: none; }
        }
        @keyframes clothFallbackClose {
          0% { clip-path: inset(0 round 18px); transform: perspective(900px) rotateX(0) rotateY(0) scale(1); filter: none; }
          55% { clip-path: polygon(10% 14%, 90% 18%, 86% 82%, 14% 88%); transform: perspective(900px) rotateX(8deg) rotateY(-5deg) scale(0.8); filter: blur(0.2px); }
          100% { clip-path: polygon(38% 30%, 62% 28%, 66% 62%, 34% 64%); transform: perspective(900px) rotateX(19deg) rotateY(-12deg) scale(0.48); filter: blur(1px) saturate(0.82); }
        }
        .ipad-frame {
          aspect-ratio: 4/3;
          border-radius: 28px;
          background: #111;
          box-sizing: border-box;
          padding: 3.5%;
          box-shadow: 0 24px 60px rgba(15,17,40,0.2), inset 0 0 0 2px #2a2a2a, inset 0 0 12px rgba(0,0,0,1);
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: stretch;
          transition: transform 0.3s ease;
        }
        .ipad-frame:hover {
          transform: scale(1.02);
        }
        .cloth-reveal-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 18px;
          overflow: hidden;
          transform-origin: center;
          background:
            radial-gradient(circle at 50% 28%, rgba(232,201,122,0.15), transparent 34%),
            #0f1128;
          box-shadow: 0 20px 60px rgba(15,17,40,0.12);
        }
        .cloth-reveal-stage[data-direction="open"] {
          animation: clothStageOpen 8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .cloth-reveal-stage[data-direction="close"] {
          animation: clothStageClose 8s cubic-bezier(0.45, 0, 0.2, 1) both;
        }
        .cloth-reveal-fallback-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1;
          transform-origin: center;
          transition: opacity 0.18s ease;
          pointer-events: none;
        }
        .cloth-reveal-fallback-image[data-direction="open"] {
          animation: clothFallbackOpen 8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .cloth-reveal-fallback-image[data-direction="close"] {
          animation: clothFallbackClose 8s cubic-bezier(0.45, 0, 0.2, 1) both;
        }
        .cloth-reveal-fallback-image[data-ready="true"] {
          opacity: 0;
        }
        .cloth-reveal-stage canvas {
          position: relative;
          z-index: 1;
        }
        .cloth-reveal-label {
          position: absolute;
          z-index: 2;
          left: 50%;
          bottom: 1rem;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.72);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          pointer-events: none;
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
        }
      `}</style>
      <div className="content-wrap">
        {/* ── Header — always visible, always centred ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>

          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: '#2f315a', lineHeight: 1.2, margin: 0,
          }}>
            Learn AutoCount Accounting in Just 60 Minutes
          </h2>
        </div>

        {showIframe ? (
          /* ── Layout 2: Full-width video after clicking play ── */
          <div
            ref={videoRef}
            style={{
              width: '100%',
              animation: 'videoExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button 
                onClick={handleClose}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(47, 49, 90, 0.08)', color: '#2f315a', padding: '0.45rem 1.1rem',
                  borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(47, 49, 90, 0.15)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(47, 49, 90, 0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                Minimize
              </button>
            </div>
            
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#0f1128',
                boxShadow: '0 20px 60px rgba(15,17,40,0.12)',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1${VIDEOS.find(v => v.id === activeVideo)?.playlistId ? '&list=' + VIDEOS.find(v => v.id === activeVideo).playlistId : ''}`}
                title="AutoCount Training Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        ) : clothMode ? (
          <div
            ref={videoRef}
            style={{
              width: '100%',
              animation: clothMode === 'open'
                ? 'videoExpand 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                : 'none',
            }}
          >
            <UnfurlingClothReveal
              videoId={activeVideo}
              direction={clothMode}
              onComplete={() => {
                if (clothMode === 'open') {
                  setClothMode(null);
                  setShowIframe(true);
                  return;
                }

                setClothMode(null);
                if (sectionRef.current) {
                  const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 60;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
            />
          </div>
        ) : (
          /* ── Layout 1: Video thumbnail (left) + description (right) ── */
          <>
            <div className="training-grid">
              {/* iPad Frame Wrapper */}
              <div>
                <div
                  className="ipad-frame"
                onClick={handlePlay}
              >
                {/* iPad Screen */}
                <div style={{
                  flex: 1,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#0f1128',
                  position: 'relative',
                }}>
                  <img
                    src={getThumbnailUrl(activeVideo)}
                    alt="AutoCount Tutorial"
                    loading="lazy"
                    crossOrigin="anonymous"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center' }}>
                    <div style={{
                      width: 64, height: 64, background: '#e8c97a', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(232,201,122,0.4)',
                      paddingLeft: 4
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#2f315a">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Selector Buttons */}
              <div style={{
                marginTop: '1.25rem',
                background: '#2f315a',
                borderRadius: '20px',
                padding: '6px',
                display: 'flex',
                gap: '6px'
              }}>
                {VIDEOS.map(v => {
                  const isActive = activeVideo === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideo(v.id)}
                      style={{
                        flex: 1,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        padding: '12px 4px',
                        background: isActive ? '#f5f5f8' : 'transparent',
                        color: isActive ? '#1c1e36' : 'rgba(255,255,255,0.7)',
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
            </div>

              {/* Description text */}
              <div style={{ transform: 'translateY(-1rem)' }}>
                <p style={{
                  fontSize: '0.95rem', color: '#6b6f91', lineHeight: 1.8,
                  maxWidth: 480, marginBottom: '1.5rem', marginTop: 0,
                }}>
                  Skip the long manuals. AutoCount's 60-minute guide covers
                  everything you need to know to navigate AutoCount Accounting
                  with confidence — from basic setup to daily transactions.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handlePlay}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      background: '#2f315a', color: '#fff', padding: '0.75rem 1.75rem',
                      borderRadius: 50, fontSize: '0.88rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'background 0.2s, transform 0.2s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#3e4175'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#2f315a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Watch on Youtube
                  </button>
                  <span style={{ fontSize: '0.82rem', color: '#a8abcc', fontWeight: 500 }}>
                    Free · 60 minutes
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
