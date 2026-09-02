"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useSimulation";
import { VIDEO_SPEED } from "@/lib/pace";

/**
 * A screen recording of the real admin, framed the way cursor.com frames its
 * product shots: a window with traffic lights and the address it was taken at,
 * so the viewer reads it as software rather than a marketing render.
 *
 * The clips were recorded at a natural pace. They play back at VIDEO_SPEED to
 * match cursor.com's fast demo, and only start once the window is actually on
 * screen, so seven recordings on one page do not all decode at once.
 */
export function ProductVideo({
  src,
  label,
  poster,
  className = "",
  priority = false,
}: {
  src: string;
  /** shown in the window chrome, like Cursor's "Cursor Desktop" */
  label: string;
  poster?: string;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(priority);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || priority) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.playbackRate = VIDEO_SPEED;
    if (reduced) {
      el.pause();
      return;
    }
    if (visible) void el.play().catch(() => {});
    else el.pause();
  }, [visible, reduced]);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
        {/* macOS traffic lights, in their real colours: close, minimise, zoom */}
        <span className="flex items-center gap-[7px]">
          <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto truncate font-mono text-[11px] tracking-[0.04em] text-fg-3">
          {label}
        </span>
        {/* keeps the label optically centred against the three lights */}
        <span aria-hidden className="w-[47px] shrink-0" />
      </div>

      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        className="block w-full"
      />
    </div>
  );
}
