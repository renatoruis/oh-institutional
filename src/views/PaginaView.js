/**
 * PaginaView – página dinâmica por slug (getPage)
 * Renderiza rich-content, document.title
 */
import { getPage } from '../api/index.js';
import { escapeHtml, updateMetaTags, truncate } from '../utils.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { i18n, t } from '../i18n.js';

export async function render(params) {
  const slug = params?.slug;
  if (!slug) {
    return `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="empty-state">
          <p>${i18n('page_not_found')} <a href="/" class="text-primary font-bold hover:underline">${i18n('back_home')}</a></p>
        </div>
      </div>
    </div>`;
  }

  const p = await getPage(slug);
  if (!p) {
    return `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="empty-state">
          <p>${i18n('page_not_found')} <a href="/" class="text-primary font-bold hover:underline">${i18n('back_home')}</a></p>
        </div>
      </div>
    </div>`;
  }

  const title = t(p.title_i18n) || t(p.meta_title_i18n) || '';
  const content = t(p.content_i18n) || '';
  const img = p.cover_image_url || '';
  const ctaLabel = t(p.cta_label_i18n) || '';
  const ctaUrl = p.cta_url || '';
  const ctaStyle = p.cta_style || 'primary';

  const metaDesc = truncate((content || '').replace(/<[^>]+>/g, '').trim(), 160);
  const metaTitle = title ? `${title} | Open Heavens Church` : 'Open Heavens Church';
  const finalTitle = p.meta_title_i18n ? t(p.meta_title_i18n) : metaTitle;
  updateMetaTags({
    title: finalTitle,
    description: metaDesc || undefined,
    ogTitle: finalTitle,
    ogDescription: metaDesc || undefined,
    ogImage: img || undefined,
  });

  return `
  <div class="pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      ${img ? `<div class="relative rounded-2xl overflow-hidden mb-8 aspect-[21/9]">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent"></div>
      </div>` : ''}
      <div class="fade-in">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-6">${escapeHtml(title)}</h1>
        <div class="rich-content">${sanitizeHtml(content)}</div>
        ${ctaLabel && ctaUrl ? `<div class="mt-8">
          <a href="${escapeHtml(ctaUrl)}" class="${ctaStyle === 'outline' ? 'btn-outline' : 'btn-primary'}">${escapeHtml(ctaLabel)}</a>
        </div>` : ''}
      </div>
    </div>
  </div>`;
}
