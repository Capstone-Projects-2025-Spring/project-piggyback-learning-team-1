import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';


jest.mock('next/navigation', () => ({
 useRouter: jest.fn(),
 useSearchParams: jest.fn(),
}));


describe('VideoPage', () => {
 const mockRouter = {
   back: jest.fn(),
   push: jest.fn(),
 };


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


 beforeEach(() => {
   (useRouter as jest.Mock).mockReturnValue(mockRouter);
   (useSearchParams as jest.Mock).mockReturnValue({
     get: () => encodeURIComponent('https://example.com/video.mp4'),
   });
 });


 afterEach(() => {
   jest.clearAllMocks();
 });


 it('renders the video container when URL is provided', () => {
   render(<VideoPage />);


   const backButton = screen.getByText('⬅ Back');
   expect(backButton).toBeInTheDocument();


   const video = screen.getByTestId('video-player');
   expect(video).toBeInTheDocument();
 });


 it('tries to play the video when it can play', async () => {
   const playMock = jest.fn();
   jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(playMock);


   render(<VideoPage />);


   const video = screen.getByTestId('video-player');
   fireEvent(video, new Event('canplay'));


   await waitFor(() => {
     expect(playMock).toHaveBeenCalled();
   });
 });
});
