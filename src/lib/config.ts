/**
 * Where the live demo lives.
 *
 * The demo is the REAL admin app running with `NEXT_PUBLIC_USE_MOCKS=true`,
 * which makes every API adapter fall back to in-memory fixtures — no backend,
 * no database, nothing to break. Its fixture data is already fictional.
 *
 * Override locally to point at a dev instance:
 *   NEXT_PUBLIC_DEMO_URL=http://localhost:4400/dashboard/orders npm run dev
 */
export const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ?? "https://demo.sherko.no/dashboard/orders";

/** Until the demo is actually deployed, the CTA stays hidden. */
export const DEMO_ENABLED = process.env.NEXT_PUBLIC_DEMO_ENABLED === "true";
