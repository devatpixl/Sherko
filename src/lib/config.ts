/**
 * Where the live demo lives.
 *
 * The demo is the REAL admin app running with `NEXT_PUBLIC_USE_MOCKS=true`,
 * which makes every API adapter fall back to in-memory fixtures — no backend,
 * no database, nothing to break. Its fixture data is already fictional.
 *
 * This links straight at the demo host rather than through our own /demo
 * proxy. The proxy exists so the *iframe* is same-origin and therefore
 * drivable; pushing a whole interactive app through it for a plain link
 * would spend our bandwidth for nothing.
 *
 * Override to point at a local instance while working on the fork:
 *   NEXT_PUBLIC_DEMO_URL=http://localhost:4400/demo/dashboard/orders npm run dev
 */
export const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ??
  "https://sherko-demo.pixlmedia.no/demo/dashboard/orders";

/** Set NEXT_PUBLIC_DEMO_ENABLED=false to pull the CTA if the demo host is down. */
export const DEMO_ENABLED = process.env.NEXT_PUBLIC_DEMO_ENABLED !== "false";
