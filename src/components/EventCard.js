import { escapeHtml } from '../utils.js';

/**
 * Event card: optional image, date, time, title, location.
 * Link: /evento/:id (evento.html?id=)
 * @param {Object} props
 * @param {string|number} props.id - Event ID
 * @param {string} props.title - Title
 * @param {string} [props.dateStr] - Formatted date (e.g. "sex, 21 fev")
 * @param {string} [props.timeStr] - Formatted time (e.g. "19:00")
 * @param {string} [props.imageUrl] - Optional cover image
 * @param {string} [props.location] - Location text
 */
export function render(props) {
  const { id = '', title = 'Evento', dateStr = '', timeStr = '', imageUrl = '', location = '' } = props || {};
  const safeTitle = escapeHtml(title);
  const safeDate = escapeHtml(dateStr);
  const safeTime = escapeHtml(timeStr);
  const safeLocation = escapeHtml(location);
  const href = `/evento/${encodeURIComponent(String(id))}`;

  const dateTimeLine = timeStr ? `${safeDate} · ${safeTime}` : safeDate;

  const imageBlock = imageUrl
    ? `<div class="h-40 relative overflow-hidden"><img src="${imageUrl}" alt="${safeTitle}" class="w-full h-full object-cover" loading="lazy"><div class="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div></div>`
    : '<div class="h-1 bg-primary/30"></div>';

  return `<a href="${href}" class="dark-card card-hover block fade-in rounded-2xl overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F5]">
  ${imageBlock}
  <div class="p-4">
    ${dateTimeLine ? `<p class="text-xs text-white/35">${dateTimeLine}</p>` : ''}
    <h3 class="text-[15px] font-bold text-white/95 mt-1 line-clamp-2">${safeTitle}</h3>
    ${location ? `<p class="text-xs text-white/30 mt-1">${safeLocation}</p>` : ''}
  </div>
</a>`;
}
