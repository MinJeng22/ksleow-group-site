import { useEffect, useRef, useState } from "react";
import { CONTACT } from "../constants/contact.js";
import ParticleBackground from "./ParticleBackground";
import { CTA_PARTICLE_PROPS } from "./ctaParticleConfig.js";
import careers from "../content/careers.json";

/* Strip surrounding quotes / trailing period, then split on first comma. */
function parseQuote(raw) {
  if (!raw) return ["", ""];
  let txt = String(raw).trim();
  txt = txt.replace(/^["“”'‘’]/, "").replace(/["“”'‘’]$/, "");
  txt = txt.replace(/\.$/, "");
  const i = txt.indexOf(",");
  if (i === -1) return [txt, ""];
  return [txt.slice(0, i).trim(), txt.slice(i + 1).trim()];
}

/* Animated word reveal — each word fades + slides in sequentially.
 * Words only animate when `visible` is true; before that they're
 * invisible (opacity 0) so layout is stable. */
function AnimatedWords({ text, startDelay = 0, stepMs = 60, visible }) {
  if (!text) return null;
  const words = text.split(" ");
  return words.map((w, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        transitionDelay: visible ? `${startDelay + i * stepMs}ms` : "0ms",
        marginRight: i < words.length - 1 ? "0.28em" : 0,
        whiteSpace: "pre",
      }}
    >
      {w}
    </span>
  ));
}

export default function Careers() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [buttonsClickable, setButtonsClickable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      }),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [line1, line2] = parseQuote(careers.heading);
  /* Line-by-line reveal — each line fades in as a whole. */
  const LINE_FADE_MS = 550;
  const line1Start = 0;
  const line2Start = line1Start + LINE_FADE_MS + 250;       /* line1 finishes, brief pause */
  const bodyStart  = line2Start + LINE_FADE_MS + 350;       /* line2 finishes, brief pause */
  const BODY_STEP  = 26;
  const bodyDur    = (careers.body || "").split(" ").length * BODY_STEP;
  const buttonsStart = bodyStart + bodyDur + 200;
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setButtonsClickable(true);
      }, buttonsStart + 500);
      return () => clearTimeout(timer);
    }
  }, [visible, buttonsStart]);



  return (
    <div className="home-section" style={{
      position: "relative",
      overflow: "hidden",
      background: "#f4f6fb",
      padding: "var(--section-py) 0",
      borderTop: "0.5px solid rgba(47,49,90,0.1)",
    }}>
      <ParticleBackground
        {...CTA_PARTICLE_PROPS}
        active={visible}
        paused={false}
      />
      <div
        className="content-wrap"
        style={{
          position: "relative", zIndex: 1,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
        }}
      >
        <div ref={ref} style={{ maxWidth: 720, flex: "1 1 480px" }}>
          <div style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.1rem",
          }}>
            {careers.eyebrow}
          </div>

          {/* Two-line layout: line 1 fades in as a whole, then line 2 fades in. */}
          <h2 style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            fontWeight: 700,
            color: "#2f315a",
            lineHeight: 1.4,
            marginBottom: "0.9rem",
          }}>
            <span style={{
              display: "inline-block",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${LINE_FADE_MS}ms ease, transform ${LINE_FADE_MS}ms ease`,
              transitionDelay: visible ? `${line1Start}ms` : "0ms",
            }}>
              <span aria-hidden="true">“</span>{line1}
            </span>
            <br />
            <span className="careers-line2" style={{
              display: "inline-block",
              marginLeft: "clamp(1.5rem, 6vw, 4rem)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${LINE_FADE_MS}ms ease, transform ${LINE_FADE_MS}ms ease`,
              transitionDelay: visible ? `${line2Start}ms` : "0ms",
            }}>
              {line2}<span aria-hidden="true">”</span>
            </span>
          </h2>

          {/* Supporting body — words fade in sequentially */}
          <p style={{ color: "#6b6f91", fontSize: "0.95rem", lineHeight: 1.75 }}>
            <AnimatedWords text={careers.body} startDelay={bodyStart} stepMs={BODY_STEP} visible={visible} />
          </p>
        </div>

        <div
          className="careers-btns"
          style={{
            display: "flex", gap: "0.85rem", flexWrap: "wrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
      <div
        className="content-wrap"
        style={{
          position: "relative", zIndex: 1,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
        }}
      >
        <div ref={ref} style={{ maxWidth: 720, flex: "1 1 480px" }}>
          <div style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.1rem",
          }}>
            {careers.eyebrow}
          </div>

          {/* Two-line layout: line 1 fades in as a whole, then line 2 fades in. */}
          <h2 style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            fontWeight: 700,
            color: "#2f315a",
            lineHeight: 1.4,
            marginBottom: "0.9rem",
          }}>
            <span style={{
              display: "inline-block",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${LINE_FADE_MS}ms ease, transform ${LINE_FADE_MS}ms ease`,
              transitionDelay: visible ? `${line1Start}ms` : "0ms",
            }}>
              <span aria-hidden="true">“</span>{line1}
            </span>
            <br />
            <span className="careers-line2" style={{
              display: "inline-block",
              marginLeft: "clamp(1.5rem, 6vw, 4rem)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${LINE_FADE_MS}ms ease, transform ${LINE_FADE_MS}ms ease`,
              transitionDelay: visible ? `${line2Start}ms` : "0ms",
            }}>
              {line2}<span aria-hidden="true">”</span>
            </span>
          </h2>

          {/* Supporting body — words fade in sequentially */}
          <p style={{ color: "#6b6f91", fontSize: "0.95rem", lineHeight: 1.75 }}>
            <AnimatedWords text={careers.body} startDelay={bodyStart} stepMs={BODY_STEP} visible={visible} />
          </p>
        </div>

        <div
          className="careers-btns"
          style={{
            display: "flex", gap: "0.85rem", flexWrap: "wrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: visible ? `${buttonsStart}ms` : "0ms",
            pointerEvents: buttonsClickable ? undefined : "none",
          }}
        >
          {/* Primary — career enquiry */}
          <a
            href={`mailto:${CONTACT.email}?subject=Career Enquiry`}
            style={{
              background: "#2f315a", color: "#ffffff",
              padding: "0.82rem 2.2rem", borderRadius: 50,
              fontSize: "0.9rem", fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "background 0.2s",
              display: "inline-flex", alignItems: "center", gap: "0.4rem"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
            onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
          >
            {careers.careerButtonLabel || careers.buttonLabel || "Join Our Team"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
          </a>

          {/* Secondary — partnership enquiry */}
          <a
            href={`mailto:${careers.partnerEmail || CONTACT.email}?subject=Partnership Enquiry`}
            className="btn-ghost-base btn-ghost-dark"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            {careers.partnerButtonLabel || "Partner with Us"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
