---
sidebar_position: 1
---

# HomePage.tsx  

## `export default function HomePage()`

This component is the main entry point for **Piglet Prep**. It handles video playback via the YouTube Iframe API, displays an interactive quiz overlay after a set duration, and integrates a secure PIN lock modal.

* **Description:** Renders a dynamic homepage with video content, thumbnails for navigation, and interactive elements such as a quiz and PIN lock.

## `const [player, setPlayer]`

Holds the instance of the YouTube player used to control video playback.

## `const [currentVideoId, setCurrentVideoId]`

Stores the YouTube video ID for the currently playing video.

## `const [showQuestion, setShowQuestion]`

Determines whether the quiz overlay is displayed after a specific video playback duration.

## `const [showThumbnails, setShowThumbnails]`

Controls the visibility of the video thumbnails grid for navigation.

## `const videoRef`

A React ref attached to the DOM element that embeds the YouTube player.

## `const [showPinLock, setShowPinLock]`

Manages the visibility of the PIN lock modal to secure access.

## `useEffect` (YouTube API & Player Initialization)

Initializes the YouTube player when the API is ready, loads the necessary script if not already present, and sets up event listeners to manage video playback.

## `handleThumbnailClick(id: string)`

Updates the current video by setting a new video ID and hides the thumbnails grid.

* **Parameters:**
  * `id` — `string` representing the selected YouTube video ID.

## `handleBack()`

Pauses the video playback and re-displays the thumbnails grid while hiding the quiz overlay.

---

# MetricsDashboard.tsx  

## `export default MetricsDashboard`

This component displays user engagement metrics and video statistics for **Piglet Prep**. It provides an overview of popular videos and key performance indicators.


## `const popularVideos`

A static array containing metadata for popular videos, including titles and dates.

## `handleGoBack()`

Navigates the user back to the previous page using Next.js routing.

* **Behavior:** Triggers a route change to return to the HomePage.

---
