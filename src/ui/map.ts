import { state } from "../state.js";

declare global {
  interface Window { L: any; }
}

export async function renderMapPanel(mapEl: HTMLElement) {
  // Ensure Leaflet is loaded
  if (!window.L) {
    mapEl.innerHTML = "<div class='text-red-400 p-4'>Map library not loaded.</div>";
    return;
  }
  // Create map container
    mapEl.innerHTML = `<div id=\"leaflet-map\" style=\"width:100%;height:100%;border-radius:12px;position:absolute;top:0;left:0;\"></div>`;
  const map = window.L.map("leaflet-map").setView([51.505, -0.09], 3);
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Helper to add markers for events with geo
  function addMarkers(events: any[]) {
    events.forEach(ev => {
      if (ev.geo && typeof ev.geo.lat === "number" && typeof ev.geo.lng === "number") {
        window.L.marker([ev.geo.lat, ev.geo.lng])
          .addTo(map)
          .bindPopup(`<b>${ev.title}</b><br>${ev.year}`);
      }
    });
  }

  // Listen for timeline updates
  document.addEventListener("timeline:updated", (e: any) => {
    map.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) map.removeLayer(layer);
    });
    if (e.detail && Array.isArray(e.detail.events)) {
      addMarkers(e.detail.events);
    }
  });

  // Resize map when panel resizes
  const panel = mapEl.closest('.panel');
  if (panel) {
    const resizeObserver = new window.ResizeObserver(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 50);
    });
    resizeObserver.observe(panel);
  }
}
