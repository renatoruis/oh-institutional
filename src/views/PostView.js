/**
 * Post (detalhe) - View para /blog/:slug
 * getBlogPost(slug), layout: imagem, título, data, categoria, rich-content, back link.
 */
import { getBlogPost } from '../api/index.js';
import { escapeHtml, formatDate, updateMetaTags, truncate } from '../utils.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { t, i18n, getLang } from '../i18n.js';
import { EmptyState } from '../components/index.js';

export function render(params) {
  const slug = params?.slug;
  const wrap = document.createElement('div');
  wrap.className = 'pt-24 pb-16';

  if (!slug) {
    wrap.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        ${EmptyState({
          message: getLang() === 'en' ? 'Article not found.' : 'Artigo não encontrado.',
          actionLink: { href: '/blog', label: i18n('back_to_blog') },
        })}
      </div>
    `;
    return wrap;
  }

  wrap.innerHTML = `
    <div id="post-container" class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="skeleton h-[400px] rounded-2xl mb-8"></div>
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="skeleton h-8 w-3/4 rounded"></div>
        <div class="skeleton h-4 w-1/3 rounded"></div>
        <div class="skeleton h-4 w-full rounded mt-6"></div>
      </div>
    </div>
  `;

  (async () => {
    const p = await getBlogPost(slug);
    const container = wrap.querySelector('#post-container');
    if (!container) return;

    if (!p) {
      container.innerHTML = `
        ${EmptyState({
          message: getLang() === 'en' ? 'Article not found.' : 'Artigo não encontrado.',
          actionLink: { href: '/blog', label: i18n('back_to_blog') },
        })}
      `;
      return;
    }

    const title = t(p.title_i18n) || 'Artigo';
    const content = t(p.content_i18n) || '';
    const img = p.cover_image_url || p.image_url || '';
    const date = formatDate(p.published_at);
    const author = p.author || '';
    const cat = p.category?.name || '';
    const tags = p.tags || [];

    const desc = truncate((content.replace(/<[^>]+>/g, '').trim()), 160);
    updateMetaTags({
      title: `${title} | Open Heavens Church`,
      description: desc || undefined,
      ogTitle: `${title} | Open Heavens Church`,
      ogDescription: desc || undefined,
      ogImage: img || undefined,
    });

    container.innerHTML = `
      ${img ? `<div class="relative rounded-2xl overflow-hidden mb-8 aspect-[21/9]">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
      </div>` : ''}
      <article class="fade-in">
        <div class="mb-6">
          <a href="/blog" class="text-sm text-primary hover:underline mb-4 inline-block">← ${i18n('back_to_blog')}</a>
          ${cat ? `<span class="badge badge-blue mb-3">${escapeHtml(cat)}</span>` : ''}
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark leading-tight">${escapeHtml(title)}</h1>
          <div class="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
            ${date ? `<span>${escapeHtml(date)}</span>` : ''}
            ${author ? `<span>· ${escapeHtml(author)}</span>` : ''}
          </div>
          ${tags.length ? `<div class="flex flex-wrap gap-1.5 mt-3">${tags.map((tg) => `<span class="badge badge-dark">${escapeHtml(tg)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="rich-content">${sanitizeHtml(content)}</div>
      </article>
    `;
  })();

  return wrap;
}
