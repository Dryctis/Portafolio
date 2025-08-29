// components/ProjectTeaser.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { projects, type Project } from "@/data/projects";

type Props = { title: string; href?: string; className?: string };

export default function ProjectTeaser({ title, href = "/projects", className = "" }: Props) {
  const prefersReduced = useReducedMotion();
  const titleId = React.useId();
  const descId = React.useId();

  const initial = prefersReduced ? false : { opacity: 0, y: 16 };
  const animate = { opacity: 1, y: 0 };
  const whileHover = prefersReduced ? undefined : { y: -3 };

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        role="region"
        aria-labelledby={titleId}
        aria-describedby={descId}
        initial={initial}
        whileInView={animate}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={whileHover}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={[
          "group rounded-2xl border border-border bg-card",
          "card-translucent",
          "shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] dark:shadow-none",
          "focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2",
          className,
        ].join(" ")}
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 id={titleId} className="font-semibold text-base sm:text-lg">
              {title}
            </h3>
            <Link
              href={href}
              prefetch={false}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm underline underline-offset-4
                         text-foreground/70 hover:text-foreground
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]
                         focus-visible:ring-offset-2"
              aria-label={`Ver más proyectos (${title})`}
            >
              Ver más
            </Link>
          </div>

          <p id={descId} className="mt-1 text-sm text-[color:var(--color-muted)]">
            Casos reales con código y despliegue.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3" role="list">
            {projects.slice(0, 3).map((p: Project) => {
              const url = p.live || p.repo || href;
              const isExternal = /^https?:\/\//i.test(url);

              const inner = (
                <>
                  <div className="text-sm font-medium line-clamp-2">{p.title}</div>
                  {p.blurb && (
                    <div className="mt-1 text-xs text-[color:var(--color-muted)] line-clamp-2">
                      {p.blurb}
                    </div>
                  )}
                  {isExternal && (
                    <span
                      className="mt-2 inline-block text-[10px] uppercase tracking-wide text-foreground/60"
                      aria-hidden
                    >
                      Abrir ↗
                    </span>
                  )}
                </>
              );

              const baseClass =
                "block rounded-lg border border-border bg-card px-3 py-3 " +
                "card-translucent hover:border-[var(--color-accent)]/40 transition " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";

              return (
                <div key={p.slug} role="listitem">
                  {isExternal ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseClass}
                      aria-label={`Abrir ${p.title} en una nueva pestaña`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={url} prefetch={false} className={baseClass} aria-label={`Abrir ${p.title}`}>
                      {inner}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </m.article>
    </LazyMotion>
  );
}
