// Turns the decoded Nuxt payload of ctrl.xyz into compact local content JSON
// (asset URLs rewritten to the namespaced public folder, Vimeo metadata trimmed).
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'ctrl-xyz-d5a73559';
const PAGE = 'root-8a5edab2';
const RESEARCH = path.join(ROOT, 'docs/research', SITE, PAGE);
const PUB = path.join(ROOT, 'public/sites', SITE, PAGE);
const OUT = path.join(ROOT, 'src/data/sites', SITE);
const base = `/sites/${SITE}/${PAGE}`;

const { data } = JSON.parse(readFileSync(path.join(RESEARCH, 'payload.decoded.json'), 'utf8'));
const settings = data[Object.keys(data).find((k) => k.startsWith('sanity-'))];
const home = data['get-home'];
delete settings.slugs;

const missing = new Set();
const fix = (o) => {
  if (typeof o === 'string') {
    if (o.startsWith('/cms/')) {
      const file = path.basename(o.split('?')[0]);
      if (!existsSync(path.join(PUB, 'cms', file))) missing.add(o);
      return `${base}/cms/${file}`;
    }
    return o;
  }
  if (Array.isArray(o)) return o.map(fix);
  if (o && typeof o === 'object') {
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === 'video' && v?.sources) continue; // Sanity-hosted fallbacks are never used when a Vimeo entry exists
      if (k === 'vimeo' && v?.files) {
        const local = existsSync(path.join(PUB, 'videos', `${v.id}.mp4`));
        if (!local) missing.add(`vimeo:${v.id}`);
        const files = v.files.filter((f) => f.width && f.height).map((f) => ({ rendition: f.rendition, width: f.width, height: f.height }));
        const best = files.find((f) => f.rendition === '1080p') || files[0];
        r.vimeo = { id: v.id, name: v.name, src: `${base}/videos/${v.id}.mp4`, width: best.width, height: best.height };
        continue;
      }
      r[k] = fix(v);
    }
    return r;
  }
  return o;
};

mkdirSync(OUT, { recursive: true });
writeFileSync(path.join(OUT, 'home.json'), JSON.stringify(fix(home), null, 2));
writeFileSync(path.join(OUT, 'settings.json'), JSON.stringify(fix(settings), null, 2));

for (const m of missing) {
  if (m.startsWith('vimeo:')) { console.log('MISSING', m); continue; }
  const file = path.basename(m.split('?')[0]);
  const cdn = `https://cdn.sanity.io/${m.replace(/^\/cms\//, '').split('?')[0]}`;
  const res = await fetch(`https://web.archive.org/web/2025id_/${cdn}`, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (res.ok) {
    mkdirSync(path.join(PUB, 'cms'), { recursive: true });
    writeFileSync(path.join(PUB, 'cms', file), Buffer.from(await res.arrayBuffer()));
  }
  console.log(res.ok ? 'recovered' : `MISSING ${res.status}`, m);
}
console.log('home.json', readFileSync(path.join(OUT, 'home.json')).length, 'settings.json', readFileSync(path.join(OUT, 'settings.json')).length);
