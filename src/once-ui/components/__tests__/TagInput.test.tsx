import React, { useState } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TagInput } from '../TagInput'

const TagInputWrapper = () => {
  const [tags, setTags] = useState<string[]>(['tag1', 'tag2'])
  return (
    <TagInput
        label="Tags"
        id="tags"
        value={tags}
        onChange={setTags}
    />
  )
}

describe('TagInput', () => {
    it('renders initial tags', () => {
        render(<TagInputWrapper />)
        expect(screen.getByText('tag1')).toBeInTheDocument()
        expect(screen.getByText('tag2')).toBeInTheDocument()
    })

    it('adds a new tag on Enter', () => {
        render(<TagInputWrapper />)
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'newTag' } })
        fireEvent.keyDown(input, { key: 'Enter' })
        expect(screen.getByText('newTag')).toBeInTheDocument()
    })

    it('adds a new tag on comma', () => {
        render(<TagInputWrapper />)
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'commaTag' } })
        fireEvent.keyDown(input, { key: ',' })
        expect(screen.getByText('commaTag')).toBeInTheDocument()
    })

    it('removes a tag', () => {
        render(<TagInputWrapper />)

        // Chip container has the label
        const chip = screen.getByLabelText('Remove tag tag1');
        const removeButton = within(chip).getByRole('button', { name: /Remove/i });

        fireEvent.click(removeButton);

        expect(screen.queryByText('tag1')).not.toBeInTheDocument()
        expect(screen.getByText('tag2')).toBeInTheDocument()
    })
})
