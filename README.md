# Instagram Stories Lite

A mobile-focused React + Vite + Tailwind UI that mimics Instagram Stories: horizontal story strip, tap navigation, autoplay every 5s, and data loaded from an external JSON file. No external libraries beyond React and Tailwind.

## Getting started

1. Install deps:
   ```sh
   npm install
   ```
2. Run dev server:
   ```sh
   npm run dev
   ```
3. Open the mobile-sized preview at the URL shown in the terminal.

## How it works

- Stories data lives in `public/data/stories.json` and is fetched at runtime.
- `App.tsx` manages loading state, the story strip, and the viewer.
- `StoryViewer` handles tap zones (left/back, right/next), autoplay with `requestAnimationFrame`, and progress bars.
- Auto-advance waits for the image to load, then moves to the next story after 5s; manual taps reset the timer.
- Basic fade/scale transitions and gradients provide a smooth, mobile look.

## Notes

- Built for mobile sizing (max width 520px) and centered on desktop for convenience.
- The lint script is a placeholder; add ESLint/Prettier if you want stricter checks.
