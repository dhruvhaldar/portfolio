import { render } from "@testing-library/react";
import Prism from "prismjs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "../CodeBlock";

// Mock useToast since it's used in CodeBlock and might fail without provider
vi.mock("@/once-ui/components", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // biome-ignore lint/suspicious/noExplicitAny: mocking module
    ...(actual as any),
    useToast: () => ({ addToast: vi.fn() }),
  };
});

describe("CodeBlock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls Prism.highlightElement (optimized) on mount", () => {
    const highlightAllSpy = vi.spyOn(Prism, "highlightAll");
    const highlightElementSpy = vi.spyOn(Prism, "highlightElement");

    const codeInstances = [{ code: 'console.log("hello")', language: "javascript", label: "JS" }];
    render(<CodeBlock codeInstances={codeInstances} />);

    // This confirms the optimized behavior
    expect(highlightAllSpy).not.toHaveBeenCalled();
    expect(highlightElementSpy).toHaveBeenCalled();
  });
});
