export function initArchive(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-archive]');
  if (!root) return;
  if (!root.querySelector('[data-entry]')) return;
  const rows = [...root.querySelectorAll<HTMLElement>('[data-entry]')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const input = root.querySelector<HTMLInputElement>('#title-search')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  let active = 'all';
  const sync = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let count = 0;
    rows.forEach(row => {
      const match = (active === 'all' || row.dataset.kind === active) && (row.dataset.title || '').includes(query);
      row.hidden = !match;
      if (match) count++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
    empty.hidden = count !== 0;
    status.textContent = `显示 ${count} / ${rows.length} 条记录 · 按时间倒序`;
    const url = new URL(window.location.href);
    if (active !== 'all') url.searchParams.set('kind', active); else url.searchParams.delete('kind');
    if (input.value.trim()) url.searchParams.set('q', input.value.trim()); else url.searchParams.delete('q');
    history.replaceState(history.state, '', url);
  };
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('kind');
  if (buttons.some(b => b.dataset.filter === requested)) active = requested!;
  input.value = params.get('q') || '';
  buttons.forEach(button => button.addEventListener('click', () => { active = button.dataset.filter!; sync(); }, { signal }));
  input.addEventListener('input', sync, { signal });
  root.querySelector('.reset-filter')?.addEventListener('click', () => { active = 'all'; input.value = ''; sync(); }, { signal });
  window.addEventListener('pageshow', sync, { signal });
  sync();

  const message = root.querySelector<HTMLElement>('[data-search-message]')!;
  const search = root.querySelector<HTMLElement>('#full-search')!;
  let searchUI: { destroy(): void } | undefined;
  if (import.meta.env.DEV) {
    message.textContent = '全文搜索在生产构建后可用；请运行 npm run build，再运行 npm run preview。';
    return;
  }
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/pagefind/pagefind-ui.css';
  document.head.appendChild(stylesheet);
  const script = document.createElement('script');
  script.src = '/pagefind/pagefind-ui.js';
  script.onload = () => {
    if (signal.aborted) return;
    const UI = (window as Window & { PagefindUI?: new (options: object) => { destroy(): void } }).PagefindUI;
    if (!UI) { message.textContent = '全文搜索暂时不可用，可以使用上方标题搜索。'; return; }
    searchUI = new UI({ element: search, showSubResults: true, showImages: false, translations: { placeholder: '搜索全部正文…', zero_results: '没有找到「[SEARCH_TERM]」', clear_search: '清除', searching: '搜索中…', load_more: '显示更多', many_results: '找到 [COUNT] 条结果', one_result: '找到 1 条结果' } });
    message.hidden = true;
  };
  script.onerror = () => { if (signal.aborted) return; message.textContent = '全文搜索暂时不可用，可以使用上方标题搜索。'; };
  document.body.appendChild(script);
  signal.addEventListener('abort', () => {
    searchUI?.destroy();
    search.replaceChildren();
    stylesheet.remove();
    script.remove();
  }, { once: true });
}
