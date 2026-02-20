/**
 * Recursos – lista de recursos para download
 */
import { getResources } from '../api/index.js';
import { API_BASE } from '../api/index.js';
import { escapeHtml } from '../utils.js';
import { i18n, t } from '../i18n.js';

const fileIcons = {
  pdf: '<svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>',
  doc: '<svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
  default: '<svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>',
};

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export async function render() {
  const { items } = await getResources();

  const headerHtml = `
    <div class="mb-8">
      <div class="section-header" data-bg="RESOURCES">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-dark" data-i18n="resources_title">${i18n('resources_title')}</h1>
      </div>
      <p class="text-gray-500 mt-1" data-i18n="resources_subtitle">${i18n('resources_subtitle')}</p>
    </div>`;

  if (!items.length) {
    return { html: `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        ${headerHtml}
        <div class="empty-state col-span-full">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
          <p>${i18n('no_resources')}</p>
        </div>
      </div>
    </div>`, mount: () => {} };
  }

  const cardsHtml = items.map(r => {
    const title = t(r.title_i18n) || 'Recurso';
    const desc = t(r.description_i18n) || '';
    const type = (r.file_type || '').toLowerCase();
    const icon = fileIcons[type] || fileIcons.default;
    const size = formatFileSize(r.file_size);
    const cat = r.category || '';

    return `<div class="rounded-2xl bg-white border border-gray-200 p-5 flex items-center gap-4 card-hover fade-in">
      <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">${icon}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          ${cat && cat !== 'general' ? `<span class="badge badge-dark">${escapeHtml(cat)}</span>` : ''}
          ${type ? `<span class="text-[10px] font-bold text-gray-400 uppercase">${escapeHtml(type)}</span>` : ''}
          ${size ? `<span class="text-[10px] text-gray-400">${escapeHtml(size)}</span>` : ''}
        </div>
        <h3 class="text-[15px] font-bold text-dark">${escapeHtml(title)}</h3>
        ${desc ? `<p class="text-sm text-gray-500 mt-0.5 line-clamp-1">${escapeHtml(desc)}</p>` : ''}
      </div>
      <button data-resource-id="${escapeHtml(r.id)}" class="btn-primary text-xs px-4 shrink-0 resource-download">
        <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        ${i18n('download_label')}
      </button>
    </div>`;
  }).join('');

  return {
    html: `
  <div class="pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      ${headerHtml}
      <div class="space-y-4">${cardsHtml}</div>
    </div>
  </div>`,
    mount,
  };
}

/**
 * Mount download handlers - call after render
 */
export function mount() {
  document.querySelectorAll('.resource-download').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.resourceId;
      if (!id) return;
      try {
        const res = await fetch(`${API_BASE}/api/resources/${id}/download`, { method: 'POST' });
        const data = await res.json();
        if (data?.file_url || data?.url) {
          window.open(data.file_url || data.url, '_blank');
        }
      } catch (e) {
        console.warn('Download error:', e);
      }
    });
  });
}
