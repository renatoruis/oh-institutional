/* ───────────────────────────────────────────
   Open Heavens – i18n (extraído de shared.js)
   setLang sem reload: callback onLangChange para re-render
   ─────────────────────────────────────────── */

let _lang = localStorage.getItem('oh_lang') || 'pt';

/** @type {(newLang: string) => void[]} */
const _onLangChangeListeners = [];

export const I18N = {
  nav_sermons: { pt: 'Sermões', en: 'Sermons' },
  nav_bible: { pt: 'Bíblia', en: 'Bible' },
  nav_prayer: { pt: 'Oração', en: 'Prayer' },
  nav_events: { pt: 'Agenda', en: 'Events' },
  nav_notices: { pt: 'Avisos', en: 'Notices' },
  see_all: { pt: 'Ver todos →', en: 'See all →' },
  learn_more: { pt: 'Saber mais', en: 'Learn more' },
  all_filter: { pt: 'Todos', en: 'All' },
  verse_label: { pt: 'Versículo do dia', en: 'Verse of the day' },
  next_event_label: { pt: 'Próximo evento', en: 'Next event' },
  sermons_title: { pt: 'Sermões', en: 'Sermons' },
  events_title: { pt: 'Agenda', en: 'Events' },
  /** Watermark vertical da secção Agenda/Events (uppercase). */
  agenda_watermark: { pt: 'AGENDA', en: 'EVENTS' },
  about_title: { pt: 'Sobre Nós', en: 'About Us' },
  join_title: { pt: 'Junta-te a Nós', en: 'Join Us' },
  prayers_title: { pt: 'Pedidos de Oração', en: 'Prayer Requests' },
  prayers_desc: { pt: 'Partilha o teu pedido e ora por outros.', en: 'Share your request and pray for others.' },
  notices_title: { pt: 'Avisos', en: 'Notices' },
  notices_desc: { pt: 'Fica a par das novidades da igreja.', en: 'Stay updated with church news.' },
  sermons_page_title: { pt: 'Sermões', en: 'Sermons' },
  sermons_subtitle: { pt: 'Mensagens que transformam vidas.', en: 'Messages that transform lives.' },
  search_sermons: { pt: 'Pesquisar sermões...', en: 'Search sermons...' },
  no_sermons: { pt: 'Sem sermões encontrados.', en: 'No sermons found.' },
  blog_subtitle: { pt: 'Artigos, reflexões e devocional.', en: 'Articles, reflections and devotionals.' },
  search_placeholder: { pt: 'Pesquisar...', en: 'Search...' },
  no_articles: { pt: 'Sem artigos encontrados.', en: 'No articles found.' },
  featured_label: { pt: 'Destaque', en: 'Featured' },
  read_article: { pt: 'Ler artigo →', en: 'Read article →' },
  events_page_title: { pt: 'Agenda', en: 'Events' },
  events_subtitle: { pt: 'Próximos eventos e atividades.', en: 'Upcoming events and activities.' },
  no_events: { pt: 'Sem eventos de momento.', en: 'No events at the moment.' },
  add_calendar: { pt: 'Adicionar ao calendário', en: 'Add to calendar' },
  notices_page_title: { pt: 'Avisos', en: 'Notices' },
  notices_subtitle: { pt: 'Comunicados e novidades da igreja.', en: 'Church news and announcements.' },
  no_notices: { pt: 'Sem avisos de momento.', en: 'No notices at the moment.' },
  pinned: { pt: 'Fixado', en: 'Pinned' },
  no_extra_content: { pt: 'Sem conteúdo adicional.', en: 'No additional content.' },
  prayers_page_title: { pt: 'Pedidos de Oração', en: 'Prayer Requests' },
  prayers_page_desc: { pt: 'Partilha o teu pedido e ora pela comunidade.', en: 'Share your request and pray for the community.' },
  share_request: { pt: 'Partilha o teu pedido', en: 'Share your request' },
  name_label: { pt: 'Nome', en: 'Name' },
  name_placeholder: { pt: 'O teu nome', en: 'Your name' },
  request_label: { pt: 'Pedido', en: 'Request' },
  request_placeholder: { pt: 'Escreve o teu pedido de oração...', en: 'Write your prayer request...' },
  phone_label: { pt: 'Telefone', en: 'Phone' },
  phone_placeholder: { pt: '+351 ...', en: '+351 ...' },
  optional_label: { pt: 'opcional', en: 'optional' },
  public_request: { pt: 'Pedido público', en: 'Public request' },
  private_request: { pt: 'Pedido privado', en: 'Private request' },
  submit_request: { pt: 'Enviar pedido', en: 'Submit request' },
  sending: { pt: 'A enviar...', en: 'Sending...' },
  request_sent: { pt: 'Pedido enviado com sucesso! Obrigado.', en: 'Request sent successfully! Thank you.' },
  send_error: { pt: 'Erro ao enviar. Tenta novamente.', en: 'Error sending. Try again.' },
  community_requests: { pt: 'Pedidos da comunidade', en: 'Community requests' },
  prayed_for: { pt: 'Orei por ti', en: 'I prayed for you' },
  be_first: { pt: 'Sê o primeiro a partilhar um pedido.', en: 'Be the first to share a request.' },
  bible_title: { pt: 'Bíblia', en: 'Bible' },
  bible_choose_version: { pt: 'Escolhe uma versão para começar a ler.', en: 'Choose a version to start reading.' },
  no_versions: { pt: 'Nenhuma versão disponível.', en: 'No versions available.' },
  no_books: { pt: 'Nenhum livro encontrado.', en: 'No books found.' },
  bible_books_label: { pt: 'Livros', en: 'Books' },
  old_testament: { pt: 'Antigo Testamento', en: 'Old Testament' },
  new_testament: { pt: 'Novo Testamento', en: 'New Testament' },
  chapters_label: { pt: 'Capítulos', en: 'Chapters' },
  chapter_label: { pt: 'Capítulo', en: 'Chapter' },
  no_chapters: { pt: 'Sem capítulos.', en: 'No chapters.' },
  load_error: { pt: 'Não foi possível carregar o capítulo.', en: 'Could not load the chapter.' },
  content_unavailable: { pt: 'Conteúdo não disponível.', en: 'Content not available.' },
  previous_btn: { pt: '← Anterior', en: '← Previous' },
  next_btn: { pt: 'Próximo →', en: 'Next →' },
  about_page_title: { pt: 'Sobre Nós', en: 'About Us' },
  about_page_sub: { pt: 'Uma comunidade de fé em Coimbra.', en: 'A community of faith in Coimbra.' },
  our_mission: { pt: 'A Nossa Missão', en: 'Our Mission' },
  pastors_title: { pt: 'Os Pastores', en: 'The Pastors' },
  service_times_title: { pt: 'Horários', en: 'Service Times' },
  location_title: { pt: 'Localização', en: 'Location' },
  contact_title: { pt: 'Contacta-nos', en: 'Contact Us' },
  contact_sub: { pt: 'Estamos aqui para te ajudar. Envia-nos uma mensagem!', en: 'We are here to help. Send us a message!' },
  email_label: { pt: 'Email', en: 'Email' },
  email_placeholder: { pt: 'email@exemplo.com', en: 'email@example.com' },
  subject_label: { pt: 'Assunto', en: 'Subject' },
  subject_placeholder: { pt: 'Assunto da mensagem', en: 'Message subject' },
  message_label: { pt: 'Mensagem', en: 'Message' },
  message_placeholder: { pt: 'Escreve a tua mensagem...', en: 'Write your message...' },
  send_message: { pt: 'Enviar mensagem', en: 'Send message' },
  message_sent: { pt: 'Mensagem enviada com sucesso! Entraremos em contacto em breve.', en: 'Message sent successfully! We will be in touch soon.' },
  info_title: { pt: 'Informações', en: 'Information' },
  phone_info: { pt: 'Telefone', en: 'Phone' },
  email_info: { pt: 'Email', en: 'Email' },
  address_info: { pt: 'Morada', en: 'Address' },
  resources_title: { pt: 'Recursos', en: 'Resources' },
  resources_subtitle: { pt: 'Materiais e documentos para download.', en: 'Materials and documents for download.' },
  no_resources: { pt: 'Sem recursos disponíveis.', en: 'No resources available.' },
  related_sermons: { pt: 'Sermões relacionados', en: 'Related sermons' },
  no_related_sermons: { pt: 'Sem sermões relacionados.', en: 'No related sermons.' },
  all_sermons: { pt: '← Todos os sermões', en: '← All sermons' },
  views_label: { pt: 'visualizações', en: 'views' },
  sermon_not_found: { pt: 'Sermão não encontrado.', en: 'Sermon not found.' },
  back_to_blog: { pt: '← Voltar ao blog', en: '← Back to blog' },
  footer_pages: { pt: 'Páginas', en: 'Pages' },
  footer_contact: { pt: 'Contacto', en: 'Contact' },
  footer_times: { pt: 'Horários', en: 'Service Times' },
  footer_notices: { pt: 'Avisos', en: 'Notices' },
  footer_resources: { pt: 'Recursos', en: 'Resources' },
  celebration: { pt: 'Celebração', en: 'Celebration' },
  required: { pt: '*', en: '*' },
  download_label: { pt: 'Download', en: 'Download' },
  page_not_found: { pt: 'Página não encontrada.', en: 'Page not found.' },
  back_home: { pt: '← Voltar ao início', en: '← Back to home' },
  event_not_found: { pt: 'Evento não encontrado.', en: 'Event not found.' },
  back_to_events: { pt: '← Voltar à agenda', en: '← Back to events' },
  coming_soon: { pt: 'Em breve.', en: 'Coming soon.' },
  quick_access: { pt: 'Acesso Rápido', en: 'Quick Access' },
  push_notify_desc: { pt: 'Recebe notificações de eventos e novidades!', en: 'Get notifications for events and updates!' },
  push_enable: { pt: 'Ativar', en: 'Enable' },
  push_not_now: { pt: 'Agora não', en: 'Not now' },
  nav_change_lang: { pt: 'Mudar idioma', en: 'Change language' },
  close: { pt: 'Fechar', en: 'Close' },
  loading: { pt: 'A carregar...', en: 'Loading...' },
  about_default: { pt: 'Uma igreja fundamentada no amor de Deus, focada em buscar a Sua Presença e experimentar um grande avivamento pelo poder do Espírito Santo.', en: 'A church founded on God\'s love, focused on seeking His Presence and experiencing a great revival through the power of the Holy Spirit.' },
};

export function getLang() {
  return _lang;
}

/**
 * Define o idioma atual sem reload.
 * Atualiza _lang, localStorage, chama applyI18n() e onLangChange callbacks.
 * @param {string} newLang - ex: 'pt', 'en'
 */
export function setLang(newLang) {
  if (_lang === newLang) return;
  _lang = newLang;
  localStorage.setItem('oh_lang', newLang);
  applyI18n();
  _onLangChangeListeners.forEach(fn => { try { fn(newLang); } catch (e) { console.warn('onLangChange:', e); } });
}

/**
 * Regista callback chamado quando o idioma muda (para re-render da view atual).
 * @param {(newLang: string) => void} fn
 * @returns {() => void} - função para remover o listener
 */
export function onLangChange(fn) {
  _onLangChangeListeners.push(fn);
  return () => {
    const i = _onLangChangeListeners.indexOf(fn);
    if (i >= 0) _onLangChangeListeners.splice(i, 1);
  };
}

export function t(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[_lang] || obj.pt || obj.en || '';
}

export function i18n(key) {
  const entry = I18N[key];
  if (!entry) return key;
  return entry[_lang] || entry.pt || entry.en || key;
}

/**
 * Aplica traduções nos elementos com data-i18n, data-i18n-placeholder, data-i18n-title.
 */
export function applyI18n() {
  const root = document;
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = i18n(key);
    if (val && val !== key) el.textContent = val;
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = i18n(key);
    if (val && val !== key) el.placeholder = val;
  });
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = i18n(key);
    if (val && val !== key) el.title = val;
  });
  document.documentElement.lang = _lang;
}
