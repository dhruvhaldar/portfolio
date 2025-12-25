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
})
