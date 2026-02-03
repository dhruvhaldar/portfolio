import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DatePicker } from '../DatePicker'

describe('DatePicker Functionality', () => {
    it('renders days correctly for a given month (Oct 2023)', () => {
        // Oct 2023 starts on Sunday (1st) and ends on Tuesday (31st)
        const date = new Date(2023, 9, 15) // Oct 15, 2023
        render(<DatePicker value={date} />)

        expect(screen.getByText('October 2023')).toBeInTheDocument()

        // Check for specific days
        expect(screen.getByLabelText('Sunday, October 1, 2023')).toBeInTheDocument()
        expect(screen.getByLabelText('Tuesday, October 31, 2023')).toBeInTheDocument()

        // Previous month filler: Sep 30 is Saturday
        // Next month filler: Nov 1 is Wednesday
        // The grid is 7 columns.
    })

    it('calls onChange when a day is clicked', () => {
        const handleChange = vi.fn()
        const date = new Date(2023, 9, 15) // Oct 15, 2023
        render(<DatePicker value={date} onChange={handleChange} />)

        const targetDate = new Date(2023, 9, 20) // Oct 20
        const dayButton = screen.getByLabelText('Friday, October 20, 2023')

        fireEvent.click(dayButton)

        expect(handleChange).toHaveBeenCalledTimes(1)
        // Check argument. Note: time might be preserved or reset depending on logic
        const calledDate = handleChange.mock.calls[0][0]
        expect(calledDate.getFullYear()).toBe(2023)
        expect(calledDate.getMonth()).toBe(9)
        expect(calledDate.getDate()).toBe(20)
    })

    it('navigates to next month', () => {
        const date = new Date(2023, 9, 15) // Oct 15, 2023
        render(<DatePicker value={date} />)

        const nextButton = screen.getByRole('button', { name: /next month/i })
        fireEvent.click(nextButton)

        expect(screen.getByText('November 2023')).toBeInTheDocument()
    })

    it('handles hover events', () => {
        const handleHover = vi.fn()
        const date = new Date(2023, 9, 15)
        render(<DatePicker value={date} onHover={handleHover} />)

        const dayButton = screen.getByLabelText('Friday, October 20, 2023')
        fireEvent.mouseEnter(dayButton)

        expect(handleHover).toHaveBeenCalledTimes(1)
        const hoveredDate = handleHover.mock.calls[0][0]
        expect(hoveredDate.getDate()).toBe(20)

        fireEvent.mouseLeave(dayButton)
        expect(handleHover).toHaveBeenCalledTimes(2)
        expect(handleHover.mock.calls[1][0]).toBeNull()
    })
})
