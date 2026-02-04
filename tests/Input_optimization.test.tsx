import { fireEvent, render, screen, act } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";
import { Input } from "../src/once-ui/components/Input";
import { Textarea } from "../src/once-ui/components/Textarea";

// Helper to check for floating label class presence
// We assume that the label element will have a class that indicates floating state
// In the source, it is styles.floating. In tests, it depends on setup.
// We will look for a class that includes "floating" if possible, or check behavior.
// Since we can't reliably know the class name without importing styles (which might not work in test file if not transformed),
// we will verify that the Input component works as expected by checking input value and behavior.

describe("Input Optimization", () => {
  it("Controlled Input updates value correctly", () => {
    const TestComponent = () => {
      const [value, setValue] = useState("initial");
      return (
        <Input
          id="controlled-input"
          label="Controlled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByLabelText("Controlled") as HTMLInputElement;

    expect(input.value).toBe("initial");

    fireEvent.change(input, { target: { value: "updated" } });
    expect(input.value).toBe("updated");

    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");
  });

  it("Uncontrolled Input updates value correctly", () => {
    render(<Input id="uncontrolled-input" label="Uncontrolled" defaultValue="default" />);
    const input = screen.getByLabelText("Uncontrolled") as HTMLInputElement;

    expect(input.value).toBe("default");

    fireEvent.change(input, { target: { value: "changed" } });
    expect(input.value).toBe("changed");
  });
});

describe("Textarea Optimization", () => {
  it("Controlled Textarea updates value and character count correctly", () => {
    const TestComponent = () => {
      const [value, setValue] = useState("start");
      return (
        <Textarea
          id="controlled-textarea"
          label="Controlled Area"
          value={value}
          showCount
          maxLength={100}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    render(<TestComponent />);
    const textarea = screen.getByLabelText("Controlled Area") as HTMLTextAreaElement;

    expect(textarea.value).toBe("start");
    expect(screen.getByText("5 / 100")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "longer value" } });
    expect(textarea.value).toBe("longer value");
    expect(screen.getByText("12 / 100")).toBeInTheDocument();
  });

  it("Uncontrolled Textarea updates value and character count correctly", () => {
    render(
      <Textarea
        id="uncontrolled-textarea"
        label="Uncontrolled Area"
        defaultValue="hello"
        showCount
        maxLength={50}
      />
    );
    const textarea = screen.getByLabelText("Uncontrolled Area") as HTMLTextAreaElement;

    expect(textarea.value).toBe("hello");
    expect(screen.getByText("5 / 50")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "world" } });
    expect(textarea.value).toBe("world");
    expect(screen.getByText("5 / 50")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "longer" } });
    expect(textarea.value).toBe("longer");
    expect(screen.getByText("6 / 50")).toBeInTheDocument();
  });
});
