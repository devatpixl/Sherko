"use client";

import { animate, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cursor } from "@/components/hero/SimCursor";
import { usePrefersReducedMotion } from "@/lib/useSimulation";

/* ═══════════════════════════════════════════════════════════════════
   The real admin portal, framed and driven.

   This replaces the hand-built replica. The frame loads the actual
   application from /demo/* — proxied onto our own origin precisely so this
   is same-origin and we can reach into it. The cursor then dispatches real
   pointer events at real elements, so what you watch is the product doing
   the thing, not a drawing of it doing the thing.

   Nothing here can drift from the product, because it *is* the product.
   ═══════════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How we locate a control inside the framed app.
 *
 * `role` defaults to every interactive shape the app actually uses. That
 * matters: the primary actions are shadcn <Button asChild><Link>, which
 * render as an <a>, not a <button> — searching only for buttons silently
 * finds nothing and the step is skipped.
 */
export type Find = { role?: string; text?: string; nth?: number };

const INTERACTIVE = "button, a, [role='button'], [role='combobox'], [role='option']";

export type FrameStep =
  | { kind: "wait"; ms: number }
  /** Move the cursor onto a control and click it for real. */
  | { kind: "click"; ms: number; find: Find; settle?: number }
  /** Move without clicking — used to lead the eye before a page change. */
  | { kind: "move"; ms: number; find: Find };

/* ── Locating things in the framed document ───────────────────────── */

function locate(doc: Document, f: Find): HTMLElement | null {
  const nodes = [...doc.querySelectorAll<HTMLElement>(f.role ?? INTERACTIVE)];
  const matches = f.text
    ? nodes.filter((n) => (n.textContent || "").replace(/\s+/g, " ").trim().includes(f.text!))
    : nodes;
  // Only things actually on screen — the app renders a mobile drawer copy of
  // the nav that is display:none, and clicking that does nothing visible.
  const visible = matches.filter((n) => n.getClientRects().length > 0);
  return visible[f.nth ?? 0] ?? null;
}

/**
 * A click the framed app actually believes.
 *
 * `.click()` alone is not enough: the app is built on Radix, whose triggers
 * open on pointerdown, so a bare click leaves menus and comboboxes shut.
 */
function realClick(el: HTMLElement) {
  const view = el.ownerDocument.defaultView;
  const base = { bubbles: true, cancelable: true, view, composed: true } as const;
  const pointer = { ...base, isPrimary: true, pointerId: 1, pointerType: "mouse" };
  el.dispatchEvent(new PointerEvent("pointerover", pointer));
  el.dispatchEvent(new PointerEvent("pointerdown", pointer));
  el.dispatchEvent(new MouseEvent("mousedown", base));
  el.dispatchEvent(new PointerEvent("pointerup", pointer));
  el.dispatchEvent(new MouseEvent("mouseup", base));
  el.click();
}

/* ── The frame ────────────────────────────────────────────────────── */

export function LiveDemoFrame({
  src,
  steps,
  width,
  height,
  active,
  onFinished,
}: {
  src: string;
  steps: FrameStep[];
  width: number;
  height: number;
  active: boolean;
  onFinished?: () => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [scale, setScale] = useState(0.7);
  const [ready, setReady] = useState(false);
  const [clicking, setClicking] = useState(false);

  const x = useMotionValue(width * 0.5);
  const y = useMotionValue(height * 0.6);

  /* Fit the fixed-size frame to the container. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const doc = useCallback(() => {
    try {
      return frameRef.current?.contentDocument ?? null;
    } catch {
      // Only possible if the proxy is misconfigured and the frame ends up
      // cross-origin. Fail quietly rather than throwing on every tick.
      return null;
    }
  }, []);

  /* Wait for a control to exist, then point at it. Returns its centre. */
  const pointAt = useCallback(
    async (f: Find, ms: number) => {
      const deadline = Date.now() + 4000;
      let el: HTMLElement | null = null;
      while (Date.now() < deadline) {
        const d = doc();
        el = d ? locate(d, f) : null;
        if (el) break;
        await new Promise((r) => setTimeout(r, 120));
      }
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const opts = { duration: reduced ? 0 : ms / 1000, ease: EASE };
      await Promise.all([animate(x, cx, opts).finished, animate(y, cy, opts).finished]);
      return el;
    },
    [doc, reduced, x, y],
  );

  /* Readiness is polled, not taken from onLoad.
     The frame often finishes loading before React attaches its handler, so
     onLoad never fires and the script waits forever. Polling readyState also
     covers client-side navigations the script itself triggers. */
  useEffect(() => {
    if (ready) return;
    const id = window.setInterval(() => {
      const d = doc();
      if (d && d.readyState !== "loading" && d.body && d.body.childElementCount > 0) {
        setReady(true);
      }
    }, 150);
    return () => window.clearInterval(id);
  }, [ready, doc]);

  /* Held in a ref so an inline callback from the parent does not land in the
     effect's deps. It would get a fresh identity on every render, and since
     the script itself sets state while running, the effect would tear down and
     restart mid-flight — the run never reaching a click. */
  const finishedRef = useRef(onFinished);
  useEffect(() => {
    finishedRef.current = onFinished;
  }, [onFinished]);

  /* Run the script once the frame is up. */
  useEffect(() => {
    if (!active || !ready) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 200) : ms));

    (async () => {
      for (const step of steps) {
        if (cancelled) return;
        if (step.kind === "wait") {
          await sleep(step.ms);
          continue;
        }
        const el = await pointAt(step.find, step.ms);
        if (cancelled) return;
        if (step.kind === "click" && el) {
          setClicking(true);
          realClick(el);
          await sleep(160);
          setClicking(false);
          await sleep(step.settle ?? 900);
        }
      }
      if (!cancelled) finishedRef.current?.();
    })();

    return () => {
      cancelled = true;
    };
  }, [active, ready, steps, pointAt, reduced]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden bg-adm-bg"
      style={{ height: height * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        <iframe
          ref={frameRef}
          src={src}
          title="Sherko Admin"
          // Presentational: the page drives it, the visitor watches.
          className="pointer-events-none h-full w-full border-0"
          scrolling="no"
          tabIndex={-1}
          aria-hidden
        />
        {!reduced && <Cursor x={x} y={y} clicking={clicking} />}
      </div>

      {/* Until the app paints, show its own surface rather than a white flash */}
      {!ready && <div className="absolute inset-0 animate-pulse bg-adm-bg" />}
    </div>
  );
}
