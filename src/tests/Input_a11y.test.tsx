import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../once-ui/components/Input';
import { Textarea } from '../once-ui/components/Textarea';

describe('Input Component Accessibility', () => {
    it('renders aria-label when labelAsPlaceholder is true and no aria-label is provided', () => {
        render(<Input id="test-input" label="Email" labelAsPlaceholder />);
        const input = screen.getByPlaceholderText('Email');
        expect(input).toHaveAttribute('aria-label', 'Email');
    });

    it('renders user provided aria-label even when labelAsPlaceholder is true', () => {
        render(<Input id="test-input" label="Email" labelAsPlaceholder aria-label="Custom Label" />);
        const input = screen.getByPlaceholderText('Email');
        expect(input).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('does not render aria-label when labelAsPlaceholder is false (uses accessible label element)', () => {
        render(<Input id="test-input" label="Email" />);
        // When labelAsPlaceholder is false, the label text is in a separate label element, not placeholder
        // So we query by label text
        const input = screen.getByLabelText('Email');
        expect(input).not.toHaveAttribute('aria-label');
    });
});

describe('Textarea Component Accessibility', () => {
    it('renders aria-label when labelAsPlaceholder is true', () => {
        render(<Textarea id="test-textarea" label="Message" labelAsPlaceholder />);
        const textarea = screen.getByPlaceholderText('Message');
        expect(textarea).toHaveAttribute('aria-label', 'Message');
    });
});
