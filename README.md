# Nordre — marketing site

Product site for **Nordre**, an AI order desk for wholesalers: customers send orders
on WhatsApp or by email (free text, PDF, Excel, or a photo of a handwritten note),
Nordre reads them, resolves the customer and every line against the client's real
catalogue, and files a **draft order pending human approval**.

Built for Pixl Media. The underlying product is the Sherko agent running for Moen Engros.

## Stack

Next.js 16 (App Router, static export) · React 19 · Tailwind v4 · `motion` v13 · TypeScript strict.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # fully static, no server needed
```

> Never run `npm run build` while `next dev` is up — they fight over `.next`.

## Structure

```
src/
  app/
    layout.tsx        fonts (Schibsted Grotesk / JetBrains Mono / Caveat), metadata, JSON-LD
    page.tsx          section order — this is the argument the page makes, in order
    globals.css       ALL design tokens + utility classes. Change colours here, nowhere else.
    icon.svg          favicon
  lib/
    content.ts        every string on the site, bilingual. Copy changes happen here.
    i18n.tsx          locale store (localStorage as an external store), NO default
    chatScript.ts     the hero conversation timeline
    useSimulation.ts  the driver that plays it
  components/
    hero/             Hero, PhoneSim, TraceLog, HandwrittenNote, WhatsAppIcons
    sections/         one file per page section
    site/             Nav, Footer, Wordmark
    ui/               Container, Section, Reveal, SectionHead, buttons
```

## The hero simulation

`chatScript.ts` holds a flat list of timed steps. `useSimulation` advances an index and
**folds** `script.slice(0, i)` into view state — the view is a pure function of the index,
so StrictMode double-invocation can't corrupt it and the loop restarts with no teardown.

To change what the demo says, edit `chatScript.ts`. Two acts:
1. A plain text order → preview → customer confirms → draft filed.
2. A photo of a handwritten note → read directly → one line is ambiguous → Nordre asks.

The trace log beside the phone is the "machine view" — the agent's work log, streaming
the steps it takes while the customer only sees a chat. It is deliberately frameless (no
card, no border, no glow) so it supports the device instead of competing with it, and it
only renders at xl where there is a third column to put it in.

The WhatsApp UI is rebuilt to spec (real bubble tails, tick glyphs, palette) rather than
approximated — see `WhatsAppIcons.tsx`.

## Conventions

- **No hardcoded strings in components.** Everything is a `{ no, en }` pair from
  `content.ts`, or a local `Bi` object if it's component-specific.
- **No raw hex in components.** Use the token classes (`text-fg-2`, `border-line`,
  `text-accent`…) defined in `globals.css`. The only exception is `PhoneSim`, which
  deliberately uses WhatsApp's own palette.
- Accent (aurora mint/ice/violet) is for **one focal element per section**. The rest is
  near-black, off-white and hairlines.
- `.card` is unlayered CSS, so its `border` shorthand beats Tailwind `border-*` utilities.
  To recolour a card border, use the gradient utilities directly instead of `.card`.

## Claims policy

Nothing on this site asserts a customer result, percentage, or time saving that we have
not measured. The `facts` block is deliberately capability facts (`24/7`, `0` auto-approved
orders, `6` inbound formats, `2` languages), not invented ROI. Keep it that way until
there are real numbers to publish.

## Still open

- `hei@nordre.no` in the CTA is a placeholder — wire to a real inbox or a form.
- Domain, analytics, and OG image are not set up.
- Nav links are in-page anchors; there are no interior pages yet.
