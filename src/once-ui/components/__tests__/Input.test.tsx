import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../Input'

// Skipping complex debounce integration test for unit testing simplicity.
// Validation logic relies on useDebounce which is best tested in its own unit test
// or via integration tests. Use simple prop tests here.

describe('Input', () => {
    it('renders label and input', () => {
        render(<Input id="test-input" label="Test Label" />)
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    })

    it('displays error message', () => {
        const handleChange = vi.fn()
        render(<Input id="test-input" label="Label" error errorMessage="Error occurred" value="some value" onChange={handleChange} />)
        expect(screen.getByText('Error occurred')).toBeInTheDocument()
    })

    it('has default maxLength of 255', () => {
        render(<Input id="test-input" label="Test Label" />)
        const input = screen.getByLabelText('Test Label') as HTMLInputElement
        expect(input.maxLength).toBe(255)
    })

    it('allows overriding maxLength', () => {
        render(<Input id="test-input" label="Test Label" maxLength={50} />)
        const input = screen.getByLabelText('Test Label') as HTMLInputElement
        expect(input.maxLength).toBe(50)
    })

    it('correctly handles controlled input transitions (performance & behavior)', () => {
        const { rerender } = render(<Input id="test" label="Label" value="" readOnly />)
        const label = screen.getByText('Label')

        // Initially empty, not floating
        expect(label).not.toHaveClass('floating')

        // Update to filled
        rerender(<Input id="test" label="Label" value="Filled" readOnly />)
        expect(label).toHaveClass('floating')

        // Update to empty
        rerender(<Input id="test" label="Label" value="" readOnly />)
        expect(label).not.toHaveClass('floating')
    })

    it('correctly handles defaultValue (uncontrolled)', () => {
        render(<Input id="test-default" label="Label" defaultValue="Default" />)
        const label = screen.getByText('Label')
        expect(label).toHaveClass('floating')
    })
})
