export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();

  // Clone response to add headers
  const newResponse = new Response(response.body, response);

  // Security headers
  newResponse.headers.set("X-Content-Type-Options", "nosniff");
  newResponse.headers.set("X-Frame-Options", "DENY");
  newResponse.headers.set("X-XSS-Protection", "1; mode=block");
  newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newResponse.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Content Security Policy - allow self, Supabase, OpenStreetMap tiles, Leaflet CDN
  newResponse.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js needs unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'", // Tailwind/inline styles
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://cdnjs.cloudflare.com",
      "media-src 'self' blob:", // Video playback
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co", // Supabase API + realtime
      "font-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  // HSTS (when deployed with HTTPS)
  newResponse.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  return newResponse;
};
