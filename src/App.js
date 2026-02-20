/* ───────────────────────────────────────────
   Open Heavens – App (Layout + Router integration)
   ─────────────────────────────────────────── */

import { start, onRouteChange, bindLinks } from './router.js';
import { renderNav, updateNavActive, closeNavDrawer, renderFooter, updateFooterText, renderScrollTop, setFavicon, applyI18n, setOnLangChangeTrigger } from './shared.js';
import { onLangChange } from './i18n.js';

/** @type {Record<string, (params: Record<string, string>) => string | HTMLElement | Promise<string | HTMLElement | { html: string, mount?: () => void }>>} */
const views = {};

let _currentView = null;
let _currentParams = {};

/**
 * Regista um handler para uma view
 */
export function registerView(name, render) {
  views[name] = render;
}

/**
 * Renderiza a view no container
 */
async function renderView(view, params) {
  const container = document.getElementById('app-content');
  if (!container) return;

  _currentView = view;
  _currentParams = params || {};

  const fn = views[view] ?? views['NotFound'];
  let content = fn ? fn(params) : `<div class="max-w-6xl mx-auto px-4 py-16"><h1 class="text-2xl font-bold">${view}</h1><p>View placeholder</p></div>`;

  if (content && typeof content.then === 'function') {
    content = await content;
  }

  let html = '';
  let mountFn = null;

  if (typeof content === 'object' && content !== null && 'html' in content) {
    html = content.html;
    mountFn = content.mount;
  } else if (typeof content === 'string') {
    html = content;
  } else if (content instanceof HTMLElement) {
    container.innerHTML = '';
    container.appendChild(content);
    if (typeof content.mount === 'function') content.mount();
    return;
  }

  container.innerHTML = html;
  if (typeof mountFn === 'function') mountFn();
}

/**
 * Re-render da view atual (para troca de idioma sem reload)
 */
function reRenderCurrentView() {
  if (_currentView) renderView(_currentView, _currentParams);
}

/**
 * Inicializa a aplicação SPA
 */
export function init() {
  const activePage = getInitialActivePage();
  renderNav(activePage);
  renderFooter();
  renderScrollTop();
  setFavicon();
  applyI18n();
  setOnLangChangeTrigger(reRenderCurrentView);
  onLangChange(updateFooterText);

  bindLinks();

  onRouteChange((view, params, activePage) => {
    if (activePage != null) updateNavActive(activePage);
    closeNavDrawer();
    renderView(view, params);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });

  start();
}

function getInitialActivePage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/' || path === '') return 'home';
  const seg = path.split('/')[1];
  const map = {
    sobre: 'sobre',
    sermoes: 'sermoes',
    blog: 'blog',
    eventos: 'eventos',
    evento: 'eventos',
    oracoes: 'oracoes',
    biblia: 'biblia',
    avisos: 'avisos',
    contacto: 'contacto',
    recursos: 'recursos',
  };
  return map[seg] ?? 'home';
}
