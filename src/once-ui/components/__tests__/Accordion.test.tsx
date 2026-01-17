import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Accordion } from '../Accordion'

interface AccordionRef {
    open: () => void;
    close: () => void;
}

describe('Accordion', () => {
    it('renders title', () => {
        render(<Accordion title="Test Title">Content</Accordion>)
        expect(screen.getByRole('heading', { name: "Test Title" })).toBeInTheDocument()
    })

    it('expands and collapses on click', () => {
        render(<Accordion title="Test Title">Content</Accordion>)

        const heading = screen.getByRole('heading')
        const button = heading.parentElement
        expect(button).not.toBeNull()

        // Initial state: collapsed
        expect(button).toHaveAttribute('aria-expanded', 'false')

        // Expand
        fireEvent.click(button!)
        expect(button).toHaveAttribute('aria-expanded', 'true')

        // Collapse
        fireEvent.click(button!)
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('exposes imperative methods', () => {
        // We use a custom interface for the imperative handle, but the component forwardRef 
        // effectively returns a mutable ref object that React handles.
        // TypeScript complains because AccordionRef isn't an HTMLDivElement.
        // We can cast the ref type to allow our custom methods.
        const ref = React.createRef<AccordionRef & HTMLDivElement>()
        render(<Accordion ref={ref} title="Title">Content</Accordion>)

        // Open via ref
        expect(ref.current).toBeDefined()
        const button = screen.getByRole('heading').parentElement!;

        React.act(() => {
            ref.current!.open()
        })
        expect(button).toHaveAttribute('aria-expanded', 'true')

        React.act(() => {
            ref.current!.close()
        })
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('generates unique IDs for content and links aria-controls', () => {
        render(
            <>
                <Accordion title="Accordion 1">Content 1</Accordion>
                <Accordion title="Accordion 2">Content 2</Accordion>
            </>
        )

        const headings = screen.getAllByRole('heading')
        const button1 = headings[0].parentElement
        const button2 = headings[1].parentElement

        const controls1 = button1!.getAttribute('aria-controls')
        const controls2 = button2!.getAttribute('aria-controls')

        expect(controls1).toBeTruthy()
        expect(controls2).toBeTruthy()
        expect(controls1).not.toBe(controls2)
        expect(controls1).toContain('accordion-content-')

        const content1 = document.getElementById(controls1!)
        const content2 = document.getElementById(controls2!)

        expect(content1).toBeInTheDocument()
        expect(content2).toBeInTheDocument()
        expect(content1).toHaveTextContent('Content 1')
        expect(content2).toHaveTextContent('Content 2')
    })
})
