import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('security.txt', () => {
  it('should exist in the public/.well-known directory', () => {
    const filePath = path.join(process.cwd(), 'public/.well-known/security.txt');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should contain the correct contact email', () => {
    const filePath = path.join(process.cwd(), 'public/.well-known/security.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('Contact: mailto:bubqbgvl1@mozmail.com');
  });

  it('should contain an Expires field', () => {
    const filePath = path.join(process.cwd(), 'public/.well-known/security.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('Expires:');
  });
});
