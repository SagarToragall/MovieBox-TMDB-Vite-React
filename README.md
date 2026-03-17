# MovieBox-TMDB-Vite-React

A modern, responsive, Netflix-style movie app built with **React (Vite)**, **React Router**, **Axios**, and **Framer Motion**.

## Features

- Home page: **Trending** + **Popular** movies (TMDB)
- Search page with query params (`/search?q=...`)
- Movie details page (poster, overview, rating, release date, runtime, trailer link if available)
- **Favorites / Watchlist** (saved to `localStorage`)
- Loading states: spinner + skeleton cards
- Error handling UI (missing API key, network/API errors)
- Smooth animations: card hover scale + page transitions

## Project structure

```
src/
  components/
  pages/
  services/api.js
  state/FavoritesContext.jsx
  App.jsx
  main.jsx
```

## Setup

1) Install

```bash
npm install
```

2) Add TMDB API key

- Copy `.env.example` to `.env`
- Add your key:

```bash
VITE_TMDB_API_KEY=xxxxxxxxxxxxxxxxxxxx
```

Get a key from TMDB: https://www.themoviedb.org/settings/api

3) Run dev server

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Netlify / Vercel)

### Netlify

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: add `VITE_TMDB_API_KEY`

### Vercel

- Framework preset: **Vite**
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment variables**: add `VITE_TMDB_API_KEY`

## Notes

- TMDB rate limits apply; API calls are lightly cached in-memory in `src/services/api.js`.
- TMDB results cap pagination at 500 pages (the UI respects this).
