import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* Lifted verbatim from the Moen Engros admin's lib/utils.ts — the vendored
   primitives in components/admin-ui all call it. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
