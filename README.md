# Systém na správu oznamov

Full-stack appka na oznamy... vytváranie, edit, filtrovanie a pod.

## Produkčné prostredia

- Frontend: https://zadanie-simplicity.vercel.app
- Backend API: https://zadanie-simplicity.render.com
- Databáza: Supabase PostgreSQL
- (príp. local env podľa potreby)

## Ciele projektu

Projekt bol implementovaný cca v 72h, focus bol hlavne na:

- korektnú a stabilnú CRUD logiku,
- backend architektúru (layers...)
- filtrovanie / search,
- bezpečnosť (`helmet`, `cors`, validácie),
- realtime notifikácie cez websocket,
- ďalšie veci podľa času.

## Technologický stack

### Frontend

- React 19
- TypeScript
- Vite
- + bežné FE tooling veci

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- WebSocket (`ws`)
- (error handling, validácie, middleware flow)

### Infraštruktúra

- Vercel (hosting frontendu)
- Render (hosting backendu)
- Supabase (PostgreSQL)
- možno neskôr AWS, zatiaľ netreba

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

Pozn.: schéma je zjednodušená, doplní sa detailnejší flow.

## Prečo PostgreSQL

Oznamy + kategórie sú pevne štruktúrované, preto relačný model dáva zmysel. PostgreSQL:

- silnú konzistenciu pri CRUD operáciách,
- efektívne filtrovanie a vyhľadávanie,
- overené tooling + Prisma kompatibilita.

MongoDB / DynamoDB boli zvažované, ale pre tento use case skôr extra komplexita navyše (indexy/query patterns/modeling rozdiely atď.). Relational fit je tu jednoducho lepší.

## Dátový model (high-level)

- `categories`: záznamy kategórií (`id`, `name`)
- `announcements`: záznamy oznamov (... title, description, publicationDate, category väzby)
- prípadné doplnenie atribútov neskôr

## Návrh backendu

Backend používa vrstvenú štruktúru (klasika pre tento typ API):

- `routes`: definícia endpointov a napojenie validácie,
- `controllers`: request/response orchestrace,
- `services`: business logika + data access,
- `middlewares`: prierezové funkcionality (validácia, chyby, bezpečnosť),
- `utils`: helpery (async wrapper, logger, app error...).

### Čo robí Express v tomto projekte

Express je HTTP framework, ktorý rieši hlavne:

- mapovanie requestov na endpointy (napr. `GET /api/announcements`),
- vykonávanie middleware pipeline (`helmet`, `cors`, JSON parsing, logging),
- request/response lifecycle,
- error flow do centralizovaného handlera.

TODO: doplniť jednoduchý diagram middleware poradia.

### WebSocket prístup („hybridný“ model)

Aplikácia ide cez hybridný model:

- REST API pre CRUD + načítanie dát,
- WebSocket hlavne na event notifikácie (`announcement.created`, ...).

Takto ostáva backend jednoduchší a zároveň je real-time UX tam, kde treba.

---

## API prehľad

### Health

### Kategórie

### Oznamy

### Realtime

## Bezpečnosť a validácia

## Lokálny development setup

## 1) Požiadavky

## 2) Klonovanie a inštalácia závislostí

## 3) Konfigurácia environment premenných

## 4) Inicializácia schémy databázy a seed dát

## 5) Spustenie aplikácie

## Dostupné skripty

### Root (frontend)

### Server

## Poznámky k nasadeniu

## Praktické poznámky z implementácie

### Bezpečnostné voľby

### Prečo nie MongoDB alebo DynamoDB

### Real-time prístup
