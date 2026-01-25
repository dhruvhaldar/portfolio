"use client";

import React, {
  useState,
  type KeyboardEventHandler,
  type ChangeEventHandler,
  type FocusEventHandler,
  forwardRef,
  useCallback,
} from "react";

import { Chip, Flex, Input, type InputProps } from ".";

interface TagInputProps extends Omit<InputProps, "onChange" | "value"> {
  /** Current array of tags */
  value: string[];
  /** Handler for tag changes */
  onChange: (value: string[]) => void;
}

interface TagListProps {
  tags: string[];
  onRemove: (index: number) => void;
}

const TagList = React.memo(({ tags, onRemove }: TagListProps) => {
  return (
    <Flex
      style={{
        margin: "calc(-1 * var(--static-space-8)) var(--static-space-8)",
      }}
      direction="row"
      gap="4"
      vertical="center"
      wrap
      paddingY="16"
    >
      {tags.map((tag, index) => (
        <Chip
          // biome-ignore lint/suspicious/noArrayIndexKey: Duplicate tags are allowed, so index is the only unique identifier.
          key={index}
          label={tag}
          onRemove={() => onRemove(index)}
          aria-label={`Remove tag ${tag}`}
        />
      ))}
    </Flex>
  );
});

TagList.displayName = "TagList";

/**
 * An input component that converts text entries into tags.
 */
const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, label, placeholder, ...inputProps }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        if (inputValue.trim()) {
          onChange([...value, inputValue.trim()]);
          setInputValue("");
        }
      }
    };

    const handleRemoveTag = useCallback(
      (index: number) => {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
      },
      [value, onChange],
    );

    const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
      setIsFocused(true);
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      setIsFocused(false);
    };

    return (
      <Input
        ref={ref}
        label={label}
        placeholder={placeholder}
        labelAsPlaceholder
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-haspopup="listbox"
        aria-expanded={isFocused}
        {...inputProps}
      >
        {value.length > 0 && <TagList tags={value} onRemove={handleRemoveTag} />}
      </Input>
    );
  },
);

TagInput.displayName = "TagInput";

export { TagInput };
export type { TagInputProps };
