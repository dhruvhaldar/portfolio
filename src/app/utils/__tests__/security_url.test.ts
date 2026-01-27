import { describe, it, expect } from 'vitest';
import { isSafeUrl } from '../security';

describe('isSafeUrl Security Hardening', () => {
  // ✅ Safe URLs
  it('should allow safe protocols', () => {
    expect(isSafeUrl('https://google.com')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('mailto:user@example.com')).toBe(true);
    expect(isSafeUrl('tel:+1234567890')).toBe(true);
  });

  it('should allow relative URLs', () => {
    expect(isSafeUrl('/dashboard')).toBe(true);
    expect(isSafeUrl('about')).toBe(true);
    expect(isSafeUrl('../images/logo.png')).toBe(true);
    expect(isSafeUrl('#section')).toBe(true);
  });

  // ❌ Dangerous Schemes
  it('should block dangerous schemes', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<b>xss</b>')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
  });

  // 🛡️ Obfuscation Vectors
  it('should block obfuscated schemes with control characters', () => {
    // Newline in protocol
    expect(isSafeUrl('java\nscript:alert(1)')).toBe(false);
    expect(isSafeUrl('java\rscript:alert(1)')).toBe(false);

    // Tab in protocol
    expect(isSafeUrl('java\tscript:alert(1)')).toBe(false);

    // Null byte
    expect(isSafeUrl('java\0script:alert(1)')).toBe(false);

    // Vertical tab
    expect(isSafeUrl('java\vscript:alert(1)')).toBe(false);
  });

  it('should block schemes with whitespace', () => {
    // Leading space (already trimmed, but good to check)
    expect(isSafeUrl('  javascript:alert(1)')).toBe(false);

    // Trailing space
    expect(isSafeUrl('javascript:alert(1)  ')).toBe(false);

    // Space inside protocol (browsers might ignore, but we should be strict)
    // Note: 'javascript : alert(1)' is technically not a valid protocol in URL spec,
    // but some old browsers might have accepted it.
    // new URL('javascript :') throws? If so, isSafeUrl returns TRUE (unsafe).
    // We want it to be FALSE.
    expect(isSafeUrl('javascript : alert(1)')).toBe(false);
  });

  it('should block mixed case schemes', () => {
    expect(isSafeUrl('JaVaScRiPt:alert(1)')).toBe(false);
  });
});
