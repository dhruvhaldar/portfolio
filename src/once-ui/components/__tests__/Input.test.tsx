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
        render(<Input id="test-input" label="Label" error errorMessage="Error occured" value="some value" onChange={() => { }} />)
        expect(screen.getByText('Error occured')).toBeInTheDocument()
    })
})
