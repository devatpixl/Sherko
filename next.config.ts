import type { NextConfig } from "next";

/**
 * The live demo is proxied onto our own origin at /demo/*.
 *
 * That is the whole point of the proxy: served from its own host, an <iframe>
 * of the demo is cross-origin and the simulation cannot reach into it — no
 * cursor, no clicks, just a static picture. Proxied through here it is
 * same-origin, so the animation drives the *real* application rather than a
 * rebuild of it that silently drifts every time upstream changes.
 *
 * The demo must run with NEXT_PUBLIC_BASE_PATH=/demo so it serves its own
 * /demo/_next assets; both are Next apps and would otherwise collide.
 *
 * DEMO_ORIGIN is the VPS in production, a local dev server while working.
 */
const DEMO_ORIGIN = process.env.DEMO_ORIGIN ?? "http://127.0.0.1:4400";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/demo/:path*", destination: `${DEMO_ORIGIN}/demo/:path*` }];
  },
};

export default nextConfig;
