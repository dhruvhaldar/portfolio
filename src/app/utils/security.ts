/**
 * Sanitizes an object for safe embedding in JSON-LD within a <script> tag.
 * It strictly serializes the object to JSON and escapes characters that could
 * be used to break out of the script context or cause XSS.
 *
 * @param data - The data object to serialize and sanitize.
 * @returns A sanitized JSON string safe for injection into __html.
 */
export function sanitizeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Validates an email address for correct format and length.
 *
 * @param email - The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  // Max length of an email address is 254 characters (RFC 5321)
  if (email.length > 254) return false;

  // Strict email validation regex
  // Ensures:
  // - Local part allows alphanumeric and ._%+-
  // - Domain part allows alphanumeric and -
  // - Domain parts must be separated by single dot
  // - TLD must be at least 2 characters
  // - Prevents consecutive dots in domain
  // - Prevents consecutive dots in local part
  const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const SAFE_URL_MAX_LENGTH = 2048;
const DANGEROUS_SCHEMES_REGEX = /^\s*(javascript|vbscript|data|file):/i;
// Bolt Optimization: Pre-compile regex and allowed protocols
// Regex to extract protocol scheme. Matches start of string (ignoring whitespace),
// followed by a letter, then alphanumerics/plus/minus/dot, and a colon.
const PROTOCOL_SCHEME_REGEX = /^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/;
const ALLOWED_URL_PROTOCOLS = new Set(["http", "https", "mailto", "tel"]);
const ALLOWED_IMAGE_PROTOCOLS = new Set(["http", "https", "data", "blob"]);

// 🛡️ Sentinel: Anchored regex to prevent confusion attacks (e.g. matching inside query params)
// Also supports youtube-nocookie.com for privacy-enhanced embeds
const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?(?:(?:youtube\.com|youtube-nocookie\.com)\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

/**
 * Validates if a URL is a valid YouTube URL.
 *
 * @param url - The URL to validate.
 * @returns True if the URL is a valid YouTube URL, false otherwise.
 */
export function validateYoutubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url);
}

/**
 * Extracts the YouTube video ID from a URL.
 *
 * @param url - The URL to extract the ID from.
 * @returns The YouTube video ID if found, null otherwise.
 */
export function extractYoutubeId(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

/**
 * Validates if a URL is safe to be used in an href attribute.
 * Uses an allowlist approach for protocols and robustly handles URL parsing.
 *
 * @param url - The URL to validate.
 * @returns True if the URL is safe, false otherwise.
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  if (url.length > SAFE_URL_MAX_LENGTH) return false;

  const href = url.trim();

  // 🛡️ Sentinel: Sanitize to prevent filter bypass (e.g. java\0script:)
  // Strip control characters (0x00-0x1F, 0x7F)
  const sanitized = href.replace(/[\x00-\x1F\x7F]/g, "").trim();

  // 🛡️ Sentinel: Block dangerous schemes even if URL parsing fails or handles them weirdly
  if (DANGEROUS_SCHEMES_REGEX.test(sanitized)) {
    return false;
  }

  // Bolt Optimization: Check for protocol scheme to avoid expensive try-catch with new URL()
  // for relative URLs.
  const protocolMatch = sanitized.match(PROTOCOL_SCHEME_REGEX);

  // If no protocol scheme is found, treat it as a relative URL (safe)
  if (!protocolMatch) {
    return true;
  }

  const protocol = protocolMatch[1].toLowerCase();

  if (ALLOWED_URL_PROTOCOLS.has(protocol)) {
    try {
      new URL(sanitized);
      return true;
    } catch (e) {
      // Malformed absolute URL
      return false;
    }
  }

  return false;
}

/**
 * Validates if an image source URL is safe.
 * Allows data: and blob: schemes which are often used for images.
 *
 * @param src - The image source URL.
 * @returns True if the URL is safe, false otherwise.
 */
export function isSafeImageSrc(src: string): boolean {
  if (!src) return false;

  const href = src.trim();

  // 🛡️ Sentinel: Sanitize to prevent filter bypass (e.g. java\0script:)
  // Strip control characters (0x00-0x1F, 0x7F)
  const sanitized = href.replace(/[\x00-\x1F\x7F]/g, "").trim();

  // 🛡️ Sentinel: Explicitly block dangerous schemes
  if (/^\s*(javascript|vbscript):/i.test(sanitized)) {
    return false;
  }

  // Bolt Optimization: Check for protocol scheme to avoid expensive try-catch with new URL()
  // for relative URLs.
  const protocolMatch = sanitized.match(PROTOCOL_SCHEME_REGEX);

  // If no protocol scheme is found, treat it as a relative URL (safe)
  if (!protocolMatch) {
    return true;
  }

  const protocol = protocolMatch[1].toLowerCase();

  if (ALLOWED_IMAGE_PROTOCOLS.has(protocol)) {
    try {
      new URL(sanitized);
      return true;
    } catch (e) {
      // Malformed absolute URL
      return false;
    }
  }

  return false;
}
