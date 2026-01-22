import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Dialog } from '../Dialog';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Dialog', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders into portal-root if available and DOES NOT mark itself inert', async () => {
    // Setup portal-root
    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);

    // Setup other content
    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    mainContent.textContent = 'Main Content';
    document.body.appendChild(mainContent);

    const handleClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Test Dialog">
        <p>Dialog Content</p>
      </Dialog>
    );

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const dialog = screen.getByRole('dialog');

    // Dialog should be inside portal-root
    expect(portalRoot.contains(dialog)).toBe(true);

    // Dialog (or its container) should NOT be inert
    // Since dialog is inside portal-root, and portal-root is excluded from inert loop
    expect((portalRoot as any).inert).toBeFalsy();

    // Main content SHOULD be inert
    expect((mainContent as any).inert).toBe(true);
  });

  it('DOES NOT mark a wrapper inert if it contains portal-root (robustness against nesting)', async () => {
    // Setup nested portal-root
    const wrapper = document.createElement('div');
    wrapper.id = 'app-wrapper';
    document.body.appendChild(wrapper);

    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    wrapper.appendChild(portalRoot);

    // Sibling of wrapper
    const sibling = document.createElement('div');
    sibling.id = 'sibling';
    document.body.appendChild(sibling);

    const handleClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Test Dialog">
        <p>Dialog Content</p>
      </Dialog>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const dialog = screen.getByRole('dialog');

    // Check structure
    expect(wrapper.contains(portalRoot)).toBe(true);
    expect(portalRoot.contains(dialog)).toBe(true);

    // Wrapper should NOT be inert because it contains portal-root
    expect((wrapper as any).inert).toBeFalsy();

    // Sibling SHOULD be inert
    expect((sibling as any).inert).toBe(true);

    // Portal Root should NOT be inert
    expect((portalRoot as any).inert).toBeFalsy();
  });
});
