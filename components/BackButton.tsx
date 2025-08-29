// components/BackButton.tsx — versión morada optimizada
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type Props = {
  label?: string;
  className?: string;
  /** Si quisieras sobreescribir los tonos morados en alguna página */
  from?: string; // por defecto #7C3AED
  to?: string;   // por defecto #6366F1
  /** Ruta a la que ir si no hay historial (p. ej., acceso directo a la página) */
  fallbackHref?: string; // default: "/"
};

export default function BackButton({
  label = "VOLVER",
  className = "",
  from,
  to,
  fallbackHref = "/",
}: Props) {
  const router = useRouter();

  const goBack = useCallback(() => {
    // Si hay historial (navegaste dentro del sitio), volver.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    // Si no, usa el fallback (evita quedarse en la misma página).
    router.push(fallbackHref);
  }, [router, fallbackHref]);

  // Evitar capturar atajos cuando escribes en inputs/textarea/contenteditable
  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      const editable =
        el.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT";
      return editable;
    };

    const onKey = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;

      const altLeft = e.altKey && (e.key === "ArrowLeft" || e.code === "ArrowLeft");
      const escape = e.key === "Escape" || e.code === "Escape";

      if (altLeft || escape) {
        e.preventDefault();
        goBack();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack]);

  // Morados por defecto (puedes redefinirlos en CSS con las vars)
  const gradFrom = from ?? "var(--accent-purple-from, #7C3AED)"; // violet-600
  const gradTo   = to   ?? "var(--accent-purple-to, #6366F1)";    // indigo-500
  const onAccent = "var(--on-accent, #ffffff)";
  const gradient = `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`;

  return (
    <button
      type="button"
      onClick={goBack}
      className={[
        "relative inline-flex items-center justify-center group select-none",
        // Altura mínima táctil (Fitts) + padding cómodo
        "min-h-11 px-6 sm:px-7 py-3 rounded-full uppercase tracking-wide font-semibold",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-4",
        "focus-visible:ring-[color:var(--accent-purple-from,#7C3AED)]/35",
        "ring-offset-2 ring-offset-[color:var(--color-background)]",
        className,
      ].join(" ")}
      aria-label="Volver a la página anterior"
      aria-keyshortcuts="Alt+ArrowLeft, Escape"
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
          className="text-[18px] font-extrabold -ml-1 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
        >
          «
        </span>
        <span className="text-sm sm:text-base">{label}</span>
      </span>
    </button>
  );
}
