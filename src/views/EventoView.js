/**
 * EventoView – detalhe do evento por id
 */
import { getEvent, API_BASE } from '../api/index.js';
import { escapeHtml, updateMetaTags, truncate } from '../utils.js';
import { sanitizeHtml } from '../utils/sanitize.js';

const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function t(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = (typeof window !== 'undefined' && typeof window.getLang === 'function') ? window.getLang() : 'pt';
  return obj[lang] || obj.pt || obj.en || '';
}

function i18n(key) {
  return (typeof window !== 'undefined' && typeof window.i18n === 'function')
    ? window.i18n(key) : key;
}

export function render(params) {
  const id = params?.id;
  const wrapper = document.createElement('div');

  const skeletonHtml = `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="skeleton h-[300px] rounded-2xl mb-8"></div>
        <div class="space-y-4">
          <div class="skeleton h-8 w-3/4 rounded"></div>
          <div class="skeleton h-4 w-1/2 rounded"></div>
        </div>
      </div>
    </div>
  `;

  wrapper.innerHTML = skeletonHtml;

  async function loadEvent() {
    const container = wrapper.querySelector('div > div');
    if (!id) {
      container.innerHTML = `
        <div class="empty-state">
          <p>${i18n('event_not_found')} <a href="/eventos" class="text-primary font-bold hover:underline">${i18n('see_all')}</a></p>
        </div>
      `;
      return;
    }

    const e = await getEvent(id);
    if (!e) {
      container.innerHTML = `
        <div class="empty-state">
          <p>${i18n('event_not_found')} <a href="/eventos" class="text-primary font-bold hover:underline">${i18n('see_all')}</a></p>
        </div>
      `;
      return;
    }

    const title = t(e.title_i18n) || 'Evento';
    const desc = t(e.description_i18n) || '';
    const img = e.image_url || '';
    const d = e.event_date ? new Date(e.event_date) : null;
    const endD = e.event_end_date ? new Date(e.event_end_date) : null;
    const dateStr = d ? d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const timeStr = d ? d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';
    const endTimeStr = endD ? endD.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';
    const tags = e.tags || [];

    const metaDesc = truncate((desc || '').replace(/<[^>]+>/g, '').trim(), 160);
    updateMetaTags({
      title: `${title} | Open Heavens Church`,
      description: metaDesc || undefined,
      ogTitle: `${title} | Open Heavens Church`,
      ogDescription: metaDesc || undefined,
      ogImage: img || undefined,
    });

    container.innerHTML = `
      ${img ? `<div class="relative rounded-2xl overflow-hidden mb-8 aspect-[21/9]">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent"></div>
      </div>` : ''}
      <div class="fade-in">
        <div class="flex flex-wrap items-start gap-4 mb-6">
          <div class="shrink-0 w-20 py-4 rounded-2xl bg-[#E8A838]/10 text-center border border-[#E8A838]/20">
            <span class="text-3xl font-extrabold text-[#E8A838] leading-none block">${d ? d.getDate() : ''}</span>
            <span class="text-xs font-bold text-[#E8A838]/70 mt-0.5 block">${d ? MONTHS[d.getMonth()] : ''}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-dark">${escapeHtml(title)}</h1>
            <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              ${dateStr ? `<span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-[#E8A838]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>${escapeHtml(dateStr)}</span>` : ''}
              ${timeStr ? `<span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-[#E8A838]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>${escapeHtml(timeStr)}${endTimeStr ? ' — ' + escapeHtml(endTimeStr) : ''}</span>` : ''}
            </div>
            ${e.location ? `<p class="flex items-center gap-1.5 mt-2 text-sm text-gray-500"><svg class="w-4 h-4 text-[#E8A838]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><a href="https://maps.google.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener" class="hover:text-primary transition">${escapeHtml(e.location)}</a></p>` : ''}
          </div>
        </div>

        ${tags.length ? `<div class="flex flex-wrap gap-1.5 mb-6">${tags.map((tg) => `<span class="badge badge-amber">${escapeHtml(tg)}</span>`).join('')}</div>` : ''}

        ${desc ? `<div class="rich-content rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 mb-6">${sanitizeHtml(desc)}</div>` : ''}

        <div class="flex flex-wrap gap-3">
          <a href="${API_BASE}/api/events/${encodeURIComponent(id)}/ical" class="btn-primary" download>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            ${i18n('add_calendar') || 'Adicionar ao calendário'}
          </a>
          <a href="/eventos" class="btn-outline">${i18n('back_to_events')}</a>
        </div>
      </div>
    `;
  }

  loadEvent();
  return wrapper;
}
