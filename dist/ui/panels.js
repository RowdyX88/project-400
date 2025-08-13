var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { state, setCategory } from "../state.js";
export function renderLeftPanel(root) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/src/data/categories.json");
        const categories = yield res.json();
        root.innerHTML = "";
        categories.forEach(cat => {
            const div = document.createElement("div");
            div.className = "category" + (state.currentCategory === cat.id ? " active" : "");
            div.textContent = cat.label;
            div.dataset.id = cat.id;
            div.onclick = () => {
                setCategory(cat.id);
                renderLeftPanel(root); // refresh active state
                document.dispatchEvent(new CustomEvent("category:changed"));
            };
            root.appendChild(div);
        });
    });
}
