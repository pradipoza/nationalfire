# NationalFireSafe

this is the official site of national fire safe pvt ltd 

## Summary
A full-stack TypeScript application:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL-compatible (Neon supported)
- ORM: Drizzle ORM

## Languages
- TypeScript (end-to-end, frontend + backend)
- JavaScript (built artifacts / toolchains)

## Frontend
- React (v18)
- Vite (dev server & production build)
- State & data fetching:
  - @tanstack/react-query
  - wouter (lightweight routing)
- Rich content / editors:
  - TipTap (rich text editor)
  - GrapesJS (+ grapesjs-preset-webpage) — page builder / visual editor
- UI primitives & components:
  - Radix UI (selects, dialogs, tooltips, etc.)
  - lucide-react, react-icons
  - framer-motion (animations)
  - recharts (charts)
- Forms & validation on client:
  - react-hook-form
  - @hookform/resolvers
- Styling:
  - Tailwind CSS (with tailwind-merge & tailwind-animate)
  - PostCSS, autoprefixer

## Backend
- Node.js with Express
- Server-side bundling: esbuild
- Dev server runtime: tsx
- Middleware & HTTP:
  - compression (gzip)
  - helmet (security headers, CSP configured)
  - morgan (logging)
  - express-rate-limit (general and auth-specific limits)
  - CORS handling (custom middleware)
- Authentication & Sessions:
  - passport + passport-local
  - express-session
  - connect-pg-simple (Postgres session store in production)
  - memorystore (in development)
  - bcrypt (password hashing)
- File uploads:
  - multer (memory storage; images returned as base64 assets for GrapesJS)
- Validation & types:
  - zod (schema validation, shared DTOs)

## Database & Data Layer
- PostgreSQL-compatible database (Neon supported via @neondatabase/serverless)
- Drizzle ORM (drizzle-orm) for typed queries and schema
- drizzle-kit for schema/migration push
- Server connects via @neondatabase/serverless Pool (webSocketConstructor configured)

## Shared / Common
- A shared package/module (`@shared/schema`) contains Drizzle table definitions and Zod schemas used by both server and client.

## Build & Tooling
- Vite (frontend build)
- esbuild (server bundle)
- tsx (run TypeScript on server in dev)
- TypeScript compiler (tsc)
- PostCSS / Tailwind tooling

## Dev / Utility Dependencies
- dotenv / environment-driven configuration (env vars used at runtime)
- morgan / custom logging
- rate-limiters and input size limits for DoS protection

## Common Libraries / Notable Packages
- grapesjs, grapesjs-preset-webpage
- @tiptap/react and multiple @tiptap extensions
- @radix-ui/* components
- @neondatabase/serverless
- drizzle-orm and drizzle-zod
- zod and zod-validation-error
- passport-local, express-session, connect-pg-simple
- multer, bcrypt

## Environment (runtime) highlights
- Required: DATABASE_URL (Postgres/Neon)
- Required in production: SESSION_SECRET
- Typical runtime: server listens on port 5000 (0.0.0.0)
- In production, session store uses Postgres; in development, an in-memory store is used.

## Notes / Operational considerations
- GrapesJS integration requires relaxed CSP directives for inline/eval in editor routes — consider scoping relaxed CSP to editor paths in hardened deployments.
- Current image handling returns base64 assets (suitable for demo). For production, migrate to object storage (S3/MinIO) and return hosted URLs.
- Drizzle ORM + drizzle-kit are used for typed DB access and migrations; Neon is supported out of the box.

If you want, I can produce a one-page "architecture diagram" or a compact table of all major packages and their roles (for use in internal documentation).
