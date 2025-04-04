import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from './page';
import { useRouter } from 'next/navigation';
import type { HTMLProps } from 'react';

// Define types for mocks
interface ImageProps extends HTMLProps<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface MotionComponentProps {
  children?: React.ReactNode;
  whileHover?: unknown;
  [key: string]: unknown;
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image with proper types
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: ImageProps) => (
    <img alt={alt || 'Video thumbnail'} {...props} />
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: unknown, prop: string) => {
      return function MockComponent({ children, ...props }: MotionComponentProps) {
        const sanitizedProps = { ...props };
        delete sanitizedProps.whileHover;
        return prop === 'div' ? 
          <div {...sanitizedProps}>{children}</div> : 
          <h1 {...sanitizedProps}>{children}</h1>;
      };
    }
  })
}));

describe('HomePage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders homepage correctly', () => {
    render(<HomePage />);
    expect(screen.getByText('Select a Video')).toBeInTheDocument();
  });

  it('shows all video thumbnails', () => {
    render(<HomePage />);
    const thumbnails = screen.getAllByRole('img');
    expect(thumbnails).toHaveLength(5);
  });

  it('handles thumbnail click correctly', async () => {
    const mockPresignedUrl = 'test-url';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ url: mockPresignedUrl }),
    });

    render(<HomePage />);
    const thumbnails = screen.getAllByRole('img');
    
    await fireEvent.click(thumbnails[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/presigned-url?id=giant_pandas')
      );
      expect(mockRouter.push).toHaveBeenCalledWith(
        `/video/giant_pandas?url=${encodeURIComponent(mockPresignedUrl)}`
      );
    });
  });

  it('handles fetch error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<HomePage />);
    const thumbnails = screen.getAllByRole('img');
    
    await fireEvent.click(thumbnails[0]);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});