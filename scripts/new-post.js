import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';

const [name, kind = 'writing'] = process.argv.slice(2);
if (!name || !['writing', 'project', 'note'].includes(kind) || !/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(name)) {
  console.error('Usage: npm run new-post -- my-post [writing|project|note]\nUse a lowercase URL slug with letters, numbers, hyphens, or nested folders.');
  process.exit(1);
}
const root = resolve('src/content/posts');
const target = resolve(root, `${name}.md`);
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const text = `---\ntitle: ${JSON.stringify(name.split('/').at(-1))}\npublished: ${today}\nkind: ${kind}\ndescription: ""\ntags: []\nlang: zh-CN\ndraft: true\n---\n\n在这里开始记录。\n`;
try {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, text, { flag: 'wx' });
  console.log(`Created ${relative(process.cwd(), target)} (draft). Set draft: false to publish.`);
} catch (error) {
  console.error(error.code === 'EEXIST' ? 'This record already exists; no file was changed.' : error.message);
  process.exit(1);
}
