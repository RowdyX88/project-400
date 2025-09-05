# Project 400 — Panels & Timeline

[![CI](https://github.com/RowdyX88/project-400/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/RowdyX88/project-400/actions/workflows/ci.yml)

Lightweight, static app that renders category-based timelines with optional map and insights.

## Quick start

```sh
npm ci
npm run dev    # serve at http://127.0.0.1:5511
```

Build assets:

```sh
npm run build
```

## Data and validation

- Authoritative data rules: `src/data/schema.md`
- Schemas: `src/data/schema/*.json`
- Validate data: `npm run validate:data`
- Normalize and sort (writes fixes): `npm run normalize:data:write`

Pre-commit runs validation automatically. CI also validates on push/PR.

## Scripts

- `npm run dev` — local server on 127.0.0.1:5511
- `npm run dev:any` — bind 0.0.0.0 for LAN testing
- `npm run build` — TypeScript + Tailwind build
- `npm run validate:data` — schema + logical checks
- `npm run normalize:data[:write]` — auto-fix minor issues

## Folder layout

- `src/` — TypeScript and UI modules
- `src/data/` — categories and per-category events
- `assets/` — built CSS and icons
- `scripts/` — data validator and normalizer

## Notes

- IDs follow `category-YYYY[-MM[-DD]]-slug`. Year in the ID must match the `year` field.
- Keep events flat and concise; put extra details under `meta`.

## Contributing

See `CONTRIBUTING.md` for setup, data rules, validation steps, and PR guidelines.
