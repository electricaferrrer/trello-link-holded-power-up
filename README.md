# Trello Link Holded Power-Up

Power-Up de Trello para vincular tarjetas con clientes y proyectos de [Holded](https://www.holded.com/).

## Arquitectura

```
┌─────────────────────┐       ┌──────────────────────────┐       ┌─────────────────┐
│   Trello (browser)  │──────▶│   Cloudflare Pages       │       │  Holded API     │
│                     │       │   Frontend (Vite + TS)   │       │                 │
└─────────────────────┘       └──────────────────────────┘       └────────▲────────┘
                                        │                                 │
                                        │ fetch                           │ key: SECRET
                                        ▼                                 │
                              ┌──────────────────────────┐                │
                              │   Cloudflare Worker      │────────────────┘
                              │   holded-proxy           │
                              │   (API key como secret)  │
                              └──────────────────────────┘
```

- **Frontend** — Vite + TypeScript, sin framework. Hosted en Cloudflare Pages.
- **Worker** — Proxy en Cloudflare Workers que inyecta el API key de Holded. El frontend nunca toca la API key.
- **Storage** — Trello Power-Up storage (`t.set('card', 'shared', ...)`) para guardar los datos por tarjeta.

## Funcionalidades

### Vincular cliente/proyecto

Botones en cada tarjeta para buscar y vincular un cliente o proyecto de Holded. La búsqueda es flexible: divide las palabras del query y busca en nombre, email, CIF/NIF, nombre comercial.

### Card-back section

Al abrir una tarjeta se muestra una sección "Holded" con tags de color:
- **Azul** — cliente vinculado (click abre en Holded)
- **Verde** — proyecto vinculado (click abre en Holded)
- Hover muestra botón para desvincular (con confirmación)

### Badges

En la vista de tablero, las tarjetas muestran badges con icono + nombre del cliente/proyecto vinculado.

### Filtro de tablero

Desde el menú de filtros nativo de Trello se puede filtrar por cliente y/o proyecto de Holded.

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- Cuenta de [Cloudflare](https://www.cloudflare.com/) (gratuita)
- API key de [Holded](https://app.holded.com/api)
- Acceso a un tablero de Trello para crear el Power-Up

## Instalación

```bash
git clone https://github.com/miquelferrerllompart/trello-link-holded-power-up.git
cd trello-link-holded-power-up
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre `http://localhost:5173` — aunque para probar el Power-Up necesitas registrarlo en Trello apuntando a esa URL (o usar un túnel como ngrok).

## Estructura del proyecto

```
trello-link-holded-power-up/
├── index.html                    # Entry point del Power-Up
├── src/
│   ├── connector.ts              # Registro de capabilities (TrelloPowerUp.initialize)
│   ├── holded-api.ts             # Cliente HTTP → proxy worker
│   ├── storage.ts                # Helpers para Trello card storage
│   ├── types.ts                  # Interfaces TypeScript
│   ├── icons.ts                  # URLs de iconos centralizadas
│   ├── capabilities/
│   │   ├── card-buttons.ts       # Botones "Vincular cliente/proyecto"
│   │   ├── card-badges.ts        # Badges en vista de tablero
│   │   ├── card-back-section.ts  # Sección iframe en detalle de tarjeta
│   │   └── card-filter.ts        # Filtro de tablero por cliente/proyecto
│   └── popups/
│       ├── search-contact.html   # Popup búsqueda de clientes
│       ├── search-contact.ts
│       ├── search-project.html   # Popup búsqueda de proyectos
│       ├── search-project.ts
│       ├── filter.html           # Popup filtro de tablero
│       └── filter.ts
├── public/
│   ├── card-back.html            # Iframe del card-back (inline JS por CSP)
│   └── icons/                    # SVGs para iconos
│       ├── contact.svg           # Sin fill (Trello coloriza)
│       ├── contact-light.svg
│       ├── contact-dark.svg
│       ├── project.svg
│       ├── project-light.svg
│       ├── project-dark.svg
│       └── holded-light.svg
├── worker/
│   ├── index.ts                  # Cloudflare Worker (proxy API)
│   └── wrangler.toml             # Config del worker
├── vite.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md                     # Guía para asistentes AI
```

## Deploy

### 1. Configurar el API key de Holded en el Worker

```bash
echo "TU_API_KEY_DE_HOLDED" | npx wrangler secret put HOLDED_API_KEY --name holded-proxy
```

### 2. Desplegar el Worker

```bash
cd worker
npx wrangler deploy
cd ..
```

El worker queda en `https://holded-proxy.mferrer.workers.dev`.

### 3. Build y deploy del frontend

```bash
npm run build
npx wrangler pages deploy dist --project-name trello-link-holded-power-up
```

El frontend queda en `https://trello-link-holded-power-up.pages.dev`.

### 4. Registrar el Power-Up en Trello

1. Ir a [trello.com/power-ups/admin](https://trello.com/power-ups/admin)
2. Crear nuevo Power-Up
3. URL del iframe connector: `https://trello-link-holded-power-up.pages.dev/`
4. Capabilities a activar: `card-buttons`, `card-badges`, `card-back-section`, `filter-card`

## Stack técnico

| Componente | Tecnología |
|---|---|
| Frontend | Vite + TypeScript (vanilla, sin framework) |
| Hosting frontend | Cloudflare Pages |
| Proxy API | Cloudflare Workers |
| SDK | [Trello Power-Up SDK](https://developer.atlassian.com/cloud/trello/power-ups/) |
| API | [Holded API v1](https://developers.holded.com/) |

## API de Holded (endpoints utilizados)

| Endpoint | Uso |
|---|---|
| `GET /api/invoicing/v1/contacts` | Listar contactos (clientes/proveedores) |
| `GET /api/projects/v1/projects` | Listar proyectos |

Todos los contactos/proyectos se cargan una vez y se filtran en el cliente.

## Datos almacenados por tarjeta

```typescript
interface CardHoldedData {
  contactId?: string;    // ID del contacto en Holded
  contactName?: string;  // Nombre del contacto
  projectId?: string;    // ID del proyecto en Holded
  projectName?: string;  // Nombre del proyecto
}
```

Almacenado con `t.set('card', 'shared', 'holdedData', data)` (max ~4KB, más que suficiente).

## Seguridad

- El API key de Holded se almacena como **secret** en Cloudflare Workers (nunca expuesto al frontend)
- El Worker es un proxy de solo lectura (GET) — no puede modificar datos en Holded
- CORS configurado con `Access-Control-Allow-Origin: *` (necesario para que Trello pueda llamar al worker)

## Licencia

Proyecto privado de uso interno.
