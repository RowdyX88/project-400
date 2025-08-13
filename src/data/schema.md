
// This file is deprecated. Please use roadmap.md for all future data format and onboarding reference.
	"id": "nato-1949-04-04-washington-treaty",
	"category": "nato",
	"year": 1949,
	"title": "North Atlantic Treaty signed (Washington Treaty)",
	"summary": "12 founding members sign the North Atlantic Treaty in Washington, D.C.",
	"meta": {
		"month": 4,
		"day": 4,
		"members_added": ["BE","CA","DK","FR","IS","IT","LU","NL","NO","PT","UK","US"],
		"countries": ["US"],
		"sources": [
			"https://www.nato.int/cps/en/natohq/topics_49150.htm"
		],
		"tags": ["founding","treaty"]
	}
}

Field Rules (strict)
id: category-YYYY[-MM[-DD]]-slug
category = the same as event.category
YYYY required, MM and DD optional (1–12, 1–31)
slug = short, lowercase, hyphenated description
Must be globally unique (use a suffix like -v2 if needed)
category: must match an id in categories.json
year: integer (e.g., 1949)
title: short headline
summary: 1–2 lines, plain text
meta: optional object. Recommended keys:
month, day (integers; optional)
countries: array of ISO-like strings (e.g., ["US","DEU","UA"])
members_added: for NATO accessions (array of codes)
sources: array of URLs (can be empty)
tags: array of short keywords

Validation (what the AI must do automatically)
Ensure category exists in categories.json.
Year present and integer.
No duplicates: if another event has the same id, either update it (explicit “update”) or generate a new unique id (append -v2, -b, etc.).
Optional date: if month/day unknown, omit them—don’t guess.
Keep objects flat (no nested event lists inside events).

How to Add Events (Natural Language → JSON)
You (the human) can write quick instructions like:
“Add NATO event: 2004 enlargement — seven countries joined (BG, EE, LV, LT, RO, SK, SI).”
The AI must convert it to:
{
	"id": "nato-2004-03-29-enlargement-seven",
	"category": "nato",
	"year": 2004,
	"title": "Seven countries join NATO",
	"summary": "Bulgaria, Estonia, Latvia, Lithuania, Romania, Slovakia, Slovenia.",
	"meta": {
		"month": 3,
		"day": 29,
		"members_added": ["BG","EE","LV","LT","RO","SK","SI"],
		"tags": ["accession","enlargement"]
	}
}
If you only give minimal info, e.g.:
“NATO — 2016 — Warsaw Summit — EFP approved.”
The AI should still create:
{
	"id": "nato-2016-warsaw-summit-efp",
	"category": "nato",
	"year": 2016,
	"title": "Warsaw Summit",
	"summary": "Enhanced Forward Presence in Baltic States and Poland approved.",
	"meta": {
		"tags": ["summit","EFP"]
	}
}

JSON Schemas (drop these into /src/data/)
event.schema.json
{
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"$id": "event.schema.json",
	"type": "object",
	"required": ["id", "category", "year", "title", "summary"],
	"properties": {
		"id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
		"category": { "type": "string" },
		"year": { "type": "integer" },
		"title": { "type": "string", "minLength": 1, "maxLength": 200 },
		"summary": { "type": "string", "minLength": 1, "maxLength": 600 },
		"meta": {
			"type": "object",
			"additionalProperties": true,
			"properties": {
				"month": { "type": "integer", "minimum": 1, "maximum": 12 },
				"day": { "type": "integer", "minimum": 1, "maximum": 31 },
				"countries": { "type": "array", "items": { "type": "string" } },
				"members_added": { "type": "array", "items": { "type": "string" } },
				"sources": { "type": "array", "items": { "type": "string", "format": "uri" } },
				"tags": { "type": "array", "items": { "type": "string" } }
			}
		}
	},
	"additionalProperties": false
}
category.schema.json
{
	"$schema": "https://json-schema.org/draft/2020-12/schema",
	"$id": "category.schema.json",
	"type": "object",
	"required": ["id", "label"],
	"properties": {
		"id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
		"label": { "type": "string", "minLength": 1, "maxLength": 100 }
	},
	"additionalProperties": false
}

AI Workflow (what the AI should always do)
Read this file (AI_ONBOARDING.md) to learn the rules.
Load categories.json and events.json.
When the user says “add/update event…”
Parse the natural language.
Construct a valid event object (see templates).
Generate a compliant id (category-YYYY[-MM[-DD]]-slug).
Merge (update if same id exists) or append (new unique id).
Validate the changed object(s) against event.schema.json.
Resort events.json by year ASC, then by id ASC.
Save file with pretty formatting (2-space indent), UTF-8, LF line endings.
Re-run the app; ensure no console/Problems warnings.

Performance Notes
If events.json exceeds ~5–10k items, we’ll shard by decade:
/src/data/events/events_1940s.json, events_1950s.json, …
Build an index in memory: { [category]: { [year]: Event[] } }.
For very large files, the AI should stream/edit in chunks (don’t load entire file into memory if not needed).

Naming Conventions
Slugs: lowercase, hyphenated, short (e.g., washington-treaty, warsaw-summit-efp).
Tags: short, reusable keywords ("summit", "accession", "treaty", "arms-control").
Country codes: use common ISO (2–3 letters; be consistent).

Acceptance Criteria (quick)
Left panel lists all categories.json.
Timeline shows only events.json filtered by category + year.
No hardcoded events in JS/TS.
events.json validates against event.schema.json.
No console errors/warnings.

Quick Copilot/Agent Prompt (paste this to start new sessions)
Load /src/data/AI_ONBOARDING.md, categories.json, events.json, and the two schemas. From now on, when I say “add/update an event”, you must:
parse my text, 2) build a valid event object, 3) generate a compliant id (category-YYYY[-MM[-DD]]-slug), 4) validate against event.schema.json, 5) merge or append, 6) sort by year then id, 7) save with 2-space indentation.
Never hardcode data in TS. If info is missing (month/day/sources), omit gracefully. Report back with the exact JSON diff you wrote.
