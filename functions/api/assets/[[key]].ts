/**
 * Cloudflare Pages Function — Serve assets from R2
 *
 * GET /api/assets/:key  — Serve a file from R2
 * DELETE /api/assets/:key — Delete a file from R2 (authenticated)
 *
 * The [[key]] catch-all route handles nested paths like:
 *   /api/assets/video/trail-123/1234567-video.mp4
 */

import { verifyJwt } from "../../lib/jwt";

interface Env {
  ASSETS_BUCKET: R2Bucket;
  SUPABASE_JWT_SECRET: string;
}

const VALID_KEY_PATTERN = /^(video|gpx|thumbnail)\/[\w\-]+\/[\w\-\.]+$/;

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
  const { valid } = await verifyJwt(token, context.env.SUPABASE_JWT_SECRET);
  if (!valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = decodeURIComponent((context.params.key as string[]).join("/"));

  await context.env.ASSETS_BUCKET.delete(key);

  return Response.json({ success: true, deleted: key });
};
