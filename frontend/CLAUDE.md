# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page photo gallery site ("Chasing Chipmunks") — a responsive masonry wall of photos that opens into a
fullscreen swipeable/keyboard-navigable lightbox. Built with React 19 + TypeScript + Vite, deployed as a static
site to Cloudflare Pages.

This `frontend/` directory is a subfolder of a larger repo whose root is one level up (`../`). The sibling
`../photos/` directory holds the original HEIC photos plus a conversion script and the generated `full/` (JPEG)
and `thumbs/` (PNG) images that the app actually loads at runtime — see "Photo pipeline" below.

## Commands

```bash
npm run dev         # start Vite dev server with HMR
npm run build        # tsc -b type-check, then vite build -> dist/
npm run preview       # serve the built dist/ locally
npm run lint          # eslint ./src
npm run lint:fix       # eslint ./src --max-warnings 0 --fix
npm run prettier       # format all .ts/.tsx files (2-space tabs)
npm run deploy        # build, then wrangler pages deploy ./dist --project-name chasingchipmunks
```

A `Makefile` wraps the common ones: `make dev`, `make build`, `make deploy`, `make lint`.

There is no test suite in this project.

## Architecture

Everything lives in `src/`, with no routing and no backend — it's one page.

- **`src/App.tsx`** — owns all gallery state. Splits `NUM_PHOTOS` photos into a responsive number of masonry
  columns (`3` desktop / `2` tablet / `1` mobile, based on `useWindowSize` breakpoints at 991px/575px) and renders
  each as a thumbnail `<img>`. Also exports `BASE_URL`, the jsdelivr CDN base URL the whole app fetches images
  from.
  - On **mobile (1 column)**, clicking a photo does nothing; instead `useCenteredImage` tracks whichever photo is
    scrolled to the vertical center of the viewport and un-blurs it in place (`in-the-middle` class).
  - On **desktop/tablet (2-3 columns)**, clicking a photo opens `LazyImageFullscreen` instead, and the
    centered-image tracking is disabled.
  - Photo IDs are derived, not stored: index `rawIdx` maps to a zero-padded 3-digit filename (`"001"`, `"002"`,
    ...), and `NUM_PHOTOS` must be kept in sync with however many images actually exist in the CDN source.
- **`src/LazyImageFullscreen.tsx`** — the lightbox overlay. Loads the low-res thumb immediately (already cached
  from the grid) and layers the high-res full image on top, fading it in once loaded (`opacity` transition, no
  layout shift) with a small spinner shown until then. Supports Escape/ArrowLeft/ArrowRight and touch-swipe
  navigation, and locks body scroll while open.
- **`src/hooks/useCenteredImage.tsx`** — generic scroll/resize-driven hook that finds which element (by CSS
  selector) is closest to viewport center and returns its `id`. Only used for the mobile un-blur behavior above.
- **`src/main.tsx`** — mounts `<App>` and registers `public/serviceWorker.js`. There is no data-fetching
  layer; all images load as plain `<img>` tags straight from the CDN.
- **`public/serviceWorker.js`** — a runtime cache-only service worker: any request whose URL contains
  `/lukasz321/chasingchipmunks` (i.e. the jsdelivr CDN photo URLs) is cached on first fetch and served from cache
  thereafter, so repeat visits/navigation don't re-download full-res images.

### Photo pipeline & CDN

Images are **not** bundled with the app — they're fetched at runtime from jsdelivr, pinned to a git tag of this
repo:

```
BASE_URL = https://cdn.jsdelivr.net/gh/lukasz321/chasingchipmunks@v1/photos/
```

- Thumbnails: `${BASE_URL}/thumbs/{001..NNN}.png`
- Full-res: `${BASE_URL}/full/{001..NNN}.jpg`

Source images live in `../photos/` (originals as `.HEIC`/`.heic`, converted via `../photos/convert_heic_to_png.sh`
using ImageMagick into numbered `full/*.jpg` (max 4000px, q90) and `thumbs/*.png` (max 600px, q75)).

**To add new photos:** drop HEICs into `../photos/`, run the conversion script, commit `full/` and `thumbs/`,
move/create the `vN` git tag jsdelivr resolves against, and bump `NUM_PHOTOS` in `App.tsx` to match. Because
jsdelivr caches by tag, existing tags are effectively immutable once published — that's why the tag gets bumped
rather than reused (see commit "Pin photos to a git tag rather than branch").

## Styling

- `App.scss` is the entire stylesheet: masonry grid/columns, responsive column hiding via media queries (mirrors
  the JS breakpoints in `App.tsx` — keep both in sync if breakpoints change), the grayscale/blur/brightness photo
  filter transitions (hover on desktop, scroll-driven "in-the-middle" on mobile), and the fullscreen overlay
  fade/spinner styles. No CSS framework — Bootstrap was removed (it was pulling ~30 kB gzip for a single padding
  utility).
- **Do not delete the `.debug` rule in `App.scss`** even though nothing references it in the committed code — it's
  a manual outline helper the author toggles onto elements by hand while developing.
- `index.css` is unmodified Vite/React template boilerplate (light/dark `prefers-color-scheme` variables); it's
  effectively superseded by the black background and rules in `App.scss`/`App.tsx` and shouldn't be treated as
  the source of truth for visual style.
- Format with `npm run prettier` (2-space tabs) before committing; `npm run lint:fix` enforces zero ESLint
  warnings.
