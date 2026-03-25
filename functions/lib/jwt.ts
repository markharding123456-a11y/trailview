/**
 * Shared JWT verification helper for Cloudflare Pages Functions.
 *
 * Uses the Web Crypto API (available in Cloudflare Workers runtime)
 * to cryptographically verify HMAC-SHA256 signatures on Supabase JWTs.
 */

/**
 * Base64url-decode a string to a Uint8Array.
 */
function base64UrlDecode(str: string): Uint8Array {
  // Convert base64url to standard base64
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verify a Supabase JWT using HMAC-SHA256 signature verification.
 *
 * @param token  - The raw JWT string (header.payload.signature)
 * @param secret - The Supabase JWT secret (from Dashboard > Settings > API)
 * @returns An object with `valid: true` and the decoded `payload` if verification
 *          succeeds, or `valid: false` otherwise.
 */
export async function verifyJwt(
  token: string,
  secret: string,
): Promise<{ valid: boolean; payload?: any }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // 1. Decode header and verify algorithm
    const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64)));
    if (header.alg !== "HS256") {
      return { valid: false };
    }

    // 2. Import the secret as a CryptoKey for HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    // 3. Verify the signature over "<header>.<payload>"
    const signingInput = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlDecode(signatureB64);

    const isValid = await crypto.subtle.verify("HMAC", cryptoKey, signature, signingInput);
    if (!isValid) {
      return { valid: false };
    }

    // 4. Decode payload and validate claims
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));

    // Check expiration (exp is in seconds since epoch)
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    // Check issuer contains "supabase"
    if (!payload.iss || !payload.iss.includes("supabase")) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
