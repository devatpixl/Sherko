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

const INTERACTIVE =
  "button, a, input, [role='button'], [role='combobox'], [role='option']";

/**
 * Is this node an <input>?
 *
 * `instanceof HTMLInputElement` cannot answer that here. The node comes from
 * the framed document, which is a separate realm with its own constructors,
 * so it is never an instance of *our* HTMLInputElement and the check silently
 * returns false for every input on the page.
 */
function isInput(el: Element | null): el is HTMLInputElement {
  return !!el && el.tagName === "INPUT";
}

/** Text we can match a control by — inputs carry theirs in the placeholder. */
function labelOf(el: HTMLElement): string {
  const own = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (own) return own;
  const ph = el.getAttribute("placeholder") || "";
  return ph.replace(/\s+/g, " ").trim();
}

export type FrameStep =
  | { kind: "wait"; ms: number }
  /** Move the cursor onto a control and click it for real. */
  | { kind: "click"; ms: number; find: Find; settle?: number }
  /** Move without clicking — used to lead the eye before a page change. */
  | { kind: "move"; ms: number; find: Find }
  /**
   * Move onto a field and type into it, character by character.
   *
   * This is how the product picker gets opened. That control opens its list
   * on focus, and focus is exactly what we cannot reliably take: Radix
   * returns focus to the customer combobox as it closes, which fires the
   * picker's onBlur and shuts the list again. But the field also opens on
   * change — so typing drives it without touching focus at all, and has the
   * pleasant side effect of showing the search actually working.
   */
  | { kind: "type"; ms: number; find: Find; text: string; perChar?: number; settle?: number };

/* ── Locating things in the framed document ───────────────────────── */

function locate(doc: Document, f: Find): HTMLElement | null {
  const nodes = [...doc.querySelectorAll<HTMLElement>(f.role ?? INTERACTIVE)];
  const matches = f.text ? nodes.filter((n) => labelOf(n).includes(f.text!)) : nodes;
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
  // Some pickers are text inputs that open their list on focus, not on click.
  if (isInput(el)) el.focus();
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

/**
 * Write into a React-controlled input.
 *
 * Assigning `.value` directly is not enough: React caches the last value it
 * set on the node and skips the change event when it sees no difference.
 * Going through the prototype setter updates the node underneath that cache,
 * so the input event React hears looks exactly like a real keystroke.
 *
 * The prototype has to come from the framed window — ours is a different
 * realm, and its setter would not apply to a node from over there.
 */
function setNativeValue(el: HTMLInputElement, value: string) {
  const win = el.ownerDocument.defaultView as (Window & typeof globalThis) | null;
  const proto = win ? win.HTMLInputElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
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
      const deadline = Date.now() + 6500;
      let el: HTMLElement | null = null;
      while (Date.now() < deadline) {
        const d = doc();
        el = d ? locate(d, f) : null;
        if (el) break;
        await new Promise((r) => setTimeout(r, 120));
      }
      if (!el) return null;

      // Bring it into the frame first. Half the form sits below 900px, so
      // without this the cursor clicks something the viewer cannot see — and
      // the page never appears to do anything.
      const before = el.getBoundingClientRect();
      if (before.top < 40 || before.bottom > height - 40) {
        el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
        await new Promise((r) => setTimeout(r, reduced ? 0 : 650));
      }

      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const opts = { duration: reduced ? 0 : ms / 1000, ease: EASE };
      await Promise.all([animate(x, cx, opts).finished, animate(y, cy, opts).finished]);
      return el;
    },
    [doc, reduced, x, y, height],
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
        if (process.env.NEXT_PUBLIC_FRAME_DEBUG === "true") {
          console.log("[frame]", step.kind, JSON.stringify(step.find), el ? "FOUND" : "NOT FOUND");
        }
        if (cancelled) return;

        if (step.kind === "type" && isInput(el)) {
          // Character by character, so the list visibly narrows as it goes.
          for (let i = 1; i <= step.text.length; i++) {
            if (cancelled) return;
            setNativeValue(el, step.text.slice(0, i));
            await sleep(step.perChar ?? 70);
          }
          await sleep(step.settle ?? 900);
          continue;
        }

        if (step.kind === "click" && el) {
          // Re-locate before clicking. The cursor takes ~900ms to travel, and
          // React can re-render the form in that window — leaving `el`
          // detached, so the click lands on a node no longer in the document
          // and nothing happens.
          const d = doc();
          const fresh = (d && locate(d, step.find)) || el;
          setClicking(true);
          realClick(fresh);
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
  }, [active, ready, steps, pointAt, reduced, doc]);

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
