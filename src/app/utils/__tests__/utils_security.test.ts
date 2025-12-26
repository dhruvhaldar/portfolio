import { describe, it, expect, vi } from 'vitest';
import { getPostBySlug } from '../utils';
import path from 'path';
import fs from 'fs';

// Mock fs and path to avoid actual file system access
vi.mock('fs');
vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('path')>();
  // In ESM, 'path' might be a default export or named exports.
  // We need to handle both.
  return {
    ...actual,
    // Mock named exports if they exist
    join: vi.fn((...args) => args.join('/')), // Simple join for testing
    basename: vi.fn((p) => p.split('/').pop() || ''),
    extname: vi.fn((p) => {
        const parts = p.split('.');
        return parts.length > 1 ? '.' + parts.pop() : '';
    }),
    // Mock default export if it's used
    default: {
        ...actual,
        join: vi.fn((...args) => args.join('/')),
        basename: vi.fn((p) => p.split('/').pop() || ''),
        extname: vi.fn((p) => {
            const parts = p.split('.');
            return parts.length > 1 ? '.' + parts.pop() : '';
        }),
    }
  };
});

describe('getPostBySlug Security', () => {
  it('should return undefined for slugs containing path traversal characters', () => {
    // Attempting to access parent directory
    const maliciousSlug = '../secret';

    // We want this to fail validation before it hits FS.
    // But to prove it works, we ensure FS *would* return true if it got there.
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Secret\n---\nSecret Content');

    const result = getPostBySlug(maliciousSlug);

    // Without fix: result is defined (because we mocked existsSync=true)
    // With fix: result is undefined
    expect(result).toBeUndefined();
  });

  it('should return undefined for slugs with special characters', () => {
    const maliciousSlug = 'some/path/to/file';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const result = getPostBySlug(maliciousSlug);
    expect(result).toBeUndefined();
  });

  it('should allow valid slugs', () => {
    const validSlug = 'valid-post-123';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Test\n---\nContent');

    const result = getPostBySlug(validSlug);

    expect(result).toBeDefined();
    expect(result?.slug).toBe(validSlug);
  });
});
