---
sidebar_position: 1
---
# Unit tests

The homepage and the video page are tested.

A test case consists of input parameter values and expected results.

External libraries and components (e.g., `next/navigation`, `next/image`, `framer-motion`) are stubbed or mocked as needed.

## HomePage tests
- Mocks `useRouter`, `next/image`, and `motion` from `framer-motion`.
- Tests:
  - Renders the "Popular Videos" heading.
  - Renders exactly 6 thumbnails (images).
  - Clicking on a thumbnail does not break the UI (sanity click test).

## VideoPage tests
- Mocks `useRouter` and `useSearchParams`.
- Tests:
  - Renders the back button correctly when URL and preferences are present.
