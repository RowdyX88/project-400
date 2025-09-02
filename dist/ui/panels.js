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
        const res = yield fetch("src/data/categories.json");
        const data = yield res.json();
        const categories = data.categories;
        root.innerHTML = "";
        // Brand header with logo
        const brand = document.createElement("div");
        brand.style.display = "flex";
        brand.style.alignItems = "center";
        brand.style.gap = "10px";
        brand.style.marginBottom = "12px";
        brand.innerHTML = `
    <img src="assets/icons/apple-touch-icon.png?v=${Date.now()}" alt="BuildByer logo" width="88" height="88"
         style="border-radius:14px; padding:2px; background:rgba(2,6,23,0.9); box-shadow: 0 4px 16px rgba(0,0,0,0.45); outline:1.5px solid rgba(255,255,255,0.18)" />
    <div style="display:flex; flex-direction:column">
      <span style="font-weight:800; color:#fbbf24; letter-spacing:.2px">BuildByer</span>
      <span style="font-size:11px; color:#94a3b8">Explore by category</span>
    </div>
  `;
        root.appendChild(brand);
        const divider = document.createElement("div");
        divider.style.height = "1px";
        divider.style.background = "rgba(255,255,255,0.08)";
        divider.style.margin = "8px 0 10px";
        root.appendChild(divider);
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
