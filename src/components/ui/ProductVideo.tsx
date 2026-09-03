"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useSimulation";
import { VIDEO_SPEED } from "@/lib/pace";

/**
 * One window, two modes: the recording, and the real application.
 *
 * guardiancrm.pixlmedia.no does this well — a module you can actually click
 * into rather than a picture of one — and the demo here is already proxied
 * onto our own origin at /demo/*, so it can be framed inline. No popup.
 *
 * The recording plays on arrival because it needs no decision from the reader.
 * "Prøv selv" swaps the same frame to the live portal at the matching route,
 * where the tables, filters and forms are the product's own. Switching back
 * unmounts the frame so seven routes are never live at once.
 *
 * No play/pause chrome and no scrub bar: a progress line across the bottom of
 * a product shot reads as a video player, which is exactly what this is not
 * meant to look like.
 */
export function ProductVideo({
  src,
  label,
  route,
  poster,
  className = "",
  priority = false,
  interactiveLabel = "Prøv selv",
  videoLabel = "Se opptak",
}: {
  src: string;
  /** shown in the window chrome, like Cursor's "Cursor Desktop" */
  label: string;
  /** same-origin path into the proxied demo, e.g. /demo/dashboard/rapporter */
  route?: string;
  /** defaults to the sibling .jpg generated from the clip's own first frame */
  poster?: string;
  className?: string;
  priority?: boolean;
  interactiveLabel?: string;
  videoLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(priority);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const reduced = usePrefersReducedMotion();

  const posterSrc = poster ?? src.replace(/\.mp4$/, ".jpg");

  /* Only decode once the window is near the viewport: seven recordings on one
     page must not all buffer at once. */
  useEffect(() => {
    const el = ref.current;
    if (!el || priority) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "300px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.playbackRate = VIDEO_SPEED;
    if (reduced || !visible || live) {
      el.pause();
      return;
    }
    void el.play().catch(() => {});
  }, [visible, reduced, live]);

  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}>
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
        {/* macOS traffic lights, in their real colours: close, minimise, zoom */}
        <span className="flex shrink-0 items-center gap-[7px]">
          <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto truncate font-mono text-[11px] tracking-[0.04em] text-fg-3">
          {label}
        </span>

        {route ? (
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            className={`shrink-0 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300 ${
              live
                ? "border border-line-2 text-fg-3 hover:text-fg"
                : "bg-accent text-white hover:bg-accent-dim"
            }`}
          >
            {live ? videoLabel : interactiveLabel}
          </button>
        ) : (
          /* keeps the label optically centred against the three lights */
          <span aria-hidden className="w-[47px] shrink-0" />
        )}
      </div>

      <div className="relative w-full">
        {live && route ? (
          <iframe
            src={route}
            title={label}
            /* The demo is proxied onto our origin, so this is same-origin and
               genuinely usable rather than a picture behind glass. */
            className="block aspect-[16/10] w-full border-0 bg-canvas"
            loading="lazy"
          />
        ) : (
          <>
            {/* The clip's own first frame, so the window is never blank. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterSrc}
              alt=""
              aria-hidden
              className={`block w-full transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
            />
            <video
              ref={ref}
              src={src}
              muted
              loop
              playsInline
              preload={priority ? "auto" : "metadata"}
              onCanPlay={() => setReady(true)}
              className={`absolute inset-0 block h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
