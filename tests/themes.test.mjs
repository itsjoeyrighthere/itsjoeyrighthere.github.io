import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { themeRegistry, themeBootstrap, applyThemeToDocument, surfaceForPath } from '../src/config/themes.ts';

function documentFor(path, theme) {
  const meta = { content: '', setAttribute(_, value) { this.content = value; } };
  return {
    documentElement: {
      dataset: { surface: surfaceForPath(path), themePalettes: JSON.stringify(themeRegistry), ...(theme ? { theme } : {}) },
      classList: { add() {} },
    },
    querySelector() { return meta; },
    querySelectorAll() { return []; },
    meta,
  };
}

test('reading routes and display routes use distinct surfaces', () => {
  assert.equal(surfaceForPath('/'), 'display');
  for (const path of ['/posts/example/', '/library/duan/3/', '/blog/example/']) assert.equal(surfaceForPath(path), 'reading');
  for (const path of ['/archive/', '/about/', '/404.html', '/library-other/']) assert.equal(surfaceForPath(path), 'index');
});

test('invalid preference resolves to the default without retaining an invalid ID', () => {
  const doc = documentFor('/');
  assert.equal(applyThemeToDocument(doc, 'unknown', themeRegistry), 'paper');
  assert.equal(doc.documentElement.dataset.artTheme, 'false');
});

test('the same saved art theme uses the destination reading background', () => {
  for (const id of ['electric', 'signal', 'raw']) {
    const home = documentFor('/');
    const article = documentFor('/library/duan/3/');
    applyThemeToDocument(home, id, themeRegistry);
    applyThemeToDocument(article, id, themeRegistry);
    assert.equal(article.documentElement.dataset.theme, id);
    assert.equal(article.meta.content, '#ffffff');
    assert.equal(home.meta.content, themeRegistry.find(theme => theme.id === id).surfaces.display);
  }
});

test('serialized first-paint script is self-contained and respects the target route', () => {
  const document = documentFor('/posts/example/');
  runInNewContext(themeBootstrap, { document, localStorage: { getItem: () => 'electric' } });
  assert.equal(document.documentElement.dataset.theme, 'electric');
  assert.equal(document.meta.content, '#ffffff');
});

test('page-swap preference wins over stale storage and blocked storage remains readable', () => {
  const swapped = documentFor('/archive/', 'signal');
  runInNewContext(themeBootstrap, { document: swapped, localStorage: { getItem: () => 'night' } });
  assert.equal(swapped.documentElement.dataset.theme, 'signal');
  const blocked = documentFor('/');
  runInNewContext(themeBootstrap, { document: blocked, localStorage: { getItem() { throw new Error('unavailable'); } } });
  assert.equal(blocked.documentElement.dataset.theme, 'paper');
});
