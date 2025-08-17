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
        // initial slider bounds
        sliderEl.min = String(state.startYear);
        sliderEl.max = String(state.endYear);
        sliderEl.value = String(state.currentYear);
        readoutEl.textContent = String(state.currentYear);
        // load correct events file for current category
        const catRes = yield fetch("/src/data/categories.json");
        const catData = yield catRes.json();
        let all = [];
        function loadEvents() {
            return __awaiter(this, void 0, void 0, function* () {
                let file = "nato.json";
                const catRes = yield fetch("/src/data/categories.json");
                const catData = yield catRes.json();
                if (catData && Array.isArray(catData.categories)) {
                    for (let i = 0; i < catData.categories.length; i++) {
                        if (catData.categories[i].id === state.currentCategory) {
                            file = catData.categories[i].file;
                            break;
                        }
                    }
                }
                try {
                    const res = yield fetch(`/src/data/${file}`);
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
                chip.title = e.summary || e.title;
                chip.textContent = `${e.year} — ${e.title}`;
                stripEl.appendChild(chip);
            });
            readoutEl.textContent = String(state.currentYear);
            // Notify map panel of visible events
            document.dispatchEvent(new CustomEvent("timeline:updated", { detail: { events: items } }));
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
