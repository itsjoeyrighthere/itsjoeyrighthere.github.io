export const themes = [
  { id: 'paper', name: '纸白钴蓝', description: '暖白纸面，钴蓝标题', background: '#f5f4ed', ink: '#171a20', brand: '#214acb' },
  { id: 'sage', name: '雾绿', description: '灰绿纸面，深绿文字', background: '#edf0e7', ink: '#222d27', brand: '#315f4b' },
  { id: 'rose', name: '暖玫瑰', description: '浅玫瑰纸面，酒红标题', background: '#f4ece8', ink: '#30282d', brand: '#7d3d55' },
  { id: 'night', name: '夜墨', description: '炭灰底色，柔和浅绿', background: '#202629', ink: '#e0e4df', brand: '#b5ccb5' },
  { id: 'electric', name: '电蓝', description: '电蓝展示场，冷白阅读面，酸黄点色', background: '#003bff', ink: '#ffffff', brand: '#e4ff00' },
  { id: 'signal', name: '信号黄', description: '信号黄与纯黑，白色阅读面', background: '#e4ff00', ink: '#101010', brand: '#ffffff' },
  { id: 'raw', name: '冷白', description: '冷白与纯黑，信号橙硬边点色', background: '#ffffff', ink: '#101010', brand: '#ff5100' },
] as const;

export type Surface = 'display' | 'index' | 'reading';
type Palette = {
  background: string; ink: string; muted: string; line: string;
  material: string; materialInk: string; materialMuted: string;
  underlay: string; action: string; actionInk: string; link: string; mark: string;
};
const reading = (link: string): Palette => ({
  background: '#ffffff', ink: '#101010', muted: '#555555', line: '#767676',
  material: '#ffffff', materialInk: '#101010', materialMuted: '#555555',
  underlay: '#101010', action: link, actionInk: '#ffffff', link, mark: link,
});
const electricDisplay: Palette = {
  background: '#003bff', ink: '#ffffff', muted: '#e3eaff', line: '#b4c5ff',
  material: '#ffffff', materialInk: '#003bff', materialMuted: '#263f9f',
  underlay: '#0021aa', action: '#e4ff00', actionInk: '#101010', link: '#ffffff', mark: '#e4ff00',
};
const signalDisplay: Palette = {
  background: '#e4ff00', ink: '#101010', muted: '#343a00', line: '#657000',
  material: '#101010', materialInk: '#e4ff00', materialMuted: '#e4ff00',
  underlay: '#ffffff', action: '#101010', actionInk: '#e4ff00', link: '#101010', mark: '#101010',
};
const rawDisplay: Palette = {
  ...reading('#b63800'), underlay: '#ff5100', action: '#101010', mark: '#ff5100',
};
export const artPalettes: Record<string, Record<Surface, Palette>> = {
  electric: {
    display: electricDisplay,
    index: { ...reading('#003bff'), material: '#003bff', materialInk: '#ffffff', materialMuted: '#ffffff', underlay: '#e4ff00' },
    reading: reading('#003bff'),
  },
  signal: {
    display: signalDisplay,
    index: { ...reading('#101010'), material: '#e4ff00', materialInk: '#101010', materialMuted: '#343a00' },
    reading: reading('#101010'),
  },
  raw: {
    display: rawDisplay,
    index: { ...reading('#b63800'), material: '#101010', materialInk: '#ffffff', materialMuted: '#dddddd', underlay: '#ff5100' },
    reading: reading('#b63800'),
  },
};

export function surfaceForPath(path: string): Surface {
  if (path === '/') return 'display';
  return /^\/(posts|library|blog)(\/|$)/.test(path) ? 'reading' : 'index';
}

export const themeRegistry = themes.map(theme => ({
  ...theme,
  art: Object.hasOwn(artPalettes, theme.id),
  surfaces: Object.fromEntries((['display', 'index', 'reading'] as const).map(surface =>
    [surface, artPalettes[theme.id]?.[surface].background ?? theme.background])),
}));

// Keep first paint, page swaps and interactive selection on the same resolver.
// This self-contained function is also serialized into the document head.
export function applyThemeToDocument(doc: Document, id: string, registry: typeof themeRegistry): string {
  const theme = registry.find(theme => theme.id === id) ?? registry[0];
  const root = doc.documentElement;
  const surface = root.dataset.surface;
  const background = surface === 'display' || surface === 'reading' ? theme.surfaces[surface] : theme.surfaces.index;
  root.dataset.theme = theme.id;
  root.dataset.artTheme = String(theme.art);
  doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
  doc.querySelectorAll('[data-theme-option]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.getAttribute('data-theme-option') === theme.id));
  });
  doc.querySelectorAll('[data-theme-current]').forEach(label => { label.textContent = theme.name; });
  return theme.id;
}

export const themeBootstrap = `(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let id = root.dataset.theme;
  if (!id) { try { id = localStorage.getItem('joey-theme'); } catch {} }
  (${applyThemeToDocument.toString()})(document, id || 'paper', JSON.parse(root.dataset.themePalettes || '[]'));
})();`;

export const artThemeStyles = Object.entries(artPalettes).flatMap(([id, states]) =>
  Object.entries(states).map(([surface, p]) => `:root[data-theme="${id}"][data-surface="${surface}"] {
    color-scheme: light;
    --surface-bg:${p.background}; --surface-ink:${p.ink}; --surface-muted:${p.muted}; --surface-line:${p.line};
    --material-bg:${p.material}; --material-ink:${p.materialInk}; --material-muted:${p.materialMuted};
    --action-bg:${p.action}; --action-ink:${p.actionInk}; --link:${p.link}; --focus:${p.ink}; --underlay:${p.underlay};
    --reading-bg:#fff; --reading-ink:#101010; --reading-muted:#555;
    --paper:var(--surface-bg); --ink:var(--surface-ink); --muted:var(--surface-muted); --line:var(--surface-line);
    --brand:var(--link); --accent:var(--focus); --footer:var(--surface-bg); --note:var(--surface-bg); --dot:${p.mark};
    --sheet-line:var(--material-muted); --inline:#ededed; --code:#161616; --code-ink:#f8f8f1;
    --selection-bg:${surface === 'display' && id === 'electric' ? '#e4ff00' : '#101010'}; --selection-ink:${surface === 'display' && id === 'electric' ? '#101010' : '#ffffff'};
    --table-line:#767676;
  }`)).join('\n');
