
import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { projects, type Project } from "@/data/projects";

export const metadata: Metadata = { title: "Proyectos | Allan-Dev" };
export const revalidate = 3600; 

type GhRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string; 
  html_url: string;
  homepage?: string | null;
};

type CuratedRepoDef = { owner: string; repo: string; tag: string };
const CURATED_REPOS = [
  { owner: "Dryctis", repo: "APILoginConGoogle", tag: "Backend • Auth" },
  { owner: "Dryctis", repo: "Login_GoogleFrontEnd", tag: "Frontend • Auth" },
  { owner: "Dryctis", repo: "APIChatBotGemini", tag: "Backend • IA/Gemini" },
  { owner: "Dryctis", repo: "greenbot-asistente", tag: "Frontend • IA/Gemini" },
] as const satisfies readonly CuratedRepoDef[];

type CuratedRepo = GhRepo & { tag: string };

async function getRepo(owner: string, repo: string): Promise<GhRepo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      
      next: { revalidate }, 
    });
    if (!res.ok) return null;
    return (await res.json()) as GhRepo;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export default async function ProjectsPage() {
  // Fetch en paralelo de los repos curados
  const curatedRaw = await Promise.all(
    CURATED_REPOS.map(async (r) => {
      const data = await getRepo(r.owner, r.repo);
      return data ? ({ tag: r.tag, ...data } as CuratedRepo) : null;
    })
  );
  const curated = curatedRaw.filter((r): r is CuratedRepo => r !== null);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <BackButton />
      </div>
      <p className="text-foreground/70 mb-10">
        Casos seleccionados con código y despliegue.
      </p>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" role="list" aria-label="Proyectos destacados">
        {projects.map((p: Project) => {
          const href = p.live || p.repo || "";
          const disabled = !p.live && !p.repo;
          const titleId = `proj-${p.slug}`;

          return (
            <article
              key={p.slug}
              role="listitem"
              aria-labelledby={titleId}
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2"
            >
              <h2 id={titleId} className="text-lg md:text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-foreground/70">{p.blurb}</p>

              <div className="mt-4">
                {disabled ? (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-border text-foreground/60 opacity-50 cursor-not-allowed"
                    title="Próximamente"
                  >
                    Demo
                  </button>
                ) : isExternal(href) ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    aria-label={`Abrir demo de ${p.title} en una nueva pestaña`}
                  >
                    Demo <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <Link
                    href={href || "/projects"}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    aria-label={`Abrir demo de ${p.title}`}
                  >
                    Demo
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      
      <h2 className="text-xl font-semibold mb-4">Otros del repositorio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5" role="list" aria-label="Otros repositorios">
        {curated.map((repo) => {
          const hasDemo = !!repo.homepage && repo.homepage.trim() !== "";

          return (
            <article
              key={repo.full_name}
              role="listitem"
              className="group rounded-2xl border border-border bg-card/60 p-5 shadow-[0_6px_18px_rgb(2_6_23_/_0.05)] hover:shadow-[0_10px_28px_rgb(2_6_23_/_0.08)] transition-shadow focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded"
                  aria-label={`Abrir repositorio ${repo.name} en GitHub (nueva pestaña)`}
                  title={repo.full_name}
                >
                  {repo.name}
                </a>

                <div className="flex items-center gap-2">
                  {repo.language && (
                    <span className="rounded-md border border-border bg-card/70 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                      {repo.language}
                    </span>
                  )}
                  <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px]">
                    {repo.tag}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-sm text-foreground/70 line-clamp-4">
                {repo.description || "Repositorio sin descripción."}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-foreground/60">
                <div className="flex items-center gap-4">
                  <span aria-label="Estrellas">★ {repo.stargazers_count}</span>
                  <span aria-label="Última actualización">Actualizado {formatDate(repo.pushed_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasDemo && (
                    <a
                      href={repo.homepage as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border px-2.5 py-1 hover:bg-foreground/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                      aria-label={`Abrir demo de ${repo.name} (nueva pestaña)`}
                    >
                      Demo ↗
                    </a>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-foreground/10 px-2.5 py-1 hover:bg-foreground/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    aria-label={`Abrir repositorio ${repo.name} en GitHub (nueva pestaña)`}
                  >
                    Repo ↗
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
