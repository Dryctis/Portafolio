// components/SkipLink.tsx
// Componente server (no requiere "use client"): enlace para saltar directo al contenido
export default function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only fixed top-2 left-2 z-[1000] rounded-md px-3 py-2
                 bg-[color:var(--color-foreground)] text-[color:var(--color-background)] shadow"
    >
      Saltar al contenido
    </a>
  );
}
