import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
    it('renders children', () => {
        render(
            <Dropdown>
                <div data-value="1">Option 1</div>
                <div data-value="2">Option 2</div>
            </Dropdown>
        )
        expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('handles selection', async () => {
        const user = userEvent.setup()
        const onSelect = vi.fn()
        render(
            <Dropdown onSelect={onSelect}>
                <div data-value="opt1">Option 1</div>
            </Dropdown>
        )

        await user.click(screen.getByText('Option 1'))
        expect(onSelect).toHaveBeenCalledWith('opt1')
    })

    it('supports arrow key navigation', async () => {
        const user = userEvent.setup()
        render(
            <Dropdown>
                <button data-testid="opt1">Option 1</button>
                <button data-testid="opt2">Option 2</button>
                <button data-testid="opt3">Option 3</button>
            </Dropdown>
        )

        const dropdown = screen.getByRole('listbox')
        dropdown.focus()

        // Navigate down
        await user.keyboard('{ArrowDown}')
        expect(document.activeElement).toBe(screen.getByTestId('opt1'))

        await user.keyboard('{ArrowDown}')
        expect(document.activeElement).toBe(screen.getByTestId('opt2'))

        // Navigate up
        await user.keyboard('{ArrowUp}')
        expect(document.activeElement).toBe(screen.getByTestId('opt1'))

        // Wrap around top to bottom
        await user.keyboard('{ArrowUp}')
        expect(document.activeElement).toBe(screen.getByTestId('opt3'))
    })
})
