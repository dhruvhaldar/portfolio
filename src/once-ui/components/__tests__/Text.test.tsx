import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Text } from '../Text'

describe('Text', () => {
    it('renders correctly', () => {
        render(<Text>Hello World</Text>)
        const text = screen.getByText('Hello World')
        expect(text).toBeInTheDocument()
        expect(text.tagName).toBe('SPAN') // Default tag
    })

    it('renders as different element', () => {
        render(<Text as="p">Paragraph</Text>)
        const text = screen.getByText('Paragraph')
        expect(text.tagName).toBe('P')
    })

    it('applies variant classes', () => {
        render(<Text variant="display-strong-l">Variant Text</Text>)
        // Check for classes: font-display, font-strong, font-l
        // But since we mock CSS, we can check if className contains these strings 
        // IF the component applies them as strings. 
        // Button.tsx uses styles[variant].
        // Text.tsx uses split to get class names like `font-display`.
        // If these are global classes or CSS modules, the mock implementation matters.
        // Text.tsx uses `classNames` and string interpolation, so `font-display` will be applied literally if not imported from styles module.
        // Text.tsx imports styles? No, it doesn't import styles module. It uses utility classes.
        const text = screen.getByText('Variant Text')
        expect(text).toHaveClass('font-display', 'font-strong', 'font-l')
    })
})
