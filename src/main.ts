// Listen for map changes (visible region/events)
window.addEventListener('map:changed', (e: Event) => {
	const detail = (e as CustomEvent).detail;
	if (detail && detail.visibleEvents && detail.visibleEvents.length > 0) {
		// Use the first visible event for context, or summarize
		const ev = detail.visibleEvents[0];
		currentContext = {
			title: ev.title,
			summary: ev.summary,
			year: ev.year,
			location: ev.location,
			tags: ev.tags
		};
		updateAgentComments(currentContext);
	} else {
		currentContext = { title: 'No visible events on map' };
		updateAgentComments(currentContext);
	}
});
// Multi-agent panel logic: always visible, dynamic commentary
const agentPanelRoot = document.getElementById('agent-panels-root');
type AgentType = 'wonderer' | 'detective' | 'storyteller';

const agentCommentIds: Record<AgentType, string> = {
	wonderer: 'comment-wonderer',
	detective: 'comment-detective',
	storyteller: 'comment-storyteller',
};

type AgentContext = {
	title?: string;
	summary?: string;
	year?: number;
	location?: string;
	tags?: string[];
};

function agentComment(agent: AgentType, context: AgentContext): string {
	switch (agent) {
		case 'wonderer':
			return context.summary
				? `I wonder what secrets lie within "${context.title}" (${context.year})... ${context.summary}`
				: `I wonder what secrets lie within ${context.title || 'this event'}...`;
		case 'detective':
			return context.tags && context.tags.length
				? `Detective's note: Looking for clues in "${context.title}" (${context.year}). Tags: ${context.tags.join(', ')}.`
				: `Detective's note: Something seems off about ${context.title || 'this event'}.`;
		case 'storyteller':
			return context.summary
				? `Once upon a time in ${context.year}, "${context.title}" happened. ${context.summary}`
				: `Once upon a time in ${context.title || 'the current map view'}, a story unfolded.`;
		default:
			return `Agent ${agent} is pondering ${context.title || 'the current map view'}.`;
	}
}

function updateAgentComments(context: AgentContext) {
	// Debug log
	const debugEl = document.getElementById('agent-debug');
	if (debugEl) {
		debugEl.textContent = 'Last context: ' + JSON.stringify(context);
	}
	(['wonderer', 'detective', 'storyteller'] as AgentType[]).forEach(agent => {
		const el = document.getElementById(agentCommentIds[agent]);
		if (el) el.textContent = agentComment(agent, context);
	});
}

// Initial context
let currentContext: AgentContext = { title: 'the current map view' };
updateAgentComments(currentContext);

// Listen for timeline updates (visible events)
window.addEventListener('timeline:updated', (e: Event) => {
	const detail = (e as CustomEvent).detail;
	if (detail && detail.events && detail.events.length > 0) {
		// Use the first event as context, or summarize
		const ev = detail.events[0];
		currentContext = {
			title: ev.title,
			summary: ev.summary,
			year: ev.year,
			location: ev.location,
			tags: ev.tags
		};
		updateAgentComments(currentContext);
	} else {
		currentContext = { title: 'No events' };
		updateAgentComments(currentContext);
	}
});

// Listen for event focus (user clicks/taps event)
window.addEventListener('event:focus', (e: Event) => {
	const detail = (e as CustomEvent).detail;
	if (detail && detail.event) {
		const ev = detail.event;
		currentContext = {
			title: ev.title,
			summary: ev.summary,
			year: ev.year,
			location: ev.location,
			tags: ev.tags
		};
		updateAgentComments(currentContext);
	}
});

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

