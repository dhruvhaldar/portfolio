import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Icon } from '../Icon'

describe('Icon', () => {
    it('renders correct icon', () => {
        render(<Icon name="chevronRight" />)
        expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument()
    })

    it('warns on missing icon', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
        const { container } = render(<Icon name="missingIcon" />)
        expect(container).toBeEmptyDOMElement()
        expect(consoleSpy).toHaveBeenCalledWith('Icon "missingIcon" does not exist in the library.')
        consoleSpy.mockRestore()
    })
})
