# Nordre — build contract (READ FULLY BEFORE WRITING CODE)

Marketing site for **Nordre**, an AI order-desk agent for Norwegian wholesalers.
Next.js 16 (App Router) · React 19 · Tailwind **v4** · `motion` v13 · TypeScript strict.

## The product, so your copy and visuals are true

Orders arrive on **WhatsApp or email** as free text, PDF, Excel, or **a photo of a
handwritten note**. Nordre reads the attachment natively, resolves the customer and
every line against the client's **real catalogue** (article number, brand, supplier,
pack size), shows the customer a **preview** of what it understood, waits for a yes,
then files a **draft order marked "pending approval"**. It never auto-approves, never
moves stock, never invents a product or price, asks one specific question instead of
guessing, and admits it is an AI when asked. Operators can also ask it for revenue
figures and recent activity.

**Never invent customer results, percentages, testimonials, logos, or "saves N hours"
claims.** Only state capabilities that are true of the description above.

## Hard rules

1. **Only create the files you are assigned.** Never edit a file another agent owns,
   never touch `src/app/page.tsx`, `globals.css`, `src/lib/*`, or `src/components/ui/index.tsx`.
2. Every component: `"use client";` at the top if it uses hooks/motion, else omit.
3. **All copy comes from `src/lib/content.ts`.** Do not hardcode Norwegian or English
   strings in a component. If you need a string that is not in content.ts, put it in
   your component as a local `Bi` object (`{ no: "...", en: "..." }`) and resolve it
   with the locale — never a bare string.
4. Read the locale like this:
   ```tsx
   import { useLocale } from "@/lib/i18n";
   const { locale } = useLocale();          // "no" | "en"
   ...{someBiPair[locale]}
   ```
5. Import primitives from `@/components/ui`:
   `Container, Section, Reveal, Eyebrow, SectionHead, ButtonPrimary, ButtonGhost, Rule`
   Use `<SectionHead eyebrow={...} title={...} body={...} />` for every section header.
6. `npx tsc --noEmit` must pass. No `any`. No unused imports (eslint is on).
7. Do NOT run `npm run build` — a dev server is already running and it will collide.
   Verify with `npx tsc --noEmit` only.

## Design tokens — use these Tailwind classes, never raw hex

| Token | Class | Value | Use for |
|---|---|---|---|
| canvas | `bg-canvas` | `#07080A` | page background |
| elevated | `bg-elev` | `#0C0E11` | alternating section bands |
| surface | `bg-surface` | `#111418` | cards |
| surface-2 | `bg-surface-2` | `#171B21` | card top of gradient |
| line | `border-line` | `#21262C` | hairlines |
| line-2 | `border-line-2` | `#2C333A` | stronger borders |
| fg | `text-fg` | `#F0EEE9` | headings |
| fg-2 | `text-fg-2` | `#A2AAB2` | body copy |
| fg-3 | `text-fg-3` | `#6E767E` | captions, mono labels |
| fg-4 | `text-fg-4` | `#4A5158` | faintest |
| accent | `text-accent` `bg-accent` | `#5CE1B0` | aurora mint — the primary accent |
| ice | `text-ice` | `#4CC9F0` | secondary |
| violet | `text-violet` | `#7C6BF5` | tertiary |
| signal | `text-signal` | `#F0B849` | "needs a human" / pending |

**Accent discipline:** aurora colours are for *one* focal thing per section, not for
every icon. Most of the page is near-black, off-white and hairlines. If a section has
more than ~3 coloured elements, cut it back.

## Utility classes available in globals.css

- `.display` — display type: tight tracking, 0.95 line-height, balanced wrap. Put it on every `h1/h2/h3`.
- `.eyebrow` — mono uppercase micro-label (SectionHead already applies it)
- `.lede` — `text-wrap: pretty` for body paragraphs
- `.card` — surface gradient + border + 16px radius + top specular hairline
- `.glass` — translucent canvas + backdrop blur
- `.aurora-text` — mint→ice→violet gradient clipped to text
- `.aurora` + `.aurora-drift` — blurred aurora blob (position it absolutely, give it size)
- `.grain` — film grain overlay (on a `relative` parent)
- `.grid-substrate` — 64px engineering grid
- `.mask-radial`, `.mask-b` — fade a layer out radially / toward the bottom
- `.rule-x` — hairline that fades at both ends
- `.marquee` — set `--marquee-duration`, wrap 2× duplicated content, translate -50%
- `.spin-slow`, `.dash-flow` (SVG stroke flow)

## Motion rules

```tsx
import { motion, useInView } from "motion/react";
```
- Standard easing: `[0.16, 1, 0.3, 1]`. Standard spring: `{ type: "spring", stiffness: 420, damping: 34 }`.
- Entrances: `opacity 0→1`, `y 22→0`, `duration 0.7`, staggered `0.06s` per item.
- Use the shared `<Reveal delay={n}>` wrapper for scroll entrances rather than
  hand-rolling `useInView` unless you need finer control.
- Everything must still read correctly with `prefers-reduced-motion` (globals.css already
  neutralises CSS animations; don't rely on motion for meaning).
- Never animate `width`/`height`/`top`/`left`. Use `transform` and `opacity`.

## Rhythm

- Sections: `<Section id="...">` (gives `py-24 md:py-32 lg:py-40` and scroll-margin).
- Alternate `bg-canvas` and `bg-elev` between neighbouring sections for banding.
- Max content width is handled by `<Container>` (1240px). Don't add your own max-width
  wrapper outside it.
- Headings: `text-[clamp(2rem,4.4vw,3.4rem)]`. Body: `text-[1.0625rem] leading-relaxed text-fg-2`.

## Quality bar

This is a premium dark "operator console" aesthetic — Cursor/Linear tier. Aim for:
restraint, real hairlines, generous air, mono micro-labels, and **one genuinely
memorable visual idea per section** rather than six generic icon cards. Prefer
custom inline SVG over emoji or icon fonts. No emoji in UI chrome.

Before you finish: re-read your component and delete anything decorative that is
fighting the layout rather than helping it.
