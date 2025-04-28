import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from './page';
import { useRouter } from 'next/navigation';

// --- Mocks ---

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockedImage(props: { src: string; alt: string }) {
    return <img {...props} />;
  },
}));

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => {
      const MockedMotionComponent = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );
      MockedMotionComponent.displayName = 'MockedMotionComponent';
      return MockedMotionComponent;
    },
  }),
}));

// --- Tests ---

describe('HomePage', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Popular Videos heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Popular Videos')).toBeInTheDocument();
  });

  it('shows 6 thumbnails', () => {
    render(<HomePage />);
    expect(screen.getAllByRole('img')).toHaveLength(6);
  });

  it('clicks thumbnail (no full fetch)', () => {
    render(<HomePage />);
    const thumbnails = screen.getAllByRole('img');
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[1]).toBeInTheDocument(); // just sanity check after click
  });
});
