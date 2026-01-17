import { describe, expect, it } from "vitest";
import { isValidEmail } from "../app/utils/security";

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
