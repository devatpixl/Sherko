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
 * DEMO_ORIGIN defaults to the VPS; point it at a local dev server when
 * working on the demo fork itself.
 */
const DEMO_ORIGIN = process.env.DEMO_ORIGIN ?? "https://sherko-demo.pixlmedia.no";

const nextConfig: NextConfig = {
  async rewrites() {
    // beforeFiles, not a bare array.
    //
    // A bare array is an afterFiles rewrite, which only runs once Next has
    // failed to resolve the path against its own routes. Plain page loads
    // survive that, but the framed app navigates by fetching RSC payloads
    // (/demo/...?_rsc=), and for those Next answers first with its own 404
    // — so every in-frame navigation silently died in production while
    // working locally. beforeFiles hands /demo/* over before Next looks.
    return {
      beforeFiles: [
        { source: "/demo/:path*", destination: `${DEMO_ORIGIN}/demo/:path*` },
      ],
    };
  },
};

export default nextConfig;
