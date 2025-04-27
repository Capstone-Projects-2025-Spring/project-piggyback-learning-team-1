import { render, screen } from '@testing-library/react';
import VideoPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Update mock to capture props
jest.mock('@/app/videotomcq/DetectLabels', () => {
  interface DetectLabelsProps {
    videoSrc: string;
    preferences: {
      enableOD: boolean;
      subjects: string[];
      penaltyOption: string;
    };
  }

  interface DetectLabelsMockType extends React.FC<DetectLabelsProps> {
    lastProps: DetectLabelsProps | null;
    displayName: string;
  }

  const DetectLabelsMock: DetectLabelsMockType = (props: DetectLabelsProps) => {
    DetectLabelsMock.lastProps = props;
    return <div data-testid="detect-labels">DetectLabels Component</div>;
  };

  DetectLabelsMock.displayName = 'DetectLabelsMock';
  DetectLabelsMock.lastProps = null;

  return DetectLabelsMock;
});

// Get access to the mock, checking for default export if present.
const moduleExport = jest.requireMock('@/app/videotomcq/DetectLabels');
const DetectLabelsMock = moduleExport.default || moduleExport;

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
    // Reset the captured props.
    if (DetectLabelsMock) { DetectLabelsMock.lastProps = null; }
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

  it('passes correct preferences to DetectLabels', () => {
    render(<VideoPage />);

    // Verify correct preferences are passed
    expect(DetectLabelsMock.lastProps).toBeDefined();
    expect(DetectLabelsMock.lastProps.videoSrc).toEqual('https://example.com/video.mp4');
    expect(DetectLabelsMock.lastProps.preferences).toMatchObject({
      enableOD: true, // expected default value
      subjects: expect.any(Array), // adjust based on your defaults
      penaltyOption: expect.any(String) // adjust based on your defaults
    });
  });
});
