import { describe, expect, it } from "vitest";
import { isSafeUrl, isValidEmail } from "../app/utils/security";

describe("isValidEmail", () => {
  it("should return true for valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    expect(isValidEmail("user+tag@example.org")).toBe(true);
  });

  it("should return false for emails without @", () => {
    expect(isValidEmail("testexample.com")).toBe(false);
  });

  it("should return false for emails without domain", () => {
    expect(isValidEmail("test@")).toBe(false);
  });

  it("should return false for emails without local part", () => {
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("should return false for emails with spaces", () => {
    expect(isValidEmail("test @example.com")).toBe(false);
    expect(isValidEmail("test@ example.com")).toBe(false);
  });

  it("should return false for emails with invalid characters", () => {
    expect(isValidEmail("test@example!.com")).toBe(false); // ! not allowed in domain
    expect(isValidEmail("te<st@example.com")).toBe(false);
  });

  it("should return false for emails with double dots in domain", () => {
    expect(isValidEmail("test@example..com")).toBe(false);
  });

  it("should return false for emails with double dots in local part", () => {
    expect(isValidEmail("test..user@example.com")).toBe(false);
  });

  it("should return false for emails longer than 254 characters", () => {
    const longEmail = `${"a".repeat(64)}@${"b".repeat(190)}.com`; // > 254
    expect(isValidEmail(longEmail)).toBe(false);
  });

  it("should return true for emails exactly 254 characters", () => {
    // 64 chars local part + @ + 189 chars domain = 254
    const validLongEmail = `${"a".repeat(64)}@${"b".repeat(185)}.com`;
    expect(isValidEmail(validLongEmail)).toBe(true);
  });

  it("should return false for non-string inputs", () => {
    // biome-ignore lint/suspicious/noExplicitAny: Testing runtime type safety
    expect(isValidEmail(null as any)).toBe(false);
    // biome-ignore lint/suspicious/noExplicitAny: Testing runtime type safety
    expect(isValidEmail(undefined as any)).toBe(false);
    // biome-ignore lint/suspicious/noExplicitAny: Testing runtime type safety
    expect(isValidEmail(123 as any)).toBe(false);
  });
});

describe("isSafeUrl", () => {
  it("should return true for valid HTTP/HTTPS URLs", () => {
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("http://example.com")).toBe(true);
  });

  it("should return true for valid mailto/tel URLs", () => {
    expect(isSafeUrl("mailto:user@example.com")).toBe(true);
    expect(isSafeUrl("tel:+1234567890")).toBe(true);
  });

  it("should return true for relative URLs", () => {
    expect(isSafeUrl("/path/to/page")).toBe(true);
    expect(isSafeUrl("path/to/page")).toBe(true); // Treated as relative
    expect(isSafeUrl("#anchor")).toBe(true);
    expect(isSafeUrl("/")).toBe(true);
  });

  it("should return false for dangerous protocols", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("vbscript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeUrl("file:///etc/passwd")).toBe(false);
  });

  it("should return false for dangerous protocols via regex check (defense in depth)", () => {
    expect(isSafeUrl("javascript:void(0)")).toBe(false);
    expect(isSafeUrl("vbscript:msgbox(1)")).toBe(false);
    expect(
      isSafeUrl(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      ),
    ).toBe(false);
    expect(isSafeUrl("file://C:/Windows/System32/drivers/etc/hosts")).toBe(false);
  });

  it("should return false for obfuscated dangerous protocols", () => {
    // URL parser handles these (normalizes them), so they should fail validation because protocol matches javascript:
    expect(isSafeUrl("java\nscript:alert(1)")).toBe(false);
    expect(isSafeUrl("JAVASCRIPT:alert(1)")).toBe(false);
    expect(isSafeUrl("  javascript:alert(1)")).toBe(false);
  });

  it("should handle empty inputs", () => {
    expect(isSafeUrl("")).toBe(false);
    // biome-ignore lint/suspicious/noExplicitAny: Testing runtime type safety
    expect(isSafeUrl(null as any)).toBe(false);
  });
});
