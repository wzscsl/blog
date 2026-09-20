// Optional verification: node scripts/check-build.mjs [output-directory]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join, relative, dirname, sep } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(process.argv[2] || 'public');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
}
const htmlFiles = files(root).filter(file => file.endsWith('.html'));
let linkCount = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<html lang=["']?zh-CN/, `${file}: missing language`);
  for (const match of html.matchAll(/(?:href|src)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    const target = match[1] ?? match[2] ?? match[3];
    if (/^(?:https?:|data:|mailto:|#)/.test(target)) continue;
    const pathname = decodeURIComponent(target.split(/[?#]/)[0]);
    let local = pathname.startsWith('/') ? join(root, pathname) : resolve(dirname(file), pathname);
    assert.ok(!relative(root, local).startsWith(`..${sep}`), `${file}: path outside output`);
    if (existsSync(local) && statSync(local).isDirectory()) local = join(local, 'index.html');
    assert.ok(existsSync(local), `${relative(root, file)}: broken link ${target}`);
    linkCount++;
  }
}
const index = JSON.parse(readFileSync(join(root, 'index.json'), 'utf8'));
assert.ok(index.length >= 3, 'Search index must include initial notes');
for (const page of index) {
  assert.ok(page.content.length > 0 && page.title.length > 0);
  assert.match(page.url, /^\/posts\/(agent|engineering|backend)\//);
  assert.ok(existsSync(join(root, decodeURIComponent(page.url), 'index.html')));
  assert.ok(!page.url.includes('workflow-check'), 'Draft leaked into production search');
}
assert.ok(!existsSync(join(root, 'posts/agent/workflow-check/index.html')), 'Draft leaked into production pages');
const codePage = readFileSync(join(root, 'posts/agent/minimal-tool-loop/index.html'), 'utf8');
assert.match(codePage, /data-lang=["']?python/);
assert.match(codePage, /data-lang=["']?typescript/);
assert.match(codePage, /class=["']?k[\s"'>]/);
console.log(`PASS: ${htmlFiles.length} HTML pages, ${linkCount} internal links/assets, ${index.length} indexed notes, draft exclusion, Python/TypeScript highlighting.`);
