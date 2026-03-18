# Dev_Next01 — CLAUDE.md

## Project description

SaaS web application — Platform connecting relocation companies with independent consultants.
Current version: 0.1.4 — Current sprint: Sprint #004.

---

## Technical stack

| Tool / Library           | Version     | Purpose                        |
|--------------------------|-------------|--------------------------------|
| Next.js                  | 16.x        | Framework (App Router)         |
| React                    | 19.x        | UI library                     |
| TypeScript               | 5.x         | Language (strict mode)         |
| Tailwind CSS             | 4.x         | Utility-first CSS              |
| PostgreSQL                | 16.x        | Database                       |
| Prisma                   | 7.x         | ORM                            |
| next-auth (Auth.js v5)   | beta        | Authentication                 |
| @auth/prisma-adapter     | latest      | Auth.js ↔ Prisma bridge        |
| @prisma/adapter-pg       | latest      | Prisma 7 driver adapter for PG |
| pg                       | latest      | PostgreSQL client (Node.js)    |
| Resend                   | latest      | Transactional emails           |
| @react-email/components  | latest      | Email templates                |
| @react-email/render      | latest      | Email rendering                |
| zod                      | latest      | Schema validation              |
| lucide-react             | latest      | Icons                          |
| clsx                     | latest      | Conditional classnames         |
| tailwind-merge           | latest      | Tailwind class merging         |
| shadcn/ui                | latest      | UI component library           |

---

## Coding rules

- All code, comments, variable names, function names, and file names must be written in **English**
- Keep code as simple and minimal as possible: prioritize readability, performance, and ease of modification
- Never add unused code, components, imports, or dependencies
- Minimize the number of dependencies: prefer native solutions when sufficient
- Always use the latest stable versions of all frameworks, tools, and dependencies
- **Never modify package.json dependencies without explaining why**
- Use strict TypeScript at all times — **never use `any`**
- Before creating new code or modifying existing code, check for:
  - Duplicate logic or components already present in the codebase
  - Negative impacts on existing features or files
- Naming conventions:
  - PascalCase → React components
  - camelCase → functions and variables
  - UPPER_SNAKE_CASE → constants
- Always type imports explicitly — no implicit types
- Follow Next.js 15+ App Router conventions — **no /pages directory**
- Never expose secrets in client components
- Environment variables must be server-only unless explicitly prefixed with `NEXT_PUBLIC_`

### shadcn/ui rules

- Always use existing shadcn components before creating a custom one
- **Never modify files inside `src/components/ui/` directly**
- Extend via wrapper components in `src/components/`
- Do not install additional shadcn components unless explicitly required

---

## Database naming conventions

**Table names:** prefix `n01_` + plural noun (e.g. `n01_users`, `n01_sessions`)

**Column names:** `singular_element_name` + `_` + type code + `_` + simple column name

| Type code | Usage              | Example              |
|-----------|--------------------|----------------------|
| `ID`      | identifiers        | `user_ID`            |
| `N`       | numeric values     | `user_N_age`         |
| `B`       | boolean values     | `user_B_active`      |
| `DT`      | date or datetime   | `user_DT_createdAt`  |
| `T`       | text               | `user_T_name`        |

Auth.js requires specific field names in its Prisma adapter. Use `@@map` and `@map` directives to
apply custom column names while keeping Auth.js field names in the Prisma schema:

```prisma
model User {
  id    String  @id @map("user_ID")
  email String? @unique @map("user_T_email")
  @@map("n01_users")
}
```

### Prisma 7 specifics

- Generator: `provider = "prisma-client"` with `output = "../src/generated/prisma"` — **not** the legacy `prisma-client-js`
- Generated client import path: `@/generated/prisma/client`
- Database URL is configured in `prisma.config.ts` (not in `schema.prisma` — Prisma 7 breaking change)
- Runtime connection uses `@prisma/adapter-pg`: `new PrismaClient({ adapter: new PrismaPg({ connectionString: ... }) })`
- Never put `url` in the `datasource db {}` block in `schema.prisma`

---

## Branch strategy

| Branch          | Purpose                                              |
|-----------------|------------------------------------------------------|
| `main`          | Production — protected, never push directly          |
| `preproduction` | Integration branch — Claude Code always pushes here  |

Claude Code must **only push to `preproduction`**. The `main` branch is updated manually by the Product Owner after validation.

### Conventional Commits

Format: `type: short description`

| Prefix       | When to use                            |
|--------------|----------------------------------------|
| `feat:`      | New feature                            |
| `fix:`       | Bug fix                                |
| `chore:`     | Tooling, config, dependencies          |
| `docs:`      | Documentation only                     |
| `refactor:`  | Code restructuring without behavior change |

---

## Sprint #003 — Key decisions

### Authentication
- Sign-in entry point: `/` (magic link only, no password field)
- Provider: Auth.js Email provider via Resend
- `auth.ts` is Edge-safe (no Node.js modules) — used by middleware only
- `auth.node.ts` is the full config with `PrismaAdapter` + Resend — used by API routes and Server Actions only

### User roles
- Three roles: `ADMIN` (developers/admins), `CLIENT` (relocation companies), `PROVIDER` (consultants)
- Default role at registration: `CLIENT`
- Column: `user_T_role` on `n01_users`

### Route protection
- All routes are protected except `/` and `/api/auth/*`
- Middleware at `middleware.ts` is Edge-compatible — no Node.js native imports
- Unauthenticated users are redirected to `/`

### Capacitor
- `server.url` must be a hardcoded string (not `process.env`)
- Placeholder: `https://your-production-url.com` — replace at deployment

### No deployment this sprint — localhost only

---

## Sprint #004 — Key decisions

### Sign-in page
- Redesigned to match provided mockups (three states: default, error, success)
- Implemented in `src/app/page.tsx` as a `'use client'` component using `useActionState` (React 19)
- `src/components/SignInForm.tsx` deleted — all logic now lives directly in `page.tsx`
- shadcn components used: Card, Input, Label, Button, Separator
- Icons: `Mail` from lucide-react
- No new CSS files — Tailwind utility classes only

### Error handling
- Server action (`src/app/actions/auth.ts`) returns typed error codes via `SignInResult` union type
- Error codes: `INVALID_EMAIL`, `EMAIL_REQUIRED`, `USER_NOT_FOUND`, `ACCOUNT_INACTIVE`, `RESEND_ERROR`, `SERVER_ERROR`
- `user_B_active` field not yet in schema — `ACCOUNT_INACTIVE` check skipped until field is added

### Toast notifications
- `sonner` (already installed) used for server/auth error toasts — no separate toast package needed
- `Toaster` added to `src/app/layout.tsx` with `position="top-center"` and `richColors`
- Toast errors: `USER_NOT_FOUND`, `ACCOUNT_INACTIVE`, `SERVER_ERROR`, `RESEND_ERROR`

### Inline validation
- `INVALID_EMAIL` → inline error below the email input: "Veuillez saisir une adresse email valide."
- `EMAIL_REQUIRED` → inline error below the email input: "L'adresse email est obligatoire."

### Footer links
- Three links displayed at the bottom of the page: CGU, Mentions légales, Politique de confidentialité
- All use `href="#"` — pages not yet created

### S'inscrire link
- Displayed below the separator on the sign-in form
- Uses `href="#"` — registration page not yet created

### No deployment this sprint — localhost only

---

## Important reminders

- **Always check existing code before creating or modifying anything** — avoid duplicates
- **Always ask for confirmation before deleting files or modifying the production database**
- **Never modify package.json dependencies without explaining why** (name the package and reason)
- **Never commit `.env` or `.env.local`** — they contain secrets
- **Never push directly to `main`** — always push to `preproduction`
- **Ask for confirmation before any `git push --force`**
