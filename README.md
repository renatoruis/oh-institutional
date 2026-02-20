# Open Heavens Church - Site Institucional

Site institucional da Open Heavens Church Coimbra. SPA (Single Page Application) com conteúdo dinâmico da API (avisos, sermões, blog, agenda).

## Estrutura do Projeto

```
institucional/
├── index.html          # Entry point SPA (único HTML)
├── config.js           # Configuração da API (copiado para public no build)
├── styles.css          # Estilos customizados (copiado para public no build)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── api-backend.json    # Documentação OpenAPI do backend
├── public/             # Assets estáticos servidos como /path
│   ├── manifest.json   # PWA manifest
│   ├── sw.js           # Service Worker (PWA)
│   ├── config.js       # (cópia no build)
│   └── styles.css      # (cópia no build)
└── src/
    ├── main.js         # Entry point SPA, rotas e registo de views
    ├── App.js          # Layout, router integration
    ├── router.js       # Cliente-side routing
    ├── shared.js       # Nav, footer, utilitários partilhados
    ├── utils.js        # escapeHtml, formatDateShort
    ├── i18n.js         # Traduções pt/en
    ├── api/
    │   ├── config.js   # API_BASE (APP_CONFIG ou VITE_API_BASE)
    │   ├── client.js   # fetchAPI
    │   ├── index.js    # getChurch, etc.
    │   ├── resources.js # Recursos
    │   └── parsers.js
    ├── components/     # Componentes reutilizáveis
    └── views/         # Views por rota (HomeView, SermoesView, etc.)
```

## Configuração da API

A API usa `API_BASE` com a seguinte prioridade:

1. **`window.APP_CONFIG.API_BASE`** (via `config.js` no HTML – permite alterar em runtime sem rebuild)
2. **`VITE_API_BASE`** (variável de ambiente no build)
3. **Default:** `https://ohapi.weserve.one`

Edita `config.js` na raiz para alterar a URL do backend:

```javascript
var APP_CONFIG = {
  API_BASE: 'https://tua-api.com',
};
```

Ou define `.env` com `VITE_API_BASE=https://tua-api.com` antes do build.

## Executar

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # dist/
pnpm preview      # Pré-visualizar build
```

## Tecnologias

- **Vite** – build e dev server
- **Tailwind CSS** (CDN no index) – utilitários
- **Vanilla JS** – sem frameworks (SPA manual)
- **PWA** – manifest + Service Worker
