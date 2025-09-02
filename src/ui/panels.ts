
import { state, setCategory } from "../state.js";

type Category = { id: string; label: string };
export async function renderLeftPanel(root: HTMLElement){
  const res = await fetch("src/data/categories.json");
  const data = await res.json();
  const categories: Category[] = data.categories;
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

  // Also populate phone micro-dock if present
  const dock = document.getElementById('cat-dock');
  if (dock) {
    dock.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn' + (state.currentCategory === cat.id ? ' active' : '');
      // Option A: readable short labels
      btn.textContent = cat.label.length > 6 ? cat.label.slice(0,6) : cat.label;
      btn.title = cat.label;
      btn.dataset.id = cat.id;
      btn.onclick = () => {
        setCategory(cat.id);
        renderLeftPanel(root);
        document.dispatchEvent(new CustomEvent('category:changed'));
      };
      dock.appendChild(btn);
    });
  }
}
