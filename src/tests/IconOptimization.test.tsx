import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Icon } from '../once-ui/components/Icon';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock the icon library to ensure we have a predictable icon
vi.mock('../once-ui/icons', () => ({
    iconLibrary: {
        testIcon: () => <div data-testid="test-icon-svg" />
    }
}));

// Mock Tooltip to avoid complex rendering and ensure we catch it
vi.mock('../once-ui/components/Tooltip', () => ({
    Tooltip: ({ label }: { label: React.ReactNode }) => <div data-testid="tooltip">{label}</div>
}));

describe('Icon Component', () => {
    it('renders correctly without tooltip', () => {
        render(<Icon name="testIcon" data-testid="icon-container" />);
        expect(screen.getByTestId('test-icon-svg')).toBeInTheDocument();
        expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('renders with tooltip and shows it on hover', async () => {
        render(<Icon name="testIcon" tooltip="Test Tooltip" data-testid="icon-container" />);

        const container = screen.getByTestId('icon-container');
        expect(container).toBeInTheDocument();

        fireEvent.mouseEnter(container);

        // Tooltip should appear after delay (400ms)
        await waitFor(() => {
            expect(screen.getByTestId('tooltip')).toBeInTheDocument();
            expect(screen.getByText('Test Tooltip')).toBeInTheDocument();
        });
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Icon name="testIcon" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies basic props correctly', () => {
        render(<Icon name="testIcon" className="test-class" data-testid="icon-container" />);
        const container = screen.getByTestId('icon-container');
        expect(container).toHaveClass('test-class');
    });
});
