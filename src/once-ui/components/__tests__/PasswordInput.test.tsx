import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PasswordInput } from '../PasswordInput'

describe('PasswordInput', () => {
    it('renders with visibility toggle having accessible label', () => {
        render(<PasswordInput id="password" label="Password" />)

        // Initially password should be hidden, so button should say "Show password"
        // Note: Using getByRole with name option is the best way to test accessibility
        const showButton = screen.getByRole('button', { name: /show password/i })
        expect(showButton).toBeInTheDocument()

        // Click to show password
        fireEvent.click(showButton)

        // Now button should say "Hide password"
        const hideButton = screen.getByRole('button', { name: /hide password/i })
        expect(hideButton).toBeInTheDocument()

        // And check if type changes (although the main goal here is the accessible label)
        const input = screen.getByLabelText('Password')
        expect(input).toHaveAttribute('type', 'text')
    })
})
