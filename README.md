# Chetan Suthar — Portfolio

React + Vite portfolio with a real-time Three.js hero (React Three Fiber), a 3D skill sphere, and Framer Motion scroll animations.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the build
```

## Edit content

All text (profile, skills, experience, projects, contact) lives in [`src/data/content.js`](src/data/content.js). The portrait is `public/images/chetan.webp`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`.
In the repo on GitHub, go to **Settings → Pages → Source** and select **GitHub Actions** once.

## Structure

```
src/
  App.jsx               page composition
  data/content.js       all copy
  three/HeroScene.jsx   WebGL hero (lazy-loaded)
  components/           Hero, About, Skills, Experience, Projects, Contact, Chrome (nav/loader/cursor), Motion helpers
  styles.css            theme + layout
```

The previous static site is archived in `_legacy/`. It isn't part of the build, so you can delete it.
