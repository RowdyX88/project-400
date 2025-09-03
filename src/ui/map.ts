import { state } from "../state.js";
// @ts-ignore
// leaflet.markercluster is loaded via CDN in index.html

declare global {
  interface Window {
    L: any;
    currentEvents?: any[];
  }
}

export async function renderMapPanel(mapEl: HTMLElement) {
  // Ensure Leaflet is loaded
  if (!window.L) {
    mapEl.innerHTML = "<div class='text-red-400 p-4'>Map library not loaded.</div>";
    return;
  }
  // Create or reuse a map node without removing other children (like the category dock)
  let mapNode = mapEl.querySelector('#leaflet-map') as HTMLElement | null;
  if (!mapNode) {
    mapNode = document.createElement('div');
    mapNode.id = 'leaflet-map';
    // Minimal inline sizing; layout is driven by CSS
    mapNode.style.width = '100%';
    mapNode.style.height = '100%';
    mapNode.style.borderRadius = '12px';
    mapEl.appendChild(mapNode);
  }
  const map = window.L.map(mapNode).setView([51.505, -0.09], 3);
  // Expose map instance on DOM node for resize/invalidation from layout scripts
  try {
    const node = window.L.DomUtil.get('leaflet-map');
    if (node) (node as any)._leaflet_map = map;
  } catch {}
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    lang: 'en' // Force English for attribution if supported
  }).addTo(map);

  // Helper to add markers for events with geo
  let markerGroup: any = null;
  let markerRefs: Record<string, any> = {};
  let activeMarker: any = null;
  let activePath: any = null;
  let relatedHighlightLayer: any = null;
  let accentColor: string = '#6366f1';
  // Active focus rings (we use pixel-based circleMarkers for consistent visibility)
  let activeRings: any[] = [];
  // Track whether we've auto-fitted the map to the initial set of markers
  let didAutoFit = false;

  // Build a stable, unique key for events to avoid ID collisions across categories/years/places
  function eventKey(ev: any): string {
    const cat = (ev && (ev.category || (state as any).currentCategory)) || 'unknown';
    const id = (ev && ev.id) || 'noid';
    const yr = (ev && typeof ev.year !== 'undefined') ? ev.year : 'na';
    const lat = ev && ev.geo && typeof ev.geo.lat === 'number' ? ev.geo.lat.toFixed(5) : 'na';
    const lng = ev && ev.geo && typeof ev.geo.lng === 'number' ? ev.geo.lng.toFixed(5) : 'na';
    return `${cat}::${id}::${yr}::${lat},${lng}`;
  }
  function addMarkers(events: any[]) {
    markerRefs = {};
    if (markerGroup) {
      markerGroup.clearLayers();
    } else {
      // Use marker cluster group for smooth clustering
      markerGroup = window.L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        // Prevent spiderfy on click to avoid perceived jump
        spiderfyOnClick: false,
        disableClusteringAtZoom: 8,
        animate: true
      }).addTo(map);
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
      const marker = window.L.marker([lat, lng], { riseOnHover: true })
        .bindPopup(
          `${warning}<b>${ev.title}</b><br>${ev.year}<br>${ev.location ? ev.location : ''}<br>${ev.summary ? ev.summary : ''}`,
          {
            className: 'bb-popup',
            maxWidth: 220,
            autoPan: true,
            autoPanPaddingTopLeft: [10, 10],
            autoPanPaddingBottomRight: [10, 10]
          }
        );
      markerGroup.addLayer(marker);
      markerRefs[eventKey(ev)] = marker;
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

    // On first load with markers, auto-fit to show all markers without over-zooming
    try {
      if (!didAutoFit && markerGroup && markerGroup.getLayers && markerGroup.getLayers().length > 0) {
        const b = markerGroup.getBounds();
        if (b && b.isValid && b.isValid()) {
          map.fitBounds(b, { padding: [40, 40], maxZoom: 5, animate: false });
          didAutoFit = true;
        }
      }
    } catch {}
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
    const marker = markerRefs[eventKey(event)];
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
        // Draw high-contrast selection rings that stay a constant size (pixel-based)
        try {
          const ll = marker.getLatLng();
          // Clear any existing rings first
          if (activeRings.length) {
            activeRings.forEach(r => { try { map.removeLayer(r); } catch {} });
            activeRings = [];
          }
          // Choose a very visible inner color (prefer accent, else cyan)
          const innerColor = (accentColor && typeof accentColor === 'string') ? accentColor : '#22d3ee';
          const radiusPx = 16; // slightly larger for visibility
          // Use overlayPane so rings never occlude the pin icon
          const outer = window.L.circleMarker(ll, {
            radius: radiusPx,
            color: '#ffffff',
            weight: 5,
            opacity: 0.95,
            fill: false,
            interactive: false,
            pane: 'overlayPane',
            className: 'active-ring-outer'
          });
          const inner = window.L.circleMarker(ll, {
            radius: radiusPx,
            color: innerColor,
            weight: 3,
            opacity: 1,
            dashArray: '6 4',
            fill: false,
            interactive: false,
            pane: 'overlayPane',
            className: 'active-ring-inner'
          });
          // Add a small center dot above the pin for clear focus
          const dot = window.L.circleMarker(ll, {
            radius: 4,
            color: '#0ea5e9',
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: '#ffffff',
            fillOpacity: 0.9,
            interactive: false,
            pane: 'markerPane',
            className: 'active-ring-dot'
          });
          outer.addTo(map);
          inner.addTo(map);
          dot.addTo(map);
          activeRings = [outer, inner, dot];
        } catch {}
      };
      if (panTo && (window as any).L && markerGroup && typeof markerGroup.zoomToShowLayer === 'function') {
        // Ensure the marker is visible (decluster if needed), then center it
        markerGroup.zoomToShowLayer(marker, () => {
          map.panTo(marker.getLatLng(), { animate: true });
          showMarker();
        });
      } else {
        showMarker();
      }
    }
    // Clear previous highlights
    if (activePath) { map.removeLayer(activePath); activePath = null; }
    if (relatedHighlightLayer) { map.removeLayer(relatedHighlightLayer); relatedHighlightLayer = null; }
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
    if (activePath) { map.removeLayer(activePath); activePath = null; }
    if (relatedHighlightLayer) { map.removeLayer(relatedHighlightLayer); relatedHighlightLayer = null; }
    if (activeRings && activeRings.length) {
      activeRings.forEach(r => { try { map.removeLayer(r); } catch {} });
      activeRings = [];
    }
  });

  // Listen for timeline updates
  document.addEventListener("timeline:updated", (e: any) => {
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

  // Add a scale control for context
  try { window.L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map); } catch {}

  // Add a simple Fit-to-Events control
  try {
    const FitControl = window.L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        const btn = window.L.DomUtil.create('button', 'fit-events-btn');
        btn.title = 'Fit map to visible events';
        btn.innerHTML = 'Fit';
        btn.style.cssText = 'background:#0ea5e9;color:#fff;border:none;border-radius:8px;padding:6px 10px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.25);font-weight:700;';
        window.L.DomEvent.disableClickPropagation(btn);
        window.L.DomEvent.on(btn, 'click', () => {
          try {
            if (markerGroup && markerGroup.getLayers && markerGroup.getLayers().length > 0) {
              const b = markerGroup.getBounds();
              if (b && b.isValid && b.isValid()) {
                map.fitBounds(b, { padding: [40, 40], maxZoom: 6 });
              }
            }
          } catch {}
        });
        return btn;
      }
    });
    map.addControl(new FitControl());
  } catch {}

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
