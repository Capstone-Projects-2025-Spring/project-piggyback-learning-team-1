import { render, screen } from '@testing-library/react';
import VideoPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// ✅ Fix: Give mocked component a display name to remove lint error
jest.mock('@/app/videotomcq/DetectLabels', () => {
  const DetectLabelsMock = () => (
    <div data-testid="detect-labels">DetectLabels Component</div>
  );
  DetectLabelsMock.displayName = 'DetectLabelsMock';
  return DetectLabelsMock;
});

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
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument();

    expect(screen.getByTestId('detect-labels')).toBeInTheDocument();
  });
});