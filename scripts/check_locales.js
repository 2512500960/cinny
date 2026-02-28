import { readdir, readFile } from 'fs/promises';
import path from 'path';

async function findLocaleDirs(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((d) => d.name);
}

function flatten(obj, prefix = '') {
  const res = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(res, flatten(v, key));
    } else {
      res[key] = v;
    }
  }
  return res;
}

async function checkLocales() {
  const root = path.join(process.cwd(), 'public', 'locales');
  let locales;
  try {
    locales = await findLocaleDirs(root);
  } catch (err) {
    console.error('Could not read locales directory:', err.message);
    process.exit(2);
  }

  const problems = {};

  for (const loc of locales) {
    const file = path.join(root, loc, 'translation.json');
    try {
      const content = await readFile(file, 'utf8');
      const parsed = JSON.parse(content);
      const flat = flatten(parsed);
      const empties = Object.entries(flat)
        .filter(([, v]) => v === '' || v === null || (typeof v === 'string' && v.trim() === ''))
        .map(([k]) => k);
      if (empties.length) problems[loc] = empties;
    } catch (err) {
      console.error(`Failed to read/parse ${file}:`, err.message);
      process.exitCode = 3;
    }
  }

  if (Object.keys(problems).length === 0) {
    console.log('Locale check passed — no empty translation keys found.');
    process.exit(0);
  }

  console.error('Locale check failed — empty translation keys found:');
  for (const [loc, keys] of Object.entries(problems)) {
    console.error(`\nLocale: ${loc} — ${keys.length} empty key(s)`);
    for (const k of keys) console.error(`  - ${k}`);
  }

  process.exit(4);
}

checkLocales();
