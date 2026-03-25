/**
 * Cloudflare Pages Function — File Upload to R2
 *
 * Handles GPX, video, and thumbnail uploads.
 * Files are stored in R2 under: {type}/{trailId}/{filename}
 *
 * POST /api/upload
 * Body: multipart/form-data with fields: file, trailId, type
 */

interface Env {
  ASSETS_BUCKET: R2Bucket;
  TRAIL_CACHE: KVNamespace;
}

const MAX_SIZES: Record<string, number> = {
  gpx: 10 * 1024 * 1024,        // 10 MB
  thumbnail: 5 * 1024 * 1024,   // 5 MB
  video: 500 * 1024 * 1024,     // 500 MB
};

const ALLOWED_TYPES: Record<string, string[]> = {
  gpx: [".gpx"],
  thumbnail: [".jpg", ".jpeg", ".png", ".webp"],
  video: [".mp4", ".mov", ".webm"],
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get("file") as File | null;
    const trailId = formData.get("trailId") as string | null;
    const type = formData.get("type") as string | null;

    if (!file || !trailId || !type) {
      return new Response("Missing required fields: file, trailId, type", { status: 400 });
    }

    if (!["gpx", "thumbnail", "video"].includes(type)) {
      return new Response("Invalid type. Must be: gpx, thumbnail, or video", { status: 400 });
    }

    // Validate file size
    const maxSize = MAX_SIZES[type];
    if (file.size > maxSize) {
      return new Response(
        `File too large. Max size for ${type}: ${(maxSize / 1024 / 1024).toFixed(0)} MB`,
        { status: 413 }
      );
    }

    // Validate file extension
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_TYPES[type].includes(ext)) {
      return new Response(
        `Invalid file type. Allowed for ${type}: ${ALLOWED_TYPES[type].join(", ")}`,
        { status: 400 }
      );
    }

    // Build the R2 key: type/trailId/timestamp-filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${type}/${trailId}/${timestamp}-${safeName}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await context.env.ASSETS_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
      customMetadata: {
        trailId,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    // If it's a GPX file, cache the parsed content in KV for fast reads
    if (type === "gpx") {
      const text = new TextDecoder().decode(arrayBuffer);
      await context.env.TRAIL_CACHE.put(
        `gpx:${trailId}`,
        text,
        { expirationTtl: 60 * 60 * 24 * 30 } // 30 days
      );
    }

    const url = `/api/assets/${encodeURIComponent(key)}`;

    return Response.json({
      success: true,
      key,
      url,
      size: file.size,
    });
  } catch (err: any) {
    return new Response(`Upload error: ${err.message}`, { status: 500 });
  }
};
