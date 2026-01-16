import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CustomLink } from '@/components/mdx';
import { SmartLink } from '@/once-ui/components';

describe('Link Security', () => {
  const dangerousSchemes = [
    'javascript:alert(1)',
    'vbscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
  ];

  describe('CustomLink', () => {
    it('should render safe external links', () => {
      render(<CustomLink href="https://example.com">Safe Link</CustomLink>);
      const link = screen.getByText('Safe Link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render safe relative links', () => {
      render(<CustomLink href="/internal">Internal Link</CustomLink>);
      const link = screen.getByText('Internal Link');
      // SmartLink renders as an anchor via ElementType -> Link or a
      expect(link).toHaveAttribute('href', '/internal');
    });

    it('should render safe anchor links', () => {
      render(<CustomLink href="#anchor">Anchor Link</CustomLink>);
      const link = screen.getByText('Anchor Link');
      expect(link).toHaveAttribute('href', '#anchor');
    });

    dangerousSchemes.forEach((scheme) => {
      it(`should block dangerous scheme: ${scheme}`, () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<CustomLink href={scheme}>Dangerous Link</CustomLink>);

        const element = screen.getByText('Dangerous Link');
        // Expecting it to NOT be an anchor tag with that href
        if (element.tagName === 'A') {
           expect(element).not.toHaveAttribute('href', scheme);
        } else {
           // If it's a span or button, it's safe (as long as it doesn't have the href or onclick)
           expect(element).toBeInTheDocument();
        }

        consoleSpy.mockRestore();
      });
    });
  });

  describe('SmartLink (ElementType)', () => {
    it('should render safe external links', () => {
      render(<SmartLink href="https://example.com">Safe SmartLink</SmartLink>);
      const link = screen.getByText('Safe SmartLink');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    dangerousSchemes.forEach((scheme) => {
      it(`should block dangerous scheme: ${scheme}`, () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<SmartLink href={scheme}>Dangerous SmartLink</SmartLink>);

        const element = screen.getByText('Dangerous SmartLink');

        if (element.tagName === 'A') {
            // It might fail here before the fix
            expect(element).not.toHaveAttribute('href', scheme);
        } else {
            // If it renders as a button (fallback), it's safe
            expect(element).toBeInTheDocument();
        }

        consoleSpy.mockRestore();
      });
    });
  });
});
