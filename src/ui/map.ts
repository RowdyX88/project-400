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
    attribution: '&copy; OpenStreetMap contributors',
    lang: 'en' // Force English for attribution if supported
  }).addTo(map);

  // Helper to add markers for events with geo
  let markerGroup: any = null;
  let markerRefs: Record<string, any> = {};
  let activeMarker: any = null;
  let activePath: any = null;
  function addMarkers(events: any[]) {
    markerRefs = {};
    if (markerGroup) {
      markerGroup.clearLayers();
    } else {
      markerGroup = window.L.layerGroup().addTo(map);
    }
    events.forEach(ev => {
      let lat, lng, warning = "";
      if (ev.geo && typeof ev.geo.lat === "number" && typeof ev.geo.lng === "number") {
        lat = ev.geo.lat;
        lng = ev.geo.lng;
      } else {
        // Default to Brussels, Belgium for missing geo
        lat = 50.8503;
        lng = 4.3517;
        warning = "<span style='color:orange'>No geo data for this event.</span><br>";
      }
      const marker = window.L.marker([lat, lng], { riseOnHover: true }).addTo(markerGroup)
        .bindPopup(
          `${warning}<b>${ev.title}</b><br>${ev.year}<br>${ev.location ? ev.location : ''}<br>${ev.summary ? ev.summary : ''}`
        );
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
  function highlightMarker(event: any, panTo = false) {
    if (!event || !event.id) return;
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
      marker.openPopup();
      marker.setZIndexOffset(1000);
      activeMarker = marker;
      if (panTo) {
        map.setView(marker.getLatLng(), 6, { animate: true });
      }
    }
    // Draw path if event has multiple locations
    if (activePath) {
      map.removeLayer(activePath);
      activePath = null;
    }
    if (event.locations && Array.isArray(event.locations) && event.locations.length > 1) {
  const latlngs = event.locations.map((loc: any) => [loc.lat, loc.lng]);
      activePath = window.L.polyline(latlngs, { color: '#6366f1', weight: 4, opacity: 0.7 }).addTo(map);
    }
  }

  document.addEventListener("event:focus", (e: any) => {
    if (e.detail && e.detail.event) {
      highlightMarker(e.detail.event, !!e.detail.panTo);
    }
  });
  document.addEventListener("event:blur", (e: any) => {
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
  });

  // Listen for timeline updates
  document.addEventListener("timeline:updated", (e: any) => {
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
