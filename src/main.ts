
import { renderLeftPanel } from "./ui/panels.js";
import { renderTimeline } from "./ui/timeline.js";

const left = document.getElementById("left-panel")!;
const strip = document.getElementById("timeline-strip")!;
const slider = document.getElementById("year-slider") as HTMLInputElement;
const readout = document.getElementById("year-readout")!;

renderLeftPanel(left);
renderTimeline(strip, slider, readout);
