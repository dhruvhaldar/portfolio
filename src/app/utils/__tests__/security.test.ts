
import { describe, it, expect } from 'vitest';
import { sanitizeJsonLd } from '../security';

describe('Security Utils', () => {
  describe('sanitizeJsonLd', () => {
    it('should escape < and > to prevent script injection', () => {
      const data = {
        name: '<script>alert("xss")</script>'
      };
      // Expected: {"name":"\u003cscript\u003ealert(\"xss\")\u003c/script\u003e"}
      // Note: JSON.stringify escapes " to \" automatically.
      const result = sanitizeJsonLd(data);
      expect(result).toContain('\\u003cscript\\u003e');
      expect(result).toContain('\\u003c/script\\u003e');
      expect(result).not.toContain('<script>');
    });

    it('should escape &', () => {
      const data = { val: 'Tom & Jerry' };
      const result = sanitizeJsonLd(data);
      expect(result).toContain('Tom \\u0026 Jerry');
    });

    it('should NOT corrupt URLs', () => {
      const data = { url: 'https://example.com/path?q=1' };
      const result = sanitizeJsonLd(data);
      // Should remain valid JSON string with correct URL chars (except if they contained <>&)
      expect(result).toContain('"url":"https://example.com/path?q=1"');

      // Verify parsing back works and gives original data
      const parsed = JSON.parse(result);
      expect(parsed.url).toBe('https://example.com/path?q=1');
    });

    it('should handle complex objects', () => {
      const data = {
        user: {
          name: 'O\'Neil',
          bio: '<b>Bold</b>'
        }
      };
      const result = sanitizeJsonLd(data);
      const parsed = JSON.parse(result);

      expect(parsed.user.name).toBe("O'Neil"); // ' is not escaped by our simple replacer (JSON.stringify handles it if needed, or leaves it)
      expect(parsed.user.bio).toBe('<b>Bold</b>'); // Recovered original string
      expect(result).toContain('\\u003cb\\u003eBold\\u003c/b\\u003e'); // But in the string it is escaped
    });

    it('should handle line separators', () => {
      const data = { text: 'Line\u2028Break' };
      const result = sanitizeJsonLd(data);
      expect(result).toContain('\\u2028');
      const parsed = JSON.parse(result);
      expect(parsed.text).toBe('Line\u2028Break');
    });
  });
});
