import { escapeHtml } from '../utils.js';

const DEFAULT_ICON = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/></svg>';

/**
 * Empty state: icon + message, optional action link.
 * @param {Object} props
 * @param {string} props.message - Message text
 * @param {string} [props.icon] - Optional SVG string
 * @param {Object} [props.actionLink] - Optional { href, label }
 */
export function render(props) {
  const { message = '', icon = '', actionLink } = props || {};
  const safeMsg = escapeHtml(message);
  const svg = icon || DEFAULT_ICON;

  const actionHtml = actionLink?.href
    ? `<a href="${escapeHtml(actionLink.href)}" class="btn-primary mt-4 inline-block">${escapeHtml(actionLink.label || 'Ver mais')}</a>`
    : '';

  return `<div class="empty-state col-span-full">
  ${svg}
  <p>${safeMsg}</p>
  ${actionHtml}
</div>`;
}
