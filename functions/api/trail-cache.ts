/**
 * Cloudflare Pages Function — Trail Cache via KV
 *
 * GET /api/trail-cache?key=gpx:trail-123  — Read cached data
 * PUT /api/trail-cache                    — Write to cache
 *
 * Used to cache sync manifests and trail metadata at the edge
 * for instant loads without hitting Supabase.
 */

interface Env {
  TRAIL_CACHE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
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
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
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
  } catch (err: any) {
    return new Response(`Cache write error: ${err.message}`, { status: 500 });
  }
};
