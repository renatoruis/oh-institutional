/**
 * API client – Open Heavens
 */
import { API_BASE } from './config.js';
export { API_BASE };

export async function fetchAPI(path, opts = {}) {
  try {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (import.meta.env.DEV && import.meta.env.VITE_API_DEBUG) {
      console.debug(`[API] ${path} →`, data?.items?.length ?? data?.data?.length ?? (typeof data === 'object' ? 'OK' : data));
    }
    return data;
  } catch (e) {
    if (import.meta.env.DEV) console.warn(`[API] ${path}:`, e.message);
    return null;
  }
}
