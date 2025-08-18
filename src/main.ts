
import { renderLeftPanel } from "./ui/panels.js";
import { renderTimeline } from "./ui/timeline.js";
import { renderMapPanel } from "./ui/map.js";

const left = document.getElementById("left-panel")!;
const strip = document.getElementById("timeline-strip")!;
const slider = document.getElementById("year-slider") as HTMLInputElement;
const readout = document.getElementById("year-readout")!;
const mapPanel = document.getElementById("map-panel")!;
const mapContainer = document.getElementById("map-container")!;

renderLeftPanel(left);
renderTimeline(strip, slider, readout);
renderMapPanel(mapContainer);

