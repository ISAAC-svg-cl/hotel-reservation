import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NovotelLogo({
  className,
  showSubtitle = true,
  size = "md",
}: {
  className?: string;
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { icon: "w-8 h-8", title: "text-base tracking-[0.2em]", sub: "text-[8px] tracking-[0.25em]" },
    md: { icon: "w-10 h-10", title: "text-xl tracking-[0.25em]", sub: "text-[9px] tracking-[0.25em]" },
    lg: { icon: "w-12 h-12", title: "text-2xl tracking-[0.25em]", sub: "text-[11px] tracking-[0.25em]" },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Novotel Signature Monogram Badge */}
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center border border-amber-500/40 shadow-lg shadow-amber-500/10 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300",
          currentSize.icon
        )}
      >
        <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 29V11L28 29V11"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="8" r="2.5" fill="#f59e0b" />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-black text-white font-sans uppercase leading-none text-glow",
              currentSize.title
            )}
          >
            NOVOTEL
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        </div>
        {showSubtitle && (
          <span
            className={cn(
              "block font-bold uppercase text-amber-400 leading-tight mt-0.5",
              currentSize.sub
            )}
          >
            LUBUMBASHI &bull; RDC
          </span>
        )}
      </div>
    </div>
  );
}
