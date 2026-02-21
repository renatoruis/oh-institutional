/**
 * OracoesView – formulário de pedido + lista pública com "Orei por ti"
 */
import { getPrayers, postPrayer, postPray } from '../api/index.js';
import { SectionHeader, Pagination, PaginationMount, EmptyState, Skeleton, FormFeedback } from '../components/index.js';
import { escapeHtml, formatDateShort } from '../utils.js';
import { i18n } from '../i18n.js';

const LIMIT = 10;

export function render() {
  let isPublic = true;

  function togglePublic() {
    isPublic = !isPublic;
    const track = wrapper.querySelector('#pf-toggle');
    const label = wrapper.querySelector('#pf-toggle-label');
    if (track) track.classList.toggle('active', isPublic);
    if (label) label.textContent = isPublic ? i18n('public_request') : i18n('private_request');
  }

  const headerHtml = SectionHeader({
    title: i18n('prayers_page_title') || 'Pedidos de Oração',
    subtitle: i18n('prayers_page_desc') || 'Partilha o teu pedido e ora pela comunidade.',
    bgText: 'PRAYER',
  });

  const formHtml = `
    <section class="rounded-2xl gradient-green p-6 sm:p-8 mb-10 relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-primary/[0.05]"></div>
      <div class="relative">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 class="text-lg font-bold text-white" data-i18n="share_request">${escapeHtml(i18n('share_request') || 'Partilha o teu pedido')}</h2>
        </div>
        <form id="prayer-form" class="space-y-4">
          <div>
            <label for="pf-name" class="block text-sm font-semibold text-white/70 mb-1" data-i18n="name_label">${escapeHtml(i18n('name_label') || 'Nome')}</label>
            <input id="pf-name" type="text" required minlength="2" class="form-input bg-white/10 border-white/15 text-white placeholder:text-white/30 focus:border-primary" placeholder="${escapeHtml(i18n('name_placeholder') || 'O teu nome')}">
          </div>
          <div>
            <label for="pf-message" class="block text-sm font-semibold text-white/70 mb-1" data-i18n="request_label">${escapeHtml(i18n('request_label') || 'Pedido')}</label>
            <textarea id="pf-message" required minlength="5" rows="4" class="form-input bg-white/10 border-white/15 text-white placeholder:text-white/30 focus:border-primary" placeholder="${escapeHtml(i18n('request_placeholder') || 'Escreve o teu pedido de oração...')}"></textarea>
          </div>
          <div>
            <label for="pf-phone" class="block text-sm font-semibold text-white/70 mb-1">
              <span data-i18n="phone_label">${escapeHtml(i18n('phone_label') || 'Telefone')}</span>
              <span class="font-normal text-white/40"> (${escapeHtml(i18n('optional_label') || 'opcional')})</span>
            </label>
            <input id="pf-phone" type="tel" class="form-input bg-white/10 border-white/15 text-white placeholder:text-white/30 focus:border-primary" placeholder="${escapeHtml(i18n('phone_placeholder') || '+351 ...')}">
          </div>
          <div class="flex items-center gap-3">
            <div id="pf-toggle" class="toggle-track active" data-toggle>
              <div class="toggle-thumb"></div>
            </div>
            <span id="pf-toggle-label" class="text-sm text-white/70">${escapeHtml(i18n('public_request') || 'Pedido público')}</span>
          </div>
          <input type="text" name="website" id="pf-hp" class="hidden" tabindex="-1" autocomplete="off">
          <div id="pf-feedback"></div>
          <button id="pf-submit" type="submit" class="btn-primary w-full justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            <span data-i18n="submit_request">${escapeHtml(i18n('submit_request') || 'Enviar pedido')}</span>
          </button>
        </form>
      </div>
    </section>
  `;

  const listHeader = SectionHeader({
    title: i18n('community_requests') || 'Pedidos da comunidade',
    bgText: 'COMMUNITY',
  });

  const html = `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="mb-8">
          ${headerHtml}
          <p class="text-gray-500 mt-1" data-i18n="prayers_page_desc">${escapeHtml(i18n('prayers_page_desc') || 'Partilha o teu pedido e ora pela comunidade.')}</p>
        </div>
        ${formHtml}
        <section>
          <div class="section-header mb-5">${listHeader}</div>
          <div id="prayers-list" class="space-y-4">
            ${Skeleton({ variant: 'listItem', count: 3 })}
          </div>
          <div id="prayers-pagination" class="mt-8"></div>
        </section>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  wrapper.querySelector('#pf-toggle')?.addEventListener('click', togglePublic);

  let currentOffset = 0;

  function prayerCard(p) {
    const prayCount = p.pray_count || 0;
    return `
      <div class="rounded-2xl bg-white border border-gray-200 p-5 fade-in" data-prayer-id="${escapeHtml(String(p.id))}">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
            ${escapeHtml((p.name || '?')[0].toUpperCase())}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-dark">${escapeHtml(p.name)}</span>
              <span class="text-xs text-gray-400">${formatDateShort(p.created_at)}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1.5 leading-relaxed">${escapeHtml(p.message)}</p>
          </div>
        </div>
        <div class="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
          <button class="pray-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-primary hover:bg-primary/10 transition" data-id="${escapeHtml(String(p.id))}">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ${i18n('prayed_for') || 'Orei por ti'} <span class="pray-count">${prayCount > 0 ? '(' + prayCount + ')' : ''}</span>
          </button>
        </div>
      </div>
    `;
  }

  async function loadPrayers() {
    const list = wrapper.querySelector('#prayers-list');
    const pagEl = wrapper.querySelector('#prayers-pagination');

    list.innerHTML = Skeleton({ variant: 'listItem', count: 3 });

    const { items, total } = await getPrayers({ limit: LIMIT, offset: currentOffset });

    if (!items.length) {
      list.innerHTML = EmptyState({
        message: i18n('be_first') || 'Sê o primeiro a partilhar um pedido.',
        icon: '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>',
      });
    } else {
      list.innerHTML = items.map(prayerCard).join('');
      list.querySelectorAll('.pray-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          if (!id || btn.disabled) return;
          try {
            await postPray(id);
            btn.classList.add('text-primary');
            const countEl = btn.querySelector('.pray-count');
            const current = parseInt(countEl.textContent.replace(/\D/g, '') || '0', 10);
            countEl.textContent = `(${current + 1})`;
            btn.disabled = true;
            btn.style.opacity = '0.7';
          } catch (err) {
            console.warn('pray error:', err);
          }
        });
      });
    }

    if (Math.ceil(total / LIMIT) > 1) {
      pagEl.innerHTML = '<div class="pagination mt-8">' + Pagination({ total, limit: LIMIT, offset: currentOffset }) + '</div>';
      PaginationMount(wrapper, { limit: LIMIT, onPage: (off) => { currentOffset = off; loadPrayers(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
    } else {
      pagEl.innerHTML = '';
    }
  }

  wrapper.querySelector('#prayer-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = wrapper.querySelector('#pf-submit');
    const feedbackEl = wrapper.querySelector('#pf-feedback');
    const hp = wrapper.querySelector('#pf-hp')?.value || '';

    const body = {
      name: wrapper.querySelector('#pf-name')?.value?.trim() || '',
      message: wrapper.querySelector('#pf-message')?.value?.trim() || '',
      is_public: isPublic,
      honeypot: hp || undefined,
    };
    const phone = wrapper.querySelector('#pf-phone')?.value?.trim();
    if (phone) body.phone = phone;

    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<span>${i18n('sending') || 'A enviar...'}</span>`;
    feedbackEl.innerHTML = '';
    feedbackEl.className = '';

    try {
      const result = await postPrayer(body);
      const hasError = result === null || (typeof result === 'object' && result?.error);
      if (hasError) {
        const errMsg = (typeof result === 'object' && result?.error) ? String(result.error) : (i18n('send_error') || 'Erro ao enviar.');
        feedbackEl.innerHTML = FormFeedback({ type: 'error', message: errMsg });
      } else {
        feedbackEl.innerHTML = FormFeedback({ type: 'success', message: i18n('request_sent') || 'Pedido enviado com sucesso! Obrigado.' });
        feedbackEl.classList.remove('hidden');
        wrapper.querySelector('#prayer-form')?.reset();
        isPublic = true;
        wrapper.querySelector('#pf-toggle')?.classList.add('active');
        wrapper.querySelector('#pf-toggle-label').textContent = i18n('public_request');
        loadPrayers();
      }
    } catch (err) {
      feedbackEl.innerHTML = FormFeedback({ type: 'error', message: err.message || i18n('send_error') || 'Erro ao enviar.' });
    }

    btn.disabled = false;
    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> <span data-i18n="submit_request">${i18n('submit_request')}</span>`;
  });

  loadPrayers();
  return wrapper;
}
