import { escapeHtml } from '../utils.js';

/**
 * Form feedback (success/error).
 * @param {Object} props
 * @param {'success'|'error'} props.type - Feedback type
 * @param {string} props.message - Message text
 * @param {boolean} [props.visible=true] - Whether to show
 */
export function render(props) {
  const { type = 'success', message = '', visible = true } = props || {};
  const safeMsg = escapeHtml(message);

  const baseClass = 'text-sm font-semibold p-3 rounded-xl';
  const typeClass = type === 'error'
    ? 'bg-red-100 text-red-600'
    : 'bg-primary/20 text-primary';

  const hiddenClass = visible ? '' : ' hidden';

  return `<div class="form-feedback ${baseClass} ${typeClass}${hiddenClass}">${safeMsg}</div>`;
}
