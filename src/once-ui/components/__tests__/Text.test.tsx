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
        const text = screen.getByText('Variant Text')
        // Check if classes are applied
        expect(text).toHaveClass('font-display')
        expect(text).toHaveClass('font-strong')
    })
})
