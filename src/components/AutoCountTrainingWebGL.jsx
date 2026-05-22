import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = 'ztmg4hvro6U';

/**
 * Lusion-style scroll-driven video reveal.
 * Uses pure CSS transforms + GSAP (no WebGL) for maximum compatibility.
 *
 * Flow:
 *  1. Initial: small 16:9 rounded video card on the left, text on the right.
 *  2. On scroll: text fades out, video card stretches with a 3D perspective warp.
 *  3. Final: video expands to near-fullscreen with negative space on sides.
 */
export default function AutoCountTrainingWebGL() {
  const sectionRef = useRef(null);
  const videoCardRef = useRef(null);
  const rightTextRef = useRef(null);



  useEffect(() => {
    const section = sectionRef.current;
    const videoCard = videoCardRef.current;
    const rightText = rightTextRef.current;
    if (!section || !videoCard || !rightText) return;



    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
      },
    });

    // ─── Phase 1 (0 → 0.4): Fade out text, begin video card growth ───
    tl.to(rightText, {
      opacity: 0,
      x: 60,
      duration: 0.35,
      ease: 'power1.in',
    }, 0);

    // Video card: grow from initial size to full viewport
    // Initial state is set via CSS; we animate to the final state.
    tl.to(videoCard, {
      width: '85vw',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      borderRadius: '20px',
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // 3D warp effect during the middle of the transition
    tl.fromTo(videoCard, {
      rotateY: 0,
      rotateX: 0,
    }, {
      rotateY: -12,
      rotateX: 3,
      duration: 0.5,
      ease: 'power2.in',
    }, 0);

    tl.to(videoCard, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.5);



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
          perspective: '1200px',
        }}
      >
        {/* ── Video Card (CSS-animated) ── */}
        <div
          ref={videoCardRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '12vw',
            transform: 'translateY(-50%)',
            width: '38vw',
            aspectRatio: '16/9',
            borderRadius: '18px',
            overflow: 'hidden',
            background: '#0f1128',
            boxShadow: '0 30px 80px rgba(15,17,40,0.25)',
            zIndex: 2,
            transformStyle: 'preserve-3d',
            willChange: 'transform, width, left, top, border-radius',
          }}
        >
          {/* YouTube embed — always loaded, plays inline */}
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
            title="Learn AutoCount Accounting in 60 Minutes"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>

        {/* ── Right Side Text ── */}
        <div
          ref={rightTextRef}
          style={{
            position: 'absolute',
            top: '50%',
            right: '5vw',
            width: '38vw',
            transform: 'translateY(-50%)',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '0.6rem',
            }}
          >
            Free Training
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
              fontWeight: 700,
              color: '#2f315a',
              lineHeight: 1.2,
              marginBottom: '0.9rem',
            }}
          >
            Learn AutoCount Accounting in Just 60 Minutes
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#6b6f91',
              lineHeight: 1.8,
              maxWidth: 480,
              marginBottom: '1.5rem',
            }}
          >
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#2f315a',
                color: '#ffffff',
                padding: '0.75rem 1.75rem',
                borderRadius: 50,
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#3d4075')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#2f315a')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Watch on YouTube
            </a>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: '#a8abcc',
                fontWeight: 500,
              }}
            >
              Free · 60 min
            </span>
          </div>
        </div>


      </section>
  );
}
