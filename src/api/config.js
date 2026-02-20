/**
 * API configuration – Open Heavens Website
 * Prioridade: window.APP_CONFIG (config.js) > VITE_API_BASE > default
 */
export const API_BASE =
  (typeof window !== 'undefined' && window.APP_CONFIG?.API_BASE) ||
  import.meta.env.VITE_API_BASE ||
  'https://ohapi.weserve.one';
