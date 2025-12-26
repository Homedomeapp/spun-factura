#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function findFiles(dir, pattern) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const walk = (d) => {
    fs.readdirSync(d).forEach(item => {
      const full = path.join(d, item);
      if (fs.statSync(full).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(full);
      } else if (item.match(pattern)) {
        files.push(full);
      }
    });
  };
  walk(dir);
  return files;
}

function buildRoutes() {
  const routes = new Set();
  findFiles('src/pages', /\.(astro|md|mdx)$/).forEach(f => {
    routes.add(f.replace(/^src\/pages/, '').replace(/\.(astro|md|mdx)$/, '').replace(/\/index$/, '') || '/');
  });
  findFiles('src/content/blog', /\.(md|mdx)$/).forEach(f => {
    routes.add(`/blog/${path.basename(f).replace(/\.(md|mdx)$/, '')}`);
  });
  return routes;
}

function extractLinks(content) {
  const links = [];
  for (const m of content.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
    links.push({ text: m[1], url: m[2] });
  }
  return links;
}

function checkLink(url, routes) {
  if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('#')) return { valid: true };
  let normalized = url.split('#')[0].split('?')[0];
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  if (normalized.endsWith('/') && normalized !== '/') normalized = normalized.slice(0, -1);
  return { valid: routes.has(normalized), url: normalized };
}

const file = process.argv[2];
if (!file) { console.error('Usage: check-links.js <file>'); process.exit(1); }

const routes = buildRoutes();
const content = fs.readFileSync(file, 'utf8');
const links = extractLinks(content);
const broken = links.map(l => ({ ...l, ...checkLink(l.url, routes) })).filter(l => !l.valid);

console.log(`🔗 Checking ${links.length} links in ${file}`);
if (broken.length > 0) {
  console.log('❌ Broken links:');
  broken.forEach(l => console.log(`  - ${l.url}`));
  process.exit(1);
}
console.log('✅ All links valid');
