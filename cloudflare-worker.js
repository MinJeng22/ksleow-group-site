/**
 * Cloudflare Worker — KSL Sales2DO AI Backend + Decap CMS OAuth
 * ═════════════════════════════════════════════════════════════════
 *
 * SETUP STEPS:
 * 1. Create a new Worker at https://dash.cloudflare.com → Workers & Pages
 * 2. Paste this entire file as the Worker script
 * 3. Add the following Environment Variables (Settings → Variables):
 *      VERTEX_API_KEY      — your Google Cloud Vertex AI API key
 *                            (from: console.cloud.google.com → APIs → Credentials)
 *      GCS_SIGNED_URL_KEY  — your Google Service Account JSON key (base64-encoded)
 *                            run:  base64 your-service-account.json
 *      GCS_BUCKET          — your Google Cloud Storage bucket name
 *      ALLOWED_ORIGIN      — your frontend URL e.g. https://ksleow.com
 *
 *    For the Decap CMS admin (/admin) login, also add:
 *      OAUTH_GITHUB_CLIENT_ID     — GitHub OAuth App Client ID
 *      OAUTH_GITHUB_CLIENT_SECRET — GitHub OAuth App Client Secret
 *
 * 4. Set your Worker URL in AIChatbot.jsx → WORKER_URL constant
 * 5. Set the same Worker URL in public/admin/config.yml → backend.base_url
 *
 * GITHUB OAUTH APP SETUP (one time, ~2 min):
 *   • Visit:  https://github.com/settings/developers  →  "New OAuth App"
 *   • Application name:        KSL Content Manager
 *   • Homepage URL:            https://ksleow.com
 *   • Authorization callback:  https://YOUR-WORKER.workers.dev/callback
 *   • Generate a client secret, then save both values as Worker env vars above.
 *
 * GOOGLE CLOUD SETUP:
 *   • Enable:  Cloud Storage API, Vertex AI API
 *   • Create a GCS bucket with:
 *       – Lifecycle rule: delete objects after 1 day ("阅后即焚")
 *       – Fine-grained access control
 *   • Create a Service Account with roles:
 *       – Storage Object Creator  (for signed URL generation)
 *       – Storage Object Viewer
 *   • Download the Service Account JSON key, base64-encode it (see above)
 *
 * ═════════════════════════════════════════════════════════════════
 */

const VERTEX_ENDPOINT =
  "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent";

/* ── IP rate limiter — max 20 requests per IP per minute ── */
const ipCounts = new Map(); // NOTE: resets on Worker cold start (use KV for persistence)

function checkRateLimit(ip) {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 20;
  const entry = ipCounts.get(ip) || { count: 0, start: now };
  if (now - entry.start > window) {
    ipCounts.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  ipCounts.set(ip, entry);
  return true;
}

/* ── CORS helper ── */
function cors(env) {
  return {
    "Access-Control-Allow-Origin":  env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors(env) },
  });
}

/* ── Generate a GCS signed URL using the Service Account key ── */
async function generateSignedUrl(env, ext) {
  const keyJson = JSON.parse(atob(env.GCS_SIGNED_URL_KEY));
  const bucket  = env.GCS_BUCKET;
  const object  = `uploads/${crypto.randomUUID()}.${ext}`;
  const expires = Math.floor(Date.now() / 1000) + 300; // 5 minutes

  // Build string-to-sign (V4 signing)
  const host          = "storage.googleapis.com";
  const canonicalUri  = `/${bucket}/${object}`;
  const dateTime      = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const dateStamp     = dateTime.slice(0, 8);
  const credScope     = `${dateStamp}/auto/storage/goog4_request`;
  const credential    = `${keyJson.client_email}/${credScope}`;

  const signedHeaders = "content-type;host";
  const canonicalQuery = [
    `X-Goog-Algorithm=GOOG4-RSA-SHA256`,
    `X-Goog-Credential=${encodeURIComponent(credential)}`,
    `X-Goog-Date=${dateTime}`,
    `X-Goog-Expires=300`,
    `X-Goog-SignedHeaders=${signedHeaders}`,
  ].join("&");

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuery,
    `content-type:image/jpeg\nhost:${host}\n`,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalRequest)
  );
  const canonicalHash = [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const stringToSign = [
    "GOOG4-RSA-SHA256",
    dateTime,
    credScope,
    canonicalHash,
  ].join("\n");

  // Import the RSA private key from the service account JSON
  const pemBody = keyJson.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", keyData.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", cryptoKey,
    new TextEncoder().encode(stringToSign)
  );
  const signature = [...new Uint8Array(sigBuffer)]
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const signedUrl = `https://${host}/${bucket}/${object}?${canonicalQuery}&X-Goog-Signature=${signature}`;
  const gsPath    = `gs://${bucket}/${object}`;

  return { signedUrl, gsPath };
}

/* ══════════════════════════════════════════════════════════════
 * Decap CMS — GitHub OAuth proxy
 * ──────────────────────────────────────────────────────────────
 * Decap opens /oauth in a popup. We redirect to GitHub, GitHub
 * redirects to /callback with a code, we exchange it for an
 * access token, then post the token back to the opener window
 * using the message format Decap expects.
 * ══════════════════════════════════════════════════════════════ */

function oauthRedirect(env, request) {
  const url      = new URL(request.url);
  const callback = `${url.origin}/callback`;
  const state    = crypto.randomUUID();
  const auth = new URL("https://github.com/login/oauth/authorize");
  auth.searchParams.set("client_id",    env.OAUTH_GITHUB_CLIENT_ID);
  auth.searchParams.set("redirect_uri", callback);
  auth.searchParams.set("scope",        "repo,user");
  auth.searchParams.set("state",        state);
  return Response.redirect(auth.toString(), 302);
}

async function oauthCallback(env, request) {
  const url  = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing ?code parameter from GitHub", { status: 400 });
  }

  let token, error;
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id:     env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await tokenRes.json();
    if (data.error)         error = data.error_description || data.error;
    else if (data.access_token) token = data.access_token;
    else                        error = "No access_token in GitHub response";
  } catch (e) {
    error = e.message;
  }

  // Decap expects: window.opener.postMessage("authorization:github:<status>:<json>", "*")
  const status  = error ? "error" : "success";
  const payload = error ? { message: error } : { token, provider: "github" };
  const msg     = `authorization:github:${status}:${JSON.stringify(payload)}`;

  const html = `<!DOCTYPE html>
<html><body>
<script>
  (function() {
    function send(target) {
      target.postMessage(${JSON.stringify(msg)}, "*");
    }
    window.addEventListener("message", function (e) {
      if (e.data === "authorizing:github" && window.opener) send(window.opener);
    }, false);
    if (window.opener) {
      send(window.opener);
      setTimeout(function () { window.close(); }, 600);
    } else {
      document.body.innerText = ${JSON.stringify(error ? "Login failed: " + error : "Logged in. You can close this window.")};
    }
  })();
</script>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}

/* ── Main fetch handler ── */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ip  = request.headers.get("CF-Connecting-IP") || "unknown";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    /* ── Decap CMS OAuth (GitHub) ── */
    if (url.pathname === "/oauth")    return oauthRedirect(env, request);
    if (url.pathname === "/callback") return oauthCallback(env, request);

    /* ── Route: POST /upload ──
     * Accepts { image_base64 } (JPEG, base64-encoded).
     * Generates a GCS signed URL server-side, PUTs the image to GCS
     * from inside the Worker (no browser→GCS CORS setup required),
     * and returns { gsPath } for use in subsequent /chat calls.
     * The GCS bucket lifecycle rule deletes the file after 1 day. */
    if (url.pathname === "/upload" && request.method === "POST") {
      if (!checkRateLimit(ip)) {
        return json({ error: "Rate limit exceeded. Please wait a moment." }, 429, env);
      }
      try {
        const { image_base64 } = await request.json();
        if (!image_base64) return json({ error: "Missing image_base64" }, 400, env);

        // Generate a signed PUT URL (always JPEG — frontend converts via canvas)
        const { signedUrl, gsPath } = await generateSignedUrl(env, "jpg");

        // Decode base64 → binary and PUT to GCS from the Worker
        const binary = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
        const putRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/jpeg" },
          body: binary,
        });
        if (!putRes.ok) {
          const errText = await putRes.text();
          return json({ error: `GCS upload failed (${putRes.status}): ${errText}` }, 502, env);
        }
        return json({ gsPath }, 200, env);
      } catch (err) {
        return json({ error: "Upload failed: " + err.message }, 500, env);
      }
    }

    /* ── Route: POST /signed-url ── */
    if (url.pathname === "/signed-url" && request.method === "POST") {
      if (!checkRateLimit(ip)) {
        return json({ error: "Rate limit exceeded. Please wait a moment." }, 429, env);
      }
      try {
        const { ext = "jpg" } = await request.json();
        const result = await generateSignedUrl(env, ext);
        return json(result, 200, env);
      } catch (err) {
        return json({ error: "Failed to generate upload URL: " + err.message }, 500, env);
      }
    }

    /* ── Route: POST /chat ── */
    if (url.pathname === "/chat" && request.method === "POST") {
      if (!checkRateLimit(ip)) {
        return json({ error: "Rate limit exceeded. Please wait a moment." }, 429, env);
      }

      let body;
      try { body = await request.json(); }
      catch { return json({ error: "Invalid JSON" }, 400, env); }

      const { systemPrompt, messages } = body;

      // Build Vertex AI contents array.
      // Images are referenced by GCS path — uploaded once via POST /upload.
      const contents = messages.map(m => {
        const parts = [];
        if (m.gsPath) {
          parts.push({ fileData: { mimeType: "image/jpeg", fileUri: m.gsPath } });
        }
        if (m.text) parts.push({ text: m.text });
        return { role: m.role === "assistant" ? "model" : "user", parts };
      });

      const payload = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      };

      /* ── Stream from Vertex AI → client (SSE passthrough) ── */
      const vertexRes = await fetch(
        `${VERTEX_ENDPOINT}?key=${env.VERTEX_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!vertexRes.ok) {
        const errText = await vertexRes.text();
        return json({ error: `Vertex AI error: ${errText}` }, vertexRes.status, env);
      }

      // Transform the Vertex AI response into SSE stream for the client
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      (async () => {
        const reader = vertexRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // Vertex returns JSON array chunks — parse and re-emit as SSE
            // Try to extract complete JSON objects
            let start = buffer.indexOf("{");
            while (start !== -1) {
              let depth = 0, end = -1;
              for (let i = start; i < buffer.length; i++) {
                if (buffer[i] === "{") depth++;
                else if (buffer[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
              }
              if (end === -1) break;
              const chunk = buffer.slice(start, end + 1);
              buffer = buffer.slice(end + 1);
              start = buffer.indexOf("{");
              try {
                const parsed = JSON.parse(chunk);
                await writer.write(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
              } catch { /* skip malformed */ }
            }
          }
          await writer.write(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          await writer.write(encoder.encode(`data: {"error":"${e.message}"}\n\n`));
        } finally {
          writer.close();
        }
      })();

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
          ...cors(env),
        },
      });
    }

    return json({ error: "Not found" }, 404, env);
  },
};
