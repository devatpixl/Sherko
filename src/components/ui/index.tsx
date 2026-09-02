"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/* ── Layout ───────────────────────────────────────────────────────── */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 md:px-10 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-28 py-16 md:py-20 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

/* ── Reveal on scroll ─────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* Deliberately not `once`. The block resets when it leaves the viewport and
     plays again on the way back, so nothing on the page needs a reload to be
     seen a second time. The -12% margin keeps it from resetting under
     something you are still reading. */
  const inView = useInView(ref, { margin: "-12% 0px -12% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Type ─────────────────────────────────────────────────────────── */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>{children}</p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <Reveal>
        <div className={centered ? "flex justify-center" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-fg">{title}</h2>
      </Reveal>
      {body && (
        <Reveal delay={0.12}>
          <p className="lede mt-6 text-[1.0625rem] leading-relaxed text-fg-2 md:text-lg">{body}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ── Buttons ──────────────────────────────────────────────────────── */

export function ButtonPrimary({
  children,
  href = "#kontakt",
  className = "",
  external = false,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      /* zapier.com's primary: solid orange, white label, no gradient. It was a
         near-black pill with an orange wash sweeping in on hover, which read as
         a link rather than the one thing on the page to click. */
      className={`group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-[0.9375rem] font-medium tracking-tight text-white transition-[transform,background-color] duration-300 hover:scale-[1.02] hover:bg-accent-dim active:scale-[0.99] ${className}`}
    >
      <span>{children}</span>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path
          d="M2 8h11M9 4l4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-[2px]"
        />
      </svg>
    </a>
  );
}

export function ButtonGhost({
  children,
  href = "#system",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full border border-line-2 px-6 py-3.5 text-[0.9375rem] font-medium tracking-tight text-fg-2 transition-[transform,translate,background-color,border-color,color] duration-300 hover:-translate-y-px hover:border-fg hover:bg-surface-2 hover:text-fg active:translate-y-0 active:scale-[0.99] ${className}`}
    >
      {children}
    </a>
  );
}

/* ── Misc ─────────────────────────────────────────────────────────── */

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule-x ${className}`} />;
}
