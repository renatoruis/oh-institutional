/**
 * Sanitiza HTML com DOMPurify para prevenir XSS em conteúdo rico da API (CMS).
 * Usar para rich-content: posts, páginas, sermões, eventos, avisos.
 * Para texto simples, usar escapeHtml de utils.js.
 */
import DOMPurify from 'dompurify';

/**
 * Sanitiza HTML permitindo tags seguras (p, strong, em, a, ul, ol, li, blockquote, etc.)
 * Remove scripts, event handlers e outros vetores de XSS.
 * @param {string} html - HTML bruto da API
 * @returns {string} HTML sanitizado seguro para innerHTML
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'div', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'hr', 'sub', 'sup',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
    ADD_ATTR: ['target', 'rel'],
  });
}
