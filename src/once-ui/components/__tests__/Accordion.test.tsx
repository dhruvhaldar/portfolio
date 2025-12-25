import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Accordion } from '../Accordion'

describe('Accordion', () => {
    it('renders title', () => {
        render(<Accordion title="Test Title">Content</Accordion>)
        expect(screen.getByRole('heading', { name: "Test Title" })).toBeInTheDocument()
    })

    it('expands and collapses on click', () => {
        render(<Accordion title="Test Title">Content</Accordion>)

        const button = screen.getByRole('heading').parentElement!;
        // Initial state: collapsed
        expect(button).toHaveAttribute('aria-expanded', 'false')

        // Expand
        fireEvent.click(button)
        expect(button).toHaveAttribute('aria-expanded', 'true')

        // Collapse
        fireEvent.click(button)
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('exposes imperative methods', () => {
        const ref = React.createRef<any>()
        render(<Accordion ref={ref} title="Title">Content</Accordion>)

        // Open via ref
        expect(ref.current).toBeDefined()
        const button = screen.getByRole('heading').parentElement!;

        React.act(() => {
            ref.current.open()
        })
        expect(button).toHaveAttribute('aria-expanded', 'true')

        React.act(() => {
            ref.current.close()
        })
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })
})
