/**
 * Blog (lista) - View para /blog
 * SectionHeader, search, grid de BlogCard, getBlogPosts com limit/pagination.
 */
import { getBlogPosts } from '../api/index.js';
import { escapeHtml } from '../utils.js';
import { BlogCard, EmptyState, Skeleton, Pagination, PaginationMount } from '../components/index.js';

const LIMIT = 12;

function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function render() {
  const wrap = document.createElement('div');
  wrap.className = 'pt-24 pb-16';

  let currentOffset = 0;
  let searchVal = '';
  let searchTimeout;

  const loadPosts = async () => {
    const grid = wrap.querySelector('#blog-grid');
    const pagEl = wrap.querySelector('#blog-pagination');
    if (!grid) return;

    grid.innerHTML = Skeleton({ variant: 'grid', count: 6 });
    if (pagEl) pagEl.innerHTML = '';

    const data = await getBlogPosts({
      limit: LIMIT,
      offset: currentOffset,
      search: searchVal || undefined,
    });
    const items = data?.items || [];
    const total = data?.total ?? items.length;

    grid.innerHTML = items.length
      ? items
          .map((p) =>
            BlogCard({
              slug: p.slug,
              title: (typeof t === 'function' ? t(p.title_i18n) : null) || 'Artigo',
              excerpt: truncate((typeof t === 'function' ? t(p.excerpt_i18n) : null) || '', 120),
              imageUrl: p.cover_image_url || p.image_url || '',
              category: p.category?.name || '',
            })
          )
          .join('')
      : EmptyState({
          message: typeof i18n === 'function' ? i18n('no_articles') : 'Sem artigos encontrados.',
        });

    if (pagEl && total > LIMIT) {
      pagEl.innerHTML = Pagination({
        total,
        limit: LIMIT,
        currentOffset,
        onPageChange: (pageIndex) => {
          currentOffset = pageIndex * LIMIT;
          loadPosts();
        },
      });
      PaginationMount(wrap, (pageIndex) => {
        currentOffset = pageIndex * LIMIT;
        loadPosts();
      });
    }
  };

  wrap.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="section-with-watermark" data-bg="BLOG">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-8">
        <div class="relative w-full sm:w-72">
          <input id="blog-search" type="search" class="form-input pl-10 text-sm" placeholder="${typeof i18n === 'function' ? i18n('search_placeholder') : 'Pesquisar...'}">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>

      <div id="blog-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${Skeleton({ variant: 'grid', count: 6 })}
      </div>

      <div id="blog-pagination" class="mt-10"></div>
      </div>
    </div>
  `;

  const searchInput = wrap.querySelector('#blog-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchVal = searchInput.value.trim();
        currentOffset = 0;
        loadPosts();
      }, 400);
    });
  }

  loadPosts();
  return wrap;
}
