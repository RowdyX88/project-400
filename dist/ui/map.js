var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function renderMapPanel(mapEl) {
    return __awaiter(this, void 0, void 0, function* () {
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
        function addMarkers(events) {
            events.forEach(ev => {
                if (ev.geo && typeof ev.geo.lat === "number" && typeof ev.geo.lng === "number") {
                    window.L.marker([ev.geo.lat, ev.geo.lng])
                        .addTo(map)
                        .bindPopup(`<b>${ev.title}</b><br>${ev.year}`);
                }
            });
        }
        // Listen for timeline updates
        document.addEventListener("timeline:updated", (e) => {
            map.eachLayer((layer) => {
                if (layer instanceof window.L.Marker)
                    map.removeLayer(layer);
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
    });
}
