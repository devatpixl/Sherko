/**
 * One speed control for every product simulation on the page.
 *
 * cursor.com's demo clip is fast: it cuts between states before you have
 * finished reading the previous one, which is what makes it feel like a
 * product rather than a tutorial. Ours was paced for comprehension —
 * the hero conversation alone ran 29.4s — so it read slow next to theirs.
 *
 * Set to 2.5 — a shade quicker than cursor.com. Every step, dwell and typewriter interval
 * divides by it, so the choreography keeps its proportions and only the
 * clock changes. Timings stay written at their natural values in
 * chatScript.ts, AdminSim.tsx and StockSim.tsx.
 */
export const SIM_SPEED = 2.5;

/** Scale a authored duration by the global simulation speed. */
export function paced(ms: number): number {
  return Math.round(ms / SIM_SPEED);
}

/**
 * Playback rate for the screen recordings in ProductVideo.
 *
 * Walked 3x -> 2x -> 1.6x -> 1.25x -> 1.1x -> 0.9x, and 0.9 dragged. 1.0 is
 * the recording exactly as it was captured: no correction in either direction.
 */
export const VIDEO_SPEED = 1;
