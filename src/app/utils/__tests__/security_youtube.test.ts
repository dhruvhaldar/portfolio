import { describe, it, expect } from 'vitest';
import { validateYoutubeUrl, extractYoutubeId } from '../security';

describe('YouTube URL Security', () => {
  const validUrls = [
    'https://www.youtube.com/watch?v=12345678901',
    'http://www.youtube.com/watch?v=12345678901',
    'https://youtube.com/watch?v=12345678901',
    'http://youtube.com/watch?v=12345678901',
    'https://youtu.be/12345678901',
    'https://www.youtube.com/embed/12345678901',
    'https://www.youtube.com/v/12345678901',
    'https://www.youtube.com/watch?v=12345678901&feature=share',
    'https://m.youtube.com/watch?v=12345678901',
  ];

  describe('validateYoutubeUrl', () => {
    validUrls.forEach(url => {
      it(`should validate ${url}`, () => {
        expect(validateYoutubeUrl(url)).toBe(true);
      });
    });

    it('should block unanchored matches (evil.com)', () => {
       // This tests that ^ anchor works
       const evilUrl = 'https://evil.com/?u=youtube.com/watch?v=12345678901';
       expect(validateYoutubeUrl(evilUrl)).toBe(false);
    });

    it('should return false for non-string inputs', () => {
        expect(validateYoutubeUrl(null as any)).toBe(false);
        expect(validateYoutubeUrl(undefined as any)).toBe(false);
        expect(validateYoutubeUrl(123 as any)).toBe(false);
    });
  });

  describe('extractYoutubeId', () => {
    it('should extract correct ID from valid URLs', () => {
      validUrls.forEach(url => {
        expect(extractYoutubeId(url)).toBe('12345678901');
      });
    });

    it('should return null for invalid URLs', () => {
        expect(extractYoutubeId('https://google.com')).toBeNull();
        expect(extractYoutubeId('javascript:alert(1)')).toBeNull();
        expect(extractYoutubeId('https://evil.com/?u=youtube.com/watch?v=12345678901')).toBeNull();
    });

    it('should sanitize XSS attempts by only extracting ID', () => {
        // Even if input has garbage at end, we only want the ID.
        // Current regex: `([a-zA-Z0-9_-]{11})` matches 11 chars.
        // If input is `...v=12345678901<script>`, match[1] should be `12345678901`.
        const nastyUrl = 'https://www.youtube.com/watch?v=12345678901<script>alert(1)</script>';
        expect(extractYoutubeId(nastyUrl)).toBe('12345678901');
    });

    it('should handle short IDs (invalid) gracefully', () => {
        // Only 10 chars
        const shortUrl = 'https://www.youtube.com/watch?v=1234567890';
        expect(extractYoutubeId(shortUrl)).toBeNull();
    });
  });
});
