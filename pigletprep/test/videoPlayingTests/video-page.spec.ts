// tests/video-page.spec.ts
import { test, expect } from '@playwright/test';

test('Video page exists and shows the video element', async ({ page }) => {
  // Replace with a valid presigned URL or a test value.
  const presignedUrl = 'https://your-presigned-url';
  await page.goto(`http://localhost:3000/video/giant_pandas?url=${encodeURIComponent(presignedUrl)}`);
  
  // Check that a <video> element is present
  const video = page.locator('video');
  await expect(video).toBeVisible();
});