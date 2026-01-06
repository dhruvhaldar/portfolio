import { describe, it, expect } from 'vitest';
import { sanitizeJsonLd } from '../app/utils/security';

describe('sanitizeJsonLd', () => {
  it('should serialize simple objects correctly', () => {
    const data = { name: 'John Doe', age: 30 };
    const result = sanitizeJsonLd(data);
    expect(result).toBe('{"name":"John Doe","age":30}');
  });

  it('should escape < and >', () => {
    const data = { content: '<script>alert(1)</script>' };
    const result = sanitizeJsonLd(data);
    expect(result).toBe('{"content":"\\u003cscript\\u003ealert(1)\\u003c/script\\u003e"}');
  });

  it('should escape &', () => {
    const data = { company: 'Barnes & Noble' };
    const result = sanitizeJsonLd(data);
    expect(result).toBe('{"company":"Barnes \\u0026 Noble"}');
  });

  it('should handle unicode line separators', () => {
    const data = { text: 'Hello\u2028World' };
    const result = sanitizeJsonLd(data);
    expect(result).toBe('{"text":"Hello\\u2028World"}');
  });

  it('should handle arrays', () => {
    const data = ['<a>', '<b>'];
    const result = sanitizeJsonLd(data);
    expect(result).toBe('["\\u003ca\\u003e","\\u003cb\\u003e"]');
  });

  it('should handle nested objects', () => {
    const data = { user: { name: 'Alice', bio: 'I love <cats>' } };
    const result = sanitizeJsonLd(data);
    expect(result).toBe('{"user":{"name":"Alice","bio":"I love \\u003ccats\\u003e"}}');
  });
});
