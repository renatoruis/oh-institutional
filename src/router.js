/* ───────────────────────────────────────────
   Open Heavens – Client-side Router (History API)
   ─────────────────────────────────────────── */

/**
 * Converte path pattern (ex: /sermoes/:id) em regex e extrai params
 * @param {string} pattern - ex: "/sermoes/:id", "/blog/:slug"
 * @returns {{ regex: RegExp, paramNames: string[] }}
 */
function compileRoute(pattern) {
  const paramNames = [];
  const regexSource = pattern
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
  return {
    regex: new RegExp(`^${regexSource}$`),
    paramNames,
  };
}

/**
 * Tenta fazer match de path contra pattern e retorna params ou null
 */
function matchRoute(path, compiled) {
  const m = path.match(compiled.regex);
  if (!m) return null;
  const params = {};
  compiled.paramNames.forEach((name, i) => {
    params[name] = decodeURIComponent(m[i + 1] || '');
  });
  return params;
}

/**
 * Define activePage para nav baseado no view/rota
 */
function routeToActivePage(view, params) {
  const map = {
    Home: 'home',
    Sobre: 'sobre',
    Sermoes: 'sermoes',
    Sermao: 'sermoes',
    Blog: 'blog',
    Post: 'blog',
    Eventos: 'eventos',
    Evento: 'eventos',
    Oracoes: 'oracoes',
    Biblia: 'biblia',
    Avisos: 'avisos',
    Contacto: 'contacto',
    Recursos: 'recursos',
    Pagina: null, // página dinâmica
  };
  return map[view] ?? null;
}

/** @type {{ pattern: string, view: string, compiled: ReturnType<compileRoute> }[]} */
const routes = [];

/** @type {(view: string, params: Record<string, string>) => void} */
let onRouteChangeCallback = null;

/**
 * Regista uma rota
 * @param {string} pattern - ex: "/", "/sermoes", "/sermoes/:id"
 * @param {string} view - nome da view (ex: "Home", "Sermao")
 */
export function route(pattern, view) {
  routes.push({
    pattern,
    view,
    compiled: compileRoute(pattern),
  });
}

/**
 * Resolve o path atual e retorna { view, params } ou null
 */
export function resolve(pathname) {
  const path = pathname || window.location.pathname;
  const pathOnly = path.split('?')[0];
  const normalized = pathOnly === '' ? '/' : pathOnly.replace(/\/$/, '') || '/';

  for (const r of routes) {
    const params = matchRoute(normalized, r.compiled);
    if (params !== null) {
      return { view: r.view, params };
    }
  }
  return null;
}

/**
 * Navega para um path (History API, sem reload)
 * @param {string} path - ex: "/sobre", "/sermoes/123"
 */
export function navigate(path) {
  const clean = path.charAt(0) === '/' ? path : `/${path}`;
  const normalized = clean === '/' ? '/' : clean.replace(/\/$/, '') || '/';

  if (window.location.pathname + window.location.search === normalized) return;

  window.history.pushState({ path: normalized }, '', normalized);
  handleNavigation(normalized);
}

/**
 * Trata popstate (back/forward) e navegação inicial
 */
function handleNavigation(pathname) {
  const result = resolve(pathname);
  const view = result?.view ?? 'NotFound';
  const params = result?.params ?? {};

  const activePage = routeToActivePage(view, params);
  if (onRouteChangeCallback) {
    onRouteChangeCallback(view, params, activePage);
  }

  window.dispatchEvent(
    new CustomEvent('router:change', { detail: { view, params, activePage } })
  );
}

/**
 * Regista callback chamado em cada mudança de rota
 * @param {(view: string, params: Record<string, string>, activePage: string|null) => void} fn
 */
export function onRouteChange(fn) {
  onRouteChangeCallback = fn;
}

/**
 * Inicia o router: popstate + navegação inicial
 */
export function start() {
  window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname);
  });

  handleNavigation(window.location.pathname);
}

/**
 * Liga cliques em links internos ao router (preventDefault + navigate).
 * Usa capture phase para interceptar antes de outros handlers e garantir
 * que links SPA com href="/path" chamem router.navigate() em vez de reload.
 */
export function bindLinks() {
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
      } catch {
        return;
      }

      // Links same-origin: tratar como SPA navigation (preventDefault evita reload)
      const pathname = url.pathname;
      e.preventDefault();
      navigate(pathname);
    },
    { capture: true }
  );
}
