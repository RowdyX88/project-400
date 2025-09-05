/*
Normalize event files to align with schema while preserving content:
- Remove unknown properties (keep: id, category, year, title, summary, date, location, countries[], tags[], meta, geo{lat,lng}, punchline)
- Ensure category equals file's category
- Ensure year from id if missing; else from date; else keep existing
- Coerce countries/tags to arrays of strings
- Remove nested "events" inside items
- Sort events by year ASC then id ASC
Dry-run by default; pass --write to overwrite files.
*/
const fs = require('fs');
const path = require('path');

const root = __dirname + '/..';
const dataDir = path.join(root, 'src', 'data');
const categoriesPath = path.join(dataDir, 'categories.json');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); }

const args = process.argv.slice(2);
const doWrite = args.includes('--write');

function toAsciiSlug(s) {
  if (!s) return '';
  return String(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72);
}

function fixId(currentId, category, year, title) {
  const cat = String(category || '').toLowerCase();
  const yr = (typeof year === 'number' && Number.isFinite(year)) ? String(year) : '';
  if (typeof currentId === 'string') {
    const id = currentId.toLowerCase();
    // If matches cat-YYYY-rest, rewrite cat+year parts; else fall through to generate
    const m = id.match(/^([a-z0-9-]+)-(\d{4})(.*)$/);
    if (m && yr) {
      let rest = m[3] || '';
      // If rest is empty or just hyphens, append a slug from title
      if (!rest.replace(/-/g, '').length) {
        const slug = toAsciiSlug(title || 'event');
        rest = slug ? `-${slug}` : '-event';
      }
      const fixed = `${cat}-${yr}${rest}`.replace(/--+/g, '-').replace(/(^-|-$)/g, '');
      return fixed;
    }
  }
  // Generate a clean ID from pieces
  const slug = toAsciiSlug(title || 'event');
  const core = yr ? `${cat}-${yr}-${slug}` : `${cat}-${slug}`;
  return core.replace(/--+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanEvent(ev, targetCategory, idSeen) {
  const out = {};
  const allow = new Set(['id','category','year','title','summary','date','location','countries','tags','meta','geo','punchline']);
  for (const k of Object.keys(ev || {})) {
    if (allow.has(k)) out[k] = ev[k];
  }
  // Remove nested events field if present
  if (out.events) delete out.events;
  // category
  out.category = targetCategory;
  // id/year alignment: prefer id's year if fits pattern
  if (typeof out.year !== 'number') {
    const m = typeof out.id === 'string' && out.id.match(/-(\d{4})(?:-|$)/);
    if (m) out.year = Number(m[1]);
  }
  // if still missing, try date
  if (typeof out.year !== 'number' && typeof out.date === 'string' && /^\d{4}/.test(out.date)) {
    out.year = Number(out.date.slice(0,4));
  }
  // coerce arrays
  if (typeof out.countries !== 'undefined') {
    if (!Array.isArray(out.countries)) out.countries = [String(out.countries)].filter(Boolean);
    out.countries = out.countries.map(String).filter(Boolean);
  }
  if (typeof out.tags !== 'undefined') {
    if (!Array.isArray(out.tags)) out.tags = [String(out.tags)].filter(Boolean);
    out.tags = out.tags.map(String).filter(Boolean);
  }
  // geo object shape
  if (out.geo && typeof out.geo === 'object') {
    const g = { lat: Number(out.geo.lat), lng: Number(out.geo.lng) };
    if (Number.isFinite(g.lat) && Number.isFinite(g.lng)) out.geo = g; else delete out.geo;
  }
  // Ensure title exists
  if (!out.title && ev && ev.title) out.title = String(ev.title);
  // Fix/Generate ID so prefix matches category and year matches event year
  out.id = fixId(out.id, out.category, out.year, out.title);
  // Uniqueness within file: add suffix if needed
  if (idSeen) {
    let base = out.id;
    let attempt = base;
    let n = 2;
    while (idSeen.has(attempt)) {
      attempt = `${base}-${n}`;
      n++;
    }
    out.id = attempt;
    idSeen.add(out.id);
  }
  return out;
}

function normFile(file, category) {
  const before = JSON.parse(JSON.stringify(file));
  // drop non-array events
  if (!file || typeof file !== 'object' || !Array.isArray(file.events)) {
    return { changed: false, file, changes: ['invalid structure: expected { events: [] }'] };
  }
  const idSeen = new Set();
  const cleaned = file.events.map(ev => cleanEvent(ev, category, idSeen));
  // sort
  cleaned.sort((a,b) => (a.year||0) - (b.year||0) || String(a.id).localeCompare(String(b.id)));
  // assemble
  const out = { events: cleaned };
  const changed = JSON.stringify(before) !== JSON.stringify(out);
  const changes = changed ? ['normalized fields', 'sorted events'] : [];
  return { changed, file: out, changes };
}

(function main(){
  const categories = readJson(categoriesPath);
  const report = [];
  for (const c of categories.categories) {
    const p = path.join(dataDir, c.file);
    if (!fs.existsSync(p)) { report.push({ file: c.file, missing: true }); continue; }
    let obj;
    try { obj = readJson(p); } catch(e) { report.push({ file: c.file, error: e.message }); continue; }
    const { changed, file, changes } = normFile(obj, c.id);
    report.push({ file: c.file, changed, changes });
    if (changed && doWrite) writeJson(p, file);
  }
  console.log('Normalize report:');
  for (const r of report) {
    if (r.missing) console.log(`- ${r.file}: missing`);
    else if (r.error) console.log(`- ${r.file}: ERROR ${r.error}`);
    else console.log(`- ${r.file}: ${r.changed ? 'changed' : 'ok'} ${r.changes && r.changes.length ? '('+r.changes.join(', ')+')' : ''}`);
  }
})();
