/**
 * Avisos – lista de notices, SectionHeader, cards
 */
import { getNotices } from '../api/index.js';
import { navigate } from '../router.js';
import { escapeHtml } from '../utils.js';
import { i18n, t } from '../i18n.js';

const LIMIT = 20;

function truncate(str, len = 150) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export async function render(params = {}) {
  const offset = Number(params.offset ?? new URLSearchParams(window.location.search).get('offset')) || 0;
  const { items, total } = await getNotices({ limit: LIMIT, offset });

  const headerHtml = `
    <div class="mb-8">
      <div class="section-header" data-bg="NOTICES">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-dark" data-i18n="notices_page_title">${i18n('notices_page_title')}</h1>
      </div>
      <p class="text-gray-500 mt-1" data-i18n="notices_subtitle">${i18n('notices_subtitle')}</p>
    </div>`;

  if (!items.length) {
    return {
      html: `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        ${headerHtml}
        <div class="empty-state col-span-full">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
          <p>${i18n('no_notices')}</p>
        </div>
      </div>
    </div>`,
      mount: () => {},
    };
  }

  const pinned = items.filter(n => n.pinned);
  const regular = items.filter(n => !n.pinned);
  const sorted = [...pinned, ...regular];

  const cardsHtml = sorted.map((n, idx) => {
    const title = t(n.title_i18n) || 'Aviso';
    const body = t(n.body_i18n) || '';
    const preview = truncate(body.replace(/<[^>]+>/g, ''), 150);
    const type = n.notice_type || 'general';
    const isPinned = n.pinned;

    return `<button data-aviso-idx="${idx}" class="aviso-card w-full text-left rounded-2xl bg-white border ${isPinned ? 'border-l-4 border-l-[#5B9BD5] border-[#5B9BD5]/20' : 'border-gray-200'} p-5 card-hover transition fade-in">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl ${isPinned ? 'bg-[#5B9BD5]/15' : 'bg-gray-100'} flex items-center justify-center shrink-0 mt-0.5">
          ${isPinned ? '<svg class="w-5 h-5 text-[#5B9BD5]" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>' : '<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>'}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            ${isPinned ? `<span class="badge badge-pinned">${i18n('pinned')}</span>` : ''}
            ${type !== 'general' ? `<span class="badge badge-blue">${escapeHtml(type)}</span>` : ''}
          </div>
          <h3 class="text-base font-bold text-dark">${escapeHtml(title)}</h3>
          ${preview ? `<p class="text-sm text-gray-500 mt-1 line-clamp-2">${escapeHtml(preview)}</p>` : ''}
        </div>
        <svg class="w-5 h-5 text-gray-300 shrink-0 mt-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </div>
    </button>`;
  }).join('');

  const pages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT);
  let paginationHtml = '';
  if (pages > 1) {
    paginationHtml = `<div class="pagination mt-10 flex flex-wrap gap-2">${Array.from({ length: pages }, (_, i) =>
      `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i + 1}</button>`
    ).join('')}</div>`;
  }

  return {
    html: `
  <div class="pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      ${headerHtml}
      <div id="avisos-list" class="space-y-4">
        ${cardsHtml}
      </div>
      ${paginationHtml}
    </div>
  </div>
  <div id="aviso-modal" class="modal-overlay" aria-hidden="true">
    <div class="modal-content p-6 sm:p-8" onclick="event.stopPropagation()">
      <div class="flex items-start justify-between mb-4">
        <h2 id="aviso-modal-title" class="text-xl font-extrabold text-dark pr-4"></h2>
        <button id="aviso-modal-close" class="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div id="aviso-modal-meta" class="flex flex-wrap gap-2 mb-4"></div>
      <div id="aviso-modal-body" class="rich-content text-gray-600"></div>
    </div>
  </div>`,
    mount: () => mount({ items: sorted, total }),
  };
}

/**
 * Mount event handlers for avisos (modal, pagination)
 * Called after the view HTML is inserted into the DOM.
 * @param {{ items: object[], total: number }} data - notices data for modal content
 */
export function mount(data) {
  const { items = [] } = data || {};
  const pinned = items.filter(n => n.pinned);
  const regular = items.filter(n => !n.pinned);
  const sorted = [...pinned, ...regular];

  const modal = document.getElementById('aviso-modal');
  const titleEl = document.getElementById('aviso-modal-title');
  const metaEl = document.getElementById('aviso-modal-meta');
  const bodyEl = document.getElementById('aviso-modal-body');

  function openModal(idx) {
    const n = sorted[idx];
    if (!n) return;
    const title = t(n.title_i18n) || 'Aviso';
    const body = t(n.body_i18n) || '';
    titleEl.textContent = title;
    metaEl.innerHTML = '';
    if (n.pinned) metaEl.innerHTML += `<span class="badge badge-pinned">${i18n('pinned')}</span>`;
    if (n.notice_type && n.notice_type !== 'general') metaEl.innerHTML += `<span class="badge badge-blue">${escapeHtml(n.notice_type)}</span>`;
    bodyEl.innerHTML = body || `<p class="text-gray-400">${i18n('no_extra_content')}</p>`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.aviso-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.avisoIdx, 10);
      openModal(idx);
    });
  });

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('aviso-modal-close')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); }
  });

  document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page, 10);
      const path = `/avisos${p > 0 ? '?offset=' + (p * LIMIT) : ''}`;
      navigate(path);
    });
  });
}
