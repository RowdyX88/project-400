var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cache = new Map();
function fetchWikiSummary(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = query.toLowerCase();
        if (cache.has(key))
            return cache.get(key);
        const q = encodeURIComponent(query.replace(/\s+/g, " ").trim());
        // Use Wikipedia REST summary API; no API key needed
        const endpoints = [
            `https://en.wikipedia.org/api/rest_v1/page/summary/${q}`,
        ];
        for (const url of endpoints) {
            try {
                const res = yield fetch(url, { headers: { 'Accept': 'application/json' } });
                if (!res.ok)
                    continue;
                const data = yield res.json();
                // Prefer extract; fallback to description
                const text = data.extract || data.description;
                if (typeof text === 'string' && text.length > 0) {
                    cache.set(key, text);
                    return text;
                }
            }
            catch ( /* ignore and try next */_a) { /* ignore and try next */ }
        }
        return null;
    });
}
function normId(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 24) || 'sec';
}
function eventCard(ev, extra, sections = []) {
    const title = `${ev.year} — ${ev.title}`;
    const base = ev.summary || '';
    const tags = ev.tags && ev.tags.length ? `<div class="ins-tagline">Tags: ${ev.tags.join(', ')}</div>` : '';
    const countries = ev.countries && ev.countries.length ? `<div class="ins-tagline">Countries: ${ev.countries.join(', ')}</div>` : '';
    // Build tabs: Summary, Context, and any extra sections
    const tabs = [];
    if (base)
        tabs.push({ id: 'summary', label: 'Summary', content: `<div class="ins-summary">${base}</div>` });
    if (extra)
        tabs.push({ id: 'context', label: 'Context', content: `<div class="ins-extra">${extra}</div>` });
    sections.forEach(s => {
        const id = normId(s.label);
        tabs.push({ id, label: s.label, content: `<div class="ins-extra">${s.text}</div>` });
    });
    const active = tabs.length ? tabs[0].id : '';
    const tabsHtml = tabs.length ? `
    <div class="ins-tabs" role="tablist">
      ${tabs.map(t => `<button type="button" class="ins-tab${t.id === active ? ' active' : ''}" role="tab" data-tab="${t.id}">${t.label}</button>`).join('')}
    </div>
    <div class="ins-panels">
      ${tabs.map(t => `<div class="ins-panel${t.id === active ? ' active' : ''}" role="tabpanel" data-panel="${t.id}">${t.content}</div>`).join('')}
    </div>
  ` : `<div class="ins-empty">No details available.</div>`;
    const searchLink = `https://duckduckgo.com/?q=${encodeURIComponent(ev.title + ' ' + (ev.location || ''))}`;
    return `
    <article class="ins-card" data-id="${ev.id}">
      <div class="ins-title">${title}</div>
      ${countries}
      ${tags}
      ${tabsHtml}
      <a class="ins-link" href="${searchLink}" target="_blank" rel="noopener">Search</a>
    </article>
  `;
}
export function renderInsightsPanel(root) {
    root.innerHTML = `<div class="ins-list"></div>`;
    const list = root.querySelector('.ins-list');
    if (!list)
        return;
    function render(events) {
        return __awaiter(this, void 0, void 0, function* () {
            list.innerHTML = '';
            if (!events || events.length === 0) {
                list.innerHTML = `<div class="ins-empty">No events in view.</div>`;
                return;
            }
            // Render skeletons first for responsiveness
            list.innerHTML = events.map(ev => `
      <article class="ins-card loading" data-id="${ev.id}">
        <div class="ins-title">${ev.year} — ${ev.title}</div>
        <div class="ins-loading">Loading context…</div>
      </article>
    `).join('');
            // Fetch summaries sequentially to keep it light
            for (const ev of events) {
                const q = ev.title;
                let extra = null;
                if (q && q.length > 2) {
                    extra = yield fetchWikiSummary(q);
                }
                // Build up to two category-tailored queries
                const sections = [];
                const country = ev.countries && ev.countries.length ? ev.countries[0] : undefined;
                const norm = (s) => s.replace(/\s+/g, ' ').trim();
                const queries = [];
                if (ev.category === 'nato') {
                    if (country) {
                        queries.push({ label: `${country} NATO accession`, q: norm(`${country} NATO accession`) });
                        queries.push({ label: `${country} military`, q: norm(`Military of ${country}`) });
                    }
                    else if (ev.title) {
                        queries.push({ label: `NATO context`, q: norm(`${ev.title} NATO`) });
                    }
                }
                else if (ev.category === 'politics') {
                    queries.push({ label: 'Political context', q: norm(`${ev.title} politics`) });
                }
                else if (ev.category === 'weather') {
                    queries.push({ label: 'Climatology', q: norm(`${ev.title} climatology`) });
                }
                else if (ev.category === 'life') {
                    queries.push({ label: 'Social context', q: norm(`${ev.title} society`) });
                }
                else {
                    if (ev.title)
                        queries.push({ label: 'Background', q: norm(ev.title) });
                }
                // Limit to 2 extra fetches to avoid spamming
                for (let i = 0; i < Math.min(2, queries.length); i++) {
                    const item = queries[i];
                    const text = yield fetchWikiSummary(item.q);
                    if (text)
                        sections.push({ label: item.label, text });
                }
                const cardHtml = eventCard(ev, extra || undefined, sections);
                const el = list.querySelector(`article[data-id="${ev.id}"]`);
                if (el)
                    el.outerHTML = cardHtml;
            }
        });
    }
    // Listen for timeline updates
    document.addEventListener('timeline:updated', (e) => {
        const detail = e.detail;
        const events = (detail && Array.isArray(detail.events)) ? detail.events : [];
        render(events);
    });
    // Re-render on category change to clear content until timeline updates
    document.addEventListener('category:changed', () => {
        list.innerHTML = '';
    });
    // Tab click handling (event delegation)
    root.addEventListener('click', (e) => {
        const target = e.target;
        if (!target || !target.classList || !target.classList.contains('ins-tab'))
            return;
        const tabId = target.getAttribute('data-tab');
        const card = target.closest('.ins-card');
        if (!card || !tabId)
            return;
        // Update tab active state
        card.querySelectorAll('.ins-tab').forEach(el => el.classList.remove('active'));
        target.classList.add('active');
        // Update panels
        card.querySelectorAll('.ins-panel').forEach((panel) => {
            if (panel.getAttribute('data-panel') === tabId) {
                panel.classList.add('active');
            }
            else {
                panel.classList.remove('active');
            }
        });
    });
}
// Lightweight styles scoped via IDs/classes used here
// These will piggyback on existing global CSS without requiring a new file.
// The container (insights-content) already enforces max-height + overflow.
