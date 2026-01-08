import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CustomLink } from '@/components/mdx';

describe('CustomLink Security', () => {
  it('blocks dangerous javascript: links', () => {
    // 🛡️ Sentinel: This test verifies that javascript: URLs are blocked
    // and rendered as a span instead of an anchor tag.
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<CustomLink href="javascript:alert(1)">Click me</CustomLink>);

    const element = screen.getByText('Click me');

    // Should NOT be an anchor tag
    expect(element.tagName).toBe('SPAN');
    expect(element).not.toHaveAttribute('href');

    // Should log a security error
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Security: Blocked javascript: URL'));

    consoleSpy.mockRestore();
  });

  it('allows safe external links', () => {
    render(<CustomLink href="https://example.com">Example</CustomLink>);
    const link = screen.getByText('Example');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('allows safe internal links', () => {
    // Note: SmartLink might render as 'A' because we are not using next/link mock
    // in this specific test setup, but we just check it renders.
    render(<CustomLink href="/internal">Internal</CustomLink>);
    const link = screen.getByText('Internal');
    expect(link).toBeInTheDocument();
  });
});
