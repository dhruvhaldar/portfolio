import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Accordion } from '../Accordion'

describe('Accordion Accessibility', () => {
    it('applies inert attribute to content when closed', () => {
        render(
            <Accordion title="A11y Test">
                <button>Focusable Content</button>
            </Accordion>
        )

        // Find the button even if it is hidden from accessibility tree
        const button = screen.getByText('Focusable Content')
        const content = button.closest('[id^="accordion-content-"]')
        expect(content).not.toBeNull()

        // Initially closed
        expect(content).toHaveAttribute('inert')
    })

    it('removes inert attribute from content when open', () => {
        render(
            <Accordion title="A11y Test" open={true}>
                <button>Focusable Content</button>
            </Accordion>
        )

        const button = screen.getByText('Focusable Content')
        const content = button.closest('[id^="accordion-content-"]')
        expect(content).not.toBeNull()

        // Initially open
        expect(content).not.toHaveAttribute('inert')
    })

    it('toggles inert attribute on interaction', () => {
        render(
            <Accordion title="A11y Test">
                <button>Focusable Content</button>
            </Accordion>
        )

        const heading = screen.getByRole('heading', { name: 'A11y Test' })
        const toggleButton = heading.closest('[role="button"]')
        const button = screen.getByText('Focusable Content')
        const content = button.closest('[id^="accordion-content-"]')

        // Initial state: closed -> inert
        expect(content).toHaveAttribute('inert')

        // Click to open
        fireEvent.click(toggleButton!)
        expect(content).not.toHaveAttribute('inert')

        // Click to close
        fireEvent.click(toggleButton!)
        expect(content).toHaveAttribute('inert')
    })
})
