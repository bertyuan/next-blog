# Tech Research Documents

> Last Updated: 2026-04-06  
> Scope: Current implementation in this repository (frontend, APIs, CMS, database, auth, comments, email, and engineering workflow)

## 1. Research Objective

This document summarizes the current technical architecture, key implementation decisions, risks, and evolution paths for planning and technical review.

## 2. System Positioning

This project is a full-stack blog platform with these core capabilities:

- Content publishing and management (Payload CMS)
- Reading-first frontend experience (Next.js App Router)
- User interaction (OAuth login, comments, share, subscribe)
- Distribution and SEO (RSS, OG image generation, JSON-LD, sitemap)

## 3. Current Tech Stack

| Layer | Selection | Current Role |
| --- | --- | --- |
| Web framework | Next.js 15 + React 19 | Routing, server rendering, client interactions |
| Language | TypeScript 5.7 | End-to-end type safety |
| UI and styling | Tailwind CSS v4 + shadcn/ui + fumadocs-ui + motion | Design system, layout, interaction effects |
| CMS | Payload CMS v3 + Lexical | Content modeling, admin panel, rich text editing |
| Database | PostgreSQL + Drizzle ORM | Persistence for auth/comments and related data |
| Auth | better-auth | OAuth (Google/GitHub) and session handling |
| Comments | @fuma-comment/react + @fuma-comment/server | Comment display, write, and interaction |
| Email | Resend + React Email | Newsletter subscription and email templates |
| Validation | zod + @t3-oss/env-nextjs | Environment and input validation |
| Engineering quality | Vitest + Testing Library + Biome | Tests, lint, and formatting |

## 4. Architecture Overview

### 4.1 Module Layers

1. Presentation layer: `src/app/(main)` and `src/components`
2. Content access layer: `src/lib/payload-posts.ts` (query and DTO normalization)
3. Auth/comment layer: `src/server/auth`, `src/server/comments/config.ts`, and comment API routes
4. Data layer: `src/server/db` (Drizzle schema + DB connection)
5. CMS admin layer: `src/app/(payload)` + `payload.config.ts`

### 4.2 Typical Read Flow (Posts)

1. A server component calls `getPublishedPosts` or `getPostBySlug`.
2. Payload reads from PostgreSQL `payload` schema.
3. `transformPost` normalizes documents into `BlogPost`.
4. The page renders and mounts client interactions (share/comments).

### 4.3 Typical Write Flow (Comments)

1. Post page comment component calls `/api/comments/[...comment]`.
2. API route delegates handling to `NextComment`.
3. Session is validated via better-auth adapter.
4. Drizzle adapter writes to `blog_comments`, `blog_rates`, and `blog_roles`.

## 5. Key Implementation Findings

### 5.1 Content Modeling (Payload)

Defined collections:

- `posts`: title, slug, description, content, featured image, author, tags, status, publish time
- `users`: auth-enabled user collection
- `media`: image uploads (`public/media`)

Config highlights:

- Payload uses PostgreSQL `payload` schema.
- Lexical is used as the editor.
- Generated type file is `payload-types.ts`.

### 5.2 Data Access Strategy

`src/lib/payload-posts.ts` centralizes:

- Published post pagination
- Post lookup by slug
- Slug list for static params
- Tag-based filtering
- Tag statistics

Benefits:

- UI layer is decoupled from raw CMS document shape.
- Frontend consistently consumes normalized `BlogPost`.

### 5.3 Auth Implementation

- better-auth + Drizzle adapter (PostgreSQL)
- OAuth providers: Google and GitHub
- Extended user field: `role` (default `user`)
- Session retrieval: `auth.api.getSession({ headers })`

### 5.4 Comment Implementation

- Frontend component: `@fuma-comment/react`
- Backend entry: `NextComment` route handlers
- Tables: `comments`, `rates`, `roles`
- Existing TODO indicates role governance is not fully completed

### 5.5 SEO and Distribution

Implemented:

- Page metadata generation
- JSON-LD for posts/tags
- RSS/Atom output (`/rss.xml`)
- Dynamic OG image routes (`/banner.png`, `/og/[...slug]`)
- `next-sitemap` sitemap generation

### 5.6 Newsletter and Email

- Form flow: `next-safe-action` + `react-hook-form` + zod
- Subscription flow: Resend audience contact create/update
- Template system: React Email (`emails/newsletter-welcome.tsx`)

Current state: welcome email send logic exists but is currently commented out in action flow.

### 5.7 Testing and Quality

- Tests mainly cover `components/hooks/lib`
- Test stack: Vitest + jsdom
- Static checks: Biome
- Content link validation script: `scripts/lint.mts`

## 6. Data Model Findings

### 6.1 Auth-related Tables (`blog_*`)

- `blog_users`
- `blog_sessions`
- `blog_accounts`
- `blog_verifications`

### 6.2 Comment-related Tables (`blog_*`)

- `blog_comments`
- `blog_rates`
- `blog_roles`

### 6.3 Schema Separation Strategy

- CMS content: `payload` schema
- App auth/comments: `blog_*` tables

Advantage: clear boundary between CMS-managed structures and application-owned business tables.

## 7. Runtime and Operations

### 7.1 Environment Governance

`src/env.js` enforces validation for DB, Resend, OAuth, and analytics variables. `SKIP_ENV_VALIDATION` is supported for specific local workflows.

### 7.2 Local Database Bootstrap

`start-database.sh` supports Docker/Podman and includes:

- Port conflict checks
- Existing container reuse
- Default password replacement prompt

### 7.3 Common Scripts

- Run: `dev`, `build`, `preview`, `start`
- Data: `db:*`, `payload:*`
- Quality: `lint`, `check`, `test`, `test:coverage`

## 8. Risk and Technical Debt Assessment

| Priority | Finding | Evidence | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| P0 | Potential missing type dependency in email utility | `src/lib/resend.ts` imports type from `./source`, but `src/lib/source.ts` is absent | Type-check/build instability risk | Replace with explicit local type or add the missing module |
| P0 | Payload secret has a default fallback | `payload.config.ts` uses `process.env.PAYLOAD_SECRET || 'your-secret-key'` | Production misconfiguration security risk | Enforce required secret in production and fail fast |
| P1 | RSS path inconsistency risk | Actual route is `/rss.xml`, while some references use `/api/rss.xml` | Feed discovery may fail in clients | Unify RSS canonical path and all references |
| P1 | In-memory aggregation bottleneck at scale | Search/RSS/tag stats read up to 1000 posts and aggregate in memory | Performance degradation as content grows | Move to DB-side aggregation/pagination and incremental indexing |
| P1 | Base URL tied to one deployment variable | `baseUrl` mainly depends on `VERCEL_PROJECT_PRODUCTION_URL` | Wrong canonical/OG URLs in non-Vercel production | Add explicit `NEXT_PUBLIC_SITE_URL` and enforce in production |
| P2 | Comment role governance is incomplete | Role TODO exists in comment config | Future moderation/delete policy gaps | Complete role policy and add policy tests |
| P2 | Mixed language usage in code/comments | English and Chinese are mixed in labels/comments | Collaboration and consistency friction | Define and enforce a language policy |

## 9. Suggested Evolution Roadmap

### Phase 1: Stability and Correctness

1. Fix `resend.ts` type dependency issue.
2. Harden production config checks (Payload secret, site URL).
3. Align all RSS path references.

### Phase 2: Scalability

1. Move tag statistics to DB aggregation.
2. Introduce incremental search indexing.
3. Add caching/revalidation boundaries for high-traffic pages.

### Phase 3: Governance and Developer Efficiency

1. Establish ADR (Architecture Decision Record) practice.
2. Add route-level integration tests (auth/comments/rss/search).
3. Add CI gates: `typecheck + test + lint + link validation`.

## 10. Summary

The project has a solid modern baseline (Next.js + Payload + Drizzle + better-auth), clear module boundaries, and strong extensibility. In the short term, focus on configuration hardening and correctness. In the mid term, focus on scaling and governance.

