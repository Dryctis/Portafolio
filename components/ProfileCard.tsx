"use client";

import Link from "next/link";
import { site } from "@/data/site";

export default function ProfileCard() {
  const initials = site.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop
    }
  };

  const gmailHref = (() => {
    const to = encodeURIComponent(site.email);
    const su = encodeURIComponent(`Consulta - ${site.name}`);
    const body = encodeURIComponent(
      `Hola ${site.name.split(" ")[0]},\n\n` +
        `Un gusto saludarte. Me gustaría solicitar más información / un presupuesto sobre un proyecto.\n\n` +
        `• Breve descripción: \n` +
        `• Plazos estimados: \n` +
        `• Presupuesto aproximado: \n\n` +
        `Quedo atento.\n`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
  })();

  const telHref = `tel:${(site.phone ?? "").replace(/\s+/g, "")}`;

  return (
    <aside className="rounded-2xl border border-border bg-card p-6 text-foreground backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div
          className="grid h-16 w-16 place-items-center rounded-2xl font-bold text-xl text-[var(--on-accent)]"
          style={{
            background:
              "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
          }}
        >
          {initials}
        </div>
        <div>
          <div className="text-lg font-semibold">{site.name}</div>
          <div className="text-sm text-muted">{site.role}</div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="mt-4 text-sm">{site.location}</div>

      {/* Teléfono */}
      {site.phone && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <a
            href={telHref}
            className="underline text-foreground/80 hover:text-foreground"
          >
            {site.phone}
          </a>
          <button
            onClick={() => copy(site.phone!)}
            className="text-xs underline text-foreground/60 hover:text-foreground"
            type="button"
          >
            Copiar
          </button>
        </div>
      )}

      {/* Correo */}
      <div className="mt-2 flex items-center gap-2">
        <input
          readOnly
          value={site.email}
          className="w-full rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
        />
        <button
          onClick={() => copy(site.email)}
          className="text-xs underline text-foreground/60 hover:text-foreground"
          type="button"
        >
          Copiar
        </button>
      </div>

      {/* Social */}
      <div className="mt-4 flex gap-3">
        <a
          href={site.github}
          target="_blank"
          className="rounded-lg border border-border px-3 py-2 text-sm text-foreground/80 hover:bg-[color:var(--color-foreground)]/5"
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          className="rounded-lg border border-border px-3 py-2 text-sm text-foreground/80 hover:bg-[color:var(--color-foreground)]/5"
        >
          LinkedIn
        </a>
      </div>

      {/* CTAs */}
      <div className="mt-4 grid gap-3">
        <a
          href={gmailHref}
          target="_blank"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-[var(--on-accent)] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
        >
          Escríbeme por Gmail
        </a>
        <Link
          href={site.cvUrl}
          className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-[color:var(--color-foreground)]/5"
        >
          Descargar CV
        </Link>
      </div>
    </aside>
  );
}
