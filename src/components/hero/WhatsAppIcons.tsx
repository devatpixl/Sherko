/* WhatsApp's own glyphs, rebuilt from the shipped SVG path data so the
   simulation reads as the real thing rather than an approximation.
   All use `currentColor`, so tick state is driven by the parent's color. */

export function TickSingle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 15" width="15" height="14" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
      />
    </svg>
  );
}

export function TickDouble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 15" width="15" height="14" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
      />
      <path
        fill="currentColor"
        d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
      />
    </svg>
  );
}

/** Bubble tails. The tail hangs off the *top* corner — the detail most clones miss. */
export function TailOut({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 13" width="8" height="13" className={className} aria-hidden>
      <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
      <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" />
    </svg>
  );
}

export function TailIn({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 13" width="8" height="13" className={className} aria-hidden>
      <path opacity=".13" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
      <path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z" />
    </svg>
  );
}

export function ChevronBack({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 5l-7 7 7 7"
      />
    </svg>
  );
}

export function IconVideo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" className={className} aria-hidden>
      <path fill="currentColor" d="M15 8.5v7A2.5 2.5 0 0 1 12.5 18h-8A2.5 2.5 0 0 1 2 15.5v-7A2.5 2.5 0 0 1 4.5 6h8A2.5 2.5 0 0 1 15 8.5zM22 8.2v7.6a.7.7 0 0 1-1.09.58L16.5 13.5v-3l4.41-2.88A.7.7 0 0 1 22 8.2z" />
    </svg>
  );
}

export function IconCall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" className={className} aria-hidden>
      <path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z" />
    </svg>
  );
}

export function IconKebab({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" className={className} aria-hidden>
      <circle cx="12" cy="5" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="19" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function IconEmoji({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <path d="M8.2 14.2a4.6 4.6 0 0 0 7.6 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconClip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" className={className} aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M17.5 9.5l-7.1 7.1a3 3 0 0 1-4.24-4.24l7.6-7.6a4.6 4.6 0 0 1 6.5 6.5l-7.6 7.6"
      />
    </svg>
  );
}

export function IconCamera({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" className={className} aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M3 8.6h3.2l1.4-2h8.8l1.4 2H21v10H3z"
      />
      <circle cx="12" cy="13.2" r="3.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconSend({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} aria-hidden>
      <path fill="currentColor" d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.99.99 0 0 0-1.39.91L2 9.62c0 .5.37.93.87.99L17 12 2.87 13.39c-.5.06-.87.49-.87.99l.01 5.11a.99.99 0 0 0 1.39.91z" />
    </svg>
  );
}

export function IconMic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} aria-hidden>
      <path fill="currentColor" d="M12 14.5a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5.5a3 3 0 0 0 3 3z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 11.2a6 6 0 0 0 12 0M12 17.5V21" />
    </svg>
  );
}

/** Verified-looking WhatsApp glyph for the phone's app badge. */
export function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.3-1.96 1.34-.5.04-.98.22-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.12-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.96-2.31c.25-.28.55-.35.73-.35s.36 0 .52.01c.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.11.3.02.48-.09.19-.14.3-.28.47-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.63-.14.25.09 1.61.76 1.89.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z"
      />
    </svg>
  );
}
