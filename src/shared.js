/* ───────────────────────────────────────────
   Open Heavens – Shared utilities (SPA)
   Importa i18n de src/i18n.js
   ─────────────────────────────────────────── */

import { t, i18n, applyI18n, getLang, setLang } from './i18n.js';
import { getChurch } from './api/index.js';
import { fetchAPI, API_BASE } from './api/client.js';
import { escapeHtml } from './utils.js';

export { t, i18n, applyI18n, getLang, setLang, escapeHtml, getChurch, fetchAPI, API_BASE };
export { renderNav, updateNavActive, closeNavDrawer, renderFooter, updateFooterText, renderScrollTop, renderPushBanner, setFavicon, showToast };
export { getYouTubeId, initHeroParallax, formatDate, formatDateShort, formatTime, getUrlParam, truncate };
export { skeleton, cardSkeleton, repeatSkeleton };

/* ── YouTube ID extractor ── */
function getYouTubeId(url) {
  if (!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/live\/)([^&?\s\/]+)/);
  return m ? m[1] : '';
}

/* ── Hero parallax ──────────────────────── */
function initHeroParallax() {
  const hero = document.querySelector('header');
  if (!hero) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const imgs = hero.querySelectorAll('.hero-slide img');
        const gradientDivs = hero.querySelectorAll('.hero-slide > div:first-child');
        const speed = 0.4;
        imgs.forEach(img => { img.style.transform = `translateY(${y * speed}px) scale(1.1)`; });
        gradientDivs.forEach(d => {
          if (d.classList.contains('bg-gradient-to-br')) d.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function formatDate(dateStr, opts) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'pt-PT', opts || { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(dateStr) {
  return formatDate(dateStr, { day: 'numeric', month: 'short' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleTimeString(getLang() === 'en' ? 'en-GB' : 'pt-PT', { hour: '2-digit', minute: '2-digit' });
}

function getUrlParam(key) {
  return new URLSearchParams(location.search).get(key);
}

function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function skeleton(cls = '') {
  return `<div class="skeleton ${cls}"></div>`;
}

function cardSkeleton() {
  return `<div class="rounded-2xl bg-white border border-gray-200 overflow-hidden">
    <div class="skeleton h-44 w-full"></div>
    <div class="p-4 space-y-2">
      <div class="skeleton h-4 w-3/4 rounded"></div>
      <div class="skeleton h-3 w-1/2 rounded"></div>
    </div>
  </div>`;
}

function repeatSkeleton(n, fn) {
  return Array.from({ length: n }, () => (fn || cardSkeleton)()).join('');
}

/* ── Nav ─────────────────────────────────── */
const NAV_LINKS = [
  { href: '/', path: '/', label: { pt: 'Início', en: 'Home' }, id: 'home' },
  { href: '/sobre', path: '/sobre', label: { pt: 'Sobre', en: 'About' }, id: 'sobre' },
  { href: '/sermoes', path: '/sermoes', label: { pt: 'Sermões', en: 'Sermons' }, id: 'sermoes' },
  { href: '/blog', path: '/blog', label: { pt: 'Blog', en: 'Blog' }, id: 'blog' },
  { href: '/eventos', path: '/eventos', label: { pt: 'Agenda', en: 'Events' }, id: 'eventos' },
  { href: '/oracoes', path: '/oracoes', label: { pt: 'Oração', en: 'Prayer' }, id: 'oracoes' },
  { href: '/biblia', path: '/biblia', label: { pt: 'Bíblia', en: 'Bible' }, id: 'biblia' },
  { href: '/avisos', path: '/avisos', label: { pt: 'Avisos', en: 'Notices' }, id: 'avisos' },
  { href: '/recursos', path: '/recursos', label: { pt: 'Recursos', en: 'Resources' }, id: 'recursos' },
  { href: '/contacto', path: '/contacto', label: { pt: 'Contacto', en: 'Contact' }, id: 'contacto' },
];

/** @type {(() => void) | null} */
let _onLangChangeTrigger = null;

export function setOnLangChangeTrigger(fn) {
  _onLangChangeTrigger = fn;
}

function closeNavDrawer() {
  const overlay = document.getElementById('nav-drawer-overlay');
  const drawer = document.getElementById('nav-drawer');
  if (overlay) overlay.classList.remove('active');
  if (drawer) drawer.classList.remove('open');
  document.body.classList.remove('nav-drawer-open');
}

function openNavDrawer() {
  const overlay = document.getElementById('nav-drawer-overlay');
  const drawer = document.getElementById('nav-drawer');
  if (overlay) overlay.classList.add('active');
  if (drawer) drawer.classList.add('open');
  document.body.classList.add('nav-drawer-open');
}

function renderNav(activePage) {
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.className = 'fixed top-0 left-0 right-0 z-50 bg-[#F5F5F5]/90 backdrop-blur-lg border-b border-gray-200/60 transition-shadow';
  const linkHref = (l) => l.path || l.href || l.href;
  const nextLang = getLang() === 'pt' ? 'en' : 'pt';
  nav.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
      <a href="${NAV_LINKS[0]?.path || '/'}" class="flex items-center shrink-0" aria-label="Open Heavens - ${t(NAV_LINKS[0]?.label || { pt: 'Início', en: 'Home' })}">
        <img id="nav-logo" src="https://cdn.weserve.one/church-app/default/4b9a2c45-4dae-4778-8945-a692a12d7f8a.png" alt="Open Heavens" class="h-16 sm:h-20 w-auto object-contain">
      </a>
      <div class="flex items-center gap-2">
        <button id="nav-lang-btn" data-next-lang="${nextLang}" class="text-xs font-bold px-2.5 py-1 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition" title="${i18n('nav_change_lang')}">${getLang() === 'pt' ? 'EN' : 'PT'}</button>
        <button id="nav-toggle" class="p-2 -mr-2 text-dark hover:text-primary transition" aria-label="Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>`;
  document.body.prepend(nav);

  const overlay = document.createElement('div');
  overlay.id = 'nav-drawer-overlay';
  overlay.className = 'nav-drawer-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  const drawer = document.createElement('aside');
  drawer.id = 'nav-drawer';
  drawer.className = 'nav-drawer';
  drawer.setAttribute('aria-label', 'Menu de navegação');
  drawer.innerHTML = `
    <div class="nav-drawer-inner">
      <div class="flex items-center justify-between py-4 px-4 border-b border-white/10">
        <a href="/" class="flex items-center shrink-0" aria-label="Open Heavens - ${t(NAV_LINKS[0]?.label || { pt: 'Início', en: 'Home' })}">
          <img id="nav-drawer-logo" src="https://cdn.weserve.one/church-app/default/4b9a2c45-4dae-4778-8945-a692a12d7f8a.png" alt="Open Heavens" class="h-10 w-auto object-contain">
        </a>
        <button id="nav-drawer-close" class="p-2 -mr-2 text-white/80 hover:text-primary transition" aria-label="${i18n('close')}">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="flex flex-col gap-1 p-4 overflow-y-auto">
        ${NAV_LINKS.map(l => `<a href="${linkHref(l)}" class="nav-drawer-link ${l.id === activePage ? 'nav-drawer-link-active' : ''}" data-page-id="${l.id}">${t(l.label)}</a>`).join('')}
      </nav>
    </div>`;
  document.body.appendChild(drawer);

  document.getElementById('nav-lang-btn')?.addEventListener('click', () => {
    const next = document.getElementById('nav-lang-btn')?.dataset.nextLang || 'en';
    setLang(next);
    const btn = document.getElementById('nav-lang-btn');
    if (btn) { btn.textContent = next === 'pt' ? 'EN' : 'PT'; btn.dataset.nextLang = next === 'pt' ? 'en' : 'pt'; }
    document.querySelectorAll('#main-nav [data-page-id], #nav-drawer [data-page-id]').forEach(a => {
      const link = NAV_LINKS.find(l => l.id === a.dataset.pageId);
      if (link) a.textContent = t(link.label);
    });
    if (_onLangChangeTrigger) _onLangChangeTrigger();
  });

  document.getElementById('nav-toggle')?.addEventListener('click', openNavDrawer);

  document.getElementById('nav-drawer-close')?.addEventListener('click', closeNavDrawer);

  document.getElementById('nav-drawer-overlay')?.addEventListener('click', closeNavDrawer);

  document.querySelectorAll('#nav-drawer a[href]').forEach(link => {
    link.addEventListener('click', () => closeNavDrawer());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('nav-drawer');
      if (drawer?.classList.contains('open')) closeNavDrawer();
    }
  });

  let lastY = 0;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('shadow-md', window.scrollY > 10);
    if (window.scrollY > 300 && window.scrollY > lastY) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = '';
    }
    lastY = window.scrollY;
  }, { passive: true });

  getChurch().then(c => {
    if (!c) return;
    if (c.logo_url) {
      const logo = document.getElementById('nav-logo');
      const drawerLogo = document.getElementById('nav-drawer-logo');
      if (logo) logo.src = c.logo_url;
      if (drawerLogo) drawerLogo.src = c.logo_url;
    }
    if (c.primary_color) {
      document.documentElement.style.setProperty('--primary', c.primary_color);
      document.documentElement.style.setProperty('--primary-dark', c.primary_color);
    }
  });
}

function updateNavActive(activePage) {
  document.querySelectorAll('#nav-drawer [data-page-id]').forEach(a => {
    const isActive = a.dataset.pageId === activePage;
    a.classList.toggle('nav-drawer-link-active', isActive);
  });
}

function updateFooterText() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  footer.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = i18n(key);
    if (val && val !== key) el.textContent = val;
  });
  footer.querySelectorAll('[data-page-id]').forEach(a => {
    const link = NAV_LINKS.find(l => l.id === a.dataset.pageId);
    if (link) a.textContent = t(link.label);
  });
}

function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'bg-dark text-white';
  footer.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img id="footer-logo" src="https://cdn.weserve.one/church-app/default/4b9a2c45-4dae-4778-8945-a692a12d7f8a.png" alt="Open Heavens" class="h-10 w-auto mb-4">
          <p id="footer-about" class="text-sm text-white/60 leading-relaxed">Somos uma comunidade de fé, unidos pelo amor de Cristo.</p>
        </div>
        <div>
          <h4 data-i18n="footer_pages" class="text-sm font-bold text-primary mb-4 tracking-wider uppercase">${i18n('footer_pages')}</h4>
          <nav class="flex flex-col gap-2">
            ${NAV_LINKS.map(l => `<a href="${l.path || l.href}" data-page-id="${l.id}" class="text-sm text-white/60 hover:text-primary transition">${t(l.label)}</a>`).join('')}
            <a href="/avisos" data-i18n="footer_notices" class="text-sm text-white/60 hover:text-primary transition">${i18n('footer_notices')}</a>
            <a href="/recursos" data-i18n="footer_resources" class="text-sm text-white/60 hover:text-primary transition">${i18n('footer_resources')}</a>
          </nav>
        </div>
        <div>
          <h4 data-i18n="footer_contact" class="text-sm font-bold text-primary mb-4 tracking-wider uppercase">${i18n('footer_contact')}</h4>
          <div id="footer-contact" class="space-y-2 text-sm text-white/60">
            <p data-i18n="loading">${i18n('loading')}</p>
          </div>
        </div>
        <div>
          <h4 data-i18n="footer_times" class="text-sm font-bold text-primary mb-4 tracking-wider uppercase">${i18n('footer_times')}</h4>
          <div id="footer-times" class="space-y-2 text-sm text-white/60">
            <p data-i18n="loading">${i18n('loading')}</p>
          </div>
        </div>
      </div>
      <div id="footer-social" class="flex flex-wrap gap-3 mt-10 pt-8 border-t border-white/10"></div>
      <p id="footer-copy" class="mt-6 text-xs text-white/30">&copy; Open Heavens Church Coimbra</p>
    </div>`;
  document.body.appendChild(footer);

  getChurch().then(c => {
    if (!c) return;
    if (c.logo_url) document.getElementById('footer-logo').src = c.logo_url;
    if (c.about_text) document.getElementById('footer-about').textContent = c.about_text;
    if (c.copyright_text) document.getElementById('footer-copy').textContent = c.copyright_text;

    const contact = document.getElementById('footer-contact');
    contact.innerHTML = '';
    if (c.phone) contact.innerHTML += `<p><a href="tel:${c.phone.replace(/\s/g, '')}" class="hover:text-primary transition">${c.phone}</a></p>`;
    if (c.email) contact.innerHTML += `<p><a href="mailto:${c.email}" class="hover:text-primary transition">${c.email}</a></p>`;
    if (c.address) contact.innerHTML += `<p>${escapeHtml(c.address)}</p>`;

    const times = document.getElementById('footer-times');
    if (c.service_times?.length) {
      times.innerHTML = c.service_times.map(s => `<p><strong class="text-white/80">${s.time}</strong> — ${s.label}</p>`).join('');
    }

    const social = document.getElementById('footer-social');
    const icons = {
      instagram: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
      youtube: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
      facebook: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    };
    if (c.social_links?.length) {
      social.innerHTML = c.social_links.map(s =>
        `<a href="${s.url}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-dark transition" title="${s.platform}">${icons[s.platform] || s.platform}</a>`
      ).join('');
    }
  });
}

function renderScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.className = 'fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-dark text-primary shadow-lg flex items-center justify-center opacity-0 translate-y-4 pointer-events-none transition-all duration-300';
  btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    btn.classList.toggle('opacity-0', !show);
    btn.classList.toggle('translate-y-4', !show);
    btn.classList.toggle('pointer-events-none', !show);
  }, { passive: true });
}

function renderPushBanner() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  if (localStorage.getItem('oh_push_dismissed')) return;

  const banner = document.createElement('div');
  banner.id = 'push-banner';
  banner.className = 'fixed bottom-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-lg border-t border-white/10 px-4 py-3 transform translate-y-full transition-transform duration-500';
  banner.innerHTML = `
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
        <p class="text-sm text-white/80 truncate">${i18n('push_notify_desc')}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button id="push-accept" class="btn-primary text-xs px-3 py-1.5">${i18n('push_enable')}</button>
        <button id="push-dismiss" class="text-white/40 hover:text-white/70 text-xs px-2 py-1 transition">${i18n('push_not_now')}</button>
      </div>
    </div>`;
  document.body.appendChild(banner);

  setTimeout(() => banner.style.transform = 'translateY(0)', 3000);

  document.getElementById('push-dismiss').addEventListener('click', () => {
    banner.style.transform = 'translateY(100%)';
    localStorage.setItem('oh_push_dismissed', '1');
    setTimeout(() => banner.remove(), 500);
  });

  document.getElementById('push-accept').addEventListener('click', async () => {
    try {
      const vapidRes = await fetchAPI('/api/push/vapid-key');
      if (!vapidRes?.key) throw new Error('No VAPID key');

      const reg = await navigator.serviceWorker.register('/sw.js');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidRes.key),
      });
      const json = sub.toJSON();
      await fetch(`${API_BASE}/api/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      banner.style.transform = 'translateY(100%)';
      localStorage.setItem('oh_push_dismissed', '1');
    } catch (e) {
      console.warn('Push subscription failed:', e);
      banner.style.transform = 'translateY(100%)';
      localStorage.setItem('oh_push_dismissed', '1');
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

function setFavicon() {
  getChurch().then(c => {
    if (!c?.favicon_url) return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = c.favicon_url;
  });
}

function showToast(msg, type = 'success') {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}
