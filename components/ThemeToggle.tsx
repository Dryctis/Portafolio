"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  // 1) Llama SIEMPRE a los hooks primero
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // 2) Decides VISIBILIDAD después de los hooks (no cambias el orden de hooks)
  const show = pathname !== "/";

  if (!mounted) return null; // esto no rompe la regla; los hooks ya se llamaron

  // Si no debe mostrarse en la portada, devolvemos un contenedor oculto
  if (!show) return <div className="hidden" aria-hidden />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      className={[
        "relative inline-flex h-9 w-16 items-center rounded-full",
        "border border-[color:var(--color-border)] bg-[color:var(--color-card)]",
        "shadow-sm transition-all focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)]/60 overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* pista */}
      <span className="absolute inset-0 bg-white/50 dark:bg-white/[.04]" />

      {/* knob */}
      <span
        className={[
          "relative z-[1] ml-1 h-7 w-7 rounded-full",
          "transition-transform duration-300 ease-out",
          isDark ? "translate-x-7" : "translate-x-0",
          "shadow-md",
        ].join(" ")}
      >
        <span
          className={[
            "absolute inset-0 m-auto h-7 w-7 rounded-full grid place-items-center",
            isDark ? "bg-[#9b87f5]" : "bg-yellow-400",
          ].join(" ")}
        >
          {isDark && (
            <span
              className="h-7 w-7 rounded-full"
              style={{
                WebkitMaskImage:
                  "radial-gradient(6px 6px at 45% 35%, rgba(0,0,0,.55) 98%, transparent 100%), radial-gradient(4px 4px at 62% 58%, rgba(0,0,0,.45) 98%, transparent 100%), radial-gradient(3px 3px at 38% 62%, rgba(0,0,0,.4) 98%, transparent 100%)",
                maskImage:
                  "radial-gradient(6px 6px at 45% 35%, rgba(0,0,0,.55) 98%, transparent 100%), radial-gradient(4px 4px at 62% 58%, rgba(0,0,0,.45) 98%, transparent 100%), radial-gradient(3px 3px at 38% 62%, rgba(0,0,0,.4) 98%, transparent 100%)",
                background: "#8b74ff",
                opacity: 0.35,
              }}
            />
          )}
        </span>
      </span>
    </button>
  );
}
