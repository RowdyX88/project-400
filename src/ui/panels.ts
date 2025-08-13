
import { state, setCategory } from "../state.js";

type Category = { id: string; label: string };
export async function renderLeftPanel(root: HTMLElement){
  const res = await fetch("/src/data/categories.json");
  const categories: Category[] = await res.json();
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
}
