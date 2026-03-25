/**
 * Cloudflare Pages Function — Serve assets from R2
 *
 * GET /api/assets/:key  — Serve a file from R2
 * DELETE /api/assets/:key — Delete a file from R2
 *
 * The [[key]] catch-all route handles nested paths like:
 *   /api/assets/video/trail-123/1234567-video.mp4
 */

interface Env {
  ASSETS_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const key = decodeURIComponent((context.params.key as string[]).join("/"));

  const object = await context.env.ASSETS_BUCKET.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.etag);

  // For video files, support range requests for seeking
  if (object.httpMetadata?.contentType?.startsWith("video/")) {
    headers.set("Accept-Ranges", "bytes");
  }

  return new Response(object.body, { headers });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const key = decodeURIComponent((context.params.key as string[]).join("/"));

  await context.env.ASSETS_BUCKET.delete(key);

  return Response.json({ success: true, deleted: key });
};
