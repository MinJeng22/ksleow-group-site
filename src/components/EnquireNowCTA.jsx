import React from "react";
import ParticleBackground from "./ParticleBackground";

export default function EnquireNowCTA({
  heading,
  body,
  buttons = []
}) {
  return (
    <div className="enquire-now-section">
      <ParticleBackground
        paused={false}
        backgroundStart="#f8f9fd"
        backgroundEnd="#eef1f8"
        lineRgb="47,49,90"
        dotRgb="201,168,76"
        highlightRgb="201,168,76"
        vignetteEnd="rgba(47,49,90,0.08)"
        densityScale={1.05}
        mobileDensityScale={2.6}
        lineAlphaScale={0.45}
        dotAlpha={0.68}
      />
      <div className="enquire-now-content content-wrap">
        <h2 className="enquire-now-heading">{heading}</h2>
        <p className="enquire-now-body">{body}</p>
        {buttons.length > 0 && (
          <div className="enquire-now-actions">
            {buttons.map((btn, i) => (
              <a key={i} href={btn.href} target={btn.target || "_blank"} rel="noreferrer" className={btn.className || "btn-ghost-base btn-ghost-dark"}>
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
