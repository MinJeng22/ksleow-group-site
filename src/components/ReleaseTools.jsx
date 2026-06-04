import { useState } from "react";

const DEFAULT_COLORS = {
  feature: { bg: "rgba(47,49,90,0.08)", color: "#2f315a" },
  fix: { bg: "rgba(128,195,30,0.12)", color: "#4a6e0e" },
  cloudFix: { bg: "rgba(0,158,57,0.12)", color: "#009e39" },
};

export function writeClipboard(text) {
  return navigator.clipboard?.writeText(text).catch(() => {});
}

export function copyShareUrl({ params, hash }) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== false && value !== "") {
      query.set(key, value === true ? "1" : String(value));
    }
  });
  const queryText = query.toString();
  const url = `${window.location.origin}${window.location.pathname}${queryText ? `?${queryText}` : ""}${hash || ""}`;
  const fallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); } catch { /* ignore */ }
    document.body.removeChild(textarea);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).catch(fallback);
  } else {
    fallback();
  }
}

export function ReleaseNumber({ number, type, fixColor = "#4a6e0e", fixBg = "rgba(128,195,30,0.12)" }) {
  const palette = type === "fix"
    ? { bg: fixBg, color: fixColor }
    : DEFAULT_COLORS.feature;

  return (
    <span style={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: palette.bg,
      color: palette.color,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: "0.68rem",
      fontWeight: 800,
      lineHeight: 1,
      marginTop: 1,
    }}>
      {number}
    </span>
  );
}

export function CopyReleaseButton({
  onClick,
  gold = false,
  variant = "inline",
  copiedLabel = "Copied",
  label = "Copy",
  title = "Copy for WhatsApp",
}) {
  const [copied, setCopied] = useState(false);

  function handle(event) {
    event?.stopPropagation();
    onClick?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handle}
        title={title}
        className="ks-btn ks-btn-sm ks-btn-muted"
        style={{
          gap: "0.35rem",
          background: copied ? (gold ? "rgba(0,158,57,0.18)" : "rgba(47,49,90,0.1)") : "#fff",
          border: `1px solid ${gold ? "rgba(0,158,57,0.32)" : "rgba(47,49,90,0.14)"}`,
          color: copied ? (gold ? "#009e39" : "#2f315a") : "#6b6f91",
        }}
      >
        {copied ? copiedLabel : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        background: copied ? (gold ? "rgba(128,195,30,0.2)" : "rgba(47,49,90,0.12)") : "transparent",
        border: `1px solid ${gold ? "rgba(128,195,30,0.35)" : "rgba(47,49,90,0.18)"}`,
        borderRadius: 50,
        padding: "0.2rem 0.6rem",
        fontSize: "0.62rem",
        fontWeight: 600,
        color: copied ? (gold ? "#4a6e0e" : "#2f315a") : "#a8abcc",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
      }}
    >
      {copied ? "Copied" : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export function ShareLinkButton({
  params,
  hash,
  compact = false,
  title = "Copy a shareable link to this comparison",
  variant = "inline",
  copiedColor = "#4a6e0e",
}) {
  const [copied, setCopied] = useState(false);

  function handle(event) {
    event?.stopPropagation();
    copyShareUrl({ params, hash });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handle}
        title={title}
        className={`ks-btn ks-btn-muted ${compact ? "ks-btn-sm" : ""}`}
        style={{
          gap: compact ? "0.32rem" : "0.45rem",
          background: copied ? "rgba(0,158,57,0.16)" : "#ffffff",
          color: copied ? "#009e39" : "#2f315a",
        }}
      >
        <LinkIcon width={13} height={13} />
        {copied ? "Link copied" : "Share Link"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? "0.3rem" : "0.4rem",
        background: copied ? "rgba(128,195,30,0.18)" : (compact ? "transparent" : "rgba(47,49,90,0.06)"),
        border: `1px solid ${copied ? "rgba(128,195,30,0.4)" : "rgba(47,49,90,0.16)"}`,
        borderRadius: 50,
        padding: compact ? "0.2rem 0.6rem" : "0.4rem 0.9rem",
        fontSize: compact ? "0.62rem" : "0.74rem",
        fontWeight: 600,
        color: copied ? copiedColor : "#2f315a",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
      }}
    >
      {copied ? (
        <>
          <CheckIcon />
          Link copied
        </>
      ) : (
        <>
          <LinkIcon />
          Share Link
        </>
      )}
    </button>
  );
}

export function CompareRevBadge({ children, type, fixColor = "#009e39", fixBg = "rgba(0,158,57,0.12)" }) {
  const palette = type === "fix"
    ? { color: fixColor, bg: fixBg }
    : DEFAULT_COLORS.feature;

  return (
    <span style={{
      fontSize: "0.6rem",
      fontWeight: 800,
      letterSpacing: "0.06em",
      padding: "0.2rem 0.5rem",
      borderRadius: 50,
      background: palette.bg,
      color: palette.color,
      flexShrink: 0,
      marginTop: 2,
    }}>
      {children}
    </span>
  );
}

function CheckIcon({ width = 12, height = 12 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LinkIcon({ width = 12, height = 12 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
