import { describe, it, expect } from 'vitest';
import { validateYoutubeUrl, extractYoutubeId } from '../security';

describe('YouTube URL Security', () => {
  const validUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://youtube.com/v/dQw4w9WgXcQ',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123s',
  ];

  const invalidUrls = [
    'https://evil.com',
    'https://google.com',
    'https://vimeo.com/123456',
    'https://www.youtube.com/watch?v=short', // ID too short
    'https://youtu.be/short',
    'javascript:alert(1)',
    'https://evil.com/?u=youtube.com/watch?v=dQw4w9WgXcQ', // URL parameter confusion
    'https://evil.com/youtube.com/watch?v=dQw4w9WgXcQ', // Path confusion
    'https://www.youtube.com.evil.com/watch?v=dQw4w9WgXcQ', // Subdomain confusion
  ];

  describe('validateYoutubeUrl', () => {
    it('should return true for valid YouTube URLs', () => {
      validUrls.forEach(url => {
        expect(validateYoutubeUrl(url)).toBe(true);
      });
    });

    it('should return false for invalid or malicious URLs', () => {
      invalidUrls.forEach(url => {
        expect(validateYoutubeUrl(url)).toBe(false);
      });
    });
  });

  describe('extractYoutubeId', () => {
    it('should correctly extract ID from valid URLs', () => {
      validUrls.forEach(url => {
        expect(extractYoutubeId(url)).toBe('dQw4w9WgXcQ');
      });
    });

    it('should return null for invalid URLs', () => {
      invalidUrls.forEach(url => {
        expect(extractYoutubeId(url)).toBeNull();
      });
    });
  });
});
