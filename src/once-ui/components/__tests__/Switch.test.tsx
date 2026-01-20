import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('renders correctly with label', () => {
    const onToggle = vi.fn();
    render(<Switch isChecked={false} onToggle={onToggle} label="Enable notifications" />);

    // Check if label is rendered
    expect(screen.getByText('Enable notifications')).toBeDefined();

    // Check if the switch has the correct accessible name
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDefined();

    // If the label is associated via aria-labelledby,
    // accessible name calculation should include the label text.
    expect(switchElement).toHaveAccessibleName('Enable notifications');
  });

  it('toggles when clicked', () => {
    const onToggle = vi.fn();
    render(<Switch isChecked={false} onToggle={onToggle} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('toggles when label is clicked', () => {
    const onToggle = vi.fn();
    render(<Switch isChecked={false} onToggle={onToggle} label="Click me" />);

    const label = screen.getByText('Click me');
    fireEvent.click(label);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('uses default aria-label when no label prop is provided', () => {
    const onToggle = vi.fn();
    render(<Switch isChecked={false} onToggle={onToggle} />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAccessibleName('Toggle switch');
  });

  it('supports custom aria-label', () => {
    const onToggle = vi.fn();
    render(<Switch isChecked={false} onToggle={onToggle} ariaLabel="Custom Switch" />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAccessibleName('Custom Switch');
  });

  it('supports id prop', () => {
      const onToggle = vi.fn();
      render(<Switch isChecked={false} onToggle={onToggle} id="my-switch" label="My Switch" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAccessibleName('My Switch');
  });
});
