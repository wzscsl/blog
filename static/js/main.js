(() => {
  'use strict';
  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  const status = document.getElementById('search-status');
  const results = document.getElementById('search-results');
  let indexPromise;
  let request = 0;
  let previousFocus;
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase();
  async function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(dialog.dataset.index).then(response => {
        if (!response.ok) throw new Error('索引加载失败');
        return response.json();
      }).catch(error => { indexPromise = undefined; throw error; });
    }
    return indexPromise;
  }
  function openSearch() {
    previousFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    input.focus();
    search();
  }
  document.querySelectorAll('[data-search-open]').forEach(button => button.addEventListener('click', openSearch));
  document.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => previousFocus?.focus());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  });
  async function search() {
    const currentRequest = ++request;
    const query = normalize(input.value.trim());
    results.replaceChildren();
    if (!query) { status.textContent = '输入关键词，找回一个想法。'; return; }
    status.textContent = '正在检索……';
    try {
      const pages = await loadIndex();
      if (currentRequest !== request) return;
      const terms = query.split(/\s+/).filter(Boolean);
      const matches = pages.map(page => {
        const title = normalize(page.title);
        const taxonomy = normalize([...page.tags, ...page.categories, ...page.series].join(' '));
        const content = normalize(page.content);
        const all = `${title} ${taxonomy} ${content}`;
        if (!terms.every(term => all.includes(term))) return null;
        const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 8 : 0) + (taxonomy.includes(term) ? 4 : 0) + (content.includes(term) ? 1 : 0), 0);
        return { page, score };
      }).filter(Boolean).sort((a,b) => b.score - a.score || b.page.date.localeCompare(a.page.date));
      status.textContent = matches.length ? `找到 ${matches.length} 篇笔记${matches.length > 30 ? '，显示前 30 篇' : ''}` : '没有找到相关笔记，试试更短的关键词。';
      for (const {page} of matches.slice(0,30)) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = page.url;
        const title = document.createElement('strong');
        title.textContent = page.title;
        const meta = document.createElement('small');
        meta.textContent = `${page.date} · ${page.tags.join(' / ')}`;
        const excerpt = document.createElement('p');
        const position = normalize(page.content).indexOf(terms[0]);
        const start = Math.max(0, position - 30);
        excerpt.textContent = `${start ? '…' : ''}${page.content.slice(start, start + 140).replace(/\s+/g, ' ')}…`;
        link.append(meta, document.createElement('br'), title, excerpt);
        li.append(link);
        results.append(li);
      }
    } catch {
      if (currentRequest === request) status.textContent = '搜索索引暂时无法加载，请检查网络后重新输入关键词。';
    }
  }
  input.addEventListener('input', search);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); results.querySelector('a')?.focus(); }
    if (event.key === 'Enter') results.querySelector('a')?.click();
  });
  results.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    const position = links.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') { event.preventDefault(); links[Math.min(position + 1, links.length - 1)]?.focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); position <= 0 ? input.focus() : links[position - 1].focus(); }
  });
  document.querySelectorAll('.highlight').forEach(block => {
    const code = block.querySelector('code');
    if (!code) return;
    const button = document.createElement('button');
    button.className = 'copy-code';
    button.type = 'button';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code.textContent); button.textContent = '已复制'; }
      catch { button.textContent = '请选中代码复制'; }
      setTimeout(() => { button.textContent = '复制'; }, 2000);
    });
    block.append(button);
  });
})();
