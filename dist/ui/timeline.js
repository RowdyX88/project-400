var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { state, setYear } from "../state.js";
let debounceHandle;
export function renderTimeline(stripEl, sliderEl, readoutEl) {
    return __awaiter(this, void 0, void 0, function* () {
        const truncate = (s, n = 110) => (s && s.length > n ? s.slice(0, n - 1) + "…" : s);
        const hexToRgb = (hex) => {
            if (!hex)
                return { r: 96, g: 165, b: 250 };
            const h = hex.replace('#', '');
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
        const catRes = yield fetch("src/data/categories.json");
        const catData = yield catRes.json();
        let all = [];
        let accent = "#fbbf24"; // default accent
        function loadEvents() {
            return __awaiter(this, void 0, void 0, function* () {
                let file = "nato.json";
                const catRes = yield fetch("src/data/categories.json");
                const catData = yield catRes.json();
                if (catData && Array.isArray(catData.categories)) {
                    for (let i = 0; i < catData.categories.length; i++) {
                        if (catData.categories[i].id === state.currentCategory) {
                            file = catData.categories[i].file;
                            if (catData.categories[i].color)
                                accent = catData.categories[i].color;
                            break;
                        }
                    }
                }
                try {
                    const res = yield fetch(`src/data/${file}`);
                    const data = yield res.json();
                    if (data && Array.isArray(data.events)) {
                        all = data.events;
                    }
                    else {
                        all = [];
                    }
                }
                catch (err) {
                    all = [];
                }
            });
        }
        const paint = () => __awaiter(this, void 0, void 0, function* () {
            yield loadEvents();
            const windowSize = 8; // years around current
            const from = Math.max(state.startYear, state.currentYear - windowSize);
            const to = Math.min(state.endYear, state.currentYear + windowSize);
            const items = all
                .filter((e) => e.year >= from && e.year <= to)
                .sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
            stripEl.innerHTML = "";
            items.forEach((e) => {
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
                }
                catch (_a) {
                    chip.style.setProperty('--chip-bg', 'rgba(255,255,255,0.98)');
                }
                chip.title = e.summary || e.title;
                const tagsHtml = e.tags && Array.isArray(e.tags) && e.tags.length
                    ? `<div class="chip-tags">${e.tags.slice(0, 2).map((t) => `<span class="chip-tag">${t}</span>`).join('')}</div>`
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
        });
        yield paint();
        // slider interaction (debounced)
        sliderEl.oninput = () => {
            if (debounceHandle !== undefined)
                window.clearTimeout(debounceHandle);
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
    });
}
