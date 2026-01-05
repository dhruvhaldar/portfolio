import { render } from '@testing-library/react';
import { Posts } from '../components/blog/Posts';
import { describe, it, expect, vi } from 'vitest';
import * as utils from '../app/utils/utils';

// Mock getPosts
vi.mock('../app/utils/utils', () => ({
  getPosts: vi.fn(() => []),
}));

describe('Posts Component Optimization', () => {
  it('calls getPosts with includeContent = false', () => {
    render(<Posts />);

    expect(utils.getPosts).toHaveBeenCalledWith(
      ["src", "app", "blog", "posts"],
      false
    );
  });
});
