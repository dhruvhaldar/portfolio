import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DatePicker } from '../DatePicker'

describe('DatePicker', () => {
    it('generates unique IDs for time inputs', async () => {
        render(
            <>
                <div data-testid="picker-1">
                    <DatePicker timePicker />
                </div>
                <div data-testid="picker-2">
                    <DatePicker timePicker />
                </div>
            </>
        )

        // Helper to activate time picker for a specific container
        const activateTimePicker = async (testid: string) => {
            const container = screen.getByTestId(testid)
            // Find an enabled day button within this container
            // We search for buttons with text content being a number
            const buttons = Array.from(container.querySelectorAll('button'))
            const dayButton = buttons.find(b =>
                !b.disabled &&
                /^\d+$/.test(b.textContent || '')
            )

            if (!dayButton) throw new Error(`No day button found in ${testid}`)

            fireEvent.click(dayButton)
        }

        await activateTimePicker('picker-1')
        await activateTimePicker('picker-2')

        // Wait for the transition (400ms in component)
        await act(async () => {
            await new Promise((r) => setTimeout(r, 500))
        })

        const inputs = screen.getAllByLabelText('Hours')
        expect(inputs).toHaveLength(2)

        // This assertion is expected to fail before the fix
        expect(inputs[0].id).not.toBe(inputs[1].id)
    })
})
