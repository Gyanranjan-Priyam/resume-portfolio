# Loader Component (TypeScript)

A self-contained, animated intro/loading screen extracted from **portfolio-2.0**, converted to TypeScript for reuse in other Next.js projects.

## What it does

1. **Progress counter** — animates from `0%` → `100%` over 5 seconds  
2. **Name reveal** — full name splits into lines and exits upward; short name fades in  
3. **Slide transition** — loader scales down and slides left while the `<main>` content slides in from the right  
4. **Completion** — sets `introOut: true` in the store, enables scroll, and reveals the header

## Folder structure

```
loader-component/
├── index.ts                    # Barrel exports
├── Loader.tsx                  # Main component (TypeScript)
├── loader.module.scss          # Component-scoped styles
├── store.ts                    # Zustand store (typed)
├── useIsomorphicLayoutEffect.ts
├── scss.d.ts                   # SCSS module type declarations
├── styles/
│   ├── globals.scss            # Import this in your _app to get all base styles
│   ├── colors.scss             # CSS custom properties (light/dark theme)
│   ├── fonts.scss              # @font-face declarations + CSS custom properties
│   ├── fontStyle.scss          # Typography utility classes (.h1, .h2, .name-text, .loader-number)
│   ├── functions.scss          # SCSS mixins & functions (mobile/desktop breakpoints, vw/vh helpers)
│   ├── layout.scss             # Grid layout system + .layout-block-inner
│   └── variables.scss          # SCSS variables (breakpoints, viewport sizes)
└── README.md
```

## Dependencies

Install these in your target project:

```bash
npm install gsap split-type zustand clsx
# or
yarn add gsap split-type zustand clsx
```

Your project also needs:
- **React 18+**
- **Next.js 13+ / 14+** (uses `next/router`)
- **SASS** support (`npm install sass`)
- **Lenis** smooth scroll (`npm install lenis`) — required if you use the scroll features in the store

## Setup in your project

### 1. Copy the folder

Copy the entire `loader-component/` folder into your project, e.g. `src/components/loader/`.

### 2. Import global styles

In your `_app.tsx` (or global CSS entry), import the base styles:

```tsx
import '../components/loader/styles/globals.scss';
```

### 3. Add fonts

Copy the font files to your `public/fonts/` directory:
- `pricedown.otf` — used for the progress number
- `mokoto.regular.ttf` — used for the name text

### 4. Add the component

```tsx
import { Loader } from '../components/loader';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Loader
        fullName="Your Full Name"
        shortName="Your Tagline."
      />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
```

### 5. Wire up Lenis (optional but recommended)

The loading animation uses `lenis` to scroll to top and start smooth scrolling after the intro. Set it up in your app:

```tsx
import Lenis from 'lenis';
import { useEffect } from 'react';
import { useLoaderStore } from '../components/loader';

function useLenis() {
  const setLenis = useLoaderStore((s) => s.setLenis);

  useEffect(() => {
    const lenis = new Lenis();
    setLenis(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [setLenis]);
}
```

### 6. HTML structure requirements

The animation expects this DOM structure:

```html
<div id="layout">        <!-- layoutId prop, default: "layout" -->
  <header>...</header>    <!-- Hidden during intro, revealed after -->
  <div id="loader">...</div>  <!-- The Loader component -->
  <main>...</main>        <!-- Slides in from right after intro -->
</div>
```

## Props

| Prop        | Type     | Default                | Description                          |
|-------------|----------|------------------------|--------------------------------------|
| `fullName`  | `string` | `'Gyanranjan Priyam'` | Full name shown during loading       |
| `shortName` | `string` | `'This is Priyam.'`   | Tagline revealed after loading       |
| `layoutId`  | `string` | `'layout'`            | ID of the layout wrapper element     |

## Theme support

The component supports light/dark themes via CSS custom properties. Toggle theme with:

```tsx
import { useLoaderStore } from '../components/loader';

const toggleTheme = useLoaderStore((s) => s.toggleTheme);
```

Set `data-theme="dark"` on `<html>` for dark mode.
