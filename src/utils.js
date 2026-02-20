/**
 * Escapes HTML special chars to prevent XSS in user content.
 */
export function escapeHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}

/** Extract YouTube video ID from url */
export function getYouTubeId(url) {
  if (!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/live\/)([^&?\s\/]+)/);
  return m ? m[1] : '';
}

/** Truncate string with ellipsis */
export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function getLang() {
  try { return localStorage.getItem('oh_lang') || 'pt'; } catch { return 'pt'; }
}

export function formatDate(dateStr, opts) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const lang = getLang();
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', opts || { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  return formatDate(dateStr, { day: 'numeric', month: 'short' });
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const lang = getLang();
  return d.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'pt-PT', { hour: '2-digit', minute: '2-digit' });
}
