# UI Design Documents

> Last Updated: 2026-04-06  
> Scope: Current implementation in this repository (Next.js frontend + Payload content system)

## 1. Document Purpose

This document captures the UI design of the current implementation and serves as a baseline for future iterations. It covers:

- Information architecture and page structure
- Visual language and component conventions
- Interaction behavior, responsiveness, and accessibility baseline
- Actionable UI improvements for the current codebase

## 2. Product Positioning and Design Principles

The site is currently positioned as a content-first technical blog. The UI follows these principles:

1. Reading first: prioritize hierarchy, contrast, and low visual noise.
2. Lightweight navigation: keep access to posts, tags, and login straightforward.
3. Consistent style: use dashed borders, corner crosses, and subtle motion as a recognizable theme.
4. Low learning cost: both anonymous and authenticated flows should be intuitive.
5. Cross-device consistency: preserve the same visual language across desktop and mobile.

## 3. User Roles and Core Journeys

| Role | Primary Goal | Core Routes |
| --- | --- | --- |
| Visitor | Browse and read content quickly | `/`, `/posts`, `/posts/[slug]`, `/tags` |
| Returning reader | Filter by topic and engage | `/tags/[tag]`, `/posts/[slug]` (comments) |
| Authenticated user | Comment, share, subscribe | `/login` -> `/posts/[slug]` |
| Content admin | Publish and maintain content | `/admin` (Payload admin) |

## 4. Information Architecture

### 4.1 Route and Page Responsibilities

| Route | Responsibility | Main File |
| --- | --- | --- |
| `/` | Hero + latest posts + newsletter CTA | `src/app/(main)/(home)/page.tsx` |
| `/posts` | Paginated post list | `src/app/(main)/(home)/posts/page.tsx` |
| `/posts/[slug]` | Post detail + share + comments | `src/app/(main)/(home)/posts/[slug]/page.tsx` |
| `/tags` | Tag index | `src/app/(main)/(home)/tags/page.tsx` |
| `/tags/[tag]` | Tag-filtered posts + pagination | `src/app/(main)/(home)/tags/[...slug]/page.tsx` |
| `/about` | MDX content page (profile) | `src/app/(main)/(home)/(mdx)/about/page.mdx` |
| `/login` | OAuth login page | `src/app/(main)/(auth)/login/page.tsx` |
| `404` | Not found page | `src/app/(main)/not-found.tsx` |

### 4.2 Global Layout Structure

- The main shell is based on `HomeLayout`, with custom `Header` and `Footer`.
- Content sections consistently use the `Section` wrapper for border/corner styling.
- Vertical rhythm is maintained using dashed separators between major blocks.

Related files:

- `src/app/(main)/(home)/layout.tsx`
- `src/components/sections/header/index.tsx`
- `src/components/sections/footer.tsx`
- `src/components/section.tsx`

## 5. Visual Design Guidelines

### 5.1 Typography and Layout

- Primary font: `Geist`; monospace font: `Geist Mono`.
- Home and detail pages use strong heading hierarchy (`text-3xl` to `text-6xl`).
- Secondary information uses muted color tokens to improve reading focus.

### 5.2 Color and Theme

- Color tokens are mapped to `fumadocs` variables (`src/styles/globals.css`).
- Supports `light`, `dark`, and `system` theme modes.
- Cards use translucent backgrounds (`bg-card/50`) with hover transitions.

### 5.3 Shape and Decoration

- Signature visual elements: dashed borders + corner cross markers.
- Hero and separators use textured pattern backgrounds (`bg-dashed`).
- Footer uses a grid + gradient overlay to create depth.

### 5.4 Icon System

- Base icons come from `lucide-react`; brand icons are wrapped in `Icons`.
- Icons are used for navigation, status communication, and interaction feedback.

## 6. Page-Level Design Notes

### 6.1 Home `/`

Structure:

1. Hero (personal positioning + CTA + social links)
2. Posts section heading
3. Latest 3 posts
4. Newsletter subscription block

Notes:

- Hero uses background imagery and fade-in motion for first-screen identity.
- The messaging is personal-brand oriented rather than marketing oriented.

### 6.2 Posts List `/posts`

- Shows total count and current range (for example `1-5`).
- Uses horizontal information cards for fast scanning.
- Pagination supports numbered jumps and ellipsis.

### 6.3 Post Detail `/posts/[slug]`

- Top area includes title, description, and tags.
- Main area renders rich text content.
- Desktop includes a sticky side panel for author/date/share.
- Bottom includes comments (posting requires login).

### 6.4 Tags `/tags` and `/tags/[tag]`

- `/tags`: tag grid with counts.
- `/tags/[tag]`: reuses the posts-list visual pattern for consistency.

### 6.5 Login `/login`

- Centered card layout aligned with global style (dashed borders + corner markers).
- Currently supports Google/GitHub OAuth only.

## 7. Core Component Interaction Guidelines

| Component | Current Behavior | Design Intent |
| --- | --- | --- |
| `Header` | Sticky nav, search, theme toggle, mobile menu | Keep global actions always reachable |
| `PostCard` | Fully clickable card with title/summary/meta/image | Improve list browsing efficiency |
| `TagCard` | Tag chip with optional count | Encourage topic discovery |
| `NewsletterForm` | Validation + success/error feedback | Reduce subscription friction |
| `ThemeToggle` | Theme switch with transition effect | Keep switching smooth and perceptible |
| `UserButton` | Session-aware menu (sign in/sign out) | Minimize account operation complexity |

## 8. Motion and Feedback

Implemented interaction feedback:

- Hero background fade-in (`motion`)
- Hover transforms on icons and buttons
- Theme transition via `startViewTransition`
- Share action success toast after copy

Guideline:

- Keep motion short, lightweight, and functional; avoid distracting animation.

## 9. Responsive and Accessibility Baseline

### 9.1 Responsive Behavior

- Uses Tailwind breakpoint system (`sm` to `2xl`).
- Header collapses into a menu on smaller screens.
- Post detail layout falls back from dual-column to single-column on small screens.

### 9.2 Accessibility

Current baseline:

- Core semantic structure is in place (`main`, `section`, `article`).
- Key icon buttons include accessible labels.

Recommended improvements:

1. Improve visible keyboard focus states for custom controls.
2. Audit all icon-only links to ensure explicit accessible naming.

## 10. Current Issues and Priority Improvements

### P0 (high priority)

1. Mixed language tone across content should be standardized.
2. Missing explicit empty states for posts/tags views.
3. Newsletter flow can further improve repeated-submit protection messaging.

### P1 (medium priority)

1. Add reusable skeletons for list views (future-proof for client data loading).
2. Extract a shared page-header component to reduce repeated patterns.
3. Add design token documentation (spacing, radius, border rules).

### P2 (low priority)

1. Add visual regression screenshot baseline for key pages.
2. Add a component snapshot guide under `docs/`.

## 11. Next Iteration Design Checklist

- [ ] Extract a shared page-header component
- [ ] Add reusable empty-state modules
- [ ] Run an accessibility-focused pass
- [ ] Define and enforce copy language policy
- [ ] Build component visual reference documentation
