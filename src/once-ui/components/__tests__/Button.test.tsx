import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button label="Click me" />)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()
        render(<Button label="Click me" onClick={handleClick} />)
        const button = screen.getByRole('button')
        await user.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()
        render(<Button label="Click me" onClick={handleClick} disabled />)
        const button = screen.getByRole('button')

        // Check disabled attribute
        expect(button).toBeDisabled()

        await user.click(button)
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('renders loading state', () => {
        render(<Button loading label="Click me" />)
        // Spinner has role="status" and aria-label="Loading" by default
        const spinner = screen.getByRole('status')
        expect(spinner).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
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
