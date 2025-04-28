import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';

// --- Mocks ---

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// --- Tests ---

describe('VideoPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'url') return encodeURIComponent('https://example.com/video.mp4');
        if (key === 'preferences') return encodeURIComponent(JSON.stringify({ enableOD: true }));
        return null;
      },
    });
  });

  it('renders the back button', () => {
    render(<VideoPage />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
