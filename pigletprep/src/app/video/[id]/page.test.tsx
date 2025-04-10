import { render, screen } from '@testing-library/react';
import VideoPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock DetectLabels so that it renders a predictable element
jest.mock('@/app/videotomcq/DetectLabels', () => () => (
  <div data-testid="detect-labels">DetectLabels Component</div>
));

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'load', {
    configurable: true,
    value: jest.fn(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: jest.fn(),
  });
});

describe('VideoPage', () => {
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => encodeURIComponent('https://example.com/video.mp4'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders the DetectLabels component and the back button when URL is provided', () => {
    render(<VideoPage />);
    // Instead of querying by text (since the back button is an icon only),
    // we query for the first button rendered.
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument();

    // Verify that DetectLabels is rendered (since videoUrl exists)
    expect(screen.getByTestId('detect-labels')).toBeInTheDocument();
  });
});
