import { fireEvent, render, screen, within } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TagInput } from "../TagInput";

const TagInputWrapper = () => {
  const [tags, setTags] = useState<string[]>(["tag1", "tag2"]);
  return <TagInput label="Tags" id="tags" value={tags} onChange={setTags} />;
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
});
