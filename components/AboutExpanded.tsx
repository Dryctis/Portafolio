import Link from "next/link";
import SectionCard from "@/components/SectionCard";
import { site } from "@/data/site";

/* ----------------------------- Tipos y datos ------------------------------ */
type Cert = { title: string; issuer: string; year?: string; url?: string };

const CERTS: Cert[] = [
  {
    title: "Desarrollando Aplicaciones en Angular 19 y ASP.NET Core 9",
    issuer: "Udemy",
    url: "https://www.udemy.com/certificate/UC-12c4557f-0347-4fce-81f7-e13d13e851d1",
  },
  {
    title: "Master en ASP.NET MVC - Entity Framework (.NET 9)",
    issuer: "Udemy",
    url: "https://www.udemy.com/certificate/UC-ec4b3fcb-aee4-4945-9d22-5d91f934dbf8",
  },
];

const CORE_STACK = [
  "C# / .NET",
  "ASP.NET",
  "Node.js",
  "React / Next.js",
  "TypeScript",
  "SQL / PostgreSQL",
  "Docker",
  "CI/CD",
];

/* --------------------------------- Icons --------------------------------- */
const Check = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true" fill="currentColor">
    <path d="M9.55 16.4 5.8 12.66a.9.9 0 1 1 1.27-1.27l2.49 2.48 6.37-6.37a.9.9 0 1 1 1.27 1.27l-7 7a.9.9 0 0 1-1.27 0Z" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M13.5 5.25a.75.75 0 0 1 1.06 0l5.94 5.94a.75.75 0 0 1 0 1.06l-5.94 5.94a.75.75 0 1 1-1.06-1.06l4.16-4.16H4.5a.75.75 0 0 1 0-1.5h13.16l-4.16-4.16a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

/* ------------------------------- Micro UI -------------------------------- */
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-border bg-card/70 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/70 sm:px-3 sm:py-1 sm:text-xs">
    {children}
  </span>
);

const Num = ({ n }: { n: number }) => (
  <span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-[var(--accent)]/14 text-[var(--accent)] text-[10px] font-bold shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)] sm:size-6 sm:text-xs">
    {n}
  </span>
);

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AboutExpanded() {
  const mailto = (() => {
    const subject = encodeURIComponent("Consulta / colaboración");
    const body = encodeURIComponent(
      `Hola Allan,\n\nMe gustaría hablar sobre un proyecto/colaboración.\n\nGracias,\n`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  })();

  const userInitials = initials(site.name);

  return (
    // Clip horizontal para evitar overflow
    <div className="relative mx-auto max-w-5xl 2xl:max-w-6xl px-4 sm:px-6 lg:px-8 overflow-x-clip">

      {/* HERO */}
      <section>
        <div className="relative rounded-3xl p-[0.5px] bg-[linear-gradient(120deg,theme(colors.violet.500/.45),transparent_35%,transparent_65%,theme(colors.indigo.500/.45))] shadow-[0_12px_28px_rgba(2,6,23,.08)]">
          <div className="relative rounded-3xl bg-card/90 backdrop-blur-sm p-4 sm:p-6">
            <div className="pointer-events-none absolute inset-x-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/70 to-transparent" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="rounded-2xl p-[2px] bg-[linear-gradient(180deg,theme(colors.violet.500/.6),theme(colors.indigo.500/.6))] shadow-[0_6px_20px_rgba(109,40,217,.25)]">
                  <div className="flex size-14 sm:size-16 items-center justify-center rounded-xl bg-[linear-gradient(180deg,theme(colors.violet.500/.25),theme(colors.indigo.500/.25))] text-base sm:text-lg font-extrabold text-foreground/90">
                    {userInitials || "AR"}
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{site.name}</h1>
                  <p className="mt-1 text-foreground/70 text-[13px] sm:text-sm">{site.role}</p>
                  <p className="mt-2 max-w-3xl text-[13px] sm:text-sm text-foreground/85">
                    {site.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge>{site.years} experiencia</Badge>
                <Badge>{site.deliveries} proyectos</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Principal */}
        <section className="xl:col-span-7 grid gap-4 sm:gap-6">
          <SectionCard title="Fortalezas" className="[&>div.z-10]:p-4 sm:[&>div.z-10]:p-5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] sm:text-sm">
              {[
                "Proactivo y autodidacta",
                "Ownership de punta a punta",
                "Comunicación clara",
                "Enfoque en producto (impacto > output)",
                "Calidad: pruebas, docs y seguridad",
                "Mejora continua",
              ].map((txt) => (
                <li key={txt} className="flex items-start gap-2 text-foreground/85">
                  <span className="mt-1 text-[var(--accent)]"><Check /></span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Cómo trabajo" className="[&>div.z-10]:p-4 sm:[&>div.z-10]:p-5">
            <ol className="relative pl-6 text-[13px] sm:text-sm text-foreground/85">
              <span className="pointer-events-none absolute left-2 top-1 bottom-1 w-px bg-foreground/10" />
              {[
                "Entiendo objetivo, restricciones y éxito esperado.",
                "Priorizo entregables con impacto y plazo realista.",
                "Prototipo, valido, recojo feedback y ajusto.",
                "Automatizo CI/CD, documento y dejo medible el valor entregado.",
                "Itero y mejoro de forma continua.",
              ].map((step, i) => (
                <li key={i} className="mb-2.5 flex items-start">
                  <Num n={i + 1} />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Contacto directo" className="[&>div.z-10]:p-4 sm:[&>div.z-10]:p-5">
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-[13px] sm:text-sm">
              <div className="space-y-1.5 sm:space-y-2">
                <div>Ubicación: <span className="font-medium">{site.location}</span></div>
                <div>Teléfono: <Link href={"tel:+50236643037"} className="font-medium underline underline-offset-2">+502 3664 3037</Link></div>
                <div>Email: <a className="underline underline-offset-2" href={`mailto:${site.email}`}>{site.email}</a></div>
              </div>

              <div className="flex flex-wrap items-start gap-2.5 sm:gap-3 md:justify-end">
                <a href={mailto} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3.5 py-2 text-[13px] sm:text-sm font-semibold text-[var(--on-accent)] shadow-[0_8px_24px_rgba(0,0,0,.12)] hover:opacity-95">
                  Escríbeme <ArrowRight />
                </a>
                {site.cvUrl && (
                  <Link href={site.cvUrl} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3.5 py-2 text-[13px] sm:text-sm text-foreground/80 hover:bg-card/80">
                    Descargar CV ↗
                  </Link>
                )}
                <Link href={site.linkedin} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3.5 py-2 text-[13px] sm:text-sm text-foreground/80 hover:bg-card/80">
                  LinkedIn ↗
                </Link>
                <Link href={site.github} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3.5 py-2 text-[13px] sm:text-sm text-foreground/80 hover:bg-card/80">
                  GitHub ↗
                </Link>
              </div>
            </div>
          </SectionCard>
        </section>

        {/* Lateral */}
        <aside className="xl:col-span-5 grid gap-4 sm:gap-6">
          <SectionCard title="Certificados" className="[&>div.z-10]:p-4 sm:[&>div.z-10]:p-5">
            <ul className="space-y-3 sm:space-y-4 text-[13px] sm:text-sm">
              {CERTS.map((c) => (
                <li key={`${c.title}-${c.issuer}`} className="relative pl-5">
                  <span className="absolute left-0 top-2 size-2 rounded-full bg-[var(--accent)]/70 shadow-[0_0_0_3px_rgba(127,87,241,.18)]" />
                  <div className="font-medium">{c.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span className="text-foreground/60">{c.issuer}</span>
                    {c.year && (
                      <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px]">
                        {c.year}
                      </span>
                    )}
                    {c.url && (
                      <Link
                        href={c.url}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-[13px] sm:text-sm font-semibold text-[var(--on-accent)] shadow-[0_6px_16px_rgba(127,87,241,.28)] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
                      >
                        Ver certificado <ArrowRight />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Stack principal" className="[&>div.z-10]:p-4 sm:[&>div.z-10]:p-5">
            <div className="flex flex-wrap gap-2">
              {CORE_STACK.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-gradient-to-b from-[var(--accent)]/10 to-transparent px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground/80 shadow-[inset_0_-1px_0_rgba(255,255,255,.08)] hover:bg-foreground/[.03] transition"
                >
                  {t}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Proyectos que me entusiasman" className="[&>div.z-10]:p-4 sm:[&>div.z-10]:p-5">
            <ul className="space-y-1.5 sm:space-y-2 text-[13px] sm:text-sm text-foreground/85">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-[var(--accent)]"><Check /></span>
                APIs seguras y escalables (.NET / Node).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-[var(--accent)]"><Check /></span>
                Front-ends rápidos (Next.js / Angular).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-[var(--accent)]"><Check /></span>
                Integraciones (auth, pagos, terceros) y automatización.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-[var(--accent)]"><Check /></span>
                Producto con impacto medible.
              </li>
            </ul>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
