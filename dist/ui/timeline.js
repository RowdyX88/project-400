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
        // load events
        const res = yield fetch("/src/data/events.json");
        const all = yield res.json();
        function paint() {
            const windowSize = 8; // years around current
            const from = Math.max(state.startYear, state.currentYear - windowSize);
            const to = Math.min(state.endYear, state.currentYear + windowSize);
            const items = all
                .filter((e) => e.category === state.currentCategory && e.year >= from && e.year <= to)
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
        }
        paint();
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
        document.addEventListener("category:changed", () => paint());
    });
}
