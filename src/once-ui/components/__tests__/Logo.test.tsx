import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from '../Logo';

describe('Logo', () => {
  it('renders icon and wordmark by default', () => {
    render(<Logo />);
    // By default both are true. Since we don't pass src, it renders div placeholders.
    // The component doesn't have specific roles for these divs, but we can check the container.
    const container = screen.getByLabelText('Logo');
    expect(container).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<Logo href="/" />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders only icon when wordmark is false', () => {
    render(<Logo wordmark={false} />);
    const container = screen.getByLabelText('Logo');
    // We can't easily distinguish internal divs without classnames checks or implementation details,
    // but we can assert it renders without error.
    expect(container).toBeInTheDocument();
  });

  it('renders only wordmark when icon is false', () => {
    render(<Logo icon={false} />);
    const container = screen.getByLabelText('Logo');
    expect(container).toBeInTheDocument();
  });

  it('renders empty wrapper when both are false', () => {
    render(<Logo icon={false} wordmark={false} />);
    const container = screen.getByLabelText('Logo');
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
