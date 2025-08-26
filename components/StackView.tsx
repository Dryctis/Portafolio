"use client";

import { useMemo, useState } from "react";
import type React from "react";
import SectionCard from "@/components/SectionCard";

/* ---------- Colores (mismos que tu Dashboard) ---------- */
const TECH_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f7df1e",
  python: "#3776ab",
  "c#": "#682876",
  react: "#61dafb",
  nextjs: "#000000",
  tailwindcss: "#06b6d4",
  html: "#e34f26",
  css: "#1572b6",
  angular: "#dd0031",
  nodejs: "#5fa04e",
  dotnet: "#512bd4",
  aspnet: "#512bd4",
  aspnetcore: "#512bd4",
  apirest: "#ef4444",
  rest: "#ef4444",
  api: "#ef4444",
  jwt: "#7f57f1",
  oauth2: "#3b82f6",
  jwtoauth2: "#7f57f1",
  sql: "#00618a",
  sqlserver: "#cc2927",
  postgresql: "#336791",
  docker: "#2496ed",
  railway: "#0b0d0e",
  vercel: "#000000",
  netlify: "#00ad9f",
  github: "#000000",
  cicd: "#10b981",
  selenium: "#43B02A",
  expressjs: "#000000",
  postman: "#ff6c37",
};

function norm(label: string) {
  return label
    .toLowerCase()
    .replaceAll(/\s+/g, "")
    .replaceAll(/[.&]/g, "")
    .replaceAll(/-+/g, "");
}
function hexToRgba(hex: string, a = 1) {
  const h = hex.replace("#", "");
  const v = h.length === 3
    ? parseInt(h.split("").map(c => c + c).join(""), 16)
    : parseInt(h, 16);
  const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function chipStyle(label: string): React.CSSProperties {
  const key = norm(label);
  if (!TECH_COLORS[key]) return {};
  const base = TECH_COLORS[key];
  return {
    backgroundColor: hexToRgba(base, 0.16),
    borderColor: hexToRgba(base, 0.55),
    color: "var(--color-foreground)",
    fontWeight: 600,
  };
}

/* ---------- Modelo de datos para la vista detallada ---------- */
type Level = 1 | 2 | 3 | 4 | 5;
type Tech = {
  name: string;
  category:
    | "Lenguajes"
    | "Frontend"
    | "Backend / APIs"
    | "Bases de datos"
    | "DevOps"
    | "Testing / QA"
    | "Herramientas";
  level: Level;         // 1-5
  years?: number;       // años aproximados
  use: string;          // en qué la usas
  tags?: string[];      // etiquetas buscables
  links?: { label: string; href: string }[];
};

// Reemplaza TODO el const DATA por este:
const DATA: Tech[] = [
  // Lenguajes
  { name: "TypeScript", category: "Lenguajes", level: 3, years: 2, use: "Tipado robusto en front/back con Node y Next.", tags: ["typescript", "ts"] },
  { name: "JavaScript", category: "Lenguajes", level: 3, years: 2, use: "Web apps, tooling y scripts.", tags: ["js"] },
  { name: "C#", category: "Lenguajes", level: 4, years: 3, use: "APIs y servicios con .NET/ASP.NET.", tags: ["csharp", ".net"] },
  { name: "SQL", category: "Lenguajes", level: 3, years: 2, use: "Consultas, modelado y optimización básica.", tags: ["tsql", "sql"] },
  { name: "HTML", category: "Lenguajes", level: 5, years: 5, use: "Maquetación semántica.", tags: ["html5"] },
  { name: "CSS / Tailwind", category: "Lenguajes", level: 4, years: 3, use: "UI rápida y consistente con Tailwind CSS.", tags: ["css", "tailwind"] },

  // Frontend
  { name: "React", category: "Frontend", level: 3, years: 1, use: "Interfaces reactivas, estado y hooks.", tags: ["react"] },
  { name: "Next.js", category: "Frontend", level: 3, years: 1, use: "SSR/SSG, rutas app router, optimización.", tags: ["nextjs"] },
  { name: "Angular", category: "Frontend", level: 4, years: 1, use: "Apps modulares, RxJS, forms.", tags: ["angular"] },

  // Backend / APIs
  { name: "Node.js", category: "Backend / APIs", level: 4, years: 2, use: "APIs con Express, utilidades CLI.", tags: ["node"] },
  { name: "Express.js", category: "Backend / APIs", level: 4, years: 2, use: "Routing y middlewares livianos.", tags: ["express"] },
  { name: "ASP.NET Core", category: "Backend / APIs", level: 4, years: 3, use: "APIs REST robustas, MVC, filtros.", tags: ["aspnet", "dotnet"] },
  { name: "Auth (JWT / OAuth2)", category: "Backend / APIs", level: 3, years: 1, use: "Autenticación/Autorización para SPAs y APIs.", tags: ["jwt", "oauth2"] },

  // Bases de datos
  { name: "SQL Server", category: "Bases de datos", level: 4, years: 3, use: "OLTP clásico, vistas y SPs.", tags: ["sqlserver"] },
  { name: "PostgreSQL", category: "Bases de datos", level: 3, years: 2, use: "Relacional open-source, funciones y extensiones.", tags: ["postgresql", "psql"] },

  // DevOps
  { name: "Docker", category: "DevOps", level: 2, years: 1, use: "Contenerización para dev y despliegues.", tags: ["docker"] },
  { name: "Railway / Vercel / Netlify", category: "DevOps", level: 3, years: 2, use: "Hosting de APIs/Front con previews y envs.", tags: ["railway", "vercel", "netlify"] },

  // Testing / QA
  { name: "Postman", category: "Testing / QA", level: 4, years: 2, use: "Colecciones de pruebas de API y documentación.", tags: ["postman"] },

  // Herramientas
  { name: "GitHub", category: "Herramientas", level: 4, years: 3, use: "Flujo Git, PRs, issues y proyectos.", tags: ["github"] },
];

/* ---------- UI helpers ---------- */
const CATEGORIES: Tech["category"][] = [
  "Lenguajes",
  "Frontend",
  "Backend / APIs",
  "Bases de datos",
  "DevOps",
  "Testing / QA",
  "Herramientas",
];

function levelLabel(l: Level) {
  if (l >= 5) return "Experto";
  if (l >= 4) return "Avanzado";
  if (l === 3) return "Intermedio";
  return "Básico";
}

function LevelBar({ level }: { level: Level }) {
  const percent = level * 20;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className="h-full rounded-full"
        style={{
          width: `${percent}%`,
          background:
            "linear-gradient(90deg, var(--accent), rgba(127,87,241,.6))",
        }}
      />
    </div>
  );
}

export default function StackView() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"Todas" | Tech["category"]>("Todas");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter((t) => {
      const byCat = cat === "Todas" || t.category === cat;
      const haystack = (
        t.name +
        " " +
        t.use +
        " " +
        (t.tags || []).join(" ")
      ).toLowerCase();
      const byText = !q || haystack.includes(q);
      return byCat && byText;
    });
  }, [query, cat]);

  // Group by category for layout
  const grouped = useMemo(() => {
    const g = new Map<Tech["category"], Tech[]>();
    CATEGORIES.forEach((c) => g.set(c, []));
    filtered.forEach((t) => g.get(t.category)!.push(t));
    return Array.from(g.entries()).filter(([, arr]) => arr.length);
  }, [filtered]);

  return (
    <>
      {/* Controles */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat("Todas")}
            className={[
              "rounded-full px-3 py-1 text-sm border",
              cat === "Todas"
                ? "bg-[var(--accent)] text-[var(--on-accent)] border-transparent"
                : "bg-card border-border text-foreground/80 hover:bg-card/80",
            ].join(" ")}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={[
                "rounded-full px-3 py-1 text-sm border",
                cat === c
                  ? "bg-[var(--accent)] text-[var(--on-accent)] border-transparent"
                  : "bg-card border-border text-foreground/80 hover:bg-card/80",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, uso, etiqueta…"
            className="w-full md:w-80 rounded-lg border border-border bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-foreground/50">
            {filtered.length} ítem(s)
          </span>
        </div>
      </div>

      {/* Leyenda de niveles */}
      <div className="mb-4 text-xs text-foreground/60">
        <span className="font-semibold">Leyenda:</span> Básico (1–2), Intermedio (3),
        Avanzado (4), Experto (5).
      </div>

      {/* Grupos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {grouped.map(([grupo, items]) => (
          <SectionCard key={grupo} title={grupo}>
            <ul className="space-y-4">
              {items.map((t) => (
                <li key={`${grupo}-${t.name}`} className="rounded-xl border border-border bg-card/70 p-4">
                  {/* Cabezera */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-md border px-2.5 py-1 text-xs font-semibold"
                        style={chipStyle(t.name)}
                      >
                        {t.name}
                      </span>
                      {t.tags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {t.tags.slice(0, 3).map((tg) => (
                            <span
                              key={tg}
                              className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px]"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-2 items-center gap-3 sm:w-80">
                      <div className="col-span-2">
                        <LevelBar level={t.level} />
                      </div>
                      <div className="text-xs text-foreground/60">
                        Nivel: <span className="font-medium text-foreground/80">{levelLabel(t.level)}</span>
                      </div>
                      <div className="text-xs text-foreground/60 text-right">
                        {t.years ? `${t.years} año(s)` : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="mt-3 text-sm text-foreground/80">{t.use}</p>

                  {/* Links (opcionales) */}
                  {t.links?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {t.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          className="rounded-md border border-border bg-card/60 px-2.5 py-1 text-xs hover:bg-card/80"
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>

      {/* Pipeline de despliegue y prácticas */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Pipeline típico">
          <ol className="space-y-2 text-sm text-foreground/80 list-decimal pl-5">
            <li>Dev local con Node/.NET + Docker (cuando aplica).</li>
            <li>GitFlow ligero: feature branches → PR → code review.</li>
            <li>CI: build y pruebas (GitHub Actions).</li>
            <li>CD: deploy a Vercel/Netlify (front) y Railway (APIs/BBDD).</li>
            <li>Observabilidad básica: logs, métricas del proveedor y alertas simples.</li>
          </ol>
        </SectionCard>

        <SectionCard title="En aprendizaje / radar">
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>Testing E2E moderno (Playwright) y contract-testing para APIs.</li>
            <li>Container hardening y mejores prácticas de seguridad en .NET.</li>
            <li>Mejorar monitoreo con OpenTelemetry y trazas distribuidas.</li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
