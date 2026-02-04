import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders correctly with label', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDefined();
    expect(checkbox).toHaveAccessibleName('Accept terms');
  });

  it('toggles when clicked', () => {
    const onToggle = vi.fn();
    render(<Checkbox isChecked={false} onToggle={onToggle} label="Click me" />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('does NOT toggle when disabled', () => {
    const onToggle = vi.fn();
    render(<Checkbox isChecked={false} onToggle={onToggle} disabled label="Disabled" />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes when disabled', () => {
    render(<Checkbox disabled label="Disabled Checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).toHaveAttribute('tabIndex', '-1');
  });
});
