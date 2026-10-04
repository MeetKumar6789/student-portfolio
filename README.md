# Student Portfolio - Meet Nakarani

Welcome to my personal student portfolio website. This project has been extended to include dynamic client-side routing, advanced state management, and responsiveness.

---

## Features
*   **Modular Component Architecture:** Structured using independent React components: Header, About, Skills, and Footer.
*   **Client-Side Routing:** Built with `react-router-dom` (v6) to navigate across pages instantly without triggering full browser reloads.
*   **Dynamic Theme Toggle:** Swaps between a dark mode and a light theme in real-time, modifying the class on the root element.
*   **Interactive Academics Tooltip:** Implements collapsible visibility states in the UI to display information dynamically.
*   **Controlled Form Input:** Features real-time state tracking and verification for contact forms.
*   **Live Character Counter:** Displays character length tracking dynamically below form inputs.
*   **Custom 404 Catch-All:** Gracefully handles invalid URLs with a styled NotFound view.
*   **GitHub API Integration:** Fetches public repository metadata from the unauthenticated GitHub REST API and renders repository cards with search, loading, retry, and error handling.
*   **Fidelity SVGs:** Embedded vector brand logo assets (e.g. PostgreSQL Slonik and multi-colored Figma).

---

## Technical Stack & Architecture

This application implements core React concepts:

*   **Vite Tooling:** Configured with Hot Module Replacement (HMR) and production bundling.
*   **Client-Side Routing Structure:**
    *   **BrowserRouter:** Wraps the entire layout exactly once inside `main.jsx`.
    *   **Routes & Route:** Configured inside `App.jsx` to render the correct page view:
        *   `/` -> `Home.jsx` (Hero details and Bio)
        *   `/projects` -> `Projects.jsx` (Skills and Technologies)
        *   `/contact` -> `Contact.jsx` (Form and Footer socials)
        *   `*` -> `NotFound.jsx` (Catch-all 404 handler)
    *   **Link Components:** Used inside the `NavBar` to link pages seamlessly without reloading.
*   **State Management (useState & useEffect):**
    *   `theme` / `setTheme`: Toggles dark/light stylesheets by adding or removing the `.dark-theme` / `.light-theme` class on the root `document.documentElement` element.
    *   `showTip` / `setShowTip`: Collapses or expands the educational advice box.
    *   `message` / `setMessage` & `userName` / `setUserName`: State-driven controlled inputs for form fields.
    *   Live `message.length` tracking: Renders character counts dynamically as the user types.

---

## Project Structure
```
student-portfolio/
├── index.html
├── src/
│   ├── main.jsx              ← React entry point, BrowserRouter setup
│   ├── index.css             ← Global reset, theme variable definitions, and animations
│   ├── App.jsx               ← Root shell managing routing, navigation, and theme states
│   └── components/
│       ├── NavBar.jsx + .css  ← Navigation links with theme toggler
│       ├── Home.jsx + .css    ← Hero wrapper, Academics collapsible box, and About Me section
│       ├── Projects.jsx + .css← Project page wrapper loading the Skills grid
│       ├── Contact.jsx + .css ← Contact Form, text inputs, live character counts, and Footer
│       ├── NotFound.jsx + .css← Catch-all 404 component
│       ├── Header.jsx + .css  ← Header details
│       ├── About.jsx + .css   ← Biography statistics
│       ├── Skills.jsx + .css  ← Technologies grid
│       ├── Footer.jsx + .css  ← Contact info and social media directory
│       └── PostgresLogo.jsx   ← Slonik SVG vector logo
```

---

## Getting Started

### Prerequisites
Ensure you have Node.js installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MeetKumar6789/student-portfolio.git
   cd student-portfolio
   ```

2. Install dependencies (including react-router-dom):
   ```bash
   npm install
   ```

3. Update the GitHub username used for the public API call in `src/components/Projects.jsx` if you want to show a different profile:
   ```js
   const GITHUB_USERNAME = 'MeetKumar6789';
   ```
   The app uses the public, unauthenticated GitHub REST API (`https://api.github.com/users/<username>/repos`), so no API key or backend is required.

4. Run the development server:
   ```bash
   npm run dev
   ```

### Production Build
To build the static application for production:
```bash
npm run build
```
This outputs optimized static assets in the `dist/` directory.

## Optimization Phase: Route-Based Code Splitting

This phase uses `React.lazy()` with route-level `Suspense` to load Home, Projects, Contact, Login, and NotFound only when their routes are visited. Vite dynamic imports split these pages into separate JavaScript and CSS chunks, and an accessible loading indicator is shown while a chunk loads.

Optimization techniques and tools used: React route-based lazy loading and code splitting, a `Suspense` fallback, Vite production builds (`npm run build`) to compare initial bundle sizes, and browser DevTools Network throttling to inspect route-chunk requests and loading behavior. The measured bundle comparison and verification steps are documented in [reports/optimization-phase-performance.md](reports/optimization-phase-performance.md).
