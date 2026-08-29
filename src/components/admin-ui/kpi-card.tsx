import * as React from "react";
import { ArrowDownIcon, ArrowUpIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/adm/utils";
import { Card, CardContent } from "@/components/admin-ui/card";

/**
 * KPICard — vendored from the Moen Engros admin portal (components/ui/kpi-card.tsx).
 * Colour utilities namespaced `adm-*`; layout, delta logic and the nb-NO
 * percent formatting are verbatim.
 *
 * Vercel-style metric card. One per KPI, never more than 4 in a row.
 */

export type KPICardProps = {
  label: string;
  /** Pre-formatted value. */
  value: React.ReactNode;
  /** Delta vs prior period. `value` is a fraction (0.12 → "12 %"). */
  delta?: {
    value: number;
    direction: "up" | "down" | "flat";
    label?: string;
    /** Reverses success/danger colour (for cost metrics where down = good). */
    invertColor?: boolean;
  };
  hint?: string;
  trailing?: React.ReactNode;
  /** Lucide icon in a tinted square top-right (Acreon stat-card pattern). */
  icon?: LucideIcon;
  className?: string;
} & React.ComponentProps<"div">;

export function KPICard({
  label,
  value,
  delta,
  hint,
  trailing,
  icon: Icon,
  className,
  ...rest
}: KPICardProps) {
  const goodDirection =
    delta &&
    ((delta.direction === "up" && !delta.invertColor) ||
      (delta.direction === "down" && delta.invertColor));
  const badDirection =
    delta &&
    ((delta.direction === "down" && !delta.invertColor) ||
      (delta.direction === "up" && delta.invertColor));

  const trailingNode =
    trailing ??
    (Icon ? (
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-adm-blue/10 text-adm-blue md:h-10 md:w-10"
      >
        <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
      </span>
    ) : null);

  return (
    <Card data-slot="kpi-card" className={cn("p-0", className)} {...rest}>
      <CardContent className="flex items-start justify-between gap-3 p-4 md:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="text-[11px] font-medium tracking-wide text-adm-ink-2 uppercase">
            {label}
          </div>
          <div
            data-tabular="true"
            className="truncate text-xl leading-tight font-semibold text-adm-ink sm:text-2xl md:text-2xl md:leading-tight"
            title={typeof value === "string" ? value : undefined}
          >
            {value}
          </div>
          {(delta || hint) && (
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
              {delta && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium",
                    goodDirection && "text-adm-green-fg",
                    badDirection && "text-adm-red-fg",
                    !goodDirection && !badDirection && "text-adm-ink-2",
                  )}
                >
                  {delta.direction === "up" ? (
                    <ArrowUpIcon className="h-3 w-3" />
                  ) : delta.direction === "down" ? (
                    <ArrowDownIcon className="h-3 w-3" />
                  ) : null}
                  {delta.label ??
                    new Intl.NumberFormat("nb-NO", {
                      style: "percent",
                      maximumFractionDigits: 1,
                    }).format(Math.abs(delta.value))}
                </span>
              )}
              {hint && <span className="hidden text-adm-ink-2 sm:inline">{hint}</span>}
            </div>
          )}
        </div>
        {trailingNode}
      </CardContent>
    </Card>
  );
}
