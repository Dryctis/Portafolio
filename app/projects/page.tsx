// app/projects/page.tsx
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { projects, type Project } from "@/data/projects";

export const metadata = { title: "Proyectos | Allan-Dev" };
export const revalidate = 60 * 60; // 1h – cachea la llamada a GitHub

type GhRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string; // ISO
  html_url: string;
  homepage?: string | null;
};

// Repos curados (exactamente como están en GitHub)
const CURATED_REPOS = [
  { owner: "Dryctis", repo: "APILoginConGoogle", tag: "Backend • Auth" },
  { owner: "Dryctis", repo: "Login_GoogleFrontEnd", tag: "Frontend • Auth" },
  { owner: "Dryctis", repo: "APIChatBotGemini", tag: "Backend • IA/Gemini" },
  { owner: "Dryctis", repo: "greenbot-asistente", tag: "Frontend • IA/Gemini" },
] as const;

async function getRepo(owner: string, repo: string): Promise<GhRepo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      // headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }, // opcional
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

export default async function ProjectsPage() {
  // Fetch en paralelo de los repos curados
  const curated = await Promise.all(
    CURATED_REPOS.map(async (r) => {
      const data = await getRepo(r.owner, r.repo);
      return data
        ? {
            tag: r.tag,
            ...data,
          }
        : null;
    })
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <BackButton />
      </div>
      <p className="text-foreground/70 mb-10">
        Casos seleccionados con código y despliegue.
      </p>

      {/* Destacados (de tu data local) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {projects.map((p: Project) => {
          const href = p.live || p.repo || "#";
          const disabled = !p.live && !p.repo;

          return (
            <article
              key={p.slug}
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgb(2_6_23_/_0.06)]"
            >
              <h2 className="text-lg md:text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-foreground/70">{p.blurb}</p>

              <div className="mt-4">
                <Link
                  href={href}
                  target={disabled ? undefined : "_blank"}
                  aria-disabled={disabled}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                    disabled
                      ? "opacity-50 cursor-not-allowed pointer-events-none border border-border text-foreground/60"
                      : "bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-95",
                  ].join(" ")}
                >
                  Demo {!disabled && <span aria-hidden>↗</span>}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Otros del repositorio (curados) */}
      <h2 className="text-xl font-semibold mb-4">Otros del repositorio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {curated
          .filter(Boolean)
          .map((r) => {
            const repo = r as NonNullable<typeof r>;
            const hasDemo = !!repo.homepage && repo.homepage.trim() !== "";
            return (
              <article
                key={repo.full_name}
                className="group rounded-2xl border border-border bg-card/60 p-5 shadow-[0_6px_18px_rgb(2_6_23_/_0.05)] hover:shadow-[0_10px_28px_rgb(2_6_23_/_0.08)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {repo.name}
                  </Link>

                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <span className="rounded-md border border-border bg-card/70 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                        {repo.language}
                      </span>
                    )}
                    <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px]">
                      {
                        CURATED_REPOS.find(
                          (c) =>
                            `${c.owner}/${c.repo}`.toLowerCase() ===
                            repo.full_name.toLowerCase()
                        )!.tag
                      }
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-foreground/70 line-clamp-4">
                  {repo.description || "Repositorio sin descripción."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-foreground/60">
                  <div className="flex items-center gap-4">
                    <span>★ {repo.stargazers_count}</span>
                    <span>Actualizado {formatDate(repo.pushed_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDemo && (
                      <Link
                        href={repo.homepage as string}
                        target="_blank"
                        className="rounded-md border border-border px-2.5 py-1 hover:bg-foreground/5 transition"
                      >
                        Demo ↗
                      </Link>
                    )}
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      className="rounded-md bg-foreground/10 px-2.5 py-1 hover:bg-foreground/20 transition"
                    >
                      Repo ↗
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </main>
  );
}
