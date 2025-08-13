# Project Roadmap & Data Contract

## 0) Categories Register

File: `src/data/categories.json`

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

## 1) Unified Event JSON Contract (v1.1)

All category event files use this shape:

```json
{
  "events": [
    {
      "id": "string-unique",
      "title": "short factual title",
      "summary": "1–2 line neutral summary (what/when/where).",
      "date": "YYYY-MM-DD",
      "year": 2023,
      "type": "accession|policy|weather|incident|report|conflict|economy|science|culture",
      "countries": ["Finland"],
      "geo": { "lat": 60.17, "lng": 24.94 },
      "tags": ["enlargement", "treaty"],
      "sources": ["https://..."],
      "severity": 0,
      "punchline": "optional spicy take.",
      "notes": "editor notes, not rendered"
    }
  ]
}
```

- Facts in title/summary; punchline for commentary.
- "Spice slider" in UI toggles punchline display.

## 2) Sample Data Files

### `src/data/politics.json`
```json
{
  "events": [
    {
      "id": "pol-1961-berlin-wall",
      "title": "Berlin Wall construction begins",
      "summary": "Barrier divides East and West Berlin.",
      "date": "1961-08-13",
      "type": "policy",
      "countries": ["Germany"],
      "tags": ["cold-war"],
      "sources": ["https://www.britannica.com/event/Berlin-Wall"],
      "severity": 4,
      "punchline": "Urban redesign, but make it geopolitical."
    },
    {
      "id": "pol-1992-maastricht",
      "title": "Maastricht Treaty signed",
      "summary": "Lays the foundation for the European Union.",
      "date": "1992-02-07",
      "type": "treaty",
      "countries": ["Netherlands","EU"],
      "tags": ["EU","integration"],
      "sources": ["https://eur-lex.europa.eu/EN/legal-content/summary/treaty-of-maastricht.html"],
      "severity": 2,
      "punchline": "EU achievement unlocked: bureaucracy speedrun percent."
    }
  ]
}
```

### `src/data/fafo.json`
```json
{
  "events": [
    {
      "id": "fafo-2008-russia-georgia",
      "title": "Russo–Georgian War",
      "summary": "Five-day conflict over South Ossetia and Abkhazia.",
      "date": "2008-08-08",
      "type": "conflict",
      "countries": ["Georgia","Russia"],
      "tags": ["war","territory"],
      "sources": ["https://www.osce.org/odihr/35578"],
      "severity": 5,
      "punchline": "Test the fence; get acquainted with the voltage."
    },
    {
      "id": "fafo-2022-full-invasion",
      "title": "Full-scale invasion of Ukraine",
      "summary": "Russia launches multi-front invasion; global response escalates.",
      "date": "2022-02-24",
      "type": "conflict",
      "countries": ["Ukraine","Russia"],
      "tags": ["war","sanctions","NATO"],
      "sources": ["https://www.un.org/en/fightforwhatmatters/ukraine"],
      "severity": 5,
      "punchline": "Speedrun to sanctions any%."
    }
  ]
}
```

## 3) UI/UX Guidelines
- Spice toggle in timeline header
- Category color themes event pills
- Color helper: `colorForCategory(catId)`
- Event pill: shows punchline if spice enabled, else summary

## 4) Performance & Indexing
- Index events by year per category
- Window filmstrip for performance
- Cap visible events per year, show '+N more' badge

## 5) Data Validation
- Use `checkEvent(ev)` to validate event shape

## 6) Editorial Guidelines
- Facts first, sources required
- Punchline optional, only shown if spice enabled
- Critique separated from claim

## 7) Future Map Panel
- Each event can have geo coordinates for future map integration
- Unified contract ensures easy mapping

---
This roadmap and contract should be referenced for all future feature/data additions, including the planned map panel.
