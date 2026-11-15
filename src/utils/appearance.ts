import { applyThemeToDocument, themeRegistry } from '../config/themes';

export function initAppearance(signal: AbortSignal) {
  const panel = document.querySelector<HTMLElement>('#theme-panel');
  if (!panel) return;
  const openers = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-open]')];
  const options = [...panel.querySelectorAll<HTMLButtonElement>('[data-theme-option]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener: HTMLButtonElement | undefined;
  let version = 0;
  let pendingTheme: string | undefined;
  let transition: ViewTransition | undefined;
  let animation: Animation | undefined;
  const close = (restoreFocus = false) => {
    panel.hidden = true;
    openers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (restoreFocus) opener?.focus({ preventScroll: true });
  };
  const position = () => {
    if (!opener) return;
    const box = opener.getBoundingClientRect();
    const width = Math.min(330, innerWidth - 24);
    panel.style.width = `${width}px`;
    const height = panel.getBoundingClientRect().height;
    const top = box.bottom + 10 + height <= innerHeight - 12 ? box.bottom + 10 : Math.max(12, box.top - height - 10);
    panel.style.top = `${Math.max(12, Math.min(top, innerHeight - height - 12))}px`;
    panel.style.left = `${Math.max(12, Math.min(box.right - width, innerWidth - width - 12))}px`;
  };
  openers.forEach(button => button.addEventListener('click', () => {
    if (!panel.hidden && opener === button) { close(true); return; }
    opener = button;
    panel.hidden = false;
    openers.forEach(item => item.setAttribute('aria-expanded', String(item === button)));
    position();
    panel.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus({ preventScroll: true });
  }, { signal }));
  panel.querySelector('[data-theme-close]')?.addEventListener('click', () => close(true), { signal });
  document.addEventListener('pointerdown', event => {
    const target = event.target as Node;
    if (!panel.hidden && !panel.contains(target) && !openers.some(button => button.contains(target))) close();
  }, { signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); close(true); }
  }, { signal });
  document.addEventListener('focusin', event => {
    const target = event.target as Node;
    if (!panel.hidden && !panel.contains(target) && !openers.some(button => button.contains(target))) close();
  }, { signal });
  window.addEventListener('resize', position, { signal });
  window.addEventListener('scroll', () => { if (!panel.hidden) position(); }, { signal, passive: true });

  const commit = (id: string) => {
    const selected = applyThemeToDocument(document, id, themeRegistry);
    if (pendingTheme === id) pendingTheme = undefined;
    try { localStorage.setItem('joey-theme', selected); } catch { /* The in-page selection remains usable. */ }
  };
  const stop = () => {
    version++;
    animation?.cancel();
    transition?.skipTransition();
    delete document.documentElement.dataset.themeTransition;
  };
  const changeTheme = async (id: string, event: MouseEvent, button: HTMLButtonElement) => {
    stop();
    const current = version;
    pendingTheme = id;
    if (id === document.documentElement.dataset.theme || reduced.matches || !document.startViewTransition) {
      commit(id);
      return;
    }
    const bounds = button.getBoundingClientRect();
    const x = Math.max(0, Math.min(innerWidth, event.detail ? event.clientX : bounds.left + bounds.width / 2));
    const y = Math.max(0, Math.min(innerHeight, event.detail ? event.clientY : bounds.top + bounds.height / 2));
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.documentElement.dataset.themeTransition = 'true';
    let active: ViewTransition;
    try {
      active = document.startViewTransition(() => { if (current === version && !signal.aborted) commit(id); });
    } catch {
      delete document.documentElement.dataset.themeTransition;
      commit(id);
      return;
    }
    transition = active;
    try {
      await active.ready;
      if (current !== version || signal.aborted || reduced.matches) return;
      animation = document.documentElement.animate({
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
      }, { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' });
      await animation.finished;
    } catch {
      // Snapshot creation may be skipped by navigation, hidden tabs or newer input.
      if (current === version && !signal.aborted) commit(id);
    } finally {
      if (current === version) {
        active.skipTransition();
        delete document.documentElement.dataset.themeTransition;
        transition = undefined;
        animation = undefined;
      }
    }
  };
  options.forEach((button, index) => {
    button.addEventListener('click', event => { void changeTheme(button.dataset.themeOption!, event, button); }, { signal });
    button.addEventListener('keydown', event => {
      let next: number | undefined;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % options.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = options.length - 1;
      if (next !== undefined) { event.preventDefault(); options[next].focus(); }
    }, { signal });
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'joey-theme' && event.key !== null) return;
    stop();
    pendingTheme = undefined;
    applyThemeToDocument(document, event.newValue || 'paper', themeRegistry);
  }, { signal });
  reduced.addEventListener('change', () => { if (reduced.matches) animation?.finish(); }, { signal });
  signal.addEventListener('abort', () => { if (pendingTheme) commit(pendingTheme); stop(); close(); }, { once: true });
}
