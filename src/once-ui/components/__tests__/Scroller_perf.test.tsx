import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Scroller } from '../Scroller'

describe('Scroller Performance', () => {
    const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth')
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')

    afterEach(() => {
        if (originalScrollWidth) Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth)
        if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    })

    it('does not re-render children when internal state updates', async () => {
        // Mock dimensions to trigger "next" button appearance
        // scrollWidth > clientWidth -> showNextButton = true
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 1000 })
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 })

        const renderCounter = vi.fn()

        // A memoized child that tracks renders
        const MockChild = React.memo(({ id }: { id: string }) => {
            renderCounter(id)
            return <div style={{ width: 200 }}>{id}</div>
        })

        render(
            <Scroller>
                <MockChild id="item-1" />
            </Scroller>
        )

        // Initial render triggers effect
        // Effect checks dimensions (1000 > 500)
        // Effect calls setShowNextButton(true)
        // Scroller re-renders

        // Wait for the next button to appear, confirming the state update happened
        await waitFor(() => {
            expect(screen.getByLabelText('Scroll Next')).toBeInTheDocument()
        })

        // Without optimization: Scroller re-render -> new onClick handler -> MockChild re-render. Total: 2.
        // With optimization: Scroller re-render -> same onClick handler -> MockChild NO re-render. Total: 1.

        // We expect this to fail initially (returning 2)
        expect(renderCounter).toHaveBeenCalledTimes(1)
    })
})
