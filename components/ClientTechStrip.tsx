"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Carga perezosa del carrusel real (client-only)
const TechStrip = dynamic(() => import("@/components/TechStrip"), {
  ssr: false,
});

// Props extra para controlar el diferido
type DeferMode = "visible" | "idle" | "both" | "none";

type Props = {
  /** Montaje diferido: visible (IO), idle (requestIdleCallback) o ambos */
  defer?: DeferMode;
  /** Margen del IntersectionObserver (ej. "160px") */
  rootMargin?: string;
  /** Placeholder mientras difiere */
  placeholder?: ReactNode;
  /** Passthrough de props originales del TechStrip */
  [key: string]: any;
};

export default function ClientTechStrip({
  defer = "both",
  rootMargin = "160px",
  placeholder = (
    <div
      className="h-6 w-full rounded-md bg-[color:var(--color-card)]/60"
      aria-hidden
    />
  ),
  ...props
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState<boolean>(defer === "none");

  useEffect(() => {
    if (ready) return;

    let idleId: number | null = null;
    let obs: IntersectionObserver | null = null;

    const makeReady = () => setReady(true);

    // Defer por inactividad (idle)
    if (defer === "idle" || defer === "both") {
      // @ts-ignore
      if (typeof window.requestIdleCallback === "function") {
        // @ts-ignore
        idleId = window.requestIdleCallback(makeReady, { timeout: 1500 });
      } else {
        idleId = window.setTimeout(makeReady, 200);
      }
    }

    // Defer por visibilidad (IO)
    if (defer === "visible" || defer === "both") {
      const el = ref.current;
      if (el) {
        obs = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) {
              setReady(true);
              obs?.disconnect();
            }
          },
          { root: null, rootMargin, threshold: 0.01 }
        );
        obs.observe(el);
      }
    }

    return () => {
      if (idleId) window.clearTimeout(idleId);
      obs?.disconnect();
    };
  }, [defer, rootMargin, ready]);

  return <div ref={ref}>{ready ? <TechStrip {...props} /> : placeholder}</div>;
}
