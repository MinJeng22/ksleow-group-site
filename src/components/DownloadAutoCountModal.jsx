/**
 * DownloadAutoCountModal — gated download flow for AutoCount Accounting.
 * ────────────────────────────────────────────────────────────────────
 * Three-step modal:
 *   1) form    → collect Name / Email / Phone / Company → request SMS OTP
 *   2) otp     → enter 6-digit code → verify and reveal download link
 *   3) success → auto-trigger file download + show manual link
 *
 * Talks to the Cloudflare Worker:
 *   POST /lead/request-otp   { name, email, phone, company, product }
 *   POST /lead/verify-otp    { phone, code, product } → { downloadUrl }
 *
 * The worker rate-limits per IP and per phone, stores OTPs in KV with
 * a 5-minute TTL, and only returns the download URL after successful
 * verification.
 */
import { useState, useEffect, useRef } from "react";
import { LOGO_NAV as LOGO } from "../assets/assets.js";

const WORKER_URL = "https://ksl-omni.kslbs.workers.dev";
const PRODUCT_ID = "autocount-accounting-2.2";

export default function DownloadAutoCountModal({ open, onClose }) {
  const [step, setStep]     = useState("form");        // form | otp | success
  const [form, setForm]     = useState({ name: "", email: "", phone: "", company: "" });
  const [agree, setAgree]   = useState(false);
  const [code, setCode]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const dlAnchor = useRef(null);

  /* Reset state every time the modal opens */
  useEffect(() => {
    if (open) {
      setStep("form"); setError(""); setCode("");
      setDownloadUrl(""); setResendIn(0); setLoading(false);
    }
  }, [open]);

  /* Resend countdown tick */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  if (!open) return null;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* Normalise Malaysian-style numbers to E.164 (+60xxxxxxxxx).
   * Accepts inputs like "017-905 2323", "+60 17 905 2323", "0179052323". */
  const normalisePhone = (raw) => {
    let d = String(raw).replace(/\D/g, "");
    if (d.startsWith("60")) {/* already country-coded */}
    else if (d.startsWith("0")) d = "60" + d.slice(1);
    else d = "60" + d;
    return "+" + d;
  };

  const validateForm = () => {
    if (!form.name.trim())                               return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))       return "Please enter a valid email address.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 13)         return "Please enter a valid Malaysian phone number.";
    if (!agree)                                          return "Please agree to be contacted before continuing.";
    return null;
  };

  const requestOtp = async () => {
    const err = validateForm();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const phone = normalisePhone(form.phone);
      const res = await fetch(`${WORKER_URL}/lead/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone,
          company: form.company.trim(),
          product: PRODUCT_ID,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send the verification code.");
      setStep("otp");
      setResendIn(60);
    } catch (e) {
      setError(e.message || "Could not send the verification code. Please try again.");
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (code.length !== 6) { setError("Please enter the 6-digit code."); return; }
    setError(""); setLoading(true);
    try {
      const phone = normalisePhone(form.phone);
      const res = await fetch(`${WORKER_URL}/lead/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, product: PRODUCT_ID }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      if (!data.downloadUrl) throw new Error("Download is not available right now. Our team will email you shortly.");
      setDownloadUrl(data.downloadUrl);
      setStep("success");
      // Auto-click the hidden anchor so the browser starts the download.
      setTimeout(() => dlAnchor.current?.click(), 250);
    } catch (e) {
      setError(e.message || "Code is incorrect. Please try again.");
    } finally { setLoading(false); }
  };

  /* ── Shared input style ── */
  const inputStyle = {
    width: "100%", padding: "0.65rem 0.85rem",
    borderRadius: 10, border: "1px solid #d8dae8",
    fontSize: "0.9rem", fontFamily: "inherit",
    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
    background: "#ffffff", color: "#2f315a",
  };
  const labelStyle = {
    display: "block", fontSize: "0.72rem", fontWeight: 600,
    color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: "0.35rem",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,11,20,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff", borderRadius: 20,
          padding: "2.25rem", maxWidth: 440, width: "100%",
          maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 40px 90px rgba(0,0,0,0.28)",
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
          .ksl-input:focus{border-color:#c9a84c;box-shadow:0 0 0 3px rgba(201,168,76,0.18)}`}</style>

        {/* Close button */}
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", marginLeft: "calc(440px - 4rem)", marginTop: "-1rem",
          background: "none", border: "none", fontSize: "1.4rem", color: "#a8abcc",
          cursor: "pointer", padding: "0.25rem 0.5rem", lineHeight: 1,
        }}>×</button>

        <img src={LOGO} alt="KSL Business Solutions" style={{ height: 32, marginBottom: "1.25rem", objectFit: "contain", display: "block" }} />

        {/* ── Step 1: Form ── */}
        {step === "form" && (
          <>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.4rem" }}>
              Download AutoCount Accounting 2.2
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#6b6f91", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Tell us where to send the download link. We&apos;ll text you a 6-digit code to verify your number.
            </p>

            <Field label="Full Name *" inputStyle={inputStyle} labelStyle={labelStyle}>
              <input className="ksl-input" style={inputStyle} type="text" value={form.name}
                onChange={e => update("name", e.target.value)} placeholder="John Tan" autoFocus />
            </Field>
            <Field label="Email *" inputStyle={inputStyle} labelStyle={labelStyle}>
              <input className="ksl-input" style={inputStyle} type="email" value={form.email}
                onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field label="Phone (Malaysia) *" inputStyle={inputStyle} labelStyle={labelStyle}>
              <input className="ksl-input" style={inputStyle} type="tel" value={form.phone}
                onChange={e => update("phone", e.target.value)} placeholder="017-905 2323" />
            </Field>
            <Field label="Company (optional)" inputStyle={inputStyle} labelStyle={labelStyle}>
              <input className="ksl-input" style={inputStyle} type="text" value={form.company}
                onChange={e => update("company", e.target.value)} placeholder="Your Company Sdn. Bhd." />
            </Field>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.78rem", color: "#6b6f91", marginBottom: "1.25rem", lineHeight: 1.55, cursor: "pointer" }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                style={{ marginTop: 3, accentColor: "#c9a84c", flexShrink: 0 }} />
              <span>I agree to be contacted by KSL Business Solutions about AutoCount and related services.</span>
            </label>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <button onClick={requestOtp} disabled={loading}
              style={primaryBtn(loading)}>
              {loading ? "Sending code…" : "Send Verification Code"}
            </button>
          </>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && (
          <>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.4rem" }}>
              Enter Verification Code
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#6b6f91", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              We sent a 6-digit code to <strong style={{ color: "#2f315a" }}>{form.phone}</strong>. The code expires in 5 minutes.
            </p>

            <input
              className="ksl-input"
              type="text" inputMode="numeric" maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              autoFocus
              style={{
                ...inputStyle,
                fontSize: "1.6rem", textAlign: "center", letterSpacing: "0.6rem",
                fontWeight: 700, padding: "0.85rem", marginBottom: "1rem",
              }}
            />

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <button onClick={verifyOtp} disabled={loading || code.length !== 6}
              style={primaryBtn(loading || code.length !== 6)}>
              {loading ? "Verifying…" : "Verify & Download"}
            </button>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <button type="button" onClick={() => setStep("form")}
                style={{ background: "none", border: "none", color: "#6b6f91", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                ← Edit details
              </button>
              <button type="button" disabled={resendIn > 0 || loading} onClick={requestOtp}
                style={{ background: "none", border: "none", cursor: resendIn > 0 ? "default" : "pointer",
                  color: resendIn > 0 ? "#a8abcc" : "#c9a84c", fontFamily: "inherit", padding: 0, fontWeight: 600 }}>
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Success ── */}
        {step === "success" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(46,184,128,0.12)", color: "#2eb880",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "1.1rem", fontSize: "1.6rem",
            }}>✓</div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.4rem" }}>
              Download Started
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#6b6f91", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Your AutoCount download should begin automatically. If it doesn&apos;t, click the button below.
            </p>
            <a ref={dlAnchor} href={downloadUrl} download style={primaryBtn(false)}>
              Download Now
            </a>
            <button onClick={onClose}
              style={{ marginTop: "0.75rem", width: "100%", padding: "0.75rem", borderRadius: 50,
                background: "transparent", color: "#6b6f91", border: "none", fontFamily: "inherit",
                fontSize: "0.85rem", cursor: "pointer" }}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function Field({ label, labelStyle, children }) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ErrorMsg({ children }) {
  return (
    <div style={{
      background: "rgba(220,53,69,0.08)", color: "#c33545",
      border: "1px solid rgba(220,53,69,0.18)",
      padding: "0.6rem 0.8rem", borderRadius: 10,
      fontSize: "0.8rem", marginBottom: "1rem", lineHeight: 1.5,
    }}>
      {children}
    </div>
  );
}

function primaryBtn(disabled) {
  return {
    width: "100%", padding: "0.85rem 1rem",
    background: disabled ? "#d8b685" : "#c9a84c",
    color: "#1e2040", border: "none", borderRadius: 50,
    fontSize: "0.95rem", fontWeight: 700, fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none", textAlign: "center", display: "block",
    transition: "opacity 0.2s, background 0.2s",
    opacity: disabled ? 0.7 : 1,
  };
}
