# Backend Summary

## Folders and files created

- `src/config`
  - `env.ts`
  - `prisma.ts`
- `src/controllers`
  - `categoryController.ts`
  - `announcementController.ts`
- `src/services`
  - `categoryService.ts`
  - `announcementService.ts`
- `src/routes`
  - `categoryRoutes.ts`
  - `announcementRoutes.ts`
  - `index.ts`
- `src/middlewares`
  - `requireAdminSecret.ts`
  - `validateRequest.ts`
  - `errorHandler.ts`
- `src/websocket`
  - `wsServer.ts`
- `src/utils`
  - `appError.ts`
  - `asyncHandler.ts`
  - `logger.ts`
- Root backend setup
  - `src/app.ts`
  - `src/server.ts`
  - `prisma/schema.prisma`
  - `.env.example`
  - `tsconfig.json`
  - `package.json`

## Controllers and services implemented

### Categories

- `createCategory`
- `getCategories`
- `getCategoryById`
- `updateCategory`
- `deleteCategory`

Service methods:
- `CategoryService.create`
- `CategoryService.findAll`
- `CategoryService.findById`
- `CategoryService.update`
- `CategoryService.remove`

### Announcements

- `createAnnouncement`
- `getAnnouncements`
- `getAnnouncementById`
- `getAnnouncementsByCategory`
- `searchAnnouncements`
- `updateAnnouncement`
- `deleteAnnouncement`

Service methods:
- `AnnouncementService.create`
- `AnnouncementService.findAll`
- `AnnouncementService.findById`
- `AnnouncementService.findByCategory`
- `AnnouncementService.search`
- `AnnouncementService.update`
- `AnnouncementService.remove`

## Endpoints

Base URL prefix: `/api`

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories` (admin secret required)
- `PUT /api/categories/:id` (admin secret required)
- `DELETE /api/categories/:id` (admin secret required)

### Announcements

- `GET /api/announcements`
- `GET /api/announcements/:id`
- `GET /api/announcements/category/:categoryId`
- `GET /api/announcements/search?q=<term>`
- `POST /api/announcements` (admin secret required)
- `PUT /api/announcements/:id` (admin secret required)
- `DELETE /api/announcements/:id` (admin secret required)

## Middleware and websocket setup

- `helmet()` enabled for security headers.
- `cors()` restricted to `CLIENT_URL` from environment.
- `express.json({ limit: '10kb' })` configured.
- Write operations protected by `x-admin-secret` via `requireAdminSecret` middleware.
- Request validation performed with `express-validator` and `validateRequest` middleware.
- `errorHandler` centralizes app and Prisma errors.
- WebSocket server initialized on `/ws` and broadcasts `announcement.created` with full announcement payload when a new announcement is created.

## Database tables and relationship

Using Prisma models mapped to your schema:

- `categories`
  - `id` (primary key)
  - `name`
- `announcements`
  - `id` (primary key)
  - `title`
  - `description`
  - `category_id` (foreign key -> categories.id)
  - `publication_date`
  - `last_update`

Relationship:
- One category has many announcements.
- Each announcement belongs to exactly one category.
