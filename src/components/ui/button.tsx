import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-cyan-signal text-slate-950 shadow-sm hover:bg-cyan-200",
        variant === "ghost" && "text-slate-300 hover:bg-white/[0.06] hover:text-white",
        variant === "outline" && "border border-cyan-signal/30 bg-cyan-signal/10 text-cyan-signal hover:border-cyan-signal/55 hover:bg-cyan-signal/15",
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonProps["variant"] }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        variant === "primary" && "bg-cyan-signal text-slate-950 shadow-sm hover:bg-cyan-200",
        variant === "ghost" && "text-slate-300 hover:bg-white/[0.06] hover:text-white",
        variant === "outline" && "border border-cyan-signal/30 bg-cyan-signal/10 text-cyan-signal hover:border-cyan-signal/55 hover:bg-cyan-signal/15",
        className
      )}
      {...props}
    />
  );
}
