/**
 * Open Heavens - API Response Parsers
 * Normaliza respostas da API (items, data, total, title_i18n, etc.)
 */

/**
 * Extrai array de itens de várias estruturas da API
 * @param {any} data - Resposta bruta da API
 * @returns {Array}
 */
function extractItems(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

/**
 * Extrai total da resposta (para paginação)
 * @param {any} data - Resposta bruta da API
 * @param {Array} items - Array de itens já extraído
 * @returns {number}
 */
function extractTotal(data, items) {
  if (data?.total != null && typeof data.total === 'number') return data.total;
  return items?.length ?? 0;
}

/**
 * Normaliza resposta de lista
 * @param {any} data - Resposta bruta (items, data, total)
 * @returns {{ items: Array, total: number }}
 */
function parseListResponse(data) {
  const items = extractItems(data);
  const total = extractTotal(data, items);
  return { items, total };
}

/**
 * Normaliza resposta de item único
 * @param {any} data - Resposta bruta (objeto, array ou null)
 * @returns {object|null} - Item ou null se inexistente
 */
function parseSingleResponse(data) {
  if (!data) return null;
  if (typeof data !== 'object') return null;
  if (data?.id != null || data?.slug != null) return data;
  if (Array.isArray(data)) return data[0] ?? null;
  const first = data?.items?.[0] ?? data?.data?.[0] ?? null;
  if (first && (first.id != null || first.slug != null)) return first;
  return data;
}

export { parseListResponse, parseSingleResponse, extractItems, extractTotal };
export default { parseListResponse, parseSingleResponse };
