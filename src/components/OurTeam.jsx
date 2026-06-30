import { useEffect, useRef } from "react";
import DepthDisplacementWebGL from "./DepthDisplacementWebGL";

const teamTiles = [
  {
    label: "Tax & Accounting",
    image: "/images/services/ksLeow-group.webp",
    className: "team-tile team-tile--wide",
  },
  {
    label: "Software & Support",
    image: "/images/services/webinar.webp",
    className: "team-tile team-tile--small team-tile--lift",
  },
  {
    label: "Company Advisory",
    image: "/images/services/taxation-bg.webp",
    className: "team-tile team-tile--small",
  },
  {
    label: "Secretarial",
    image: "/images/services/secretarial-bg.webp",
    className: "team-tile team-tile--medium",
  },
  {
    label: "Audit & Compliance",
    image: "/images/services/auditing-bg.webp",
    className: "team-tile team-tile--medium team-tile--drop",
  },
  {
    label: "Training",
    image: "/images/services/software-training-bg.webp",
    className: "team-tile team-tile--wide team-tile--short",
  },
];

const leadDepthDefault = {
  bgX: 0,
  bgY: 0,
  bgBlur: 0,
  personX: 0,
  personY: 0,
  shadowX: 0,
  shadowY: 0,
  tiltX: 0,
  tiltY: 0,
  lightX: 50,
  lightY: 36,
  lightOpacity: 0.54,
  active: 0,
};

export default function OurTeam() {
  const leadCardRef = useRef(null);
  const leadFrameRef = useRef(null);
  const leadCurrentRef = useRef({ ...leadDepthDefault });
  const leadTargetRef = useRef({ ...leadDepthDefault });
  const webGLRef = useRef(null);

  const writeLeadDepth = (values) => {
    const card = leadCardRef.current;
    
    if (webGLRef.current) {
      webGLRef.current.updateMouse(values.tiltY / 1.35, values.tiltX / -1.15, values.active);
    }

    if (!card) return;
    card.style.setProperty("--team-bg-x", `${values.bgX.toFixed(2)}px`);
    card.style.setProperty("--team-bg-y", `${values.bgY.toFixed(2)}px`);
    card.style.setProperty("--team-bg-blur", `${values.bgBlur.toFixed(2)}px`);
    card.style.setProperty("--team-person-x", `${values.personX.toFixed(2)}px`);
    card.style.setProperty("--team-person-y", `${values.personY.toFixed(2)}px`);
    card.style.setProperty("--team-shadow-x", `${values.shadowX.toFixed(2)}px`);
    card.style.setProperty("--team-shadow-y", `${values.shadowY.toFixed(2)}px`);
    card.style.setProperty("--team-tilt-x", `${values.tiltX.toFixed(3)}deg`);
    card.style.setProperty("--team-tilt-y", `${values.tiltY.toFixed(3)}deg`);
    card.style.setProperty("--team-light-x", `${values.lightX.toFixed(2)}%`);
    card.style.setProperty("--team-light-y", `${values.lightY.toFixed(2)}%`);
    card.style.setProperty("--team-light-opacity", values.lightOpacity.toFixed(3));
    card.style.setProperty("--team-depth-active", values.active.toFixed(3));
  };

  const animateLeadDepth = () => {
    const current = leadCurrentRef.current;
    const target = leadTargetRef.current;
    const next = {};
    let shouldContinue = false;

    Object.keys(leadDepthDefault).forEach((key) => {
      const ease = key === "active" || key === "bgBlur" || key === "lightOpacity" ? 0.12 : 0.09;
      const value = current[key] + (target[key] - current[key]) * ease;
      next[key] = Math.abs(target[key] - value) < 0.01 ? target[key] : value;
      if (Math.abs(target[key] - next[key]) >= 0.01) shouldContinue = true;
    });

    leadCurrentRef.current = next;
    writeLeadDepth(next);

    if (shouldContinue) {
      leadFrameRef.current = requestAnimationFrame(animateLeadDepth);
    } else {
      leadFrameRef.current = null;
    }
  };

  const setLeadDepthTarget = (target) => {
    leadTargetRef.current = { ...leadDepthDefault, ...target };
    if (leadFrameRef.current === null) {
      leadFrameRef.current = requestAnimationFrame(animateLeadDepth);
    }
  };

  useEffect(() => {
    return () => {
      if (leadFrameRef.current !== null) cancelAnimationFrame(leadFrameRef.current);
    };
  }, []);

  const handleLeadMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    setLeadDepthTarget({
      bgX: x * -5,
      bgY: y * -3.5,
      bgBlur: 0.55,
      personX: x * 7.5,
      personY: y * 2.8,
      shadowX: x * 3.5,
      shadowY: y * 1.2,
      tiltX: y * -1.15,
      tiltY: x * 1.35,
      lightX: 50 + x * 5,
      lightY: 34 + y * 4,
      lightOpacity: 0.68,
      active: 1,
    });
  };

  const resetLeadDepth = () => {
    setLeadDepthTarget(leadDepthDefault);
  };

  return (
    <section className="our-team-section" id="our-team" aria-labelledby="our-team-title">
      <style>{`
        .our-team-section {
          background:
            radial-gradient(circle at 17% 18%, rgba(201,168,76,0.18), transparent 32%),
            radial-gradient(circle at 82% 22%, rgba(201,168,76,0.12), transparent 34%),
            linear-gradient(180deg, #fbf5e8 0%, #fffaf0 48%, #fbf5e8 100%);
          overflow: hidden;
          padding: clamp(2.75rem, 4vw, 4.5rem) 0;
          position: relative;
        }
        .our-team-section::before,
        .our-team-section::after {
          background: rgba(201,168,76,0.12);
          border-radius: 999px;
          content: "";
          filter: blur(18px);
          height: 120px;
          position: absolute;
          width: 120px;
          z-index: 0;
        }
        .our-team-section::before {
          left: max(1.5rem, 8vw);
          top: 9%;
        }
        .our-team-section::after {
          bottom: 12%;
          right: max(1.5rem, 10vw);
        }
        .our-team-wrap {
          align-items: stretch;
          display: grid;
          gap: clamp(1.35rem, 3vw, 3.25rem);
          grid-template-columns: minmax(0, 65fr) minmax(300px, 35fr);
          position: relative;
          z-index: 1;
        }
        .team-gallery-panel {
          min-width: 0;
          padding: clamp(0.35rem, 1vw, 0.85rem) 0;
        }
        .team-lead {
          align-self: stretch;
          justify-self: end;
          perspective: 1500px;
          position: relative;
          width: 100%;
        }
        .team-lead-card {
          --team-bg-x: 0px;
          --team-bg-y: 0px;
          --team-bg-blur: 0px;
          --team-depth-active: 0;
          --team-light-opacity: 0.54;
          --team-light-x: 50%;
          --team-light-y: 36%;
          --team-person-x: 0px;
          --team-person-y: 0px;
          --team-shadow-x: 0px;
          --team-shadow-y: 0px;
          --team-tilt-x: 0deg;
          --team-tilt-y: 0deg;
          background: #142b3b;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 28px;
          box-shadow:
            0 30px 70px rgba(23,25,54,0.18),
            inset 0 1px 0 rgba(255,255,255,0.16);
          height: 100%;
          isolation: isolate;
          overflow: hidden;
          position: relative;
          transform: rotateX(var(--team-tilt-x)) rotateY(var(--team-tilt-y)) translateZ(0);
          transform-origin: center;
          transform-style: preserve-3d;
          min-height: clamp(520px, 46vw, 690px);
          transition: border-color 0.34s ease, box-shadow 0.34s ease;
          will-change: transform;
        }
        .team-lead-card::before {
          background:
            radial-gradient(ellipse at var(--team-light-x) var(--team-light-y), rgba(255,255,255,0.24), rgba(255,255,255,0.07) 28%, transparent 56%),
            linear-gradient(135deg, rgba(255,255,255,0.1), transparent 34%, rgba(3,8,14,0.16));
          content: "";
          inset: 0;
          opacity: var(--team-light-opacity);
          pointer-events: none;
          position: absolute;
          z-index: 4;
        }
        .team-lead-card::after {
          background:
            radial-gradient(ellipse at 50% 62%, transparent 36%, rgba(2,8,16,0.24) 74%, rgba(2,8,16,0.38)),
            linear-gradient(0deg, rgba(8,12,26,0.58), transparent 38%),
            linear-gradient(90deg, rgba(8,12,26,0.3), transparent 26%, transparent 75%, rgba(8,12,26,0.28));
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
          z-index: 5;
        }
        .team-lead-bg,
        .team-lead-person {
          display: block;
          position: absolute;
          will-change: transform, filter;
        }
        .team-lead-bg {
          filter: blur(var(--team-bg-blur)) brightness(0.9) saturate(1.04) contrast(1.06);
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: translate3d(var(--team-bg-x), var(--team-bg-y), -20px) scale(1.065);
          transition: filter 0.3s ease;
          width: 100%;
          z-index: 1;
        }
        .team-lead-depth-shadow {
          background: radial-gradient(ellipse, rgba(0,0,0,0.42), rgba(0,0,0,0.18) 42%, transparent 70%);
          border-radius: 999px;
          bottom: 5%;
          filter: blur(18px);
          height: 22%;
          left: 50%;
          pointer-events: none;
          position: absolute;
          transform: translate3d(calc(-50% + var(--team-shadow-x)), var(--team-shadow-y), 0) scale(1.04);
          width: 58%;
          z-index: 2;
        }
        .team-lead-person {
          bottom: -1.5%;
          filter:
            drop-shadow(0 32px 42px rgba(2,8,17,0.34))
            drop-shadow(0 7px 12px rgba(2,8,17,0.18));
          height: 98%;
          left: 50%;
          transform: translate3d(calc(-50% + var(--team-person-x)), var(--team-person-y), 30px) scale(1.048);
          transform-origin: center bottom;
          transition: filter 0.3s ease;
          width: auto;
          z-index: 3;
        }
        @media (hover: hover) and (pointer: fine) {
          .team-lead-card:hover {
            border-color: rgba(255,255,255,0.25);
            box-shadow:
              0 38px 86px rgba(23,25,54,0.22),
              inset 0 1px 0 rgba(255,255,255,0.2);
          }
          .team-lead-card:hover .team-lead-bg {
            filter: blur(var(--team-bg-blur)) brightness(0.94) saturate(1.08) contrast(1.06);
          }
          .team-lead-card:hover .team-lead-person {
            filter:
              drop-shadow(0 38px 50px rgba(2,8,17,0.42))
              drop-shadow(0 8px 13px rgba(2,8,17,0.2));
          }
        }
        .team-lead-caption {
          bottom: 1.85rem;
          color: #fff;
          left: 2rem;
          position: absolute;
          right: 2rem;
          z-index: 6;
        }
        .team-lead-caption span {
          color: #d8bd6a;
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
        }
        .team-lead-caption strong {
          display: block;
          font-size: clamp(1.55rem, 2.35vw, 2.2rem);
          line-height: 1.05;
        }
        .team-copy {
          margin-bottom: clamp(1.1rem, 1.8vw, 1.75rem);
          max-width: none;
        }
        .team-copy .section-eyebrow {
          color: #c0a044;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          margin: 0 0 0.6rem;
          text-transform: uppercase;
        }
        .team-copy h2 {
          color: #2f315a;
          font-size: var(--heading-lg);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.18;
          margin: 0 0 0.85rem;
        }
        .team-copy p {
          color: rgba(47,49,90,0.68);
          font-size: clamp(0.95rem, 1.2vw, 1.08rem);
          line-height: 1.75;
          margin: 0;
        }
        .team-photo-wall {
          display: grid;
          gap: clamp(0.65rem, 1vw, 1rem);
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-auto-rows: clamp(82px, 7vw, 126px);
          min-height: clamp(390px, 35vw, 520px);
          position: relative;
        }
        .team-photo-wall::before,
        .team-photo-wall::after {
          background: rgba(47,49,90,0.08);
          border-radius: 22px;
          content: "";
          filter: blur(6px);
          position: absolute;
          z-index: 0;
        }
        .team-photo-wall::before {
          height: 78px;
          right: 7%;
          top: 2%;
          width: 78px;
        }
        .team-photo-wall::after {
          bottom: 5%;
          height: 96px;
          left: 5%;
          width: 96px;
        }
        .team-tile {
          background: #e6e6ea;
          border: 1px solid rgba(47,49,90,0.1);
          border-radius: 18px;
          box-shadow: 0 18px 46px rgba(47,49,90,0.07);
          grid-column: span 2;
          grid-row: span 2;
          overflow: hidden;
          position: relative;
          transform: translateZ(0);
          transform-origin: center;
          transition: transform 0.36s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.36s ease, z-index 0s;
          z-index: 1;
        }
        .team-tile--wide { grid-column: span 4; grid-row: span 2; }
        .team-tile--medium { grid-column: span 2; grid-row: span 2; }
        .team-tile--small { grid-column: span 2; grid-row: span 1; }
        .team-tile--short { grid-column: span 3; grid-row: span 1; }
        .team-tile--lift { transform: translateY(-18px); }
        .team-tile--drop { transform: translateY(20px); }
        .team-tile img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.36s ease;
          width: 100%;
        }
        .team-tile::after {
          background: linear-gradient(0deg, rgba(15,17,40,0.58), transparent 58%);
          content: "";
          inset: 0;
          opacity: 0.9;
          position: absolute;
        }
        .team-tile span {
          bottom: 0.85rem;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 800;
          left: 0.9rem;
          letter-spacing: 0.04em;
          position: absolute;
          right: 0.9rem;
          z-index: 2;
        }
        @media (hover: hover) and (pointer: fine) {
          .team-tile:hover {
            box-shadow: 0 32px 82px rgba(23,25,54,0.2);
            transform: scale(1.12);
            z-index: 5;
          }
          .team-tile:hover img {
            filter: saturate(1.06) contrast(1.04);
            transform: scale(1.18);
          }
          .team-tile--lift:hover {
            transform: translateY(-18px) scale(1.12);
          }
          .team-tile--drop:hover {
            transform: translateY(20px) scale(1.12);
          }
        }
        @media (min-width: 1025px) {
          .team-copy p {
            white-space: nowrap;
          }
        }
        @media (max-width: 1024px) {
          .our-team-wrap {
            grid-template-columns: 1fr;
          }
          .team-lead {
            margin: 0 auto;
            max-width: 560px;
            width: min(86%, 560px);
          }
          .team-lead-card {
            border-radius: 24px;
            min-height: clamp(480px, 80vw, 680px);
            transform: none;
          }
          .team-copy {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }
          .team-copy p {
            white-space: normal;
          }
          .team-photo-wall {
            grid-auto-rows: clamp(74px, 13vw, 124px);
            min-height: auto;
          }
        }
        @media (max-width: 640px) {
          .our-team-section {
            padding: 3.25rem 0;
          }
          .team-lead {
            width: min(100%, 390px);
          }
          .team-lead-card {
            border-radius: 22px;
            min-height: 520px;
          }
          .team-photo-wall {
            gap: 0.55rem;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-auto-rows: 76px;
          }
          .team-tile,
          .team-tile--wide,
          .team-tile--medium,
          .team-tile--small {
            border-radius: 16px;
            grid-column: span 2;
            grid-row: span 2;
            transform: none;
          }
          .team-tile--short {
            grid-column: span 2;
            grid-row: span 1;
          }
          .team-tile span {
            font-size: 0.68rem;
          }
        }
      `}</style>
      <div className="content-wrap our-team-wrap">
        <div className="team-gallery-panel">
          <div className="team-copy">
            <p className="section-eyebrow">People Behind Every Solution</p>
            <h2 id="our-team-title" className="ks-section-title ks-section-title-inherit">Our Team</h2>
            <p>
              Practical teams. Clear support. Reliable follow-through.
            </p>
          </div>
          <div className="team-photo-wall" aria-label="Department team gallery">
            {teamTiles.map((tile) => (
              <figure className={tile.className} key={tile.label}>
                <img src={tile.image} alt={`${tile.label} team`} loading="lazy" decoding="async" />
                <span>{tile.label}</span>
              </figure>
            ))}
          </div>
        </div>

        <div className="team-lead" aria-label="Executive Manager Leow Chuen Hock">
          <div
            className="team-lead-card"
            ref={leadCardRef}
            onMouseMove={handleLeadMove}
            onMouseLeave={resetLeadDepth}
          >
            <img
              className="team-lead-bg"
              src="/images/team/ch-leow-background.webp"
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <span className="team-lead-depth-shadow" aria-hidden="true" />
            <div className="team-lead-person">
              <img
                src="/images/team/ch-leow-portrait.webp"
                alt="Executive Manager Leow Chuen Hock"
                style={{ visibility: "hidden", height: "100%", width: "auto", display: "block" }}
              />
              <DepthDisplacementWebGL
                ref={webGLRef}
                imageSrc="/images/team/ch-leow-portrait.webp"
                depthSrc="/images/team/ch-leow-portrait-depth.webp"
                style={{ position: "absolute", inset: 0 }}
                aria-label="Executive Manager Leow Chuen Hock"
              />
            </div>
            <div className="team-lead-caption">
              <span>Executive Manager</span>
              <strong>Leow Chuen Hock</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
