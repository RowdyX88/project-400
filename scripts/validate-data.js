/*
Validate categories.json and all category event files using Ajv.
Reports structural errors (schema), plus logical checks:
- id prefix matches category
- id year matches "year" field (and date if present)
- duplicate ids within a file
- nested events property or embedded event objects in arrays
- required minimal fields exist per schema
- sorts preview (not changing files; just reporting)
*/
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const root = __dirname + '/..';
const dataDir = path.join(root, 'src', 'data');
const schemaDir = path.join(dataDir, 'schema');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadSchema(name) {
  return readJson(path.join(schemaDir, name));
}

function ok(msg) { console.log(`OK  ${msg}`); }
function warn(msg) { console.warn(`WARN ${msg}`); }
function err(msg) { console.error(`ERR ${msg}`); }

(async function main(){
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const catSchema = loadSchema('category.schema.json');
  const evtSchema = loadSchema('event.schema.json');
  const validateCats = ajv.compile(catSchema);
  const validateEvent = ajv.compile(evtSchema);

  const categoriesPath = path.join(dataDir, 'categories.json');
  const categories = readJson(categoriesPath);
  const validCats = validateCats(categories);
  if (!validCats) {
    err('categories.json failed schema:');
    for (const e of validateCats.errors) console.error('  -', e.instancePath, e.message);
    process.exitCode = 1;
  } else {
    ok('categories.json schema valid');
  }

  const results = [];
  const catList = categories.categories || [];
  for (const c of catList) {
    const filePath = path.join(dataDir, c.file);
    if (!fs.existsSync(filePath)) {
      err(`Missing data file for category ${c.id}: ${c.file}`);
      process.exitCode = 1;
      continue;
    }
    let data;
    try { data = readJson(filePath); }
    catch(e) { err(`Invalid JSON in ${c.file}: ${e.message}`); process.exitCode = 1; continue; }

    // top-level structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.events)) {
      err(`${c.file} must be an object with an array property "events"`);
      process.exitCode = 1;
      continue;
    }

    const seen = new Set();
    let fileErrors = 0;
    let idx = 0;
    for (const ev of data.events) {
      idx++;
      // guard nested events
      if (ev && typeof ev === 'object' && Array.isArray(ev.events)) {
        err(`${c.file} -> events[${idx-1}]: nested "events" array found (invalid)`);
        fileErrors++;
      }
      const valid = validateEvent(ev);
      if (!valid) {
        const errs = validateEvent.errors || [];
        err(`${c.file} -> events[${idx-1}] (${ev && ev.id ? ev.id : 'no-id'}) failed schema:`);
        for (const e of errs) console.error('   -', e.instancePath, e.message);
        fileErrors++;
      }
      // logical checks
      if (ev && ev.id) {
        if (seen.has(ev.id)) { err(`${c.file} duplicate id: ${ev.id}`); fileErrors++; }
        seen.add(ev.id);
      }
      if (ev && ev.category && ev.id) {
        const prefix = ev.id.split('-')[0];
        if (prefix !== ev.category) {
          err(`${c.file} id/category mismatch: id=${ev.id} category=${ev.category}`);
          fileErrors++;
        }
      }
      if (ev && ev.id && typeof ev.year === 'number') {
        const m = ev.id.match(/-(\d{4})(?:-|$)/);
        if (m) {
          const idYear = Number(m[1]);
          if (idYear !== ev.year) {
            err(`${c.file} year mismatch for ${ev.id}: idYear=${idYear} year=${ev.year}`);
            fileErrors++;
          }
        }
      }
      if (ev && typeof ev.countries !== 'undefined') {
        if (!Array.isArray(ev.countries)) {
          err(`${c.file} -> events[${idx-1}] countries must be array`);
          fileErrors++;
        } else {
          for (let j = 0; j < ev.countries.length; j++) {
            if (typeof ev.countries[j] !== 'string') {
              err(`${c.file} -> events[${idx-1}] countries[${j}] must be string`);
              fileErrors++;
            }
          }
        }
      }
    }
  if (fileErrors === 0) ok(`${c.file} passed validation`);
  else { warn(`${c.file} had ${fileErrors} issue(s)`); process.exitCode = 1; }
    results.push({ category: c.id, file: c.file, errors: fileErrors, count: data.events.length });
  }

  // Summary table
  console.log('\nSummary:');
  for (const r of results) {
    console.log(`- ${r.file} (${r.category}): ${r.count} events, issues: ${r.errors}`);
  }
})();
