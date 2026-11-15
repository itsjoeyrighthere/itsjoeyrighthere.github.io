import { applyThemeToDocument, themeRegistry } from '../config/themes';
import { initArchive } from './archive';

let lifecycle: AbortController | undefined;
function applyTheme(id: string) {
  return applyThemeToDocument(document, id, themeRegistry);
}
function initialisePage() {
  lifecycle?.abort();
  lifecycle = new AbortController();
  const { signal } = lifecycle;
  applyTheme(document.documentElement.dataset.theme || 'paper');
  const picker = document.querySelector<HTMLElement>('[data-theme-picker]');
  picker?.querySelectorAll<HTMLButtonElement>('[data-theme-option]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.themeOption!;
      const selected = applyTheme(id);
      try { localStorage.setItem('joey-theme', selected); } catch { /* Themes still work when storage is unavailable. */ }
    }, { signal });
  });
  window.addEventListener('storage', event => {
    if (event.key === 'joey-theme' || event.key === null) applyTheme(event.newValue || 'paper');
  }, { signal });

  const sheet = document.querySelector<HTMLElement>('[data-moving-sheet]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (sheet && !motion.matches) {
    let frame = 0;
    const update = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      sheet.style.setProperty('--sheet-scroll', String(progress));
      frame = 0;
    };
    window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { signal, passive: true });
    signal.addEventListener('abort', () => cancelAnimationFrame(frame), { once: true });
    update();
  }
  initArchive(signal);

}

// Preserve the chosen palette before Astro swaps the document, preventing a light flash.
document.addEventListener('astro:before-swap', event => {
  lifecycle?.abort();
  const id = document.documentElement.dataset.theme || 'paper';
  event.newDocument.documentElement.classList.add('js');
  applyThemeToDocument(event.newDocument, id, themeRegistry);
});
document.addEventListener('astro:page-load', initialisePage);
