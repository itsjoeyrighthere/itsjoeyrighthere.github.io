import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = fileURLToPath(new URL('../', import.meta.url));

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'joey-authoring-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const folder of ['scripts', 'archetypes', 'content/posts']) {
    await mkdir(join(root, folder), { recursive: true });
  }
  await writeFile(join(root, 'package.json'), '{"type":"module"}');
  await copyFile(join(repo, 'scripts/new-post.js'), join(root, 'scripts/new-post.js'));
  await copyFile(join(repo, 'archetypes/post.md'), join(root, 'archetypes/post.md'));
  return {
    root,
    run: (...args) => spawnSync(process.execPath, [join(root, 'scripts/new-post.js'), ...args], {
      cwd: tmpdir(), encoding: 'utf8',
    }),
  };
}

test('new posts use the content directory and have real Markdown frontmatter', async t => {
  const { root, run } = await fixture(t);
  const result = run('my-first-post');
  assert.equal(result.status, 0, result.stderr);
  const post = await readFile(join(root, 'content/posts/my-first-post.md'), 'utf8');
  assert.match(post, /^---\ntitle: "my-first-post"\npublished: \d{4}-\d{2}-\d{2}\n/);
  assert.match(post, /\nkind: writing\n/);
  assert.match(post, /\ndraft: true\n---\n\n在这里开始记录。\n$/);
  assert.ok(!post.includes('\\n'), 'frontmatter must contain actual newlines');
});

test('nested names and all record kinds use the editable article template', async t => {
  const { root, run } = await fixture(t);
  const template = join(root, 'archetypes/post.md');
  await writeFile(template, `${await readFile(template, 'utf8')}\n## 自定义模板\n`);
  for (const kind of ['writing', 'project', 'note']) {
    const result = run(`2026/${kind}`, kind);
    assert.equal(result.status, 0, result.stderr);
    const post = await readFile(join(root, `content/posts/2026/${kind}.md`), 'utf8');
    assert.match(post, new RegExp(`\nkind: ${kind}\n`));
    assert.ok(post.includes('## 自定义模板'));
    assert.ok(!post.includes('{{'), 'template values must be filled');
  }
});

test('creating an existing article preserves the original content', async t => {
  const { root, run } = await fixture(t);
  const target = join(root, 'content/posts/existing.md');
  await writeFile(target, '已有的正文，不要覆盖。\n');
  const result = run('existing');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /already exists/);
  assert.equal(await readFile(target, 'utf8'), '已有的正文，不要覆盖。\n');
});

test('invalid names and kinds create no content', async t => {
  const { root, run } = await fixture(t);
  for (const args of [[], ['../outside'], ['/absolute'], ['a//b'], ['post.md'], ['post', 'unknown']]) {
    const result = run(...args);
    assert.notEqual(result.status, 0, JSON.stringify(args));
    assert.match(result.stderr, /Usage:/);
  }
  assert.deepEqual(await readdir(join(root, 'content/posts')), []);
});
