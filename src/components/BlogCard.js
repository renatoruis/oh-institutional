import { escapeHtml } from '../utils.js';

const DEFAULT_IMG = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect fill=%22%23151a2a%22 width=%22400%22 height=%22225%22/%3E%3C/svg%3E';

/**
 * Blog card: image, title, excerpt, category.
 * Link: /blog/:slug (post.html?slug=)
 * @param {Object} props
 * @param {string} props.slug - Post slug
 * @param {string} props.title - Title
 * @param {string} [props.excerpt] - Short excerpt
 * @param {string} [props.imageUrl] - Cover image URL
 * @param {string} [props.category] - Category name
 */
export function render(props) {
  const { slug = '', title = 'Artigo', excerpt = '', imageUrl = '', category = '' } = props || {};
  const safeTitle = escapeHtml(title);
  const safeExcerpt = escapeHtml(excerpt);
  const safeCategory = escapeHtml(category);
  const img = imageUrl || DEFAULT_IMG;
  const href = `/blog/${encodeURIComponent(String(slug))}`;

  return `<a href="${href}" class="dark-card card-hover block fade-in rounded-2xl overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F5]">
  <div class="h-40 relative overflow-hidden">
    <img src="${img}" alt="${safeTitle}" class="w-full h-full object-cover" loading="lazy">
    <div class="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
    ${category ? `<span class="badge badge-blue absolute top-3 left-3">${safeCategory}</span>` : ''}
  </div>
  <div class="p-4">
    <h3 class="text-[15px] font-bold text-white/95 line-clamp-2">${safeTitle}</h3>
    ${excerpt ? `<p class="text-xs text-white/45 mt-1 line-clamp-2">${safeExcerpt}</p>` : ''}
  </div>
</a>`;
}
