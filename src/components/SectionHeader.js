import { escapeHtml } from '../utils.js';

/**
 * Section header with watermark background (section-header, section-title).
 * @param {Object} props
 * @param {string} props.title - Main title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {string} [props.bgText] - Watermark text (e.g. "SERMONS")
 * @param {boolean} [props.watermarkOnly] - If true, render nothing; use section-with-watermark on parent
 */
export function render(props) {
  const { title = '', subtitle = '', bgText = '', watermarkOnly = false } = props || {};
  if (watermarkOnly) return '';
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeBg = escapeHtml(bgText);

  return `<div class="section-header" ${safeBg ? `data-bg="${safeBg}"` : ''}>
  <h2 class="section-title">${safeTitle}</h2>
  ${safeSubtitle ? `<p class="section-subtitle">${safeSubtitle}</p>` : ''}
</div>`;
}

/** Returns HTML attrs for section-with-watermark (e.g. class="section-with-watermark" data-bg="BLOG"). */
export function getWatermarkAttrs(bgText) {
  const safe = escapeHtml(bgText || '');
  return safe ? `class="section-with-watermark" data-bg="${safe}"` : '';
}
