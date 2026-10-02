// Downloads ctrl.xyz home page assets + raw source (css/js/payload) for research.
// Usage: node scripts/download-assets-ctrl-xyz-d5a73559-root-8a5edab2.mjs
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'ctrl-xyz-d5a73559';
const PAGE = 'root-8a5edab2';
const ORIGIN = 'https://ctrl.xyz';
const PUB = path.join(ROOT, 'public/sites', SITE, PAGE);
const SHARED = path.join(ROOT, 'public/sites', SITE, 'shared');
const RESEARCH = path.join(ROOT, 'docs/research', SITE, PAGE);
const SRC = path.join(RESEARCH, 'source');

const recon = JSON.parse(readFileSync(path.join(RESEARCH, 'recon.json'), 'utf8'));
const urls = [...new Set(recon.requests.map((r) => r.url))];

const jobs = [];
const add = (url, dest) => jobs.push({ url, dest });

for (const u of urls) {
  const { pathname, hostname } = new URL(u);
  if (hostname !== 'ctrl.xyz') continue;
  const base = path.basename(pathname);
  if (/\.(css|js)$/.test(base)) add(u, path.join(SRC, base));
  else if (pathname === '/_payload.json') add(u, path.join(SRC, 'payload.json'));
  else if (/\.woff2?$/.test(base)) add(u, path.join(SHARED, 'fonts', base.replace(/\.[A-Za-z0-9_-]+\.woff2$/, '.woff2')));
  else if (pathname.startsWith('/images/stickers/')) add(u, path.join(PUB, 'images/stickers', base));
  else if (/^\/popup-.*\.png$/.test(pathname)) add(u, path.join(PUB, 'images', base));
  else if (pathname.startsWith('/cms/')) add(u.split('?')[0], path.join(PUB, 'cms', base));
}
for (const l of recon.global.links) {
  if (/icon/.test(l.rel) || l.href.includes('/icons/')) add(l.href, path.join(SHARED, 'seo', path.basename(new URL(l.href).pathname)));
}
add(`${ORIGIN}/cms/images/rrhq1nuo/production/87c787c2aac94e1908d4f9b3ac847f75f7d3d6ad-1200x630.png`, path.join(SHARED, 'seo', 'og-image.png'));
recon.global.videos.forEach((v) => {
  const id = v.src.match(/playback\/(\d+)\//)?.[1];
  if (id) add(v.src, path.join(PUB, 'videos', `${id}.mp4`));
});

async function fetchOne({ url, dest }) {
  if (existsSync(dest)) return `skip ${path.relative(ROOT, dest)}`;
  try {
    let res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0', referer: ORIGIN + '/' } });
    if (!res.ok && url.includes('/cms/')) {
      // The site's /cms proxy to Sanity is dead since the shutdown; the Wayback Machine holds raw copies of the CDN originals.
      const cdn = url.replace(`${ORIGIN}/cms/`, 'https://cdn.sanity.io/');
      res = await fetch(`https://web.archive.org/web/2025id_/${cdn}`, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } });
      if (res.ok) url = `wayback:${cdn}`;
    }
    if (!res.ok) return `FAIL ${res.status} ${url}`;
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    return `ok ${buf.length} ${path.relative(ROOT, dest)}`;
  } catch (e) {
    return `ERR ${url} ${e.message}`;
  }
}

for (let i = 0; i < jobs.length; i += 4) {
  const res = await Promise.all(jobs.slice(i, i + 4).map(fetchOne));
  res.forEach((r) => console.log(r));
}
