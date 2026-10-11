# DEV BYTE Brand Mark and Logo Reveal

## Concept

The mark combines a geometric D and B around a shared vertical structure, framed by inward-facing coding brackets. Its simple stroked geometry keeps the symbol legible as a small icon while communicating code and a connected, modular identity. It uses no botanical or AI imagery.

## Files and variants

- `public/brand/devbyte-logo.svg` — primary light-surface horizontal lockup.
- `public/brand/devbyte-icon.svg` — standalone transparent DB/bracket mark.
- `public/brand/devbyte-logo-dark.svg` — white and sage lockup for dark surfaces.
- `public/brand/devbyte-logo-monochrome.svg` — one-ink lockup.
- `public/brand/devbyte-favicon.svg` — simplified, transparent small-size mark.
- `src/components/brand/DevByteLogo.tsx` — reusable inline-SVG React logo with size, variant, wordmark, and animation props.

The existing favicon reference in `index.html` now points to the new DEV BYTE favicon; the older public SVG files were preserved.

## Animation sequence

When `animated` is enabled, the bracket strokes move inward with spring timing, the connected DB paths draw in sequence, a short sage highlight passes across the mark, and the wordmark fades/slides into place. The animation is mount-triggered; static usage is the default, and there is no looping glow or repeated animation on rerender.

The landing and signup brand links use the animated lockup. Shared application-shell branding uses the same component without animation.

## Accessibility and performance

- The logo is decorative inside links that already have the accessible name “DEV BYTE home.”
- `useReducedMotion` disables the reveal and immediately shows the complete mark.
- The logo uses inline vector paths for independently animated parts; static assets are compact vector SVGs with no raster images.
- The SVG sweep clip ID is generated per instance to avoid collisions.
- No animation dependency was added; the existing `motion` package is reused.

## Checks performed

- `npm exec tsc -- -b --pretty false` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; 518 modules transformed and Vite production output completed.
- Browser fetched all five new SVG assets successfully (HTTP 200); each parsed as SVG and contained no embedded image.
- Browser rendered the light, dark, and monochrome lockups on their intended contrasting surfaces.
- Favicon SVG rendered at 16×16, 32×32, and 64×64 CSS-pixel sizes.
- Logo reveal markup was rendered in the application and its motion-path sequence is present. The integrated browser background reported the page as hidden and kept Web Animations at time zero, so it throttled actual visual playback; this environment limitation means the motion sequence could not be observed to completion in that browser session.

## Remaining limitations

- The new logo has not had a separate human visual review outside the browser render checks above.
- The browser session's hidden-page animation throttling prevented an end-to-end timing observation of the reveal. Reduced-motion handling is implemented and covered by the shared motion preference logic.
