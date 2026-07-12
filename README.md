# 🎓 Student Portfolio — Meet Nakarani

Welcome to my personal student portfolio website! Built with modern web standards, this clean, minimalist, and fully responsive single-page application highlights my background, core statistics, technical skills (complete with authentic brand logos), and contact details.

🌐 **Live GitHub Repository:** [github.com/MeetKumar6789/student-portfolio](https://github.com/MeetKumar6789/student-portfolio)

---

## ✨ Features
*   **Modern Light Design:** Crafted with a curated white & soft grey color system, featuring subtle glassmorphic elements and dark grey typography.
*   **Reusable Component Architecture:** Separated into 4 primary components ([Header](src/components/Header.jsx), [About](src/components/About.jsx), [Skills](src/components/Skills.jsx), and [Footer](src/components/Footer.jsx)).
*   **Fidelity SVGs:** Embedded authentic brand logo assets (including Slonik for *PostgreSQL* and the multi-color *Figma* logo).
*   **Micro-Animations:** Fluid fade-ins, hover lifts on cards, and animated interactive progress bars.
*   **Optimized Performance:** Built on Vite with near-instant page load and bundle build speeds.

---

## 🛠️ Tech Stack
*   **Framework:** React 19 (Functional Components & Props)
*   **Bundler:** Vite 8
*   **Styling:** Vanilla CSS (CSS Variables / Tokens, Grid, Flexbox)
*   **Linting:** Oxlint (for code quality & performance)
*   **Icons:** Simple Icons & Devicon (Custom SVG Paths)

---

## 📂 Project Structure
```
student-portfolio/
├── index.html
├── src/
│   ├── main.jsx              ← React entry point
│   ├── index.css             ← Global reset, theme tokens, and animations
│   ├── App.jsx               ← Root orchestrator passing props to components
│   └── components/
│       ├── Header.jsx + .css  ← Welcome banner & navigation
│       ├── About.jsx  + .css  ← Bio & quantitative coding statistics
│       ├── Skills.jsx + .css  ← Technical stack grid with progress bars
│       └── Footer.jsx + .css  ← Contact handles & brand social links
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MeetKumar6789/student-portfolio.git
   cd student-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```
   Open your browser to the local port (usually `http://localhost:5173`) to view the application!

### Production Build
To generate a static build of the application:
```bash
npm run build
```
The optimized bundle will be compiled inside the `dist/` directory, ready to be hosted on GitHub Pages, Vercel, or Netlify.
