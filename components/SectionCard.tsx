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
  return (
    <motion.article
      id={id}
      {...rest}
      whileHover={{ y: -3, scale: accent ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={[
        // base theme-aware
        "relative rounded-2xl border",
        "bg-[color:var(--color-card)]",
        "text-[color:var(--color-foreground)]",
        "border-[color:var(--color-border)]",
        // optional accent halo
        accent ? "ring-1 ring-[var(--color-accent)]/40" : "",
        // NO backdrop-blur en light (era lo que lavaba todo)
        className,
      ].join(" ")}
    >
      {/* fondo sutil (tema-aware) por si quieres un poco de profundidad */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-10 rounded-2xl pointer-events-none
          bg-gradient-to-br from-black/[0.02] to-black/[0.04]
          dark:from-white/[0.04] dark:to-white/[0.02]
        "
      />

      <div className="p-5 sm:p-6">
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

        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.article>
  );
}
