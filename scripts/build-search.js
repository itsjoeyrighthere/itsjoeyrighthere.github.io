import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

async function hasSearchablePage(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && await hasSearchablePage(path)) return true;
    if (entry.isFile() && entry.name.endsWith('.html') && (await readFile(path, 'utf8')).includes('data-pagefind-body')) return true;
  }
  return false;
}
if (await hasSearchablePage('dist')) {
  const result = spawnSync('pagefind', ['--site', 'dist', '--force-language', 'zh'], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) { console.error(result.error.message); process.exit(1); }
  process.exit(result.status ?? 1);
}
console.log('No published records; skipping the search index until the first record is published.');
