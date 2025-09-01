

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
  const truncate = (s: string, n = 110) => (s && s.length > n ? s.slice(0, n - 1) + "…" : s);
  const hexToRgb = (hex: string) => {
    if (!hex) return { r: 96, g: 165, b: 250 };
    const h = hex.replace('#','');
    const v = h.length === 3
      ? h.split('').map(ch => ch + ch).join('')
      : h;
    const int = parseInt(v, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return { r, g, b };
  };
  // initial slider bounds
  sliderEl.min = String(state.startYear);
  sliderEl.max = String(state.endYear);
  sliderEl.value = String(state.currentYear);
  readoutEl.textContent = String(state.currentYear);

  // load correct events file for current category
  const catRes = await fetch("src/data/categories.json");
  const catData = await catRes.json();
  let all: Event[] = [];
  let accent = "#fbbf24"; // default accent

  async function loadEvents() {
    let file = "nato.json";
  const catRes = await fetch("src/data/categories.json");
    const catData = await catRes.json();
    if (catData && Array.isArray(catData.categories)) {
      for (let i = 0; i < catData.categories.length; i++) {
        if (catData.categories[i].id === state.currentCategory) {
          file = catData.categories[i].file;
          if (catData.categories[i].color) accent = catData.categories[i].color;
          break;
        }
      }
    }
    try {
  const res = await fetch(`src/data/${file}`);
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
      chip.style.setProperty('--chip-accent', accent);
      // derive softer tints from accent for bg/border/title
      try {
        const { r, g, b } = hexToRgb(accent);
        // Keep a light card bg for readability on dark panels
        chip.style.setProperty('--chip-bg', 'rgba(255,255,255,0.98)');
        chip.style.setProperty('--chip-border', `rgba(${r}, ${g}, ${b}, 0.35)`);
        chip.style.setProperty('--chip-title', accent);
      } catch {
        chip.style.setProperty('--chip-bg', 'rgba(255,255,255,0.98)');
      }
      chip.title = e.summary || e.title;
      const tagsHtml = (e as any).tags && Array.isArray((e as any).tags) && (e as any).tags.length
        ? `<div class="chip-tags">${(e as any).tags.slice(0,2).map((t: string)=>`<span class="chip-tag">${t}</span>`).join('')}</div>`
        : '';
      const summaryHtml = e.summary ? `<div class="chip-summary">${truncate(e.summary)}</div>` : '';
      chip.innerHTML = `
        <div class="chip-top"><span class="chip-year">${e.year}</span></div>
        <div class="chip-title">${e.title}</div>
        ${summaryHtml}
        ${tagsHtml}
      `;
      chip.dataset.eventId = e.id;
      chip.onmouseenter = () => {
        chip.classList.add("active");
        document.dispatchEvent(new CustomEvent("event:focus", { detail: { event: e } }));
      };
      chip.onmouseleave = () => {
        chip.classList.remove("active");
        document.dispatchEvent(new CustomEvent("event:blur", { detail: { event: e } }));
      };
      chip.onclick = () => {
        chip.classList.add("active");
        document.dispatchEvent(new CustomEvent("event:focus", { detail: { event: e, panTo: true } }));
      };
      stripEl.appendChild(chip);
    });
    readoutEl.textContent = String(state.currentYear);
    // Notify map panel of visible events
  document.dispatchEvent(new CustomEvent("timeline:updated", { detail: { events: items, accent } }));
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

