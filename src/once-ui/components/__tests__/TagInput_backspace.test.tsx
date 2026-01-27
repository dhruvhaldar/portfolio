import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";
import { TagInput } from "../TagInput";

const TagInputWrapper = () => {
  const [tags, setTags] = useState<string[]>(["tag1", "tag2"]);
  return <TagInput label="Tags" id="tags" value={tags} onChange={setTags} />;
};

describe("TagInput Backspace Behavior", () => {
  it("removes the last tag on Backspace when input is empty", () => {
    render(<TagInputWrapper />);
    const input = screen.getByRole("textbox");

    // Ensure initial state
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    // Backspace with empty input
    fireEvent.keyDown(input, { key: "Backspace" });

    // tag2 should be removed (it's the last one)
    expect(screen.queryByText("tag2")).not.toBeInTheDocument();
    // tag1 should still be there
    expect(screen.getByText("tag1")).toBeInTheDocument();
  });

  it("does not remove tag on Backspace when input is not empty", () => {
    render(<TagInputWrapper />);
    const input = screen.getByRole("textbox");

    // Type something
    fireEvent.change(input, { target: { value: "a" } });

    // Backspace
    fireEvent.keyDown(input, { key: "Backspace" });

    // Should still have both tags
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });
});
