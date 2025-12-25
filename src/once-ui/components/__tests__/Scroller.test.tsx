import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Scroller } from '../Scroller'

describe('Scroller', () => {
    beforeEach(() => {
        // Reset mocks if any
    })

    it('renders children', () => {
        render(
            <Scroller>
                <div>Item 1</div>
                <div>Item 2</div>
            </Scroller>
        )
        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('handles item clicks', () => {
        const handleItemClick = vi.fn()
        render(
            <Scroller onItemClick={handleItemClick}>
                <button>Item 1</button>
            </Scroller>
        )

        fireEvent.click(screen.getByText('Item 1'))
        expect(handleItemClick).toHaveBeenCalledWith(0)
    })

    it('shows next button when overflowing', async () => {
        // Mock geometry
        const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth')
        const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')

        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 1000 })
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 })

        render(
            <Scroller>
                <div style={{ width: 1000 }}>Content</div>
            </Scroller>
        )

        // Wait for useEffect
        // The component checks scroll position on mount.
        // We might need to trigger a scroll or wait.
        // Actually, Scroller logic checks condition in useEffect.

        // Need to wait for internal state update if any, but useEffect runs after render.
        // The condition `scroller.scrollWidth > scroller.clientWidth` should be true (1000 > 500).
        // So `handleScroll` is called.
        // `scrollLeft` is 0. `showPrevButton` = false.
        // `maxScrollPosition` = 500. `showNextButton` = 0 < 499 => true.

        // Scroller renders Fade components which might delay rendering?
        // Let's assume buttons appear.

        // Note: Icon button aria-label="Scroll Next"
        await waitFor(() => {
            const nextButton = screen.getByLabelText('Scroll Next')
            expect(nextButton).toBeInTheDocument()
        })

        // Restore mocks
        if (originalScrollWidth) Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth)
        if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    })
})
