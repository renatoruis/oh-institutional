# API Bíblia – Documentação e Fallback

## Endpoints usados (api-backend.json)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/bible/versions` | GET | Lista versões da Bíblia |
| `/api/bible/{bibleId}/books` | GET | Lista livros de uma versão |
| `/api/bible/{bibleId}/books/{bookId}` | GET | Detalhes do livro (capítulos) |
| `/api/bible/{bibleId}/chapter/{bookId}/{chapterId}` | GET | Capítulo completo com versículos |

## Estrutura esperada das respostas

### Versões (`/api/bible/versions`)
```json
{ "items": [{ "id": "...", "name": "...", "title": "...", "abbreviation": "...", "language": "..." }] }
```
- **Nome exibido**: prioridade `name` > `title` > `abbreviation` > `id` (fallback)
- Ou: `{ "data": [...] }` ou array direto

### Livros (`/api/bible/{id}/books`)
- Campo `testament` (ou `testamentId`): `"OT"` | `"old"` | `"NT"` | `"new"` (case-insensitive)
- Fallback: livros sem testament vão para "Antigo Testamento"
- **Nome do livro**: prioridade `name` > `longName` > `shortName` > `abbreviation` > `id`

### Capítulos (`/api/bible/{id}/books/{bookId}`)
- `chapters`: array de `{ id }` ou array de números
- `chapterCount` ou `meta.chapterCount`: número total quando não há array
- Fallback: `data?.chapters`, `data?.data`, ou array vazio

### Capítulo (`/api/bible/{id}/chapter/{bookId}/{chapterId}`)
- `verses`: array de `{ verse: n, text: "..." }` ou `{ number, text }` ou `{ content }`
- Ou `content` / `text` como HTML ou texto

## Fallback

Se a API retornar estrutura diferente:
- **Versões**: `data?.items ?? data?.data ?? (Array.isArray(data) ? data : [])`
- **Livros**: idem
- **Versículos**: `data?.verses ?? data?.items ?? data?.data ?? data?.data?.verses`
- **Capítulos**: `data?.chapters ?? data?.items ?? data?.data?.chapters ?? data?.data`

## Alternativa: `/api/bible/{bibleId}/passages/{passageId}`

O backend também expõe este endpoint. Se `chapter` não existir, pode ser necessário usar `passages` com IDs no formato `GEN.1` (livro.capítulo).
