import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from '../Chip';

describe('Chip interactions', () => {
  it('renders as a button when onClick is provided', () => {
    const handleClick = vi.fn();
    render(<Chip label="Interactive Chip" onClick={handleClick} />);

    const chip = screen.getByRole('button', { name: /Interactive Chip/i });
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('tabindex', '0');
  });

  it('does NOT render as a button when onClick is NOT provided', () => {
    render(<Chip label="Static Chip" />);

    // Should NOT be a button itself.
    // Note: If onRemove is not provided, it's just text.
    // Text inside might be found, but "button" role shouldn't exist for the container.
    const chipButton = screen.queryByRole('button', { name: /Static Chip/i });
    expect(chipButton).not.toBeInTheDocument();
  });

  it('renders remove button when onRemove is provided', () => {
    const handleRemove = vi.fn();
    render(<Chip label="Removable Chip" onRemove={handleRemove} />);

    // The container should NOT be a button (unless onClick is also provided)
    const chipContainer = screen.queryByRole('button', { name: /Removable Chip/i });
    expect(chipContainer).not.toBeInTheDocument();

    // The remove button SHOULD be a button
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('passes iconButtonProps to remove button', () => {
    const handleRemove = vi.fn();
    render(
      <Chip
        label="Tagged Chip"
        onRemove={handleRemove}
        iconButtonProps={{ tooltip: "Remove tag Tagged Chip" }}
      />
    );

    // IconButton uses tooltip as aria-label
    const removeButton = screen.getByRole('button', { name: "Remove tag Tagged Chip" });
    expect(removeButton).toBeInTheDocument();
  });
});
