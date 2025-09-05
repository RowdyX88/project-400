## Data schema and rules (authoritative)

This document defines the event and category data formats used by the app and enforced by the validator.

### Files and layout
- `src/data/categories.json`: registry of available categories. Maps an id to a label, file name, and optional color.
- `src/data/<category>.json`: one file per category. Shape: `{ "events": Event[] }`.
- JSON Schemas live in `src/data/schema/` and are used by the validator.

### Event object (required properties)
- `id` string: Must follow the pattern `category-YYYY[-MM[-DD]]-slug`.
- `category` string: Lowercase id of the category (must exist in `categories.json`).
- `year` integer: Four-digit year matching the year portion in `id`.
- `title` string: Short headline.

### Event object (optional properties)
- `summary` string
- `date` string: `YYYY` or `YYYY-MM` or `YYYY-MM-DD`
- `location` string
- `countries` string[]
- `tags` string[]
- `meta` object: free-form keys allowed
- `geo` object: `{ lat: number (-90..90), lng: number (-180..180) }`
- `punchline` string

Additional properties are NOT allowed beyond the ones listed above (enforced by schema).

### Category object
In `categories.json`, the root object is `{ "categories": Category[] }` where each Category has:
- `id` (string, lowercase), `label` (string), `file` (string like `nato.json`), optional `color` (hex).

### ID format rules (strict)
- Format: `category-YYYY[-MM[-DD]]-slug`
- `category` must equal the `category` field on the event and match a known category id.
- `YYYY` must equal the event’s `year`.
- `MM` (01–12) and `DD` (01–31) are optional; when unknown, omit.
- `slug` is short, lowercase, ASCII, hyphenated. Keep it stable; if needed for uniqueness, add a short suffix like `-v2`.

### Logical constraints (enforced by validator)
- The event file must be an object with an `events` array (no nested `events` inside items).
- `id` must be unique within its file.
- `id` prefix (`category`) must match `event.category`.
- Year in `id` must match `event.year`.
- Arrays contain the right types (e.g., `countries: string[]`).

### JSON Schemas used
- `src/data/schema/event.schema.json` (draft-07)
- `src/data/schema/category.schema.json` (draft-07)

### Tooling and automation
- Normalize (optional, fixes minor issues, sorts): `npm run normalize:data:write`
- Validate (required): `npm run validate:data`
- A pre-commit hook automatically runs validation.

### Contribution tips
- Keep objects flat; do not embed lists inside events.
- Use concise titles and summaries; omit unknown dates instead of guessing.
- Prefer stable, readable slugs in `id`.

For examples, browse the existing category files in `src/data/`.
