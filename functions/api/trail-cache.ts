/**
 * Cloudflare Pages Function — Trail Cache via KV
 *
 * GET /api/trail-cache?key=gpx:trail-123  — Read cached data (public)
 * PUT /api/trail-cache                    — Write to cache (authenticated)
 *
 * Used to cache sync manifests and trail metadata at the edge
 * for instant loads without hitting Supabase.
 */

interface Env {
  TRAIL_CACHE: KVNamespace;
}

// TODO: Implement proper JWT signature verification with Supabase JWT secret
/**
 * Validate a Supabase JWT by decoding the payload and checking expiration.
 * Returns true if the token is present and not expired.
 */
function isValidJwt(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false;
    if (decoded.exp <= Math.floor(Date.now() / 1000)) return false;
    if (!decoded.iss || !decoded.iss.includes("supabase")) return false;
    return true;
  } catch {
    return false;
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return new Response("Missing key parameter", { status: 400 });
    }

    const value = await context.env.TRAIL_CACHE.get(key);
    if (value === null) {
      return new Response("Not found", { status: 404 });
    }

    // Try to parse as JSON, otherwise return as text
    try {
      const json = JSON.parse(value);
      return Response.json(json);
    } catch {
      return new Response(value, {
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch {
    return Response.json({ error: "Cache read failed" }, { status: 500 });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  // --- Authentication check ---
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  if (!token || !isValidJwt(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await context.request.json() as { key: string; value: any; ttl?: number };
    const { key, value, ttl } = body;

    if (!key || value === undefined) {
      return new Response("Missing key or value", { status: 400 });
    }

    const stringValue = typeof value === "string" ? value : JSON.stringify(value);

    await context.env.TRAIL_CACHE.put(key, stringValue, {
      expirationTtl: ttl || 60 * 60 * 24 * 7, // Default 7 days
    });

    return Response.json({ success: true, key });
  } catch {
    return Response.json({ error: "Cache write failed" }, { status: 500 });
  }
};
