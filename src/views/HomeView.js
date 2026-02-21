/**
 * Open Heavens – Home View
 * Hero → Versículo → Próximo evento → Quick access → Blog → Eventos
 */

import { getBanners, getVerseOfDay, getNextEvent, getBlogPosts, getEvents } from '@/api/index.js';
import { BlogCard, EventCard } from '@/components/index.js';
import { escapeHtml, formatDateShort, formatTime, truncate } from '@/utils.js';
import { t, i18n } from '@/i18n.js';
import { initHeroParallax } from '@/shared.js';

const QUICK_LINKS = [
  { href: '/sermoes', icon: 'play', label: { pt: 'Sermões', en: 'Sermons' } },
  { href: '/blog', icon: 'book', label: { pt: 'Blog', en: 'Blog' } },
  { href: '/eventos', icon: 'calendar', label: { pt: 'Agenda', en: 'Events' } },
  { href: '/oracoes', icon: 'heart', label: { pt: 'Oração', en: 'Prayer' } },
  { href: '/biblia', icon: 'book-open', label: { pt: 'Bíblia', en: 'Bible' } },
  { href: '/avisos', icon: 'bell', label: { pt: 'Avisos', en: 'Notices' } },
];

const ICON_SVG = {
  play: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  book: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
  calendar: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  heart: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  'book-open': '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
  bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
};

function blogToCard(p) {
  const title = t(p.title_i18n) || 'Artigo';
  const excerpt = truncate(t(p.excerpt_i18n) || '', 120);
  const img = p.cover_image_url || p.image_url || '';
  const cat = p.category?.name || '';
  return BlogCard({ slug: p.slug, title, excerpt, imageUrl: img, category: cat });
}

function eventToCard(e) {
  const title = t(e.title_i18n) || 'Evento';
  const dateStr = formatDateShort(e.event_date || e.date);
  const timeStr = formatTime(e.event_date || e.date);
  return EventCard({ id: e.id, title, dateStr, timeStr, imageUrl: e.image_url, location: e.location });
}

const HERO_HEIGHT = 'min-h-[45vh] sm:min-h-[50vh] max-h-[520px]';
const HERO_OVERLAY = 'bg-gradient-to-t from-dark via-dark/70 to-transparent';

function renderHero(banners) {
  if (!banners?.length) {
    return `
      <header class="relative ${HERO_HEIGHT} overflow-hidden bg-dark">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/25 via-dark to-dark"></div>
        <div class="absolute inset-0 ${HERO_OVERLAY}"></div>
      </header>`;
  }
  const slides = banners.map((b, i) => {
    const img = b.image_url || b.url || '';
    return `
      <div class="hero-slide ${i === 0 ? 'active' : ''}" data-slide-index="${i}">
        ${img ? `<img src="${escapeHtml(img)}" alt="" class="absolute inset-0 w-full h-full object-cover">` : '<div class="absolute inset-0 bg-gradient-to-br from-primary/25 via-dark to-dark"></div>'}
        <div class="absolute inset-0 ${HERO_OVERLAY}"></div>
      </div>`;
  }).join('');
  const slideAria = t({ pt: 'Ir ao slide', en: 'Go to slide' });
  const dots = banners.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-i="${i}" type="button" aria-label="${slideAria} ${i + 1}"></button>`).join('');
  return `
    <header class="relative ${HERO_HEIGHT} overflow-hidden bg-dark hero-carousel">
      ${slides}
      <div class="absolute bottom-6 left-0 right-0 z-20 hero-dots flex justify-center gap-2 pointer-events-auto">${dots}</div>
    </header>`;
}

export async function render() {
  const [banners, verse, nextEvent, blogRes, eventsRes] = await Promise.all([
    getBanners(),
    getVerseOfDay(),
    getNextEvent(),
    getBlogPosts({ limit: 6 }),
    getEvents({ limit: 6 }),
  ]);

  const blogPosts = Array.isArray(blogRes) ? blogRes : blogRes?.items ?? [];
  const events = Array.isArray(eventsRes) ? eventsRes : eventsRes?.items ?? [];

  const heroHtml = renderHero(Array.isArray(banners) ? banners : []);

  const verseText = t(verse?.text_i18n) || verse?.text || verse?.content || '';
  const verseHtml = verse && verseText
    ? `<section class="rounded-2xl dark-card p-5 sm:p-6">
        <p class="text-xs font-semibold text-primary uppercase tracking-wider">${i18n('verse_label')}</p>
        <blockquote class="text-base sm:text-lg text-white/90 mt-2 leading-relaxed">"${escapeHtml(verseText)}"</blockquote>
        <p class="text-xs text-white/45 mt-2">— ${escapeHtml(verse.reference || '')}</p>
      </section>`
    : '';

  const nextEventHtml = nextEvent
    ? `<a href="/evento/${nextEvent.id}" class="rounded-2xl dark-card card-hover block overflow-hidden">
        <div class="p-5 sm:p-6 flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
          </div>
          <div class="min-w-0">
            <h3 class="text-base font-bold text-white/95 truncate">${escapeHtml(t(nextEvent.title_i18n) || nextEvent.title || '')}</h3>
            <p class="text-xs text-white/50">${formatDateShort(nextEvent.event_date || nextEvent.date)}${nextEvent.event_date ? ' · ' + formatTime(nextEvent.event_date) : ''}</p>
          </div>
        </div>
      </a>`
    : '';

  const quickAccessHtml = `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      ${QUICK_LINKS.map(l => {
        const label = t(l.label);
        return `
        <a href="${l.href}" class="quick-access-link rounded-2xl bg-white border border-gray-200 p-4 sm:p-5 min-h-[88px] sm:min-h-0 flex flex-col items-center justify-center gap-2 card-hover group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="${label}">
          <div class="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-dark transition-colors shrink-0">${ICON_SVG[l.icon] || ICON_SVG.play}</div>
          <span class="text-xs font-semibold text-dark text-center">${label}</span>
        </a>`;
      }).join('')}
    </div>`;

  const blogGrid = blogPosts.length
    ? blogPosts.map((p, i) => {
        const card = blogToCard(p);
        return i === 0 ? card : `<div class="hidden sm:block">${card}</div>`;
      }).join('')
    : `<div class="col-span-full text-center py-8 text-gray-500">${i18n('coming_soon')}</div>`;

  const eventsGrid = events.length
    ? events.map((e, i) => {
        const card = eventToCard(e);
        return i === 0 ? card : `<div class="hidden sm:block">${card}</div>`;
      }).join('')
    : `<div class="col-span-full text-center py-8 text-gray-500">${i18n('coming_soon')}</div>`;

  const html = `
    <div class="pb-12">
      ${heroHtml}
      <div class="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 space-y-6 sm:space-y-8">
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <div class="lg:col-span-2">${verseHtml}</div>
          <div>${nextEventHtml}</div>
        </section>

        <section>
          ${quickAccessHtml}
        </section>

        <section class="section-with-watermark" data-bg="BLOG" aria-labelledby="section-blog-label">
          <h2 id="section-blog-label" class="sr-only">${t({ pt: 'Blog', en: 'Blog' })}</h2>
          <div class="flex justify-end mb-4">
            <a href="/blog" class="text-sm font-semibold text-primary hover:underline shrink-0">${i18n('see_all')}</a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${blogGrid}</div>
        </section>

        <section class="section-with-watermark" data-bg="${i18n('agenda_watermark')}" aria-labelledby="section-agenda-label">
          <h2 id="section-agenda-label" class="sr-only">${i18n('events_title')}</h2>
          <div class="flex justify-end mb-4">
            <a href="/eventos" class="text-sm font-semibold text-primary hover:underline shrink-0">${i18n('see_all')}</a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${eventsGrid}</div>
        </section>
      </div>
    </div>`;

  return { html, mount: () => mountHome(Array.isArray(banners) ? banners : []) };
}

function mountHome(banners) {
  const header = document.querySelector('.hero-carousel');
  if (header && banners.length > 1) {
    const slides = header.querySelectorAll('.hero-slide');
    const dots = header.querySelectorAll('.hero-dot');
    dots.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        slides.forEach((s, j) => s.classList.toggle('active', j === i));
        dots.forEach((d, j) => d.classList.toggle('active', j === i));
      });
    });
    let idx = 0;
    const advance = () => {
      idx = (idx + 1) % banners.length;
      slides.forEach((s, j) => s.classList.toggle('active', j === idx));
      dots.forEach((d, j) => d.classList.toggle('active', j === idx));
    };
    const interval = setInterval(advance, 5000);
    header.addEventListener('mouseenter', () => clearInterval(interval));
  }
  initHeroParallax();
}
