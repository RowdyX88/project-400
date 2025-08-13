

import { state, setYear } from "../state.js";

type Event = {
  id: string;
  category: string;
  year: number;
  title: string;
  summary: string;
  meta?: Record<string, unknown>;
};

let debounceHandle: number | undefined;

export async function renderTimeline(
  stripEl: HTMLElement,
  sliderEl: HTMLInputElement,
  readoutEl: HTMLElement
): Promise<void> {
  // initial slider bounds
  sliderEl.min = String(state.startYear);
  sliderEl.max = String(state.endYear);
  sliderEl.value = String(state.currentYear);
  readoutEl.textContent = String(state.currentYear);

  // load correct events file for current category
  const catRes = await fetch("/src/data/categories.json");
  const catData = await catRes.json();
  let all: Event[] = [];

  async function loadEvents() {
    let file = "nato.json";
    const catRes = await fetch("/src/data/categories.json");
    const catData = await catRes.json();
    if (catData && Array.isArray(catData.categories)) {
      for (let i = 0; i < catData.categories.length; i++) {
        if (catData.categories[i].id === state.currentCategory) {
          file = catData.categories[i].file;
          break;
        }
      }
    }
    try {
      const res = await fetch(`/src/data/${file}`);
      const data = await res.json();
      if (data && Array.isArray(data.events)) {
        all = data.events;
      } else {
        all = [];
      }
    } catch (err) {
      all = [];
    }
  }

  const paint = async () => {
    await loadEvents();
    const windowSize = 8; // years around current
    const from = Math.max(state.startYear, state.currentYear - windowSize);
    const to = Math.min(state.endYear, state.currentYear + windowSize);
    const items = all
      .filter((e: Event) => e.year >= from && e.year <= to)
      .sort((a: Event, b: Event) => a.year - b.year || a.id.localeCompare(b.id));

    stripEl.innerHTML = "";
    items.forEach((e: Event) => {
      const chip = document.createElement("div");
      chip.className = "event-chip";
      chip.title = e.summary || e.title;
      chip.textContent = `${e.year} — ${e.title}`;
      stripEl.appendChild(chip);
    });
    readoutEl.textContent = String(state.currentYear);
  };

  await paint();

  // slider interaction (debounced)
  sliderEl.oninput = () => {
    if (debounceHandle !== undefined) window.clearTimeout(debounceHandle);
    debounceHandle = window.setTimeout(() => {
      setYear(Number(sliderEl.value));
      paint();
    }, 32);
  };

  // react to category change
  document.addEventListener("category:changed", () => {
    paint();
  });
// ...existing code...
}

