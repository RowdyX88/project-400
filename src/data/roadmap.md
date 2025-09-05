# Project roadmap

This roadmap tracks conventions and future enhancements. For the authoritative data contract and validation rules, see `src/data/schema.md`.

## Categories register
`src/data/categories.json` contains an array of categories with `id`, `label`, `file`, and optional `color`. Example:

```json
{
  "categories": [
    { "id": "nato",    "label": "NATO",    "file": "nato.json",    "color": "#fbbf24" },
    { "id": "politics","label": "Politics","file": "politics.json","color": "#60a5fa" },
    { "id": "weather", "label": "Weather", "file": "weather.json", "color": "#34d399" },
    { "id": "life",    "label": "Life",    "file": "life.json",    "color": "#c084fc" },
    { "id": "fafo",    "label": "FAFO",    "file": "fafo.json",    "color": "#f87171" }
  ]
}
```

## Event shape (summary)
Each category file is `{ "events": Event[] }`. An `Event` follows the schema in `src/data/schema/event.schema.json`. Example (aligned with current schema):

```json
{
  "id": "politics-1992-02-07-maastricht-treaty-signed",
  "category": "politics",
  "year": 1992,
  "title": "Maastricht Treaty signed",
  "summary": "Lays the foundation for the European Union.",
  "date": "1992-02-07",
  "countries": ["Netherlands", "EU"],
  "tags": ["EU", "integration"],
  "geo": { "lat": 50.85, "lng": 5.69 },
  "meta": {
    "sources": ["https://eur-lex.europa.eu/EN/legal-content/summary/treaty-of-maastricht.html"]
  },
  "punchline": "EU achievement unlocked: bureaucracy speedrun percent."
}
```

Notes:
- Put references like `sources` under `meta`.
- Keep objects flat; avoid nested `events` arrays inside items.

## UI/UX guidelines
- “Spice” toggle controls visibility of `punchline`.
- Category color themes are used for chips and accents.
- Event chip shows `summary` by default; `punchline` when spice is on.

## Performance and indexing
- Events are sorted by `year` ASC, then by `id` ASC.
- Keep event cards lightweight; consider windowing if lists grow large.

## Data validation and tooling
- Validate: `npm run validate:data`
- Normalize and sort (optional fix-ups): `npm run normalize:data:write`
- A pre-commit hook runs validation automatically.

## Future enhancements
- Expand map interactions around `geo` coordinates.
- CI already validates data on push/PR.
