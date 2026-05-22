import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = 'ztmg4hvro6U';

export default function AutoCountTrainingWebGL() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const rightTextRef = useRef(null);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const rightText = rightTextRef.current;
    if (!section || !card || !rightText) return;

    // Scale factor: 85vw / 38vw ≈ 2.237
    const s = 85 / 38;
    // Translate: card center starts at 31vw, ends at 50vw → +19vw
    const tx = 19;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%',
        scrub: 2,
        pin: true,
        onUpdate: (self) => {
          if (self.progress > 0.9 && !showIframe) setShowIframe(true);
        },
      },
    });

    // Text fade — only transform + opacity (GPU only)
    tl.to(rightText, { opacity: 0, x: 40, duration: 0.3 }, 0);

    // Card scale + move — single tween, GPU only
    tl.to(card, {
      scale: s,
      x: `${tx}vw`,
      rotateY: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // 3D warp: peaks at 40%, then flattens
    tl.fromTo(card,
      { rotateY: 0 },
      { rotateY: -20, duration: 0.4, ease: 'power2.in' },
      0
    );
    tl.to(card, { rotateY: 0, duration: 0.6, ease: 'power2.out' }, 0.4);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#f8f9fc',
      }}
    >
      {/* Video Card */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '12vw',
          width: '38vw',
          aspectRatio: '16/9',
          borderRadius: '18px',
          overflow: 'hidden',
          background: '#0f1128',
          boxShadow: '0 20px 60px rgba(15,17,40,0.2)',
          zIndex: 2,
          transform: 'translateY(-50%)',
          willChange: 'transform',
        }}
      >
        {showIframe ? (
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
            title="Learn AutoCount Accounting in 60 Minutes"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <img
            src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/sddefault.jpg`}
            alt="AutoCount Tutorial"
            loading="eager"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      {/* Right Side Text */}
      <div
        ref={rightTextRef}
        style={{
          position: 'absolute',
          top: '50%',
          right: '5vw',
          width: '38vw',
          transform: 'translateY(-50%)',
          zIndex: 3,
        }}
      >
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.6rem',
        }}>
          Free Training
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontWeight: 700,
          color: '#2f315a', lineHeight: 1.2, marginBottom: '0.9rem',
        }}>
          Learn AutoCount Accounting in Just 60 Minutes
        </h2>
        <p style={{
          fontSize: '0.95rem', color: '#6b6f91', lineHeight: 1.8,
          maxWidth: 480, marginBottom: '1.5rem',
        }}>
          Skip the long manuals. AutoCount's 60-minute guide covers
          everything you need to know to navigate AutoCount Accounting
          with confidence — from basic setup to daily transactions.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={`https://youtu.be/${YOUTUBE_ID}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#2f315a', color: '#fff', padding: '0.75rem 1.75rem',
              borderRadius: 50, fontSize: '0.88rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Watch on YouTube
          </a>
          <span style={{ fontSize: '0.82rem', color: '#a8abcc', fontWeight: 500 }}>
            Free · 60 min
          </span>
        </div>
      </div>
    </section>
  );
}
