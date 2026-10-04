# Optimization Phase: Performance and Lazy Loading

## Implementation

The Home, Projects, Contact, Login, and NotFound route components are imported with `React.lazy()` in `src/App.jsx`. Vite uses these dynamic imports to emit separate JavaScript and CSS assets for each route. A route-scoped `Suspense` boundary displays an accessible loading indicator while a route chunk is fetched.

## Techniques and Tools

- React `lazy()` and dynamic `import()` for route-based code splitting.
- React `Suspense` with an accessible loading fallback.
- Vite production builds (`npm run build`) to inspect and compare initial and route chunk sizes.
- Browser DevTools Network panel, cache controls, and Slow 3G throttling to inspect when route chunks are requested and observe the fallback.

## Production Build Comparison

Measured with `npm run build` on 2026-10-04. The before build was the existing production output from commit `03f6fd2`, inspected before applying the lazy-loading change. The after build was produced from the updated route imports.

| Initial asset | Before | After | Change |
| --- | ---: | ---: | ---: |
| JavaScript, raw | 277.37 kB | 257.13 kB | -20.24 kB (-7.3%) |
| JavaScript, gzip | 90.17 kB | 84.78 kB | -5.39 kB (-6.0%) |
| CSS, raw | 21.41 kB | 4.18 kB | -17.23 kB (-80.5%) |
| CSS, gzip | 4.66 kB | 1.48 kB | -3.18 kB (-68.2%) |

The optimized build also emits route assets instead of bundling all route code and styles into the initial files:

| Lazy route asset | JavaScript | CSS |
| --- | ---: | ---: |
| Projects | 11.42 kB | 6.42 kB |
| Contact | 3.08 kB | 3.40 kB |
| Home | 3.45 kB | 4.91 kB |
| Login | 2.20 kB | 2.06 kB |
| NotFound | 0.56 kB | 0.82 kB |

Sizes above are Vite's build output, in decimal kB; each route JavaScript file is fetched when its route is first visited. This improves the initial download, not the amount of code needed after visiting every route. Build sizes are reproducible measurements; browser request timing and transferred bytes vary by browser, cache, network, and compression settings and were not captured as fixed values here.

## DevTools Verification

1. Run `npm run build` and `npm run preview`.
2. Open the preview, then open DevTools Network and enable **Disable cache**.
3. Reload `/` and record the JavaScript and CSS transfer sizes and load timings.
4. Navigate to `/projects` and `/contact`; confirm their named chunk requests appear only when each route is visited.
5. Set Network throttling to **Slow 3G**, navigate to a route that has not been loaded yet, and capture the `Loading page` fallback before its chunk finishes.
6. For repeatable timing evidence, capture each route once with an empty cache and once with a warm cache. Save the Network screenshots beside this report and note browser/version and throttling settings.

## Analysis

- The initial bundle is requested as the app starts. A lazy route chunk is requested when the user first navigates to that route.
- Lazy loading improves perceived startup by deferring code and styles for routes the user has not visited. A full visit to every route still downloads those chunks, with small per-chunk overhead.
- Lazy loading is less useful for tiny components or routes users always need immediately, where extra requests and fallback complexity can exceed the startup benefit.

The build report confirms separate route chunks and a smaller initial transfer. Network timings and React Profiler recordings are browser-session evidence and should be captured in DevTools for the submission; this report does not fabricate those observations.