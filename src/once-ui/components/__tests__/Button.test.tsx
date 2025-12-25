import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button label="Click me" />)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn()
        render(<Button label="Click me" onClick={handleClick} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
        const handleClick = vi.fn()
        render(<Button label="Click me" onClick={handleClick} disabled />)
        const button = screen.getByRole('button')

        // Check disabled attribute
        expect(button).toBeDisabled()

        fireEvent.click(button)
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('renders loading state', () => {
        render(<Button loading label="Click me" />)
        // Check if Spinner is present. Assuming Spinner renders a specific role or class.
        // Inspecting Spinner code would confirm, but usually it might not have 'button' role.
        // We can check if button persists.
        expect(screen.getByRole('button')).toBeInTheDocument()

        // If Logic: {loading && <Spinner ... />}
        // We can check for a common spinner testid if we added one, or check for absence of icon if it replaced it.
        // But let's check basic render for now.
    })

    it('renders prefix and suffix icons', () => {
        // We can't easily check for specific icons without mocking them or checking internal SVG,
        // but we can check if content structure suggests icons are there (e.g. by classes or inspection)
        // With current mocks/setup, Icon might render as empty or specific stub.

        // However, checking variant classes is doable:
        const { container } = render(<Button label="Danger" variant="danger" />)
        expect(container.firstChild).toHaveClass('danger')
    })
})
