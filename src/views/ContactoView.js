/**
 * ContactoView – formulário de contacto + sidebar com info e mapa
 */
import { getChurch, postContact } from '../api/index.js';
import { SectionHeader, FormFeedback } from '../components/index.js';
import { escapeHtml } from '../utils.js';

function i18n(key) {
  return (typeof window !== 'undefined' && typeof window.i18n === 'function')
    ? window.i18n(key) : key;
}

const SOCIAL_ICONS = {
  instagram: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  youtube: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  facebook: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
};

const DEFAULT_MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3054.8!2d-8.4285!3d40.2214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sOpen+Heavens+Church!5e0!3m2!1spt-PT!2spt!4v1&z=15';

export function render() {
  const headerHtml = SectionHeader({
    title: i18n('contact_title') || 'Contacta-nos',
    subtitle: i18n('contact_sub') || 'Estamos aqui para te ajudar. Envia-nos uma mensagem!',
    bgText: 'CONTACT',
  });

  const html = `
    <div class="pt-24 pb-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="mb-10">
          ${headerHtml}
          <p class="text-gray-500 mt-1" data-i18n="contact_sub">${escapeHtml(i18n('contact_sub') || 'Estamos aqui para te ajudar. Envia-nos uma mensagem!')}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <section class="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 fade-in">
            <form id="contact-form" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label for="cf-name" class="form-label"><span data-i18n="name_label">${escapeHtml(i18n('name_label') || 'Nome')}</span> *</label>
                  <input id="cf-name" type="text" required minlength="2" class="form-input" placeholder="${escapeHtml(i18n('name_placeholder') || 'O teu nome')}">
                </div>
                <div>
                  <label for="cf-email" class="form-label"><span data-i18n="email_label">${escapeHtml(i18n('email_label') || 'Email')}</span> *</label>
                  <input id="cf-email" type="email" required class="form-input" placeholder="${escapeHtml(i18n('email_placeholder') || 'email@exemplo.com')}">
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label for="cf-phone" class="form-label"><span data-i18n="phone_label">${escapeHtml(i18n('phone_label') || 'Telefone')}</span> <span class="font-normal text-gray-400">(${escapeHtml(i18n('optional_label') || 'opcional')})</span></label>
                  <input id="cf-phone" type="tel" class="form-input" placeholder="${escapeHtml(i18n('phone_placeholder') || '+351 ...')}">
                </div>
                <div>
                  <label for="cf-subject" class="form-label"><span data-i18n="subject_label">${escapeHtml(i18n('subject_label') || 'Assunto')}</span> <span class="font-normal text-gray-400">(${escapeHtml(i18n('optional_label') || 'opcional')})</span></label>
                  <input id="cf-subject" type="text" class="form-input" placeholder="${escapeHtml(i18n('subject_placeholder') || 'Assunto da mensagem')}">
                </div>
              </div>
              <div>
                <label for="cf-message" class="form-label"><span data-i18n="message_label">${escapeHtml(i18n('message_label') || 'Mensagem')}</span> *</label>
                <textarea id="cf-message" required minlength="5" rows="5" class="form-input" placeholder="${escapeHtml(i18n('message_placeholder') || 'Escreve a tua mensagem...')}"></textarea>
              </div>
              <input type="text" name="company" id="cf-hp" class="hidden" tabindex="-1" autocomplete="off">
              <div id="cf-feedback"></div>
              <button id="cf-submit" type="submit" class="btn-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                <span data-i18n="send_message">${escapeHtml(i18n('send_message') || 'Enviar mensagem')}</span>
              </button>
            </form>
          </section>

          <aside class="space-y-6 fade-in fade-in-delay-1">
            <div class="rounded-2xl bg-dark p-6 text-white space-y-5">
              <h3 class="text-sm font-bold text-primary tracking-wider uppercase" data-i18n="info_title">${escapeHtml(i18n('info_title') || 'Informações')}</h3>
              <div id="contact-info" class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <div>
                    <p class="text-xs text-white/40 mb-0.5" data-i18n="phone_info">${escapeHtml(i18n('phone_info') || 'Telefone')}</p>
                    <p id="ci-phone" class="text-sm text-white/80">+351 927 280 242</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <div>
                    <p class="text-xs text-white/40 mb-0.5" data-i18n="email_info">${escapeHtml(i18n('email_info') || 'Email')}</p>
                    <p id="ci-email" class="text-sm text-white/80">info@openheavens.pt</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <div>
                    <p class="text-xs text-white/40 mb-0.5" data-i18n="address_info">${escapeHtml(i18n('address_info') || 'Morada')}</p>
                    <p id="ci-address" class="text-sm text-white/80">Open Heavens Church, Estrada de Coselhas, Coimbra</p>
                  </div>
                </div>
              </div>
              <div id="ci-social" class="flex gap-2 pt-3 border-t border-white/10"></div>
            </div>
            <div id="map-container" class="rounded-2xl overflow-hidden border border-gray-200">
              <iframe id="map-iframe" class="w-full h-[240px]" frameborder="0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${escapeHtml(DEFAULT_MAP_SRC)}"></iframe>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  getChurch().then((c) => {
    if (!c) return;
    const phoneEl = wrapper.querySelector('#ci-phone');
    const emailEl = wrapper.querySelector('#ci-email');
    const addressEl = wrapper.querySelector('#ci-address');
    const mapIframe = wrapper.querySelector('#map-iframe');
    const socialEl = wrapper.querySelector('#ci-social');

    if (c.phone && phoneEl) phoneEl.textContent = c.phone;
    if (c.email && emailEl) emailEl.textContent = c.email;
    if (c.address && addressEl) addressEl.textContent = c.address;

    if (c.lat != null && c.lng != null && mapIframe) {
      mapIframe.src = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3054!2d${c.lng}!3d${c.lat}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sOpen+Heavens+Church!5e0!3m2!1spt-PT!2spt!4v1`;
    }

    if (c.social_links?.length && socialEl) {
      socialEl.innerHTML = c.social_links
        .map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-dark transition" title="${escapeHtml(s.platform || '')}">${SOCIAL_ICONS[s.platform] || s.platform}</a>`)
        .join('');
    }
  });

  wrapper.querySelector('#contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = wrapper.querySelector('#cf-submit');
    const feedbackEl = wrapper.querySelector('#cf-feedback');
    const hp = wrapper.querySelector('#cf-hp')?.value || '';

    const body = {
      name: wrapper.querySelector('#cf-name')?.value?.trim() || '',
      email: wrapper.querySelector('#cf-email')?.value?.trim() || '',
      message: wrapper.querySelector('#cf-message')?.value?.trim() || '',
      honeypot: hp || undefined,
    };
    const phone = wrapper.querySelector('#cf-phone')?.value?.trim();
    const subject = wrapper.querySelector('#cf-subject')?.value?.trim();
    if (phone) body.phone = phone;
    if (subject) body.subject = subject;

    btn.disabled = true;
    btn.innerHTML = `<span>${i18n('sending') || 'A enviar...'}</span>`;
    feedbackEl.innerHTML = '';
    feedbackEl.className = '';

    try {
      await postContact(body);
      feedbackEl.innerHTML = FormFeedback({ type: 'success', message: i18n('message_sent') || 'Mensagem enviada com sucesso! Entraremos em contacto em breve.' });
      wrapper.querySelector('#contact-form')?.reset();
    } catch (err) {
      feedbackEl.innerHTML = FormFeedback({ type: 'error', message: err.message || i18n('send_error') || 'Erro ao enviar.' });
    }

    btn.disabled = false;
    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> <span data-i18n="send_message">${i18n('send_message')}</span>`;
  });

  return wrapper;
}
