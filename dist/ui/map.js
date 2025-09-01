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
            attribution: '&copy; OpenStreetMap contributors',
            lang: 'en' // Force English for attribution if supported
        }).addTo(map);
        // Helper to add markers for events with geo
        let markerGroup = null;
        let markerRefs = {};
        let activeMarker = null;
        let activePath = null;
        let relatedHighlightLayer = null;
        let accentColor = '#6366f1';
        function addMarkers(events) {
            markerRefs = {};
            if (markerGroup) {
                markerGroup.clearLayers();
            }
            else {
                // Use marker cluster group for smooth clustering
                markerGroup = window.L.markerClusterGroup({
                    showCoverageOnHover: false,
                    maxClusterRadius: 40,
                    spiderfyOnMaxZoom: true,
                    disableClusteringAtZoom: 8,
                    animate: true
                }).addTo(map);
            }
            events.forEach(ev => {
                let lat, lng, warning = "";
                if (ev.geo && typeof ev.geo.lat === "number" && typeof ev.geo.lng === "number") {
                    lat = ev.geo.lat;
                    lng = ev.geo.lng;
                }
                else {
                    // Default to Brussels, Belgium for missing geo
                    lat = 50.8503;
                    lng = 4.3517;
                    warning = "<span style='color:orange'>No geo data for this event.</span><br>";
                }
                const marker = window.L.marker([lat, lng], { riseOnHover: true })
                    .bindPopup(`${warning}<b>${ev.title}</b><br>${ev.year}<br>${ev.location ? ev.location : ''}<br>${ev.summary ? ev.summary : ''}`);
                markerGroup.addLayer(marker);
                markerRefs[ev.id] = marker;
                marker.on('mouseover', () => {
                    marker.openPopup();
                    marker.setZIndexOffset(1000);
                });
                marker.on('mouseout', () => {
                    marker.setZIndexOffset(0);
                });
                marker.on('click', () => {
                    marker.openPopup();
                    document.dispatchEvent(new CustomEvent("event:focus", { detail: { event: ev, panTo: true } }));
                });
            });
        }
        // Animate marker and pan/zoom on event focus
        function highlightMarker(event, panTo = false) {
            if (!event || !event.id)
                return;
            if (activeMarker) {
                activeMarker.setIcon(window.L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    shadowSize: [41, 41],
                    className: ''
                }));
            }
            const marker = markerRefs[event.id];
            if (marker) {
                // Use a simple bounce/pulse animation
                marker.setIcon(window.L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    shadowSize: [41, 41],
                    className: 'marker-pulse'
                }));
                const showMarker = () => {
                    marker.openPopup();
                    marker.setZIndexOffset(1000);
                    activeMarker = marker;
                };
                if (panTo && window.L && markerGroup && typeof markerGroup.zoomToShowLayer === 'function') {
                    // Ensure the marker is visible (decluster if needed), then center it
                    markerGroup.zoomToShowLayer(marker, () => {
                        map.panTo(marker.getLatLng(), { animate: true });
                        showMarker();
                    });
                }
                else {
                    showMarker();
                }
            }
            // Clear previous highlights
            if (activePath) {
                map.removeLayer(activePath);
                activePath = null;
            }
            if (relatedHighlightLayer) {
                map.removeLayer(relatedHighlightLayer);
                relatedHighlightLayer = null;
            }
            // Draw path for multi-location events (category accent)
            if (event.locations && Array.isArray(event.locations) && event.locations.length > 1) {
                const latlngs = event.locations.map((loc) => [loc.lat, loc.lng]);
                activePath = window.L.polyline(latlngs, { color: accentColor, weight: 3, opacity: 0.8, dashArray: '8 6' }).addTo(map);
            }
            // Subtle related highlights: halos (no connecting lines)
            if (window.currentEvents && Array.isArray(window.currentEvents)) {
                const related = window.currentEvents.filter((ev) => {
                    if (ev.id === event.id)
                        return false;
                    // Related by tag, country, or year
                    const tagMatch = event.tags && ev.tags && event.tags.some((t) => ev.tags.includes(t));
                    const countryMatch = event.countries && ev.countries && event.countries.some((c) => ev.countries.includes(c));
                    const yearMatch = event.year === ev.year;
                    return tagMatch || countryMatch || yearMatch;
                });
                if (related.length) {
                    relatedHighlightLayer = window.L.layerGroup();
                    related.forEach((ev) => {
                        if (ev.geo && typeof ev.geo.lat === 'number' && typeof ev.geo.lng === 'number') {
                            const halo = window.L.circle([ev.geo.lat, ev.geo.lng], {
                                radius: 40000,
                                color: accentColor,
                                weight: 2,
                                opacity: 0.35,
                                fillColor: accentColor,
                                fillOpacity: 0.12,
                                className: 'related-halo'
                            });
                            relatedHighlightLayer.addLayer(halo);
                        }
                    });
                    relatedHighlightLayer.addTo(map);
                }
            }
        }
        document.addEventListener("event:focus", (e) => {
            if (e.detail && e.detail.event) {
                highlightMarker(e.detail.event, !!e.detail.panTo);
            }
        });
        document.addEventListener("event:blur", (e) => {
            if (activeMarker) {
                activeMarker.setIcon(window.L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    shadowSize: [41, 41],
                    className: ''
                }));
                activeMarker.setZIndexOffset(0);
                activeMarker = null;
            }
            if (activePath) {
                map.removeLayer(activePath);
                activePath = null;
            }
            if (relatedHighlightLayer) {
                map.removeLayer(relatedHighlightLayer);
                relatedHighlightLayer = null;
            }
        });
        // Listen for timeline updates
        document.addEventListener("timeline:updated", (e) => {
            if (e.detail && Array.isArray(e.detail.events)) {
                window.currentEvents = e.detail.events;
                addMarkers(e.detail.events);
            }
            if (e.detail && typeof e.detail.accent === 'string') {
                accentColor = e.detail.accent;
            }
        });
        // Dispatch map:changed event on pan/zoom
        function emitMapChanged() {
            const center = map.getCenter();
            const zoom = map.getZoom();
            const bounds = map.getBounds();
            // Find visible events (markers within bounds)
            let visibleEvents = [];
            if (window.currentEvents && Array.isArray(window.currentEvents)) {
                visibleEvents = window.currentEvents.filter(ev => {
                    if (ev.geo && typeof ev.geo.lat === "number" && typeof ev.geo.lng === "number") {
                        return bounds.contains([ev.geo.lat, ev.geo.lng]);
                    }
                    return false;
                });
            }
            document.dispatchEvent(new CustomEvent("map:changed", {
                detail: {
                    center,
                    zoom,
                    bounds,
                    visibleEvents
                }
            }));
        }
        map.on('moveend', emitMapChanged);
        map.on('zoomend', emitMapChanged);
        // Emit initial map state
        setTimeout(emitMapChanged, 500);
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
