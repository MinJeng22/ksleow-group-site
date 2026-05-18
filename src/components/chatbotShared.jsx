import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

/* ══════════════════════════════════════════════════════════════
 * chatbotShared — primitives shared by AIChatbot (modal) and KSOmni
 * (full page). Keep this file dependency-light: no react-router, no
 * global styles. Everything here is a pure helper or a presentational
 * component the two callers can drop into their own layouts.
 * ══════════════════════════════════════════════════════════════ */
/* ── Cloudflare Worker that proxies KS Omni / Gemini ── */
export const WORKER_URL = "https://ks-omni.kslbs.workers.dev";

/* ── Icons (only the ones both callers need; page-only icons live
       in their respective files) ── */
export const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
export const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const GREETING_PHRASES = [
  { hello: "Hello", prompt: "How can I help you today?" },
  { hello: "Hai", prompt: "Ada apa-apa yang boleh saya bantu?" },
  { hello: "你好丫", prompt: "今天能帮到你什么？" },
];

export function autoResizeTextarea(textarea) {
  if (!textarea) return;
  const maxHeight = Number.parseFloat(window.getComputedStyle(textarea).maxHeight) || 180;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
}

export function AnimatedGreeting({ compact = false, style }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const phrase = GREETING_PHRASES[phraseIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % GREETING_PHRASES.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let index = 0;
    setTypedText("");
    const timer = window.setInterval(() => {
      index += 1;
      setTypedText(phrase.prompt.slice(0, index));
      if (index >= phrase.prompt.length) window.clearInterval(timer);
    }, compact ? 30 : 34);
    return () => window.clearInterval(timer);
  }, [compact, phrase.prompt]);

  return (
    <div style={{
      textAlign: "left",
      width: "100%",
      maxWidth: compact ? 320 : 720,
      animation: "fadeIn 0.4s ease",
      marginBottom: compact ? 0 : "1.5rem",
      ...style,
    }}>
      <div style={{
        fontSize: compact ? "1.15rem" : "clamp(1.75rem, 3.5vw, 2.4rem)",
        fontWeight: 500,
        color: "#a8abcc",
        lineHeight: 1.2,
        marginBottom: compact ? "0.35rem" : "0.25rem",
      }}>
        {phrase.hello}
      </div>
      <div style={{
        minHeight: compact ? "3.4em" : "2.4em",
        fontSize: compact ? "1.32rem" : "clamp(1.75rem, 3.5vw, 2.4rem)",
        fontWeight: 600,
        background: "linear-gradient(90deg, #2f315a 0%, #c9a84c 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1.2,
      }}>
        {typedText}
        <span aria-hidden="true" style={{
          display: "inline-block",
          width: compact ? 8 : 10,
          marginLeft: 3,
          borderRight: "2px solid #c9a84c",
          transform: "translateY(0.08em)",
          animation: "ksCaretBlink 0.9s step-end infinite",
        }}>&nbsp;</span>
      </div>
    </div>
  );
}

/* Markdown renderer shared by KS Omni and AIChatbot. */
function markdownComponents(isUser) {
  const border = isUser ? "rgba(255,255,255,0.26)" : "rgba(47,49,90,0.16)";
  const softBg = isUser ? "rgba(255,255,255,0.12)" : "rgba(47,49,90,0.06)";
  const quoteBorder = isUser ? "rgba(232,201,122,0.7)" : "rgba(201,168,76,0.55)";
  const linkColor = isUser ? "#f3d788" : "#8a6b16";

  return {
    p: ({ children }) => <p style={{ margin: "0 0 0.65em" }}>{children}</p>,
    h1: ({ children }) => (
      <h1 style={{ fontSize: "1.14em", lineHeight: 1.35, margin: "0 0 0.55em", fontWeight: 700 }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: "1.08em", lineHeight: 1.35, margin: "0 0 0.5em", fontWeight: 700 }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: "1.02em", lineHeight: 1.35, margin: "0 0 0.45em", fontWeight: 700 }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ fontSize: "1em", lineHeight: 1.35, margin: "0 0 0.4em", fontWeight: 700 }}>
        {children}
      </h4>
    ),
    ul: ({ children }) => <ul style={{ margin: "0.2em 0 0.75em", paddingLeft: "1.35em" }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ margin: "0.2em 0 0.75em", paddingLeft: "1.45em" }}>{children}</ol>,
    li: ({ children }) => <li style={{ margin: "0.22em 0", paddingLeft: "0.05em" }}>{children}</li>,
    table: ({ children }) => (
      <div style={{ maxWidth: "100%", overflowX: "auto", margin: "0.7em 0" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 360, width: "100%", fontSize: "0.88em" }}>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th style={{ border: `1px solid ${border}`, padding: "0.45em 0.6em", background: softBg, textAlign: "left", fontWeight: 700 }}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td style={{ border: `1px solid ${border}`, padding: "0.45em 0.6em", verticalAlign: "top" }}>
        {children}
      </td>
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noreferrer" style={{ color: linkColor, fontWeight: 600 }}>
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ margin: "0.6em 0", padding: "0.15em 0 0.15em 0.75em", borderLeft: `3px solid ${quoteBorder}` }}>
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre style={{ margin: "0.6em 0", padding: "0.65em 0.75em", borderRadius: 10, overflowX: "auto", border: `1px solid ${border}`, background: softBg }}>
        {children}
      </pre>
    ),
    code: ({ children, className }) => (
      <code className={className} style={{
        background: className ? "transparent" : softBg,
        borderRadius: 5,
        padding: className ? 0 : "0.1em 0.28em",
        fontSize: "0.88em",
      }}>
        {children}
      </code>
    ),
  };
}

export function MarkdownText({ text, isUser = false, fontSize = "0.86rem" }) {
  if (!text) return null;
  return (
    <div className="ks-chat-markdown" style={{
      color: isUser ? "#ffffff" : "#2f315a",
      fontSize,
      lineHeight: 1.65,
      maxWidth: "100%",
      overflowWrap: "anywhere",
      textAlign: "left",
    }}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents(isUser)}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export function renderText(text, options = {}) {
  return <MarkdownText text={text} isUser={options.isUser} fontSize={options.fontSize} />;
}

/* ── Typing indicator (three pulsing dots, gray bubble) ── */
export function TypingDots() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "0.7rem 0.95rem",
      background: "#f0f0f6",
      borderRadius: "16px 16px 16px 4px",
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#9095b8",
          animation: `typingPulse 1.3s ${i * 0.18}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

/* ── Message bubble — supports optional inline image preview ── */
export function Message({ msg, fontSize = "0.86rem" }) {
  const isUser     = msg.role === "user";
  const showTyping = !isUser && msg.streaming && !msg.text;

  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "0.9rem", gap: "0.5rem", alignItems: "flex-end",
    }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(47,49,90,0.1)" }}>
        <img src="/images/branding/ksl-logo-circle.webp" alt="KSL" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {msg.imagePreviewUrl && (
          <img src={msg.imagePreviewUrl} alt="attachment"
            style={{ maxWidth: 220, maxHeight: 220, borderRadius: 12, border: "1px solid rgba(47,49,90,0.12)", objectFit: "cover", display: "block" }}
          />
        )}
        {msg.attachedFilename && !msg.imagePreviewUrl && (
          <div title={msg.attachedFilename} style={{
            display: "inline-flex", alignItems: "center", gap: "0.55rem",
            padding: "0.55rem 0.85rem", borderRadius: 12,
            background: "#ffffff", border: "1px solid rgba(47,49,90,0.18)",
            maxWidth: 260,
          }}>
            <span style={{
              fontSize: "0.66rem", fontWeight: 700, color: "#c9a84c",
              letterSpacing: "0.06em", flexShrink: 0,
              padding: "0.2rem 0.45rem", borderRadius: 6,
              background: "rgba(201,168,76,0.12)",
            }}>
              {(msg.attachedFilename.split(".").pop() || "DOC").toUpperCase().slice(0, 4)}
            </span>
            <span style={{
              fontSize: "0.8rem", color: "#2f315a", fontWeight: 500,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              minWidth: 0,
            }}>{msg.attachedFilename}</span>
          </div>
        )}
        {showTyping
          ? <TypingDots />
          : (msg.text && (
              <div style={{
                background: isUser ? "#2f315a" : "#f0f0f6",
                color:      isUser ? "#ffffff" : "#2f315a",
                padding: "0.65rem 0.95rem",
                borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                maxWidth: "100%",
                overflow: "hidden",
              }}>
                <MarkdownText text={msg.text} isUser={isUser} fontSize={fontSize} />
              </div>
            ))
        }
        {msg.error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "0.6rem 0.9rem", borderRadius: 12, fontSize: "0.82rem", border: "1px solid #fecaca" }}>
            {msg.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Pull a text token out of any of the response shapes the worker
       might return (Gemini chunk, OpenAI chunk, plain string, …). ── */
function extractText(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  const gem = obj.candidates?.[0]?.content?.parts?.[0]?.text;
  if (gem) return gem;
  const oai = obj.choices?.[0]?.delta?.content
           ?? obj.choices?.[0]?.message?.content;
  if (oai) return oai;
  return obj.text || obj.message || obj.response || obj.output || obj.delta || "";
}

/* ── streamChat — POST /chat and pump streaming tokens into onToken.
 *
 *   payload  { messages: [{role, text}], app?, machine_id?, … }
 *   onToken  (acc: string) => void   — called for every accumulated update
 *   signal   AbortSignal             — optional, cancels the fetch
 *
 *   Returns the final accumulated string.
 *
 *   Handles:
 *     • SSE / chunked-text streams (the production shape)
 *     • application/json single-shot replies
 *     • plain-text replies
 *     • multiple response payload shapes (Gemini, OpenAI, ad-hoc)
 *
 *   Throws an Error with a worker-supplied detail string on non-2xx.
 * ────────────────────────────────────────────────────────────── */
export async function streamChat({ payload, onToken, signal }) {
  const res = await fetch(`${WORKER_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    let detail = "";
    try { detail = (await res.text()).slice(0, 240); } catch { /* ignore */ }
    throw new Error(`Worker returned ${res.status}${detail ? `: ${detail}` : ""}`);
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  let acc = "";
  const emit = () => { try { onToken?.(acc); } catch { /* ignore */ } };

  if (res.body && (contentType.includes("event-stream") || contentType.includes("stream") || contentType === "")) {
    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, nl).trimEnd();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        const raw = line.startsWith("data:") ? line.slice(5).trim() : line;
        if (!raw || raw === "[DONE]") continue;
        let token = "";
        try { token = extractText(JSON.parse(raw)); }
        catch { token = line.startsWith("data:") ? "" : line; }
        if (token) { acc += token; emit(); }
      }
    }
    if (buffer.trim()) {
      try { acc += extractText(JSON.parse(buffer.trim())) || ""; emit(); }
      catch { /* ignore trailing partial */ }
    }
  } else if (contentType.includes("application/json")) {
    acc = extractText(await res.json());
    emit();
  } else {
    acc = await res.text();
    emit();
  }

  return acc.trim();
}

/* ── Inject the @keyframes used by Message + TypingDots once per page. ── */
export function ChatbotKeyframes() {
  // returning a <style> tag is enough — React dedupes identical children
  // when the component renders multiple times in the same tree.
  return <style>{`
    @keyframes typingPulse{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes ksCaretBlink{0%,48%{opacity:1}49%,100%{opacity:0}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .ks-chat-markdown > :first-child{margin-top:0!important}
    .ks-chat-markdown > :last-child{margin-bottom:0!important}
    .ks-chat-markdown li > p{margin:0.1em 0}
    .ks-chat-markdown table p{margin:0}
  `}</style>;
}

