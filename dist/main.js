import { renderLeftPanel } from "./ui/panels.js";
import { renderTimeline } from "./ui/timeline.js";
import { renderMapPanel } from "./ui/map.js";
import { renderInsightsPanel } from "./ui/insights.js";
import { renderRealityFrames } from "./ui/frames.js";
import { state } from "./state.js";
const left = document.getElementById("left-panel");
const strip = document.getElementById("timeline-strip");
const slider = document.getElementById("year-slider");
const readout = document.getElementById("year-readout");
const mapPanel = document.getElementById("map-panel");
const mapContainer = document.getElementById("map-container");
renderLeftPanel(left);
renderTimeline(strip, slider, readout);
renderMapPanel(mapContainer);
const insightsRoot = document.getElementById("insights-content");
if (insightsRoot) {
    renderInsightsPanel(insightsRoot);
}
// Make renderRealityFrames available globally for overlay usage
window.renderRealityFrames = renderRealityFrames;
// Initialize Reality Frames when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const realityFramesContainer = document.getElementById("neon-frames-container");
    if (realityFramesContainer) {
        renderRealityFrames(realityFramesContainer, state.currentYear);
        // Update frames when year changes
        const yearSlider = document.getElementById("year-slider");
        if (yearSlider) {
            yearSlider.addEventListener('input', () => {
                const currentYear = parseInt(yearSlider.value);
                renderRealityFrames(realityFramesContainer, currentYear);
            });
        }
    }
});
