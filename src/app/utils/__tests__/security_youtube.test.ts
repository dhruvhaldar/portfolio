import { describe, it, expect } from 'vitest';
import { validateYoutubeUrl, extractYoutubeId } from '../security';

describe('YouTube Security Utils', () => {
  describe('validateYoutubeUrl', () => {
    it('should return true for valid standard YouTube URLs', () => {
      expect(validateYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(validateYoutubeUrl('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(validateYoutubeUrl('www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(validateYoutubeUrl('youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    });

    it('should return true for valid short YouTube URLs', () => {
      expect(validateYoutubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(validateYoutubeUrl('http://youtu.be/dQw4w9WgXcQ')).toBe(true);
    });

    it('should return true for embed URLs', () => {
      expect(validateYoutubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
    });

    it('should return false for invalid IDs', () => {
      expect(validateYoutubeUrl('https://www.youtube.com/watch?v=short')).toBe(false); // Too short
      expect(validateYoutubeUrl('https://www.youtube.com/watch?v=toolongidhere')).toBe(false); // Too long
      expect(validateYoutubeUrl('https://www.youtube.com/watch?v=inv@lidID!')).toBe(false); // Invalid chars
    });

    it('should return false for non-YouTube domains', () => {
      expect(validateYoutubeUrl('https://www.vimeo.com/watch?v=dQw4w9WgXcQ')).toBe(false);
      expect(validateYoutubeUrl('https://www.evil.com/youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false); // Confusion
    });

    it('should return false for empty or non-string inputs', () => {
      expect(validateYoutubeUrl('')).toBe(false);
      // @ts-ignore
      expect(validateYoutubeUrl(null)).toBe(false);
      // @ts-ignore
      expect(validateYoutubeUrl(undefined)).toBe(false);
    });

    it('should handle excessively long URLs gracefully (DoS prevention)', () => {
      const longUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' + 'a'.repeat(3000);
      expect(validateYoutubeUrl(longUrl)).toBe(false);
    });
  });

  describe('extractYoutubeId', () => {
    it('should extract ID from standard URLs', () => {
      expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from short URLs', () => {
      expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from embed URLs', () => {
      expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URLs', () => {
      expect(extractYoutubeId('https://www.evil.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    });

    it('should extract ID even if there are query parameters', () => {
       // Regex extracts ID from capture group.
       expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s')).toBe('dQw4w9WgXcQ');
    });
  });
});
