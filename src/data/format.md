# Data Format & Import Order Guide

This file describes the required format for all category/event data files in this project. Follow this style for every new category or event import.

## Categories
- File: `categories.json`
- Format: Array of objects
- Each object: `{ id: string, label: string }`
- Example:
  ```json
  [
    { "id": "nato", "label": "NATO" },
    { "id": "treaties", "label": "Treaties" },
    { "id": "conflicts", "label": "Conflicts" }
  ]
  ```

## Events
- File: `events.json`
- Format: Array of objects
- Each object: `{ id, category, year, title, summary, meta }`
- `category` must match a category id in `categories.json`
- Example:
  ```json
  [
    {
      "id": "nato-1949-04-04-treaty",
      "category": "nato",
      "year": 1949,
      "title": "North Atlantic Treaty signed (Washington Treaty)",
      "summary": "12 founding members sign the North Atlantic Treaty in Washington, D.C.",
      "meta": { "members": ["BE","CA","DK","FR","IS","IT","LU","NL","NO","PT","UK","US"] }
    }
  ]
  ```

## Import Practice
- When adding a new category, update `categories.json` and add only events for that category to `events.json`.
- Events for each category must follow the same format as above.
- No hardcoded data in JS; always load from JSON files.
- This format ensures all panels and code can reliably find and use category/event data.

---
**Always follow this format for every new category or event import.**
