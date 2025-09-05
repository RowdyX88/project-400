# Contributing

Thanks for your interest in contributing! This project is a lightweight static app that renders timelines from JSON data. Please follow the steps below to keep data clean and builds green.

## Prerequisites
- Node.js 20+
- npm 9+

## Setup
```sh
npm ci
```

## Local development
```sh
# start local server (127.0.0.1:5511)
npm run dev

# build TypeScript + Tailwind
npm run build
```

## Data changes (events and categories)
1) Edit JSON files under `src/data/`.
- Categories: `src/data/categories.json`
- Per-category events: `src/data/<category>.json` with shape `{ "events": [] }`

2) Follow ID and schema rules (enforced):
- ID format: `category-YYYY[-MM[-DD]]-slug`
- `event.category` must match a category id
- Year in `id` must equal `event.year`
- Additional properties are not allowed beyond the schema
- See `src/data/schema.md` for the full contract and examples

3) Normalize (optional) and validate (required):
```sh
# optionally auto-fix minor issues and sort
npm run normalize:data:write

# required: schema + logical validation
npm run validate:data
```

4) Commit:
- Pre-commit hook will run validation; ensure it passes
- Keep commit messages concise and descriptive (e.g., "data: add 1992 Maastricht Treaty event")

## Pull requests
- Open PRs against the default branch
- CI runs validation and build; PRs must be green
- If CI reports data errors, run `npm run normalize:data:write` and/or fix fields to match the schema, then re-run `npm run validate:data`

## Project scripts
- `npm run dev` — local server (127.0.0.1:5511)
- `npm run dev:any` — bind 0.0.0.0 for LAN testing
- `npm run build` — compile TS + Tailwind
- `npm run validate:data` — schema + logical checks
- `npm run normalize:data[:write]` — auto-fix minor issues and sort

## Tips
- Keep events factual; put references in `meta.sources`
- Omit unknown dates (don’t guess month/day)
- Slugs should be short, lowercase, ASCII, hyphenated
- Prefer stable IDs; add a small suffix for uniqueness if needed

Happy contributing!
