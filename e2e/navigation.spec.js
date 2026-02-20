/**
 * Testes de navegação - Open Heavens SPA
 * Verifica: links do nav, quick access, cards, "Ver todos", botão voltar
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:5174';

test.describe('Navegação SPA Open Heavens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
  });

  test('carrega home em /', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`${BASE}/?$`));
    await expect(page.locator('h1')).toContainText(/OPEN HEAVENS|Início|Home/i);
  });

  test.describe('Links do Nav', () => {
    const navLinks = [
      { label: 'Início', path: '/', selector: 'a[href="/"]' },
      { label: 'Sobre', path: '/sobre', selector: 'nav a[href="/sobre"]' },
      { label: 'Sermões', path: '/sermoes', selector: 'nav a[href="/sermoes"]' },
      { label: 'Blog', path: '/blog', selector: 'nav a[href="/blog"]' },
      { label: 'Agenda', path: '/eventos', selector: 'nav a[href="/eventos"]' },
      { label: 'Oração', path: '/oracoes', selector: 'nav a[href="/oracoes"]' },
      { label: 'Bíblia', path: '/biblia', selector: 'nav a[href="/biblia"]' },
      { label: 'Contacto', path: '/contacto', selector: 'nav a[href="/contacto"]' },
    ];

    for (const { label, path, selector } of navLinks) {
      test(`${label} -> ${path}`, async ({ page }) => {
        const link = page.locator(selector).first();
        await link.click();
        await page.waitForURL(new RegExp(`${path.replace(/\//g, '\\/')}/?$`));
        expect(page.url()).toMatch(new RegExp(`${path.replace(/\//g, '\\/')}/?$`));
      });
    }
  });

  test.describe('Quick Access (6 ícones)', () => {
    const quickLinks = [
      { label: 'Sermões', path: '/sermoes' },
      { label: 'Blog', path: '/blog' },
      { label: 'Agenda', path: '/eventos' },
      { label: 'Oração', path: '/oracoes' },
      { label: 'Bíblia', path: '/biblia' },
      { label: 'Avisos', path: '/avisos' },
    ];

    for (const { label, path } of quickLinks) {
      test(`Quick access: ${label}`, async ({ page }) => {
        const link = page.locator(`a[href="${path}"]`).filter({ hasText: label }).first();
        await link.click();
        await page.waitForURL(new RegExp(`${path.replace(/\//g, '\\/')}/?$`));
        expect(page.url()).toMatch(new RegExp(`${path.replace(/\//g, '\\/')}/?$`));
      });
    }
  });

  test.describe('Cards e Ver todos', () => {
    test('Ver todos Sermões', async ({ page }) => {
      const link = page.locator('a[href="/sermoes"]').filter({ hasText: /ver todos|see all/i }).first();
      if (await link.count() > 0) {
        await link.click();
        await page.waitForURL(/\/sermoes\/?$/);
        expect(page.url()).toContain('/sermoes');
      }
    });

    test('Ver todos Blog', async ({ page }) => {
      const link = page.locator('a[href="/blog"]').filter({ hasText: /ver todos|see all/i }).first();
      if (await link.count() > 0) {
        await link.click();
        await page.waitForURL(/\/blog\/?$/);
        expect(page.url()).toContain('/blog');
      }
    });

    test('Ver todos Eventos', async ({ page }) => {
      const link = page.locator('a[href="/eventos"]').filter({ hasText: /ver todos|see all/i }).first();
      if (await link.count() > 0) {
        await link.click();
        await page.waitForURL(/\/eventos\/?$/);
        expect(page.url()).toContain('/eventos');
      }
    });

    test('Card de sermão -> /sermoes/:id', async ({ page }) => {
      const card = page.locator('a[href^="/sermoes/"]').filter({ hasNot: page.locator('nav') }).first();
      if (await card.count() > 0) {
        const href = await card.getAttribute('href');
        await card.click();
        await page.waitForURL(new RegExp(`/sermoes/[^/]+/?$`));
        expect(page.url()).toMatch(/\/sermoes\/[^/]+/);
      }
    });

    test('Card de blog -> /blog/:slug', async ({ page }) => {
      const card = page.locator('a[href^="/blog/"]').filter({ hasNot: page.locator('nav') }).first();
      if (await card.count() > 0) {
        await card.click();
        await page.waitForURL(new RegExp(`/blog/[^/]+/?$`));
        expect(page.url()).toMatch(/\/blog\/[^/]+/);
      }
    });

    test('Card de evento -> /evento/:id', async ({ page }) => {
      const card = page.locator('a[href^="/evento/"]').filter({ hasNot: page.locator('nav') }).first();
      if (await card.count() > 0) {
        await card.click();
        await page.waitForURL(new RegExp(`/evento/[^/]+/?$`));
        expect(page.url()).toMatch(/\/evento\/[^/]+/);
      }
    });
  });

  test.describe('Botão voltar do browser', () => {
    test('Voltar após navegação', async ({ page }) => {
      await page.goto(`${BASE}/`);
      await page.goto(`${BASE}/sobre`);
      expect(page.url()).toContain('/sobre');
      await page.goBack();
      await page.waitForURL(new RegExp(`${BASE}/?$`));
      expect(page.url()).toMatch(new RegExp(`${BASE}/?$`));
    });
  });

  test.describe('Navegação directa por URL', () => {
    const routes = [
      { path: '/', desc: 'Home' },
      { path: '/sobre', desc: 'Sobre' },
      { path: '/sermoes', desc: 'Sermões' },
      { path: '/sermoes/1', desc: 'Sermão detalhe' },
      { path: '/blog', desc: 'Blog' },
      { path: '/blog/test-post', desc: 'Post blog' },
      { path: '/eventos', desc: 'Eventos' },
      { path: '/evento/1', desc: 'Evento detalhe' },
      { path: '/oracoes', desc: 'Orações' },
      { path: '/biblia', desc: 'Bíblia' },
      { path: '/avisos', desc: 'Avisos' },
      { path: '/contacto', desc: 'Contacto' },
      { path: '/recursos', desc: 'Recursos' },
    ];

    for (const { path, desc } of routes) {
      test(`${desc} (${path})`, async ({ page }) => {
        await page.goto(`${BASE}${path}`);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain(path);
        await expect(page.locator('#app-content')).toBeVisible();
      });
    }
  });
});
