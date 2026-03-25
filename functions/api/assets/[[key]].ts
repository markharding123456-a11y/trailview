/**
 * Cloudflare Pages Function — Serve assets from R2
 *
 * GET /api/assets/:key  — Serve a file from R2
 * DELETE /api/assets/:key — Delete a file from R2 (authenticated)
 *
 * The [[key]] catch-all route handles nested paths like:
 *   /api/assets/video/trail-123/1234567-video.mp4
 */

interface Env {
  ASSETS_BUCKET: R2Bucket;
}

const VALID_KEY_PATTERN = /^(video|gpx|thumbnail)\/[\w\-]+\/[\w\-\.]+$/;

// TODO: Implement proper JWT signature verification with Supabase JWT secret
/**
 * Validate a Supabase JWT by decoding the payload and checking expiration.
 * Returns true if the token is present and not expired.
 */
function isValidJwt(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    // Base64url decode the payload
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false;
    // Check expiration (exp is in seconds)
    if (decoded.exp <= Math.floor(Date.now() / 1000)) return false;
    // Check issuer contains "supabase"
    if (!decoded.iss || !decoded.iss.includes("supabase")) return false;
    return true;
  } catch {
    return false;
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const key = decodeURIComponent((context.params.key as string[]).join("/"));

  // Validate key matches expected asset path pattern
  if (!VALID_KEY_PATTERN.test(key)) {
    return Response.json({ error: "Invalid asset path" }, { status: 400 });
  }

  const object = await context.env.ASSETS_BUCKET.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.etag);

  // Security headers
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");

  // CORS headers — assets need to be loadable from any origin
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, HEAD");

  // For video files, support range requests for seeking
  if (object.httpMetadata?.contentType?.startsWith("video/")) {
    headers.set("Accept-Ranges", "bytes");
  }

  return new Response(object.body, { headers });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  // --- Authentication check ---
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  if (!token || !isValidJwt(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = decodeURIComponent((context.params.key as string[]).join("/"));

  await context.env.ASSETS_BUCKET.delete(key);

  return Response.json({ success: true, deleted: key });
};
