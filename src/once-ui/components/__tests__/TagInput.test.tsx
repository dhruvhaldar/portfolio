import { fireEvent, render, screen, within } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TagInput } from "../TagInput";

const TagInputWrapper = (props: Partial<React.ComponentProps<typeof TagInput>>) => {
  const [tags, setTags] = useState<string[]>(props.value || ["tag1", "tag2"]);
  return <TagInput label="Tags" id="tags" {...props} value={tags} onChange={setTags} />;
};

describe("TagInput", () => {
  it("renders initial tags", () => {
    render(<TagInputWrapper />);
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("adds a new tag on Enter", () => {
    render(<TagInputWrapper />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "newTag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("newTag")).toBeInTheDocument();
  });

  it("adds a new tag on comma", () => {
    render(<TagInputWrapper />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "commaTag" } });
    fireEvent.keyDown(input, { key: "," });
    expect(screen.getByText("commaTag")).toBeInTheDocument();
  });

  it("removes a tag", () => {
    render(<TagInputWrapper />);

    // Chip container has the label
    const removeButton = screen.getByRole("button", { name: "Remove tag tag1" });

    fireEvent.click(removeButton);

    expect(screen.queryByText("tag1")).not.toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("removes the last tag on Backspace when input is empty", () => {
    render(<TagInputWrapper />);
    const input = screen.getByRole("textbox");

    // Ensure initial state
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    // Press Backspace on empty input
    fireEvent.keyDown(input, { key: "Backspace" });

    // Expect last tag to be removed
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.queryByText("tag2")).not.toBeInTheDocument();
  });

  it("does not remove tag on Backspace when input is NOT empty", () => {
    render(<TagInputWrapper />);
    const input = screen.getByRole("textbox");

    // Type something
    fireEvent.change(input, { target: { value: "typing" } });

    // Press Backspace
    fireEvent.keyDown(input, { key: "Backspace" });

    // Expect tags to remain
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("enforces maxTags limit", () => {
    render(<TagInputWrapper maxTags={2} />);
    const input = screen.getByRole("textbox");

    // Attempt to add 3rd tag (already has 2: tag1, tag2)
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.queryByText("tag3")).not.toBeInTheDocument();
  });

  it("enforces maxTagLength limit", () => {
    render(<TagInputWrapper maxTagLength={5} />);
    const input = screen.getByRole("textbox");

    // Type valid length
    fireEvent.change(input, { target: { value: "12345" } });
    expect(input).toHaveValue("12345");

    // Type invalid length
    fireEvent.change(input, { target: { value: "123456" } });
    // Should revert/stay at 12345 because state didn't update
    expect(input).toHaveValue("12345");
  });
});
