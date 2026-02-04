import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DateInput } from '../DateInput'

describe('DateInput Accessibility', () => {
    it('renders trigger with aria-haspopup="dialog"', () => {
        render(
            <DateInput
                id="date-input"
                label="Date"
                onChange={() => {}}
            />
        )

        // The input acts as the trigger.
        // Note: DropdownWrapper clones the trigger and adds aria-haspopup.
        // Since Input renders an <input> element inside a Flex, and DropdownWrapper wraps that,
        // we need to check if the aria attribute is applied correctly.
        // Actually DropdownWrapper clones the `trigger` prop which is the `Input` component.
        // The `Input` component spreads `...props` to the `<input>` element.
        // So the `<input>` should have `aria-haspopup="dialog"`.

        const input = screen.getByLabelText('Date')
        expect(input).toHaveAttribute('aria-haspopup', 'dialog')
    })

    it('renders dropdown with role="dialog" when open', () => {
        render(
            <DateInput
                id="date-input"
                label="Date"
                onChange={() => {}}
            />
        )

        const input = screen.getByLabelText('Date')
        fireEvent.click(input)

        // The dropdown content is rendered in a Portal or just conditional rendering?
        // DropdownWrapper uses floating-ui, but seems to render conditional JSX inline (no portal used in code I saw, checking DropdownWrapper again...)

        // Wait, DropdownWrapper uses `useFloating`.
        // `strategy` is passed to style.
        // It renders `{isOpen && (...)}`.
        // So it is in the DOM.

        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
    })
})
