
/**
 * Security utility for sanitizing data used in unsafe contexts like dangerouslySetInnerHTML.
 */

/**
 * Safely stringifies data for use in JSON-LD within <script> tags.
 * Uses Unicode escapes to prevent XSS (e.g. </script> injection) while preserving data integrity.
 *
 * @param data The data to stringify.
 * @returns A JSON string safe to embed in HTML.
 */
export function sanitizeJsonLd(data: any): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
                             .replace(/>/g, '\\u003e')
                             .replace(/&/g, '\\u0026')
                             .replace(/\u2028/g, '\\u2028') // Line separator
                             .replace(/\u2029/g, '\\u2029'); // Paragraph separator
}
