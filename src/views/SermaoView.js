/**
 * Sermão (detalhe) - View para /sermoes/:id
 *  
 */
import { getSermon, getRelatedSermons, postSermonView } from '../api/index.js';
import { escapeHtml, formatDate, getYouTubeId, formatDateShort } from '../utils.js';
import { t, i18n } from '../i18n.js';
import { EmptyState } from '../components/index.js';

export function render(params) {
  const id = params?.id;
  const wrap = document.createElement('div');
  wrap.className = 'pt-24 pb-16';

  if (!id) {
    wrap.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        ${EmptyState({
          message: i18n('sermon_not_found'),
          actionLink: { href: '/sermoes', label: i18n('see_all') },
        })}
      </div>
    `;
    return wrap;
  }

  wrap.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <div class="skeleton h-[360px] rounded-2xl mb-6"></div>
          <div class="skeleton h-8 w-3/4 rounded mb-2"></div>
          <div class="skeleton h-4 w-1/3 rounded"></div>
        </div>
        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-6">
            <div>
              <h3 class="text-sm font-bold text-dark mb-4">${i18n('related_sermons')}</h3>
              <div id="sermao-related" class="space-y-3">
                <div class="skeleton h-20 rounded-xl"></div>
                <div class="skeleton h-20 rounded-xl"></div>
              </div>
            </div>
            <a href="/sermoes" class="btn-outline w-full justify-center">${i18n('all_sermons')}</a>
          </div>
        </aside>
      </div>
    </div>
  `;

  (async () => {
    const s = await getSermon(id);
    if (!s) {
      wrap.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          ${EmptyState({
            message: i18n('sermon_not_found'),
            actionLink: { href: '/sermoes', label: i18n('see_all') },
          })}
        </div>
      `;
      return;
    }

    postSermonView(id);

    const title = t(s.title_i18n) || 'Sermão';
    const desc = t(s.description_i18n) || '';
    const date = formatDate(s.sermon_date);
    const tags = s.tags || [];
    const ytId = getYouTubeId(s.youtube_url);
    const pdfUrl = s.pdf_url || '';
    const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (s.image_url || s.thumbnail_url || '');

    document.title = `${escapeHtml(title)} | Open Heavens Church`;

    const mainCol = wrap.querySelector('.grid > div:first-child');
    mainCol.innerHTML = `
      <div class="fade-in">
        ${ytId
          ? `<div class="rounded-2xl overflow-hidden bg-dark aspect-video mb-6">
              <iframe src="https://www.youtube.com/embed/${ytId}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`
          : thumbUrl
          ? `<div class="rounded-2xl overflow-hidden aspect-video mb-6">
              <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover">
            </div>`
          : ''}
        <h1 class="text-2xl sm:text-3xl font-extrabold text-dark">${escapeHtml(title)}</h1>
        <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
          ${date ? `<span>${escapeHtml(date)}</span>` : ''}
          ${s.views != null ? `<span>· ${s.views} ${i18n('views_label')}</span>` : ''}
        </div>
        ${tags.length ? `<div class="flex flex-wrap gap-1.5 mt-3">${tags.map((tg) => `<span class="badge badge-dark">${escapeHtml(tg)}</span>`).join('')}</div>` : ''}
        ${desc ? `<div class="rich-content mt-6 pt-6 border-t border-gray-200">${desc}</div>` : ''}
        ${pdfUrl ? `<div class="mt-6 pt-6 border-t border-gray-200">
          <a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener" class="btn-outline">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download PDF
          </a>
        </div>` : ''}
      </div>
    `;

    const relatedEl = wrap.querySelector('#sermao-related');
    if (relatedEl) {
      const rel = await getRelatedSermons(id);
      const items = rel?.items || rel?.data || [];
      if (!items.length) {
        relatedEl.innerHTML = `<p class="text-sm text-gray-400">${i18n('no_related_sermons')}</p>`;
      } else {
        relatedEl.innerHTML = items.slice(0, 4)
          .map((it) => {
            const tit = t(it.title_i18n) || 'Sermão';
            const yid = getYouTubeId(it.youtube_url);
            const thumb = yid ? `https://img.youtube.com/vi/${yid}/mqdefault.jpg` : it.image_url || '';
            return `<a href="/sermoes/${encodeURIComponent(it.id)}" class="flex gap-3 p-2 rounded-xl hover:bg-gray-100 transition">
              <div class="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                ${thumb ? `<img src="${escapeHtml(thumb)}" class="w-full h-full object-cover" loading="lazy">` : ''}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-dark line-clamp-2">${escapeHtml(tit)}</p>
                <p class="text-xs text-gray-400 mt-1">${formatDateShort(it.sermon_date || it.date)}</p>
              </div>
            </a>`;
          })
          .join('');
      }
    }
  })();

  return wrap;
}
