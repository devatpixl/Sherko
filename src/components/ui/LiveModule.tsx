"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A section of the real admin, embedded and usable. Not a recording of one.
 *
 * guardiancrm.pixlmedia.no does exactly this: the module you click into is the
 * product, running on demo data. Sherko's demo is already proxied onto our own
 * origin at /demo/*, so the frame is same-origin and everything inside it
 * works — sub-tabs, date ranges, search, sorting, scrolling the tables.
 *
 * The frame is always laid out at DESIGN_W and then scaled to fit whatever
 * space it has. That is the trick that makes this look right everywhere: the
 * app inside always believes it is on a desktop, so a phone shows the same
 * full dashboard, just smaller, instead of collapsing into the app's own
 * mobile layout and showing something a visitor would never see in the pitch.
 *
 * Only mounts once the window is near the viewport. A full application per tab
 * is a real page load, so seven of them must never boot at once.
 *
 * Nothing inside is restricted. An earlier version tried to gate the sidebar
 * and the tab strip so each card stayed on its own module, and every rule
 * fought the app: it collapses its own groups, re-renders its own navigation,
 * and navigates from its own handlers, so the gate kept closing over things it
 * should not have and taking whole demos down with it. The portal is a demo on
 * invented data, so letting a visitor click wherever they like costs nothing
 * and it always works.
 */

/** The viewport the framed app is laid out at, before scaling. */
const DESIGN_W = 1340;
/**
 * The exact proportion of the screen recordings this card used to hold.
 * Measured off the captures themselves (1280 x 608, so 2.105:1) rather than
 * guessed, which is why the card is back to the height it had with video.
 */
const RECORDING_RATIO = 1280 / 608;
const DESIGN_H = Math.round(DESIGN_W / RECORDING_RATIO);
/**
 * Never shrink past this. On a phone the card is ~340px wide, which against a
 * 1340px desktop layout is a scale of 0.25 and text nobody can read. Below the
 * floor the frame keeps its size and the card pans sideways instead.
 */
const MIN_SCALE = 0.52;

export function LiveModule({
  route,
  label,
  poster,
  className = "",
  priority = false,
}: {
  /** same-origin path into the proxied demo, e.g. /demo/dashboard/reports */
  route: string;
  /** shown in the window chrome */
  label: string;
  /**
   * Show this still and boot the application only when the visitor asks.
   * The hero sits above the fold, so a frame there is running before anyone
   * has scrolled: measured on a throttled CPU it took dropped frames from
   * 2.4% to 17.9%, with a worst frame of 433ms. Deferring costs nothing until
   * it is wanted, and then it is the same live portal as every other card.
   */
  poster?: string;
  className?: string;
  priority?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mount, setMount] = useState(priority && !poster);
  const [asked, setAsked] = useState(false);
  const [scale, setScale] = useState(1);
  /* Bumped to force a fresh <iframe> when the first attempt comes up empty. */
  const [attempt, setAttempt] = useState(0);

  /* Same-origin, so we can reach in and set the app up for being embedded.
     Re-applied on a short interval as well as on load: the framed app is a
     Next client app and swaps its own DOM around after hydration. */
  const dress = useCallback((frame: HTMLIFrameElement | null) => {
    try {
      const doc = frame?.contentDocument;
      if (!doc?.head || doc.getElementById("sherko-embed-css")) return;
      const style = doc.createElement("style");
      style.id = "sherko-embed-css";
      style.textContent = `
        /* Shown so the portal reads at its real size. Other sections are
           inert; the group the current module sits in is opted back in by
           the gate() pass below. */
        main { padding: 14px 16px !important; }
        /* Smaller root size fits a whole module in the frame without the
           app ever falling back to its narrow layout. */
        html { font-size: 13px !important; }
      `;
      doc.head.appendChild(style);
    } catch {
      /* not loaded yet: try again on the next tick */
    }
  }, []);

  /* Re-opens the sidebar group the current route belongs to. Runs on the same
     interval as dress(), because the framed app re-renders its own nav and
     drops the class whenever it does. */
  /* Fit the fixed-width frame to whatever width the card actually has. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(Math.max(w / DESIGN_W, MIN_SCALE));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* A proxied app can occasionally come back empty: a cold upstream, a dropped
     connection, a request that lost its race with hydration. Rather than leave
     a blank window on the page, check once whether anything rendered and, if
     not, mount a fresh frame. One retry only, so a genuinely down demo does
     not spin. */
  useEffect(() => {
    if (!mount || attempt > 0) return;
    const t = window.setTimeout(() => {
      try {
        const body = frameRef.current?.contentDocument?.body;
        if (!body || body.innerText.trim().length < 40) setAttempt(1);
      } catch {
        setAttempt(1);
      }
    }, 9000);
    return () => window.clearTimeout(t);
  }, [mount, attempt]);

  /* Mounts on approach and unmounts once well past. A framed application keeps
     running scripts, timers and layout for as long as it exists, so leaving one
     alive while the reader is three sections away was costing frames on every
     scroll. It comes straight back on return. */
  useEffect(() => {
    const el = hostRef.current;
    if (!el || (poster && !asked)) return;
    const io = new IntersectionObserver(([e]) => setMount(e.isIntersecting), {
      rootMargin: "500px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [poster, asked]);

  return (
    <div
      ref={hostRef}
      className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
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
        {poster && !asked ? (
          <button
            type="button"
            onClick={() => {
              setAsked(true);
              setMount(true);
            }}
            className="shrink-0 rounded-full bg-accent px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-accent-dim"
          >
            Prøv selv
          </button>
        ) : (
          <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-accent uppercase">
            Live
          </span>
        )}
      </div>

      {/* Says plainly what this is. The frame points at the demo deployment,
          which runs on its own database with invented figures for a fictional
          wholesaler, so nothing done in here reaches a real customer. */}
      <p className="border-b border-line bg-accent/8 px-3.5 py-1.5 text-center font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
        Interaktiv demo · eksempeldata
      </p>

      <div
        ref={stageRef}
        className="relative w-full overflow-x-auto overflow-y-hidden bg-canvas"
        /* The card is as tall as the scaled design, so it grows and shrinks
           with the width instead of cropping the module. */
        style={{ height: DESIGN_H * scale }}
      >
        {/* The still, until the visitor asks for the real thing. Also sits
            behind the frame afterwards, so it is covered the moment the app
            paints rather than waiting on an event that may already have
            fired. */}
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            aria-hidden
            className="absolute inset-0 z-0 h-full w-full object-cover object-top"
          />
        ) : (
          <span aria-hidden className="absolute inset-0 z-0 grid place-items-center">
            <span className="font-mono text-[11px] tracking-[0.16em] text-fg-4 uppercase">
              Laster portalen
            </span>
          </span>
        )}

        {/* Holds the scroll width when the frame is wider than the card. */}
        <span aria-hidden className="block" style={{ width: DESIGN_W * scale, height: 1 }} />
        {mount && (
          <iframe
            key={attempt}
            ref={frameRef}
            src={route}
            title={label}
            onLoad={() => dress(frameRef.current)}
            className="absolute top-0 left-0 z-10 border-0"
            style={{
              width: DESIGN_W,
              height: DESIGN_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        )}
      </div>
    </div>
  );
}
