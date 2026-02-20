/**
 * Open Heavens - API Resources
 * Funções para obter dados da API.
 */

import { fetchAPI } from './client.js';
import { parseListResponse, parseSingleResponse } from './parsers.js';
import { getLang } from '../i18n.js';

export async function getChurch() {
  const data = await fetchAPI('/api/church');
  return parseSingleResponse(data);
}

export async function getBanners() {
  const data = await fetchAPI('/api/banners');
  return Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
}

/** Fallback quando a API falha */
const DEFAULT_VERSE = {
  text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigénito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
  reference: 'João 3:16',
  source: 'fallback',
};

export async function getVerseOfDay() {
  const lang = getLang();
  const params = new URLSearchParams();
  if (lang) params.set('lang', lang);
  const qs = params.toString();
  const path = `/api/home/verse-of-the-day${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  const raw = parseSingleResponse(data);
  if (!raw) {
    if (import.meta.env.DEV) console.debug('[API] verse-of-the-day: usando fallback');
    return DEFAULT_VERSE;
  }
  // API pode retornar: content, text, content_i18n, text_i18n; HomeView usa t(text_i18n) || text
  const contentI18n = raw.content_i18n ?? raw.text_i18n;
  const text = contentI18n?.[lang] ?? contentI18n?.pt ?? contentI18n?.en
    ?? raw.content ?? raw.text ?? '';
  const refI18n = raw.reference_i18n ?? raw.verse_ref_i18n;
  const reference = refI18n?.[lang] ?? refI18n?.pt ?? refI18n?.en
    ?? raw.reference ?? raw.verse_ref ?? '';
  if (!text && import.meta.env.DEV) console.debug('[API] verse-of-the-day: resposta sem texto', raw);
  // Preservar text_i18n/content_i18n para t() na HomeView quando user troca idioma (re-render)
  return text ? { ...raw, text, reference, text_i18n: contentI18n ?? raw.text_i18n, reference_i18n: refI18n ?? raw.reference_i18n } : DEFAULT_VERSE;
}

export async function getNextEvent() {
  const data = await fetchAPI('/api/home/next-event');
  return parseSingleResponse(data);
}

export async function getLatestSermon() {
  const data = await fetchAPI('/api/home/latest-sermon');
  return parseSingleResponse(data);
}

export async function getHome() {
  const data = await fetchAPI('/api/home');
  return parseSingleResponse(data);
}

export async function getSermons(opts = {}) {
  const { limit = 12, offset = 0, search = '', tag = '' } = opts;
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  if (search) params.set('search', search);
  if (tag) params.set('tag', tag);
  const qs = params.toString();
  const path = `/api/sermons${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  return parseListResponse(data);
}

export async function getSermon(id) {
  const data = await fetchAPI(`/api/sermons/${encodeURIComponent(id)}`);
  return parseSingleResponse(data);
}

export async function getRelatedSermons(id) {
  const data = await fetchAPI(`/api/sermons/${encodeURIComponent(id)}/related`);
  return parseListResponse(data);
}

export async function postSermonView(id) {
  return fetchAPI(`/api/sermons/${encodeURIComponent(id)}/view`, { method: 'POST' });
}

export async function getBlogPosts(opts = {}) {
  const { limit = 12, offset = 0, search = '', category = '' } = opts;
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  const qs = params.toString();
  const path = `/api/blog${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  return parseListResponse(data);
}

export async function getBlogPost(slug) {
  const data = await fetchAPI(`/api/blog/${encodeURIComponent(slug)}`);
  return parseSingleResponse(data);
}

export async function getRelatedBlogPosts(slug) {
  const data = await fetchAPI(`/api/blog/${encodeURIComponent(slug)}/related`);
  return parseListResponse(data);
}

export async function getEvents(opts = {}) {
  const { limit = 12, offset = 0, category = '' } = opts;
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  if (category) params.set('category', category);
  const qs = params.toString();
  const path = `/api/events${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  return parseListResponse(data);
}

export async function getEvent(id) {
  const data = await fetchAPI(`/api/events/${encodeURIComponent(id)}`);
  return parseSingleResponse(data);
}

export async function getNotices(opts = {}) {
  const { limit = 10, offset = 0 } = opts || {};
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  const qs = params.toString();
  const path = `/api/notices${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  return parseListResponse(data);
}

export async function getPrayers(opts = {}) {
  const { limit = 10, offset = 0 } = opts || {};
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  const qs = params.toString();
  const path = `/api/prayers${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  return parseListResponse(data);
}

export async function postPrayer(body) {
  return fetchAPI('/api/prayers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function postPray(id) {
  return fetchAPI(`/api/prayers/${encodeURIComponent(id)}/pray`, { method: 'POST' });
}

export async function getResources(opts = {}) {
  const params = new URLSearchParams(opts);
  const qs = params.toString();
  const path = `/api/resources${qs ? '?' + qs : ''}`;
  const data = await fetchAPI(path);
  return parseListResponse(data);
}

export async function getPage(slug) {
  const data = await fetchAPI(`/api/pages/${encodeURIComponent(slug)}`);
  return parseSingleResponse(data);
}

export async function postContact(body) {
  return fetchAPI('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getPushVapidKey() {
  return fetchAPI('/api/push/vapid-key');
}
