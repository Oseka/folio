# Task 6: Modern Web Application Dashboard (Folio)
A developer analytics dashboard that turns any GitHub profile into live charts and widgets. Built with **React 18, Vite and Recharts**, using the free GitHub REST API (no key).

## Features
- Bento-style dashboard layout with light and dark themes
- Reusable components: `Tile`, `StatTile`, `Header`, `ProfileTile`, `Charts` (donut, bar, monthly), `Feed`, `RepoExplorer`, `Compare`
- Dynamic data: profile, repositories and public events fetched live; loading, error, rate-limit and not-found states
- Data visualisation: languages donut (click to filter), top repositories by stars or size, repositories created per month, recent activity feed
- Repository explorer with search, sorting and language filter
- Head-to-head comparison of two developers
- State management with `useReducer` + Context (`src/context/DashboardContext.jsx`) and a custom data hook (`src/hooks/useGithubUser.js`)
- Responsive, centred mobile layout, keyboard-accessible controls, reduced-motion support

## Project structure
```
src/
  components/   reusable UI pieces
  context/      global state (reducer + context)
  hooks/        useGithubUser data hook
  utils/        API calls and analytics helpers
  App.jsx       layout and data wiring
```

## Run locally
```
npm install
npm run dev
```

## Deploy (GitHub Pages)
`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
In the repo go to Settings > Pages and set **Source: GitHub Actions**.

Data: GitHub REST API (public data, 60 anonymous requests per hour).


https://oseka.github.io/folio/