import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/adm/utils";

/**
 * StatusPill — vendored from the Moen Engros admin portal (components/ui/status-pill.tsx).
 *
 * This is the product's own component, not a rebuild. The ONLY change is that
 * its colour utilities are namespaced `adm-*`, because the marketing site and
 * the admin both define `surface` and `accent` and the admin's white would
 * otherwise overwrite the dark page. Logic, variants, sizes and geometry are
 * untouched.
 *
 * Linear-style dot + label pill, single source of truth for any domain status
 * (Order, Goods Receipt, Stock level, Price agreement, …).
 *
 * Sizes:
 *   sm   20px height — inside table cells
 *   md   24px height — default, drawer headers, KPI cards
 */

const statusPillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap leading-none",
  {
    variants: {
      variant: {
        neutral: "bg-adm-muted text-adm-ink",
        success: "bg-adm-muted text-adm-ink",
        info: "bg-adm-muted text-adm-ink",
        warning: "bg-adm-amber-bg text-adm-amber-fg",
        danger: "bg-adm-red-bg text-adm-red-fg",
      },
      size: {
        sm: "h-5 px-2 text-[11px]",
        md: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

const dotVariants = cva("inline-block rounded-full", {
  variants: {
    variant: {
      neutral: "bg-adm-ink-2",
      success: "bg-adm-green",
      info: "bg-adm-blue",
      warning: "bg-adm-amber",
      danger: "bg-adm-red",
    },
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "md",
  },
});

export type StatusPillVariant = "neutral" | "success" | "info" | "warning" | "danger";

export type StatusPillProps = React.ComponentProps<"span"> &
  VariantProps<typeof statusPillVariants> & {
    /** Hide the leading dot (useful when paired with a Lucide icon child). */
    hideDot?: boolean;
  };

export function StatusPill({
  className,
  variant = "neutral",
  size = "md",
  hideDot,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      data-slot="status-pill"
      data-variant={variant}
      className={cn(statusPillVariants({ variant, size }), className)}
      {...props}
    >
      {!hideDot && <span aria-hidden className={dotVariants({ variant, size })} />}
      {children}
    </span>
  );
}

export { statusPillVariants };
