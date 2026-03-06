# CLAUDE.md — Trello Link Holded Power-Up

## Project overview

Trello Power-Up that links Trello cards with Holded CRM contacts and projects. Built for Eléctrica Ferrer's internal use.

## Architecture

Two separate components:

- **Frontend** (Cloudflare Pages): Vite + TypeScript, no framework. Hosted at `trello-link-holded-power-up.pages.dev`
- **Worker** (Cloudflare Workers): API proxy at `holded-proxy.mferrer.workers.dev`. Holds the Holded API key as a secret — frontend never sees it.

## Key conventions

- **No frameworks** — vanilla TypeScript, vanilla CSS. Keep it lightweight.
- **Trello Power-Up SDK** loaded via CDN script tag (`https://p.trellocdn.com/power-up.min.js`)
- **Icons**: Trello capabilities accept different icon formats depending on the capability:
  - `card-buttons`, `card-badges`, `card-back-section` → **string URL only**
  - `board-buttons` → accepts `{ dark: string, light: string }` object
- **card-back.html** lives in `public/` with inline JS (no Vite processing) to avoid CSP issues with Trello's iframe sandbox
- **Dark mode**: use `@media (prefers-color-scheme: dark)` and Trello design tokens
- **Language**: UI strings are in Spanish (internal tool for a Spanish company)

## Build & deploy

```bash
# Frontend
npm run build          # tsc && vite build → dist/
npx wrangler pages deploy dist --project-name trello-link-holded-power-up

# Worker
cd worker
npx wrangler deploy
```

## Worker secret

The Holded API key is stored as a Cloudflare Worker secret (not in code):

```bash
echo "YOUR_API_KEY" | npx wrangler secret put HOLDED_API_KEY --name holded-proxy
```

Important: must pipe via `echo` — non-interactive `wrangler secret put` sends an empty string.

## Trello Power-Up capabilities

Registered in `src/connector.ts`:

| Capability | File | Purpose |
|---|---|---|
| `card-buttons` | `src/capabilities/card-buttons.ts` | "Vincular cliente/proyecto" buttons |
| `card-badges` | `src/capabilities/card-badges.ts` | Shows linked contact/project on card front |
| `card-back-section` | `src/capabilities/card-back-section.ts` | Iframe section in card detail |
| `filter-card` | `src/capabilities/card-filter.ts` | Board filter by client/project |

## Data storage

Card data stored via `t.set('card', 'shared', 'holdedData', data)`:

```typescript
interface CardHoldedData {
  contactId?: string;
  contactName?: string;
  projectId?: string;
  projectName?: string;
}
```

## Holded API endpoints (proxied through worker)

| Endpoint | Use |
|---|---|
| `/api/invoicing/v1/contacts` | List all contacts |
| `/api/projects/v1/projects` | List all projects |

All contacts/projects are loaded once and filtered client-side.

## Common issues

- **"Missing valid icon"** in card-back-section → icon must be a plain string URL, not `{ dark, light }`
- **Button icons not showing** → `card-buttons` only accepts string URL for `icon`
- **Worker returns "secret not configured"** → redeploy worker after setting secret: `cd worker && npx wrangler deploy`
- **HTML response from Holded** → invalid API key; worker detects this and returns 401 JSON
