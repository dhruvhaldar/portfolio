import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

    it('handles selection', () => {
        const onSelect = vi.fn()
        render(
            <Dropdown onSelect={onSelect}>
                <div data-value="opt1">Option 1</div>
            </Dropdown>
        )

        fireEvent.click(screen.getByText('Option 1'))
        expect(onSelect).toHaveBeenCalledWith('opt1')
    })
})
