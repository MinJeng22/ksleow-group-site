import React from "react";
import ParticleBackground from "./ParticleBackground";
import { CTA_PARTICLE_PROPS } from "./ctaParticleConfig.js";

export default function EnquireNowCTA({
  heading,
  body,
  buttons = []
}) {
  return (
    <div className="enquire-now-section">
      <ParticleBackground
        {...CTA_PARTICLE_PROPS}
        paused={false}
      />
      <div className="enquire-now-content content-wrap">
        <h2 className="enquire-now-heading ks-section-title">{heading}</h2>
        <p className="enquire-now-body">{body}</p>
        {buttons.length > 0 && (
          <div className="enquire-now-actions">
            {buttons.map((btn, i) => (
              <a key={i} href={btn.href} target={btn.target || "_blank"} rel="noreferrer" className={btn.className || "btn-ghost-base btn-ghost-dark"} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                {btn.label}
                {(!btn.href.startsWith("/") && !btn.href.startsWith("#")) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
