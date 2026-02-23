# Announcements Management System

Full-stack web application for creating, editing, searching, filtering, and publishing city announcements.

## Live Environments

- Frontend: https://zadanie-simplicity.vercel.app
- Backend API: https://zadanie-simplicity.render.com
- Database: Supabase PostgreSQL

## Project Goals

Built in a 72-hour implementation window, with focus on:

- Correct and stable CRUD behavior
- Clean backend architecture
- Filtering and text search support
- Basic API security middleware
- Real-time in-app notifications via WebSocket

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- WebSocket (`ws`)

### Infrastructure

- Vercel (frontend hosting)
- Render (backend hosting)
- Supabase (PostgreSQL)

## Architecture Overview

```text
client (React)
   <->
server (Express API)
  routes -> controllers -> services -> Prisma -> PostgreSQL
                  |            |
                  |            -> business logic & data access
                  -> validation, error handling, middleware
   <->
WebSocket channel (/ws) for real-time announcement events
```

## Why PostgreSQL

Announcements and categories have fixed, structured attributes, which fits a relational model well. PostgreSQL provides:

- Strong consistency for CRUD operations
- Efficient filtering and search on structured fields
- Mature tooling and compatibility with Prisma

I considered document databases (e.g., MongoDB or DynamoDB), but for this use case they add complexity without clear upside. The data model is relational and predictable, so PostgreSQL is the most practical fit.

## Data Model (High-Level)

- `categories`: category records (`id`, `name`)
- `announcements`: announcement records with title, description, publication date, and category relationships

## Backend Design

The backend follows a layered structure:

- `routes`: endpoint definitions and request validation wiring
- `controllers`: HTTP input/output orchestration
- `services`: business rules and data operations
- `middlewares`: cross-cutting concerns (validation, errors, security)
- `utils`: helper abstractions (async wrappers, logging, app errors)

### What Express does in this project

Express is the HTTP server framework that handles:

- Route matching (e.g., `GET /api/announcements`)
- Middleware pipeline execution (`helmet`, `cors`, JSON parsing, logging)
- Request and response lifecycle management
- Error propagation to centralized handlers

### WebSocket approach ("hybrid" explanation)

The app uses a hybrid communication model:

- REST API for CRUD operations and page data loading
- WebSocket only for event notifications (e.g., `announcement.created`)

This keeps writes and reads simple through REST while still delivering real-time UI updates.

## API Surface

### Health

- `GET /health`

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Announcements

- `GET /api/announcements`
- `GET /api/announcements/search?q=...`
- `GET /api/announcements/category/:categoryId`
- `GET /api/announcements/:id`
- `POST /api/announcements`
- `PUT /api/announcements/:id`
- `DELETE /api/announcements/:id`

### Realtime

- WebSocket endpoint: `/ws`
- Example event: `announcement.created`

## API Testing (Postman)

Quick way to validate backend behavior from Postman:

1. Create a Postman environment with:
   - `baseUrl` = `http://localhost:4001` (local) or `https://zadanie-simplicity.render.com` (deployed)
2. Add a collection and set `{{baseUrl}}` as the URL prefix.
3. For `POST` / `PUT` requests, set header:
   - `Content-Type: application/json`

Suggested test flow:

1. **Health check**
   - `GET {{baseUrl}}/health`
   - Expected: `200 OK` and `{ "status": "ok" }`

2. **Read categories**
   - `GET {{baseUrl}}/api/categories`
   - Expected: `200 OK` and category array

3. **Create announcement**
   - `POST {{baseUrl}}/api/announcements`
   - Body (raw JSON):

```json
{
  "id": 9999,
  "title": "Postman test announcement",
  "description": "Created from Postman",
  "categoryIds": [1],
  "publicationDate": "2026-02-23T10:00:00.000Z"
}
```

4. **Update announcement**
   - `PUT {{baseUrl}}/api/announcements/9999`
   - Body (raw JSON):

```json
{
  "title": "Updated in Postman",
  "description": "Updated content",
  "categoryIds": [1],
  "publicationDate": "2026-02-23T11:00:00.000Z"
}
```

5. **Search announcements**
   - `GET {{baseUrl}}/api/announcements/search?q=postman`

6. **Delete announcement**
   - `DELETE {{baseUrl}}/api/announcements/9999`
   - Expected: `204 No Content`

If validation fails, the API returns `400` with error details from request validation.

## Security and Validation

Implemented protections include:

- `helmet` for secure HTTP headers
- `cors` with explicit allowed origins
- Request body size limit (`express.json({ limit: '10kb' })`)
- `express-validator` for input validation
- Centralized error handler for consistent API responses

## Local Development Setup

## 1) Prerequisites

- Node.js (LTS recommended)
- npm
- PostgreSQL running locally (or remote Postgres connection)

## 2) Clone and install dependencies

```bash
git clone <repository-url>
cd zadanie_simplicity
npm install
npm --prefix server install
```

## 3) Configure environment variables

Create `server/.env` (you can copy from `server/.env.example`) and set:

- `DATABASE_URL`
- `DIRECT_URL`
- `PORT` (default `4001`)
- `CLIENT_URL` (e.g., `http://localhost:5173`)
- `ADMIN_SECRET`

## 4) Initialize database schema and seed data

```bash
npm --prefix server run prisma:generate
npm --prefix server run prisma:push
npm --prefix server run seed:mock
```

## 5) Run the application

Start backend:

```bash
npm --prefix server run dev
```

Start frontend:

```bash
npm run dev
```

Then open `http://localhost:5173`.

## Available Scripts

### Root (frontend)

- `npm run dev` – start Vite dev server
- `npm run build` – type-check and build frontend
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

### Server

- `npm --prefix server run dev` – start backend in watch mode
- `npm --prefix server run build` – compile backend TypeScript
- `npm --prefix server run start` – run compiled backend
- `npm --prefix server run prisma:generate` – generate Prisma client
- `npm --prefix server run prisma:push` – push Prisma schema to DB
- `npm --prefix server run prisma:migrate` – run Prisma migrations
- `npm --prefix server run seed:mock` – seed mock data

## Deployment Notes

Render + Supabase were selected to keep deployment fast and focused on assignment outcomes while still providing:

- Production-ready HTTPS endpoints
- Managed environment variables
- PostgreSQL compatibility with Prisma
- WebSocket support for real-time notifications

This avoids additional infrastructure overhead (e.g., AWS networking/IAM setup) that is not central to the assignment scope.

## Practical Engineering Notes

This section captures the "why" behind a few implementation decisions.

### Security choices

The API is intentionally simple, but still includes baseline protections:

- `helmet` to set secure HTTP headers by default
- `cors` with allowlisted origins to prevent unwanted browser access
- Request validation via `express-validator` to reject malformed input early
- Centralized error handling to keep responses predictable

For this assignment scope, these controls give a good safety baseline without overengineering.

### Why not MongoDB or DynamoDB

The domain is structured and relational: announcements, categories, and predictable query patterns. Because of that:

- PostgreSQL handles joins and filtering naturally
- Prisma schema modeling stays straightforward
- Operational complexity stays low for a small team/project

MongoDB or DynamoDB could work, but they were not the best tradeoff here.

### Real-time approach

WebSocket is used only for lightweight event notifications (for example, `announcement.created`). The app still relies on REST for CRUD and data retrieval. This hybrid setup keeps the backend simple while giving users real-time updates where it matters.

---

# Slovenská verzia

## Systém na správu oznamov

Full-stack webová aplikácia na vytváranie, úpravu, vyhľadávanie, filtrovanie a publikovanie mestských oznamov.

## Produkčné prostredia

- Frontend: https://zadanie-simplicity.vercel.app
- Backend API: https://zadanie-simplicity.render.com
- Databáza: Supabase PostgreSQL

## Ciele projektu

Projekt bol implementovaný v 72-hodinovom časovom okne s dôrazom na:

- korektnú a stabilnú CRUD logiku,
- čistú backend architektúru,
- filtrovanie a textové vyhľadávanie,
- základné bezpečnostné middleware komponenty,
- real-time notifikácie v aplikácii cez WebSocket.

## Technologický stack

### Frontend

- React 19
- TypeScript
- Vite

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- WebSocket (`ws`)

### Infraštruktúra

- Vercel (hosting frontendu)
- Render (hosting backendu)
- Supabase (PostgreSQL)

## Prehľad architektúry

```text
client (React)
   <->
server (Express API)
  routes -> controllers -> services -> Prisma -> PostgreSQL
                  |            |
                  |            -> business logika a prístup k dátam
                  -> validácia, error handling, middleware
   <->
WebSocket kanál (/ws) pre real-time udalosti oznamov
```

## Prečo PostgreSQL

Oznamy a kategórie majú pevné, štruktúrované atribúty, čo je ideálny scenár pre relačný model. PostgreSQL v tomto prípade poskytuje:

- silnú konzistenciu pri CRUD operáciách,
- efektívne filtrovanie a vyhľadávanie,
- overený ekosystém a výbornú kompatibilitu s Prisma.

Zvažované boli aj dokumentové databázy (napr. MongoDB alebo DynamoDB), ale pre tento use case by priniesli viac zložitosti bez jasného benefitu. Dátový model je relačný a predvídateľný, preto je PostgreSQL najpraktickejšia voľba.

## Dátový model (high-level)

- `categories`: záznamy kategórií (`id`, `name`)
- `announcements`: záznamy oznamov s názvom, obsahom, dátumom publikácie a väzbami na kategórie

## Návrh backendu

Backend používa vrstvenú štruktúru:

- `routes`: definícia endpointov a napojenie validácie,
- `controllers`: orchestrace HTTP request/response,
- `services`: business logika a práca s dátami,
- `middlewares`: prierezové funkcionality (validácia, chyby, bezpečnosť),
- `utils`: pomocné abstractions (async wrappery, logging, app errors).

### Čo robí Express v tomto projekte

Express je HTTP framework, ktorý zabezpečuje:

- mapovanie requestov na endpointy (napr. `GET /api/announcements`),
- vykonávanie middleware pipeline (`helmet`, `cors`, JSON parsing, logging),
- manažment request/response lifecycle,
- propagáciu chýb do centralizovaného error handlera.

### WebSocket prístup („hybridný“ model)

Aplikácia používa hybridný komunikačný model:

- REST API pre CRUD operácie a načítanie dát,
- WebSocket iba pre event notifikácie (napr. `announcement.created`).

Týmto spôsobom ostáva backend jednoduchý a zároveň poskytuje real-time UX tam, kde to má zmysel.

## API prehľad

### Health

- `GET /health`

### Kategórie

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Oznamy

- `GET /api/announcements`
- `GET /api/announcements/search?q=...`
- `GET /api/announcements/category/:categoryId`
- `GET /api/announcements/:id`
- `POST /api/announcements`
- `PUT /api/announcements/:id`
- `DELETE /api/announcements/:id`

### Realtime

- WebSocket endpoint: `/ws`
- Príklad eventu: `announcement.created`

## Testovanie API cez Postman

Najrýchlejší spôsob, ako overiť správanie backendu cez Postman:

1. Vytvor si Postman environment s premennou:
   - `baseUrl` = `http://localhost:4001` (lokálne) alebo `https://zadanie-simplicity.render.com` (deploy)
2. Vytvor kolekciu a v requestoch používaj prefix `{{baseUrl}}`.
3. Pre `POST` / `PUT` nastav hlavičku:
   - `Content-Type: application/json`

Odporúčaný testovací postup:

1. **Health check**
   - `GET {{baseUrl}}/health`
   - Očakávané: `200 OK` a `{ "status": "ok" }`

2. **Načítanie kategórií**
   - `GET {{baseUrl}}/api/categories`
   - Očakávané: `200 OK` a pole kategórií

3. **Vytvorenie oznamu**
   - `POST {{baseUrl}}/api/announcements`
   - Body (raw JSON):

```json
{
  "id": 9999,
  "title": "Postman test announcement",
  "description": "Created from Postman",
  "categoryIds": [1],
  "publicationDate": "2026-02-23T10:00:00.000Z"
}
```

4. **Úprava oznamu**
   - `PUT {{baseUrl}}/api/announcements/9999`
   - Body (raw JSON):

```json
{
  "title": "Updated in Postman",
  "description": "Updated content",
  "categoryIds": [1],
  "publicationDate": "2026-02-23T11:00:00.000Z"
}
```

5. **Vyhľadanie oznamov**
   - `GET {{baseUrl}}/api/announcements/search?q=postman`

6. **Zmazanie oznamu**
   - `DELETE {{baseUrl}}/api/announcements/9999`
   - Očakávané: `204 No Content`

Ak validácia requestu zlyhá, API vráti `400` s detailmi validačných chýb.

## Bezpečnosť a validácia

Použité ochranné prvky zahŕňajú:

- `helmet` pre bezpečné HTTP hlavičky,
- `cors` s explicitným allowlistom originov,
- limit veľkosti request body (`express.json({ limit: '10kb' })`),
- `express-validator` na validáciu vstupov,
- centralizovaný error handler pre konzistentné API odpovede.

## Lokálny development setup

## 1) Požiadavky

- Node.js (odporúčané LTS)
- npm
- PostgreSQL (lokálne alebo vzdialené Postgres pripojenie)

## 2) Klonovanie a inštalácia závislostí

```bash
git clone <repository-url>
cd zadanie_simplicity
npm install
npm --prefix server install
```

## 3) Konfigurácia environment premenných

Vytvor `server/.env` (môžeš vychádzať zo `server/.env.example`) a nastav:

- `DATABASE_URL`
- `DIRECT_URL`
- `PORT` (predvolene `4001`)
- `CLIENT_URL` (napr. `http://localhost:5173`)
- `ADMIN_SECRET`

## 4) Inicializácia schémy databázy a seed dát

```bash
npm --prefix server run prisma:generate
npm --prefix server run prisma:push
npm --prefix server run seed:mock
```

## 5) Spustenie aplikácie

Spusti backend:

```bash
npm --prefix server run dev
```

Spusti frontend:

```bash
npm run dev
```

Potom otvor `http://localhost:5173`.

## Dostupné skripty

### Root (frontend)

- `npm run dev` – spustí Vite dev server
- `npm run build` – type-check + build frontendu
- `npm run preview` – preview produkčného buildu
- `npm run lint` – spustí ESLint

### Server

- `npm --prefix server run dev` – spustí backend vo watch móde
- `npm --prefix server run build` – skompiluje backend TypeScript
- `npm --prefix server run start` – spustí skompilovaný backend
- `npm --prefix server run prisma:generate` – vygeneruje Prisma client
- `npm --prefix server run prisma:push` – push Prisma schémy do DB
- `npm --prefix server run prisma:migrate` – spustí Prisma migrácie
- `npm --prefix server run seed:mock` – naplní DB mock dátami

## Poznámky k nasadeniu

Render + Supabase boli zvolené preto, aby deployment ostal rýchly a v súlade s cieľmi zadania, pričom stále poskytuje:

- produkčné HTTPS endpointy,
- manažment environment premenných,
- PostgreSQL kompatibilitu s Prisma,
- WebSocket podporu pre real-time notifikácie.

Tým sa zároveň minimalizuje infra overhead (napr. AWS networking/IAM setup), ktorý nie je jadrom tohto zadania.

## Praktické poznámky z implementácie

Táto sekcia dopĺňa stručné dôvody za vybranými rozhodnutiami.

### Bezpečnostné voľby

API je zámerne jednoduché, ale obsahuje rozumný bezpečnostný základ:

- `helmet` nastavuje bezpečné HTTP hlavičky,
- `cors` povoľuje iba definované originy,
- `express-validator` zachytáva nevalidné vstupy ešte pred business logikou,
- centralizovaný error handling drží odpovede konzistentné.

V rámci rozsahu zadania je to dobrý kompromis medzi bezpečnosťou a jednoduchosťou.

### Prečo nie MongoDB alebo DynamoDB

Doména je štruktúrovaná a relačná (oznamy, kategórie, predvídateľné query patterns), preto:

- PostgreSQL prirodzene zvláda joiny a filtrovanie,
- Prisma modelovanie ostáva jednoduché,
- prevádzková komplexita je nižšia.

MongoDB aj DynamoDB sú použiteľné, ale v tomto prípade neboli najlepší tradeoff.

### Real-time prístup

WebSocket sa používa len na ľahké event notifikácie (napr. `announcement.created`). CRUD a načítanie dát ostávajú na REST API. Tento hybridný prístup drží systém prehľadný a zároveň zlepšuje UX cez real-time aktualizácie.