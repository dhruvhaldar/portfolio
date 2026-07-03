import React from 'react';
import { render, screen } from '@testing-library/react';
import { SmartLink } from '../SmartLink';
import { describe, it, expect } from 'vitest';

describe('SmartLink', () => {
  it('applies aria-current="page" when selected is true', () => {
    render(<SmartLink href="/about" selected={true}>About</SmartLink>);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not apply aria-current when selected is false', () => {
    render(<SmartLink href="/about" selected={false}>About</SmartLink>);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).not.toHaveAttribute('aria-current');
  });
});
