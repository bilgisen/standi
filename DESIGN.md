---
name: StandIdea
description: Clean, modern, multi-language blog platform with shadcn neutral/zinc design system, restrained amber accent, and a glass topbar.

colors:
  # Brand anchors
  amber-500: "oklch(76.9% 0.188 70.08)"

  # Shadcn neutral/zinc tokens (light)
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
  primary: "oklch(0.769 0.188 70.08)"

  # Shadcn neutral/zinc tokens (dark)
  dark-background: "oklch(0.145 0 0)"
  dark-foreground: "oklch(0.985 0 0)"
  dark-card: "oklch(0.205 0 0)"
  dark-muted: "oklch(0.269 0 0)"
  dark-border: "oklch(1 0 0 / 10%)"

typography:
  fontFamily: "Inter, system-ui, sans-serif"
  scale:
    sm: "0.875rem"
    base: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    "2xl": "1.5rem"
    "3xl": "2rem"
    "4xl": "2.5rem"
    "5xl": "3rem"
    "6xl": "3.75rem"

rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
---

# Design System: StandIdea

## Overview

Clean, modern blog platform with Turkish/English multi-language support. Built on the **shadcn neutral/zinc** design system (dark + light + system themes) with a restrained **amber accent** reserved for brand moments, and a **glass topbar**.

## Theme System

- **Three modes:** light, dark, system (system follows OS preference via `matchMedia`).
- Theme stored in `localStorage('theme')`, default **system**.
- Toggle in header (compact sun/moon), full **Light/Dark/System dropdown** in footer.
- `darkMode: 'class'` — applied on `<html>`.

## Color System

### Neutral/zinc surfaces (shadcn defaults)
- **Dark:** background `oklch(0.145 0 0)`, card `oklch(0.205 0 0)`, muted `oklch(0.269 0 0)`, border `oklch(1 0 0 / 10%)`.
- **Light:** background `oklch(1 0 0)`, card `oklch(1 0 0)`, muted `oklch(0.97 0 0)`, border `oklch(0.922 0 0)`.
- Never pure black or pure white accents on surfaces.

### Amber Accent (restrained)
- Brand wordmark/logo.
- Primary buttons.
- Focus/active or hover moments only.
- Not used across the whole nav — nav links stay neutral.

## Glass Topbar

- Sticky header with `bg-background/70 backdrop-blur-md`, thin `border-b`.
- Subtle, clean, not heavy.

## Navigation

- Neutral/muted links on the topbar.
- Thin `h-px` foreground underline on the active page; hover fades link to foreground.
- Logo keeps the amber brand accent.

## Language Switcher

- Classy dropdown (shadcn) showing the active locale code (EN/TR).
- Menu lists native language names (English / Türkçe) with an amber check on the active item.
- Persists `localStorage('locale')` and reloads.

## Typography

- **Font:** Inter (multi-language support)
- **Body:** 1rem, 1.6 line-height
- **Headings:** Tight line-height, semibold to bold, tracking-tight

## Components (shadcn v4)

- Button, DropdownMenu, Separator, Badge, Card
- Clean cards with subtle borders
- Rounded buttons (primary/secondary/ghost/outline)
- Theme toggle + theme dropdown + language dropdown

## Rules

1. Surface colors always from the neutral/zinc token scale — never arbitrary hex.
2. Amber for brand moments only (logo, primary CTAs, active checkmarks).
3. Accessibility: sufficient contrast in both themes; focus rings visible.
4. All interactive elements keyboard accessible.
5. Turkish character rendering handled by Inter.

## Localization & URL structure

WordPress-style, SEO-correct multi-language routing (Option A: prefix + per-locale slugs).

- Locale prefix in every frontend URL: `/en/...` and `/tr/...`.
- Root `/` 307-redirects to `/en` or `/tr` via `Accept-Language` (default EN), handled by `src/middleware.ts`.
- `html lang` is set server-side from the `[lang]` route param (no hardcoded `en`).
- Slugs are **localized**: `Posts.slug` and `Categories.slug` are `localized: true`; EN `infa-2026` ↔ TR `infa-hannover-fuari-rehberi`, category `trade-shows` ↔ `fuarlar`. The API returns the slug for the requested locale.
- `LocaleProvider` (client context) drives `useLocale()`; all shared UI (header, footer, pages) reads locale from context, not `localStorage`.
- Every internal link is locale-aware (`/${locale}/blog/...`, `/${locale}/category/...`); helpers in `src/app/(frontend)/components/localePath.ts`.
- Language switcher = single passive toggle (shows only the OTHER language). Clicking maps the current route to the equivalent localized URL: on detail routes it resolves the target slug via the Payload API (`fetchDocBySlug` → id → `fetchDocSlugById`); on structural routes (`/`, `/blog`, `/about`) it swaps the prefix.
- All user-facing strings live in `src/app/(frontend)/i18n/dictionaries.ts` (no inline `locale === 'tr'` ternaries in components).
