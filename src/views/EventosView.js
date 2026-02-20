/**
 * EventosView – lista de eventos com grid EventCard e paginação
 */
import { getEvents } from '../api/index.js';
import { EventCard, Pagination, PaginationMount, EmptyState, Skeleton } from '../components/index.js';
import { escapeHtml } from '../utils.js';
import { i18n } from '../i18n.js';

const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const LIMIT = 12;

function t(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = (typeof getLang === 'function' ? getLang() : null) || 'pt';
  return obj[lang] || obj.pt || obj.en || '';
}

function eventToCard(e) {
  const title = t(e.title_i18n) || 'Evento';
  const d = e.event_date ? new Date(e.event_date) : null;
  const day = d ? d.getDate() : '';
  const month = d ? MONTHS[d.getMonth()] : '';
  const dateStr = d ? d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
  const timeStr = d ? d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';

  return EventCard({
    id: e.id,
    title,
    dateStr: `${dateStr}${timeStr ? ' · ' + timeStr : ''}`,
    timeStr: '',
    imageUrl: e.image_url || '',
    location: e.location || '',
  });
}

export function render() {
  const skeletonHtml = Skeleton({ variant: 'grid', count: 6 });

  const html = `
    <div class="pt-24 pb-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="section-with-watermark" data-bg="${i18n('agenda_watermark')}">
        <div id="events-filters" class="flex flex-wrap gap-2 mb-8"></div>
        <div id="events-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${skeletonHtml}
        </div>
        <div id="events-pagination"></div>
        </div>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  let currentOffset = 0;
  let currentCat = '';

  async function loadEvents() {
    const grid = wrapper.querySelector('#events-grid');
    const filtersEl = wrapper.querySelector('#events-filters');
    const pagEl = wrapper.querySelector('#events-pagination');

    grid.innerHTML = Skeleton({ variant: 'grid', count: 6 });

    const { items, total } = await getEvents({ limit: LIMIT, offset: currentOffset, category: currentCat || undefined });

    if (!items.length) {
      grid.innerHTML = EmptyState({
        message: i18n('no_events') || 'Sem eventos de momento.',
        icon: '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>',
      });
    } else {
      grid.innerHTML = items.map(eventToCard).join('');
    }

    const cats = [...new Set(items.map((e) => e.category).filter(Boolean))];
    if (cats.length) {
      filtersEl.innerHTML =
        `<button class="badge ${!currentCat ? 'badge-amber' : 'badge-dark'} cursor-pointer" data-cat="">${i18n('all_filter')}</button>` +
        cats.map((c) => `<button class="badge ${currentCat === c ? 'badge-amber' : 'badge-dark'} cursor-pointer" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
      filtersEl.onclick = (ev) => {
        const cat = ev.target.dataset?.cat;
        if (cat !== undefined) {
          currentCat = cat;
          currentOffset = 0;
          loadEvents();
        }
      };
    } else {
      filtersEl.innerHTML = '';
    }

    if (Math.ceil(total / LIMIT) > 1) {
      pagEl.className = 'mt-10';
      pagEl.innerHTML = Pagination({ total, limit: LIMIT, offset: currentOffset });
      PaginationMount(wrapper, { limit: LIMIT, onPage: (off) => { currentOffset = off; loadEvents(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
    } else {
      pagEl.innerHTML = '';
    }
  }

  loadEvents();
  return wrapper;
}
