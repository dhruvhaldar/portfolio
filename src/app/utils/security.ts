/**
 * Sanitizes an object for safe embedding in JSON-LD within a <script> tag.
 * It strictly serializes the object to JSON and escapes characters that could
 * be used to break out of the script context or cause XSS.
 *
 * @param data - The data object to serialize and sanitize.
 * @returns A sanitized JSON string safe for injection into __html.
 */
export function sanitizeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
                             .replace(/>/g, '\\u003e')
                             .replace(/&/g, '\\u0026')
                             .replace(/\u2028/g, '\\u2028')
                             .replace(/\u2029/g, '\\u2029');
}
