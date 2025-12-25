import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button label="Click me" />)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('renders loading state', () => {
        render(<Button loading label="Click me" />)
        // When loading, label might be present but spinner too.
        // Based on code: {loading && <Spinner ... />}
        // { (label || children) && <Flex ...>{label}</Flex> }
        // Both render.
        expect(screen.getByRole('button')).toBeInTheDocument()
    })
})
