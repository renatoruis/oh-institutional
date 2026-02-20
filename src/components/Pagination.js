/**
 * Pagination component - renders page buttons.
 * mount() binds click handlers - call after inserting into DOM.
 * @param {Object} props
 * @param {number} props.total - Total items
 * @param {number} props.limit - Items per page
 * @param {number} props.offset - Current offset
 * @param {function(number): void} props.onPage - Callback(offset) when page changes
 */
export function render(props) {
  const { total = 0, limit = 12, offset = 0 } = props || {};
  const pages = Math.max(1, Math.ceil(total / limit));
  const current = Math.min(Math.floor(offset / limit), pages - 1);

  if (pages <= 1) return '';

  let html = '<div class="pagination flex gap-1 justify-center flex-wrap">';
  if (current > 0) {
    html += `<button class="page-btn" data-p="${current - 1}" type="button">&laquo;</button>`;
  }
  for (let i = 0; i < pages; i++) {
    if (pages > 7 && i > 1 && i < pages - 2 && Math.abs(i - current) > 1) {
      if (!html.endsWith('...')) html += '<span class="px-1 text-gray-400">...</span>';
      continue;
    }
    html += `<button class="page-btn ${i === current ? 'active' : ''}" data-p="${i}" type="button">${i + 1}</button>`;
  }
  if (current < pages - 1) {
    html += `<button class="page-btn" data-p="${current + 1}" type="button">&raquo;</button>`;
  }
  html += '</div>';
  return html;
}

/**
 * Mount pagination: bind click handlers. Call after rendering into container.
 * @param {HTMLElement} container - Element containing .pagination
 * @param {Object} opts - { limit, onPage }
 */
export function mount(container, opts) {
  if (!container) return;
  const pag = container.querySelector('.pagination');
  if (!pag) return;
  const limit = opts?.limit ?? 12;
  const onPage = opts?.onPage;
  if (typeof onPage !== 'function') return;

  pag.querySelectorAll('[data-p]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.p, 10);
      if (!isNaN(p)) {
        onPage(p * limit);
      }
    });
  });
}
