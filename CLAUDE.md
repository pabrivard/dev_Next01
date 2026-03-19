# Dev_Next01 — CLAUDE.md

## Project description

SaaS web application — Platform connecting relocation companies with
independent consultants.
Current version: 0.1.6 — Current sprint: Sprint 006.

---

## Technical stack

| Tool / Library           | Version  | Purpose                        |
|--------------------------|----------|--------------------------------|
| Next.js                  | 15.x     | Framework (App Router)         |
| React                    | 19.x     | UI library                     |
| TypeScript               | 5.x      | Language (strict mode)         |
| Tailwind CSS             | 4.x      | Utility-first CSS              |
| PostgreSQL               | 16.x     | Database                       |
| Prisma                   | 7.x      | ORM                            |
| next-auth (Auth.js v5)   | beta     | Authentication                 |
| @auth/prisma-adapter     | latest   | Auth.js ↔ Prisma bridge        |
| @prisma/adapter-pg       | latest   | Prisma 7 driver adapter for PG |
| pg                       | latest   | PostgreSQL client (Node.js)    |
| Resend                   | latest   | Transactional emails           |
| @react-email/components  | latest   | Email templates                |
| @react-email/render      | latest   | Email rendering                |
| next-intl                | latest   | Internationalization (i18n)    |
| zod                      | latest   | Schema validation              |
| lucide-react             | latest   | Icons                          |
| clsx                     | latest   | Conditional classnames         |
| tailwind-merge           | latest   | Tailwind class merging         |
| shadcn/ui                | latest   | UI component library           |
| Capacitor                | latest   | Mobile wrapper (iOS + Android) |

---

## Versioning convention

Format: `major.sprint.fix`
Examples: `0.1.3` = major 0, sprint 1, fix 3 — `0.2.0` = sprint 2, no fix

---

## Coding rules

- All code, comments, variable names, function names, and file names
  must be written in **English**
- Keep code as simple and minimal as possible: prioritize readability,
  performance, and ease of modification
- Never add unused code, components, imports, or dependencies
- Do not install new dependencies unless strictly required — always
  explain why before adding one
- Never modify `package.json` dependencies without explaining why
  (name the package and the reason)
- Always use the latest stable versions of all frameworks, tools,
  and dependencies
- Use strict TypeScript at all times — **never use `any`**
- Before creating new code or modifying existing code, check for:
  - Duplicate logic or components already present in the codebase
  - Negative impacts on existing features or files
- Naming conventions:
  - PascalCase → React components
  - camelCase → functions and variables
  - UPPER_SNAKE_CASE → constants
- Always type imports explicitly — no implicit types
- Follow Next.js 15 App Router conventions — **no /pages directory**
- Default to **React Server Components** — use `'use client'` only when
  interactivity (useState, useEffect, event handlers) is strictly required
- Use **`useActionState`** (React 19) for form submissions tied to
  Server Actions
- Zod validation errors must return **user-friendly messages** in the UI
  — never expose raw Zod error objects to the client
- Never expose secrets in client components
- Environment variables must be server-only unless explicitly prefixed
  with `NEXT_PUBLIC_`
- Credentials must never appear in code, comments, or committed documents
  — they belong only in `.env` files and sprint prompts
- Never create new CSS files — use **Tailwind utility classes only**
- After each feature implementation:
  - Run `npm run build` — fix any TypeScript error before committing
  - Run `npm run dev` — verify no runtime errors on localhost
  - Do not commit if either check fails

### shadcn/ui rules

- Always use existing shadcn components before creating a custom one
- **Never modify files inside `src/components/ui/` directly**
- Extend via wrapper components in `src/components/`
- Only install shadcn components when a feature actually requires them
  — never pre-install speculatively
- Never create a new component if an existing shadcn component covers
  the need

---

## Decision rules

- If a coding rule conflicts with a real-world constraint, explain the
  conflict clearly and propose an alternative before proceeding
- Always prioritize working, production-safe code over strict rule
  adherence
- When uncertain about an action or its impact, stop and ask before
  proceeding
- Never silently skip a step — if a step cannot be completed, explain why

---

## Database naming conventions

**Table names:** prefix `n01_` + plural noun
(e.g. `n01_users`, `n01_sessions`)

**Column names:** `singular_element_name` + `_` + type code + `_` +
simple column name

| Type code | Usage            | Example             |
|-----------|------------------|---------------------|
| `ID`      | identifiers      | `user_ID`           |
| `N`       | numeric values   | `user_N_age`        |
| `B`       | boolean values   | `user_B_active`     |
| `DT`      | date or datetime | `user_DT_createdAt` |
| `T`       | text             | `user_T_name`       |

Auth.js requires specific field names in its Prisma adapter.
Use `@@map` and `@map` directives to apply custom column names while
keeping Auth.js field names in the Prisma schema:
```prisma
model User {
  id    String  @id @map("user_ID")
  email String? @unique @map("user_T_email")
  @@map("n01_users")
}
```

### ID strategy

All IDs use `String @default(cuid())` — including all future business
tables. The Auth.js Prisma adapter requires String IDs. Numeric
auto-increment IDs are not used in this project.

### Prisma 7 specifics

- Generator: `provider = "prisma-client"` with
  `output = "../src/generated/prisma"` — **not** the legacy
  `prisma-client-js`
- Generated client import path: `@/generated/prisma/client`
- Database URL is configured in `prisma.config.ts` (not in
  `schema.prisma` — Prisma 7 breaking change)
- Runtime connection uses `@prisma/adapter-pg`:
  `new PrismaClient({ adapter: new PrismaPg({ connectionString: ... }) })`
- Never put `url` in the `datasource db {}` block in `schema.prisma`

---

## Internationalization (i18n)

- Library: **next-intl**
- Supported locales: `fr` (default), `en`
- URL structure: `/[locale]/...` (e.g. `/fr`, `/en`)
- Language auto-detected from browser `Accept-Language` header
- Fallback to French if browser language is not recognized
- Translation files: `messages/fr.json` and `messages/en.json`
- Translation keys: camelCase, grouped by page or feature
  (e.g. `signIn.title`, `signIn.submitButton`)
- **Never hardcode user-visible strings** — always use translation keys
- Error codes are resolved to translated strings in the UI layer —
  never in server actions
- Language switcher on sign-in page — to be moved to header in a
  future sprint

---

## Authentication architecture

- Sign-in entry point: `/[locale]` (magic link only, no password)
- Provider: Auth.js Email provider via Resend
- `src/lib/auth.ts` → Edge-safe config — used by middleware only
- `src/lib/auth.node.ts` → Full config with PrismaAdapter + Resend —
  used by API routes and Server Actions only

### User model fields

| Field          | Type     | Default  | Column          |
|----------------|----------|----------|-----------------|
| `id`           | String   | cuid()   | `user_ID`       |
| `name`         | String?  | —        | `user_T_name`   |
| `email`        | String?  | —        | `user_T_email`  |
| `emailVerified`| DateTime?| —        | `user_DT_emailVerifiedAt` |
| `image`        | String?  | —        | `user_T_image`  |
| `role`         | Role     | CLIENT   | `user_T_role`   |
| `active`       | Boolean  | true     | `user_B_active` |

### User roles

| Role       | Description                  | Default |
|------------|------------------------------|---------|
| `ADMIN`    | Platform developers / admins |         |
| `CLIENT`   | Relocation companies         | ✅      |
| `PROVIDER` | Independent consultants      |         |

### Role-based access control

| Role       | Accessible routes                        |
|------------|------------------------------------------|
| `ADMIN`    | All routes                               |
| `CLIENT`   | `/[locale]/client/*` + public routes     |
| `PROVIDER` | `/[locale]/provider/*` + public routes   |

- Role exposed on session: `session.user.role`
- TypeScript types extended in `src/types/next-auth.d.ts`

### Route protection

- All routes protected except `/[locale]` and `/api/auth/*`
- Middleware (`middleware.ts`) chains next-intl (locale detection)
  and Auth.js (route protection) — intl runs first
- Middleware is Edge-compatible — no Node.js native imports
- Unauthenticated users redirected to `/[locale]`

### Sign-in server action — check order

1. Validate email with Zod → `INVALID_EMAIL` / `EMAIL_REQUIRED`
2. Query database for user by email → `USER_NOT_FOUND`
3. Check `user.active === true` → `ACCOUNT_INACTIVE`
4. Call Auth.js `signIn("resend")` → `RESEND_ERROR` / `SERVER_ERROR`
5. Return `{ success: true, email }`

### Typed error codes

| Code               | Trigger                          |
|--------------------|----------------------------------|
| `EMAIL_REQUIRED`   | Empty email field                |
| `INVALID_EMAIL`    | Invalid email format             |
| `USER_NOT_FOUND`   | Email not in database            |
| `ACCOUNT_INACTIVE` | user_B_active is false           |
| `RESEND_ERROR`     | Resend API failure               |
| `SERVER_ERROR`     | Any other unexpected error       |

---

## Session-aware layout

- `UserInfo` server component in `src/components/layout/UserInfo.tsx`
- Reads session via `auth()` from `src/lib/auth.node.ts`
- Renders user email + role when authenticated
- Renders nothing when unauthenticated
- Placed in `src/app/[locale]/layout.tsx` above `{children}`

---

## Mobile (Capacitor)

- The mobile app is a wrapper around the deployed web application
- Capacitor loads the production URL — no static export
- `server.url` must be a hardcoded string (not `process.env`)
- Placeholder: `https://your-production-url.com` — replace at deployment
- `ios/` and `android/` folders are never committed to git

---

## Branch strategy

| Branch          | Purpose                                      |
|-----------------|----------------------------------------------|
| `main`          | Production — protected, never push directly  |
| `preproduction` | Integration — Claude Code always pushes here |

Claude Code must **only push to `preproduction`**. The `main` branch
is updated manually by the Product Owner after validation.

### Conventional Commits

Format: `type: short description`

| Prefix      | When to use                                        |
|-------------|----------------------------------------------------|
| `feat:`     | New feature                                        |
| `fix:`      | Bug fix                                            |
| `chore:`    | Tooling, config, dependencies                      |
| `docs:`     | Documentation only                                 |
| `refactor:` | Code restructuring without behavior change         |

---

## Standard output format

For each sprint step:
1. State what you are about to do
2. Execute the commands or create the files
3. Run `npm run build` — confirm no TypeScript errors ✅
4. Verify no runtime errors on localhost ✅
5. Summarize completion briefly and proceed ✅

At the end of each sprint, provide:
- A full recap of everything completed
- The list of environment variables to set manually
- Recommended next steps for the following sprint

---

## Important reminders

- **Always check existing code before creating or modifying anything**
- **Always ask for confirmation before deleting files or modifying
  the production database**
- **Never commit `.env` or `.env.local`**
- **Never push directly to `main`** — always push to `preproduction`
- **Ask for confirmation before any `git push --force`**