// components/BackButton.tsx  — versión morada
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  label?: string;
  className?: string;
  /** Si quisieras sobreescribir los tonos morados en alguna página */
  from?: string; // por defecto #7C3AED
  to?: string;   // por defecto #6366F1
};

export default function BackButton({
  label = "VOLVER",
  className = "",
  from,
  to,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.altKey && e.key === "ArrowLeft") || e.key === "Escape") {
        e.preventDefault();
        router.back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Morados por defecto (puedes redefinirlos en CSS con las vars)
  const gradFrom =
    from ?? "var(--accent-purple-from, #7C3AED)"; // violet-600
  const gradTo =
    to ?? "var(--accent-purple-to, #6366F1)";      // indigo-500
  const onAccent = "var(--on-accent, #ffffff)";
  const gradient = `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={[
        "relative inline-flex items-center justify-center group select-none",
        "px-7 py-3 rounded-full uppercase tracking-wide font-semibold",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--accent-purple-from,#7C3AED)]/35",
        className,
      ].join(" ")}
      aria-label="Volver a la página anterior"
      title="Volver (Alt + ← / Esc)"
      style={{ color: onAccent }}
    >
      {/* Glow */}
      <span
        aria-hidden
        className="absolute -inset-[3px] rounded-full opacity-80 blur-[6px] transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: gradient }}
      />
      {/* Superficie */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full shadow-[0_10px_24px_rgba(0,0,0,.18)] ring-2 ring-white/10"
        style={{ background: gradient }}
      />
      {/* Brillo superior */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,.35), rgba(255,255,255,0) 46%)",
        }}
      />
      {/* Contenido */}
      <span className="relative z-[1] inline-flex items-center gap-3">
        <span
          aria-hidden
          className="text-[18px] font-extrabold -ml-1 transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          «
        </span>
        <span className="text-sm sm:text-base">{label}</span>
      </span>
    </button>
  );
}
