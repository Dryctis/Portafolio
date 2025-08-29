// components/SectionCard.tsx
"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";

type Props = Omit<HTMLMotionProps<"article">, "children"> & {
  title: string;
  subtitle?: string;
  href?: string;
  accent?: boolean;
  className?: string;
  id?: string;
  children?: React.ReactNode;
};

export default function SectionCard({
  title,
  subtitle,
  href,
  accent = false,
  children,
  className = "",
  id,
  ...rest
}: Props) {
  const bodyClass = "sc-body"; // wrapper para scopear los estilos

  return (
    <motion.article
      id={id}
      {...rest}
      whileHover={{ y: -3, scale: accent ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={[
        "relative rounded-2xl border text-[color:var(--color-foreground)]",
        "border-[color:var(--color-border)]",
        "bg-[color:var(--color-card)]/85",
        "supports-[backdrop-filter]:backdrop-blur-0",
        "shadow-[0_8px_24px_rgba(2,6,23,0.04)] dark:shadow-none",
        accent ? "ring-1 ring-[var(--color-accent)]/40" : "",
        className,
      ].join(" ")}
    >
      {/* tinta sutil (no blur) */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none dark:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,.14), rgba(0,0,0,.08) 28%, transparent 58%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none hidden dark:block"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,.06), rgba(255,255,255,.04) 28%, transparent 58%)",
        }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {href && (
            <Link
              href={href}
              className="text-sm underline text-foreground/80 hover:text-foreground"
            >
              Ver más
            </Link>
          )}
        </div>

        {subtitle && (
          <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">
            {subtitle}
          </p>
        )}

        {children && <div className={`mt-4 ${bodyClass}`}>{children}</div>}
      </div>

      {/* ✅ Estilo scoped que SIEMPRE gana: negro en light y blanco en dark */}
      <style jsx>{`
        .${bodyClass} :global(.chip) {
          color: #000 !important;
          font-weight: 600 !important;
        }
        :global(.dark) .${bodyClass} :global(.chip) {
          color: #fff !important;
          font-weight: 600 !important;
        }
      `}</style>
    </motion.article>
  );
}
