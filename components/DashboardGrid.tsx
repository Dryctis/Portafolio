// components/DashboardGrid.tsx
import type React from "react";

import ProfileCard from "@/components/ProfileCard";
import SectionCard from "@/components/SectionCard";
import StatCard from "@/components/StatCard";
import ExperienceCard from "@/components/ExperienceCard";
import Image from "next/image";
import Link from "next/link";
import ClientTechStrip from "@/components/ClientTechStrip";

import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";

/* ---------- Colores representativos por tecnología (para Stack) ---------- */
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
  // bonus:
  net: "#512bd4",
};

function norm(label: string) {
  return label
    .toLowerCase()
    .replaceAll(/\s+/g, "")
    .replaceAll(/[.&]/g, "")
    .replaceAll(/-+/g, "");
}
function hexToRgba(hex: string, alpha = 1): string {
  const h = hex.replace("#", "");
  const bigint =
    h.length === 3
      ? parseInt(h.split("").map((ch) => ch + ch).join(""), 16)
      : parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------- Chips morados sólo para "Sobre mí" (sin fijar color de texto) ---------- */
const PURPLE = "#7c3aed";
function purpleChipStyle(): React.CSSProperties {
  return {
    backgroundColor: hexToRgba(PURPLE, 0.22),
    borderColor: hexToRgba(PURPLE, 0.45),
    fontWeight: 600,
  };
}

/* ---------- Chips del Stack (sin fijar color de texto) ---------- */
function chipStyle(label: string): React.CSSProperties {
  const key = norm(label);
  const base = TECH_COLORS[key];
  if (!base) return {};
  return {
    backgroundColor: hexToRgba(base, 0.22),
    borderColor: hexToRgba(base, 0.45),
    fontWeight: 600,
  };
}

export default function DashboardGrid() {
  return (
    <div className="relative">
      <div className="relative z-[1] mx-auto max-w-[115rem] 2xl:max-w-[120rem] px-6 lg:px-10 pt-6 lg:pt-8 pb-10 lg:pb-12">
        {/* Carrusel */}
        <div className="mb-3 rounded-lg border border-transparent bg-transparent px-2 py-1">
          <ClientTechStrip
            speed={28}
            direction="left"
            logoHeight={22}
            gap={28}
            pauseOnHover
            fadeOut
            fadeOutColor="transparent"
            ariaLabel="Tecnologías principales"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-6">
          {/* Izquierda */}
          <aside
            className="xl:col-span-3"
            style={{ contentVisibility: "auto", containIntrinsicSize: "700px" }}
          >
            <div className="xl:sticky xl:top-24 grid gap-6">
              <ProfileCard />

              <SectionCard
                id="sobre-mi"
                title="Sobre mí"
                className="scroll-mt-24 bg-card/50 border-border/40"
              >
                <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                  Desarrollador web full-stack, proactivo y autodidacta. Entrego
                  valor con código simple y mantenible, comunico claro y me hago
                  cargo del ciclo completo. Aprendo rápido y busco mejorar
                  continuamente procesos.
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {[
                    "Proactivo",
                    "Autodidacta",
                    "Orientado a producto",
                    "Comunicación clara",
                    "Ownership",
                    "Mejora continua",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="chip inline-flex items-center rounded-md border px-2.5 py-1 font-medium transition"
                      style={purpleChipStyle()}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SectionCard>
            </div>
          </aside>

          {/* Centro */}
          <section
            className="xl:col-span-6 grid gap-6 lg:gap-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "1200px" }}
          >
            <SectionCard
              id="proyectos"
              title="Proyectos"
              subtitle="Casos reales con código y despliegue"
              className="scroll-mt-24 bg-card/50 border-border/40"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {projects.slice(0, 3).map((p, idx) => (
                  <article
                    key={p.slug ?? p.title}
                    className="group rounded-xl border border-border/40 bg-card/45 p-4 shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] dark:shadow-none hover:ring-1 hover:ring-[var(--color-accent)]/40 transition"
                  >
                    {p.image && (
                      <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <Image
                          src={p.image}
                          alt={`Miniatura de ${p.title}`}
                          fill
                          sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          priority={idx === 0}
                        />
                      </div>
                    )}
                    <h4 className="font-medium">{p.title}</h4>
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                      {p.blurb}
                    </p>

                    <div className="mt-3 flex gap-3">
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline text-foreground/80 hover:text-foreground"
                        >
                          Demo
                        </a>
                      )}
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline text-foreground/80 hover:text-foreground"
                        >
                          Repo
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <Link
                href="/projects"
                prefetch={false}
                className="mt-4 inline-flex items-center gap-1 text-sm underline text-foreground/80 hover:text-foreground"
              >
                Ver todos los proyectos →
              </Link>
            </SectionCard>

            <div className="grid grid-cols-3 gap-5">
              <StatCard
                value={site.years}
                label="Años"
                className="bg-card/45 border-border/40"
              />
              <StatCard
                value={site.deliveries}
                label="Proyectos"
                className="bg-card/45 border-border/40"
              />
            </div>
          </section>

          {/* Derecha */}
          <aside
            className="xl:col-span-3 grid gap-6 lg:gap-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
          >
            <div className="xl:sticky xl:top-24 grid gap-6">
              <ExperienceCard />

              <SectionCard
                id="stack"
                title="Stack"
                subtitle="Tecnologías, lenguajes y herramientas que uso"
                className="scroll-mt-24 bg-card/50 border-border/40"
              >
                <div className="space-y-5">
                  {Object.entries(stack).map(([grupo, items]) => (
                    <div key={grupo}>
                      <div className="mb-2 text-xs font-medium text-foreground/70">
                        {grupo.replace("_", " / ")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {items.map((t) => (
                          <span
                            key={`${grupo}-${t}`}
                            className="chip inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition"
                            style={chipStyle(t)}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
