import React, { memo } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { Scroller } from '../Scroller'

describe('Scroller Performance', () => {
    const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth')
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')

    afterEach(() => {
        if (originalScrollWidth) Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth)
        if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    })

    it('prevents child re-renders when Scroller internal state updates', async () => {
        let renderCount = 0
        const Child = memo(() => {
            renderCount++
            return <div>Child</div>
        })
        Child.displayName = 'Child'

        // Mock overflow to enable buttons logic
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 1000 })
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 })

        render(
            <Scroller>
                <Child />
            </Scroller>
        )

        // Wait for useEffect to update buttons (triggering state change)
        await waitFor(() => {
            expect(screen.getByLabelText('Scroll Next')).toBeInTheDocument()
        })

        // Before optimization, renderCount is expected to be 2 because Scroller re-render clones children.
        // If it's 1, then the optimization is already present or my assumption is wrong.
        // We assert 1 here because that is the GOAL.
        // If this test FAILS (received 2), it confirms the issue exists.
        expect(renderCount).toBe(1)
    })
})
