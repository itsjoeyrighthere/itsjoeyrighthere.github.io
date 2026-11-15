import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const [name, kind = 'writing'] = process.argv.slice(2);
if (!name || !['writing', 'project', 'note'].includes(kind) || !/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(name)) {
  console.error('Usage: npm run new -- my-post [writing|project|note]\nUse a lowercase URL slug with letters, numbers, hyphens, or nested folders.');
  process.exit(1);
}
const project = fileURLToPath(new URL('../', import.meta.url));
const root = resolve(project, 'content/posts');
const target = resolve(root, `${name}.md`);
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
try {
  const template = await readFile(resolve(project, 'archetypes/post.md'), 'utf8');
  const values = { title: JSON.stringify(name.split('/').at(-1)), date: today, kind };
  const text = template.replace(/\{\{(title|date|kind)\}\}/g, (_, key) => values[key]);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, text, { flag: 'wx' });
  console.log(`Created ${relative(process.cwd(), target)} (draft). Set draft: false to publish.`);
} catch (error) {
  console.error(error.code === 'EEXIST' ? 'This record already exists; no file was changed.' : error.message);
  process.exit(1);
}
