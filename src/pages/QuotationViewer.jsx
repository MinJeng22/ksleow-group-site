import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

function getStoredPdfUrl(searchParams) {
  const quote = searchParams.get("quote") || searchParams.get("id") || "";
  const token = searchParams.get("token") || "";
  if (!quote || !token) return "";

  const params = new URLSearchParams({ quote, token });
  return `/api/quotation?${params.toString()}`;
}

export default function QuotationViewer() {
  const [searchParams] = useSearchParams();
  const pdfUrl = useMemo(() => getStoredPdfUrl(searchParams), [searchParams]);

  useEffect(() => {
    if (pdfUrl) window.location.replace(pdfUrl);
  }, [pdfUrl]);

  if (pdfUrl) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#f5f5f8", color: "#2f315a", textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.7rem" }}>Opening PDF...</h1>
          <a href={pdfUrl} style={{ color: "#2f315a", fontWeight: 700 }}>Open PDF manually</a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#f5f5f8", color: "#2f315a", textAlign: "center" }}>
      <div style={{ maxWidth: 520 }}>
        <img src="/ksl-logo-circle.webp" alt="" width="56" height="56" style={{ borderRadius: "50%", marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Quotation Link Unavailable</h1>
        <p style={{ color: "#6b6f91", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          This quotation link is missing a valid quote token. Please request a new quotation from KS Omni.
        </p>
        <Link to="/omni" style={{ color: "#2f315a", fontWeight: 700 }}>Back to KS Omni</Link>
      </div>
    </main>
  );
}
