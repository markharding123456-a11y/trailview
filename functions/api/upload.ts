/**
 * Cloudflare Pages Function — File Upload to R2
 *
 * Handles GPX, video, and thumbnail uploads.
 * Files are stored in R2 under: {type}/{trailId}/{filename}
 *
 * POST /api/upload
 * Body: multipart/form-data with fields: file, trailId, type
 */

import { verifyJwt } from "../lib/jwt";

interface Env {
  ASSETS_BUCKET: R2Bucket;
  TRAIL_CACHE: KVNamespace;
  SUPABASE_JWT_SECRET: string;
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

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  gpx: ["application/gpx+xml", "text/xml", "application/xml"],
  thumbnail: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/quicktime", "video/webm"],
};

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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    // --- Authentication check ---
    const authHeader = context.request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.slice(7);
    if (!token || !isValidJwt(token)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT payload to extract user ID for rate limiting
    const jwtPayload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));

    // --- Rate limiting ---
    const userId = jwtPayload.sub || 'anonymous';
    const rateLimitKey = `rate-limit:upload:${userId}`;
    const currentCount = parseInt(await context.env.TRAIL_CACHE.get(rateLimitKey) || '0');

    if (currentCount >= 10) {
      return Response.json(
        { error: "Rate limit exceeded. Maximum 10 uploads per hour." },
        { status: 429, headers: { "X-RateLimit-Limit": "10", "X-RateLimit-Remaining": "0" } }
      );
    }

    // Increment count with 1-hour TTL
    await context.env.TRAIL_CACHE.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 3600 });
    const remaining = 10 - (currentCount + 1);

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

    // Validate MIME type
    if (file.type && !ALLOWED_MIME_TYPES[type].includes(file.type)) {
      return new Response(
        `Invalid MIME type. Allowed for ${type}: ${ALLOWED_MIME_TYPES[type].join(", ")}`,
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
    }, {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch {
    return Response.json({ error: "Upload failed" }, {
      status: 500,
      headers: { "X-Content-Type-Options": "nosniff" },
    });
  }
};
