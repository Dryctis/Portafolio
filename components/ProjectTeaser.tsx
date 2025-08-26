"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";

type Props = { title: string; href?: string; className?: string };

export default function ProjectTeaser({
  title,
  href = "/projects",
  className = "",
}: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`rounded-2xl border border-border bg-card backdrop-blur-sm shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] dark:shadow-none ${className}`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <Link
            href={href}
            className="text-sm underline text-foreground/70 hover:text-foreground"
          >
            Ver más
          </Link>
        </div>

        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Casos reales con código y despliegue.
        </p>

        {/* 3 mini-cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projects.slice(0, 3).map((p: Project) => {
            const url = p.live || p.repo || href;
            const external = Boolean(p.live || p.repo);

            return (
              <Link
                key={p.slug}
                href={url}
                target={external ? "_blank" : undefined}
                className="rounded-lg border border-border bg-card/70 px-3 py-3 hover:border-[var(--color-accent)]/40 transition"
              >
                <div className="text-sm font-medium">{p.title}</div>
                {/* usa blurb en lugar de description */}
                {p.blurb && (
                  <div className="mt-1 text-xs text-[color:var(--color-muted)] line-clamp-2">
                    {p.blurb}
                  </div>
                )}
                {external && (
                  <span className="mt-2 inline-block text-[10px] uppercase tracking-wide text-foreground/60">
                    Abrir ↗
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
