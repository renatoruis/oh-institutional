/**
 * Sobre Nós – conteúdo da church (getChurch), pastores, horários, localização
 */
import { getChurch } from '../api/index.js';
import { escapeHtml } from '../utils.js';
import { i18n, t } from '../i18n.js';

export async function render() {
  const c = await getChurch();
  const aboutText = c?.about_text || i18n('about_default');

  let heroesHtml = '';
  if (c?.og_image_url) {
    heroesHtml = `<img src="${escapeHtml(c.og_image_url)}" alt="Open Heavens Church" class="absolute inset-0 w-full h-full object-cover opacity-60">`;
  }

  let pastorsHtml = '';
  const pastors = c?.pastors ?? [];
  if (pastors.length) {
    pastorsHtml = pastors.map(p => {
      const name = escapeHtml(p.name || p.title || '');
      const desc = escapeHtml(t(p.bio_i18n) || t(p.description_i18n) || p.bio || p.description || '');
      const img = p.photo_url || p.image_url || 'https://cdn.weserve.one/church-app/default/b8aae5e5-719b-4a16-947f-a281f63ed16d.png';
      return `<div class="rounded-2xl bg-dark p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8 fade-in">
        <div class="w-40 h-40 rounded-2xl bg-white/10 overflow-hidden shrink-0">
          <img src="${escapeHtml(img)}" alt="${name}" class="w-full h-full object-cover">
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">${name}</h3>
          <p class="text-white/50 text-sm mt-3 leading-relaxed">${desc}</p>
        </div>
      </div>`;
    }).join('');
  } else {
    pastorsHtml = `<div class="rounded-2xl bg-dark p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8 fade-in">
      <div class="w-40 h-40 rounded-2xl bg-white/10 overflow-hidden shrink-0">
        <img src="https://cdn.weserve.one/church-app/default/b8aae5e5-719b-4a16-947f-a281f63ed16d.png" alt="Pastores" class="w-full h-full object-cover">
      </div>
      <div>
        <h3 class="text-xl font-bold text-white">Pastor João & Gena Carvalho</h3>
        <p class="text-white/50 text-sm mt-3 leading-relaxed">Fundadores da Open Heavens Church em Coimbra. O seu coração arde por Coimbra e por trazer Jesus à cidade.</p>
      </div>
    </div>`;
  }

  let timesHtml = '';
  const serviceTimes = c?.service_times ?? [];
  if (serviceTimes.length) {
    timesHtml = serviceTimes.map(s => `
      <div class="rounded-2xl bg-white border border-gray-200 p-5 flex items-center gap-4 card-hover">
        <div class="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        </div>
        <div>
          <p class="text-lg font-bold text-dark">${escapeHtml((s.day ? s.day + ' ' : '') + (s.time || ''))}</p>
          <p class="text-sm text-gray-500">${escapeHtml(s.label || i18n('celebration'))}</p>
        </div>
      </div>
    `).join('');
  } else {
    timesHtml = `<div class="rounded-2xl bg-white border border-gray-200 p-5 flex items-center gap-4 card-hover">
      <div class="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
        <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
      </div>
      <div>
        <p class="text-lg font-bold text-dark">Domingo 10:00</p>
        <p class="text-sm text-gray-500">${i18n('celebration')}</p>
      </div>
    </div>`;
  }

  const address = c?.address || 'Open Heavens Church, Estrada de Coselhas, Coimbra';
  const mapSrc = (c?.lat && c?.lng)
    ? `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3054!2d${c.lng}!3d${c.lat}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sOpen+Heavens+Church!5e0!3m2!1spt-PT!2spt!4v1`
    : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3054.8!2d-8.4285!3d40.2214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sOpen+Heavens+Church!5e0!3m2!1spt-PT!2spt!4v1&z=15';

  return `
  <div class="pt-0 pb-16">
    <div class="relative h-[280px] sm:h-[340px] overflow-hidden bg-dark">
      ${heroesHtml}
      <div class="absolute inset-0 bg-gradient-to-t from-dark/80 to-dark/20"></div>
      <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white" data-i18n="about_page_title">${i18n('about_page_title')}</h1>
        <p class="text-white/60 text-lg mt-2 max-w-lg" data-i18n="about_page_sub">${i18n('about_page_sub')}</p>
      </div>
    </div>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 space-y-10">
      <section class="rounded-2xl bg-white border border-gray-200 p-6 sm:p-10 fade-in">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <div class="section-header" data-bg="MISSION">
            <h2 class="section-title" data-i18n="our_mission">${i18n('our_mission')}</h2>
          </div>
        </div>
        <p class="text-gray-600 leading-relaxed text-[15px]">${escapeHtml(aboutText)}</p>
      </section>
      <section class="fade-in fade-in-delay-1">
        <div class="section-header mb-6" data-bg="PASTORS">
          <h2 class="section-title" data-i18n="pastors_title">${i18n('pastors_title')}</h2>
        </div>
        ${pastorsHtml}
      </section>
      <section class="fade-in fade-in-delay-2">
        <div class="section-header mb-6" data-bg="SCHEDULE">
          <h2 class="section-title" data-i18n="service_times_title">${i18n('service_times_title')}</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${timesHtml}</div>
      </section>
      <section class="fade-in fade-in-delay-3">
        <div class="section-header mb-6" data-bg="LOCATION">
          <h2 class="section-title" data-i18n="location_title">${i18n('location_title')}</h2>
        </div>
        <div class="rounded-2xl overflow-hidden border border-gray-200">
          <div class="h-[300px] sm:h-[400px] bg-gray-200">
            <iframe class="w-full h-full" frameborder="0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${escapeHtml(mapSrc)}"></iframe>
          </div>
          <div class="p-4 bg-white">
            <p class="text-sm text-gray-600 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>${escapeHtml(address)}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>`;
}

