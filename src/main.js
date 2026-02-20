/* ───────────────────────────────────────────
   Open Heavens – SPA Entry Point
   ─────────────────────────────────────────── */

import { route } from './router.js';
import { init, registerView } from './App.js';
import { i18n } from './i18n.js';
import { render as HomeView } from './views/HomeView.js';
import { render as SobreView } from './views/SobreView.js';
import { render as SermoesView, mount as SermoesViewMount } from './views/SermoesView.js';
import { render as SermaoView } from './views/SermaoView.js';
import { render as BlogView } from './views/BlogView.js';
import { render as PostView } from './views/PostView.js';
import { render as EventosView } from './views/EventosView.js';
import { render as EventoView } from './views/EventoView.js';
import { render as OracoesView } from './views/OracoesView.js';
import { render as BibliaView } from './views/BibliaView.js';
import { render as AvisosView } from './views/AvisosView.js';
import { render as RecursosView } from './views/RecursosView.js';
import { render as PaginaView } from './views/PaginaView.js';
import { render as ContactoView } from './views/ContactoView.js';

// Registo de rotas
route('/', 'Home');
route('/sobre', 'Sobre');
route('/sermoes', 'Sermoes');
route('/sermoes/:id', 'Sermao');
route('/blog', 'Blog');
route('/blog/:slug', 'Post');
route('/eventos', 'Eventos');
route('/evento/:id', 'Evento');
route('/oracoes', 'Oracoes');
route('/biblia', 'Biblia');
route('/avisos', 'Avisos');
route('/contacto', 'Contacto');
route('/recursos', 'Recursos');
route('/pagina/:slug', 'Pagina');

registerView('Home', HomeView);
registerView('Sobre', SobreView);
registerView('Sermoes', SermoesView);
registerView('SermoesMount', SermoesViewMount);
registerView('Sermao', SermaoView);
registerView('Blog', BlogView);
registerView('Post', PostView);
registerView('Eventos', EventosView);
registerView('Evento', EventoView);
registerView('Oracoes', OracoesView);
registerView('Biblia', BibliaView);
registerView('Avisos', AvisosView);
registerView('Recursos', RecursosView);
registerView('Pagina', PaginaView);
registerView('Contacto', ContactoView);

registerView('NotFound', () => `
  <div class="max-w-6xl mx-auto px-4 py-16 text-center">
    <h1 class="text-3xl font-bold text-dark">404</h1>
    <p class="mt-2 text-gray-600">${i18n('page_not_found')}</p>
    <a href="/" class="btn-primary mt-4 inline-block">${i18n('back_home')}</a>
  </div>
`);

init();
