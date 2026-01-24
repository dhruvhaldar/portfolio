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

// 🛡️ Sentinel: Centralized YouTube URL validation regex
// Anchored to start to prevent confusion.
// Captures the 11-character ID.
export const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

/**
 * Validates if a URL is a valid YouTube URL.
 * @param url - The URL to validate
 */
export function validateYoutubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return YOUTUBE_REGEX.test(url);
}

/**
 * Extracts the YouTube video ID from a URL.
 * Returns null if the URL is invalid or no ID is found.
 * @param url - The URL to extract from
 */
export function extractYoutubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}
