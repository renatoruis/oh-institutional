import { escapeHtml } from '../utils.js';

const DEFAULT_THUMB = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect fill=%22%231a1818%22 width=%22400%22 height=%22225%22/%3E%3C/svg%3E';

/**
 * Sermon card: thumbnail, date, title, optional tags.
 * Link: /sermoes/:id (sermao.html?id=)
 * @param {Object} props
 * @param {string|number} props.id - Sermon ID
 * @param {string} props.title - Title
 * @param {string} props.date - Formatted date string
 * @param {string} [props.thumbUrl] - Thumbnail URL
 * @param {string[]} [props.tags] - Optional tags
 */
export function render(props) {
  const { id = '', title = 'Sermão', date = '', thumbUrl = '', tags = [] } = props || {};
  const safeTitle = escapeHtml(title);
  const safeDate = escapeHtml(date);
  const thumb = thumbUrl || DEFAULT_THUMB;
  const href = `/sermoes/${encodeURIComponent(String(id))}`;

  const tagsHtml = Array.isArray(tags) && tags.length
    ? `<div class="flex flex-wrap gap-1 mt-2">${tags.slice(0, 3).map(t => `<span class="text-[10px] font-semibold text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  return `<a href="${href}" class="dark-card card-hover block fade-in">
  <div class="aspect-video relative overflow-hidden">
    <img src="${thumb}" alt="${safeTitle}" class="w-full h-full object-cover" loading="lazy">
    <div class="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent"></div>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><svg class="w-6 h-6 text-dark ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
    </div>
  </div>
  <div class="p-4">
    <p class="text-xs text-white/35">${safeDate}</p>
    <h3 class="text-[15px] font-bold text-white/95 mt-1 line-clamp-2">${safeTitle}</h3>
    ${tagsHtml}
  </div>
</a>`;
}
