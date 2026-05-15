/* ══════════════════════════════════════════════════════════════
 * chatbotShared — primitives shared by AIChatbot (modal) and KSOmni
 * (full page). Keep this file dependency-light: no react-router, no
 * global styles. Everything here is a pure helper or a presentational
 * component the two callers can drop into their own layouts.
 * ══════════════════════════════════════════════════════════════ */
/* ── Cloudflare Worker that proxies KS Omni / Gemini ── */
export const WORKER_URL = "https://ksl-omni.kslbs.workers.dev";

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

/* ── Parse **bold** markdown into <strong> nodes ── */
export function renderText(text) {
  if (!text) return null;
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
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
        <img src="/ksl-logo-circle.webp" alt="KSL" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                fontSize, lineHeight: 1.65,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {renderText(msg.text)}
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
  `}</style>;
}

