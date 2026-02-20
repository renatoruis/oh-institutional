/**
 * Open Heavens – Sermões View
 * Section header, search, tag filters, grid, pagination
 */

import { getSermons } from '@/api/index.js';
import { SermonCard, EmptyState, Pagination, PaginationMount } from '@/components/index.js';
import { escapeHtml, getYouTubeId, formatDateShort } from '@/utils.js';
import { t, i18n } from '@/i18n.js';

const LIMIT = 12;

function sermonToCard(s) {
  const title = t(s.title_i18n) || 'Sermão';
  const date = formatDateShort(s.sermon_date || s.date);
  const ytId = getYouTubeId(s.youtube_url);
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (s.image_url || s.thumbnail_url || '');
  return SermonCard({ id: s.id, title, date, thumbUrl: thumb, tags: s.tags || [] });
}

function buildTagFiltersHtml(allTags, currentTag) {
  if (!allTags?.length) return '';
  const btns = [
    `<button class="badge ${!currentTag ? 'badge-primary' : 'badge-dark'} cursor-pointer" data-tag="" type="button">${i18n('all_filter')}</button>`,
    ...allTags.map(tg => `<button class="badge ${currentTag === tg ? 'badge-primary' : 'badge-dark'} cursor-pointer" data-tag="${escapeHtml(tg)}" type="button">${escapeHtml(tg)}</button>`)
  ];
  return btns.join('');
}

export async function render(params = {}) {
  const offset = parseInt(params.offset, 10) || 0;
  const search = params.search || '';
  const tag = params.tag || '';

  const { items, total } = await getSermons({ limit: LIMIT, offset, search, tag });
  const allTags = [...new Set(items.flatMap(s => s.tags || []))];

  const gridHtml = items.length
    ? items.map(sermonToCard).join('')
    : EmptyState({ message: i18n('no_sermons') });

  const filtersHtml = buildTagFiltersHtml(allTags, tag);
  const paginationHtml = Pagination({ total, limit: LIMIT, offset });

  return `
    <div class="pt-24 pb-16" id="sermoes-view">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="section-with-watermark" data-bg="SERMONS">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-8">
          <div class="relative w-full sm:w-72">
            <input id="sermoes-search" type="search" class="form-input pl-10 text-sm" placeholder="${i18n('search_sermons')}" value="${escapeHtml(search)}" autocomplete="off">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
        </div>
        <div id="sermoes-filters" class="flex flex-wrap gap-2 mb-8">${filtersHtml}</div>
        <div id="sermoes-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${gridHtml}</div>
        <div id="sermoes-pagination" class="mt-10">${paginationHtml}</div>
        </div>
      </div>
    </div>`;
}

export function mount(container) {
  const root = container?.querySelector('#sermoes-view') || container;
  if (!root) return;

  let currentOffset = 0;
  let currentTag = '';
  let searchTimeout;

  async function loadSermons() {
    const searchVal = (root.querySelector('#sermoes-search')?.value || '').trim();
    const grid = root.querySelector('#sermoes-grid');
    const pagEl = root.querySelector('#sermoes-pagination');
    const filtersEl = root.querySelector('#sermoes-filters');

    if (grid) grid.innerHTML = '<div class="skeleton h-72 rounded-2xl col-span-full"></div><div class="skeleton h-72 rounded-2xl"></div><div class="skeleton h-72 rounded-2xl"></div><div class="skeleton h-72 rounded-2xl"></div><div class="skeleton h-72 rounded-2xl"></div><div class="skeleton h-72 rounded-2xl"></div>';

    const { items, total } = await getSermons({ limit: LIMIT, offset: currentOffset, search: searchVal, tag: currentTag });

    if (grid) {
      grid.innerHTML = items.length
        ? items.map(sermonToCard).join('')
        : EmptyState({ message: i18n('no_sermons') });
    }

    if (filtersEl) filtersEl.innerHTML = buildTagFiltersHtml([...new Set(items.flatMap(s => s.tags || []))], currentTag);

    if (pagEl) {
      pagEl.innerHTML = Pagination({ total, limit: LIMIT, offset: currentOffset });
      PaginationMount(pagEl, { limit: LIMIT, onPage: (off) => { currentOffset = off; loadSermons(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
    }
  }

  root.querySelector('#sermoes-search')?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { currentOffset = 0; loadSermons(); }, 400);
  });

  root.querySelector('#sermoes-filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (btn) { currentTag = btn.dataset.tag ?? ''; currentOffset = 0; loadSermons(); }
  });

  const pagEl = root.querySelector('#sermoes-pagination');
  if (pagEl) PaginationMount(pagEl, { limit: LIMIT, onPage: (off) => { currentOffset = off; loadSermons(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
}
