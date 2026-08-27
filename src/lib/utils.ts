import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number) {
  if (score >= 80) return "text-lime-signal";
  if (score >= 55) return "text-cyan-signal";
  return "text-rose-signal";
}
