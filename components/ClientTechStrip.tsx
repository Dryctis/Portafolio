"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Carga perezosa del carrusel real (client-only)
const TechStrip = dynamic(() => import("@/components/TechStrip"), {
  ssr: false,
});

// ——— Tipos auxiliares (sin usar `any`) ———
type DeferMode = "visible" | "idle" | "both" | "none";

interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}
type IdleCallback = (deadline: IdleDeadline) => void;
type RequestIdleCallback = (cb: IdleCallback, opts?: { timeout?: number }) => number;
type CancelIdleCallback = (handle: number) => void;

// Tomamos los props del componente real (sin escribir `any` nosotros)
type TechStripProps = React.ComponentProps<typeof TechStrip>;

type BaseProps = {
  /** Montaje diferido: visible (IO), idle (requestIdleCallback) o ambos */
  defer?: DeferMode;
  /** Margen del IntersectionObserver (ej. "160px") */
  rootMargin?: string;
  /** Placeholder mientras difiere */
  placeholder?: ReactNode;
};

// Permitimos pasar cualquier prop válida para TechStrip sin `any`
type Props = BaseProps & Partial<TechStripProps>;

export default function ClientTechStrip({
  defer = "both",
  rootMargin = "160px",
  placeholder = (
    <div
      className="h-6 w-full rounded-md bg-[color:var(--color-card)]/60"
      aria-hidden
    />
  ),
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState<boolean>(defer === "none");

  useEffect(() => {
    if (ready) return;

    let idleId: number | null = null;
    let obs: IntersectionObserver | null = null;

    const makeReady = () => setReady(true);

    // Defer por inactividad (idle) — sin @ts-ignore, con tipos propios
    if (defer === "idle" || defer === "both") {
      const w = window as unknown as {
        requestIdleCallback?: RequestIdleCallback;
        cancelIdleCallback?: CancelIdleCallback;
      };
      if (typeof w.requestIdleCallback === "function") {
        idleId = w.requestIdleCallback(makeReady, { timeout: 1500 });
      } else {
        idleId = window.setTimeout(makeReady, 200);
      }
    }

    // Defer por visibilidad (IntersectionObserver)
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
      if (idleId !== null) {
        // Intentamos cancelar idle si existe; si no, limpiamos timeout
        const w = window as unknown as { cancelIdleCallback?: CancelIdleCallback };
        if (typeof w.cancelIdleCallback === "function") {
          w.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      }
      obs?.disconnect();
    };
  }, [defer, rootMargin, ready]);

  return <div ref={ref}>{ready ? <TechStrip {...(rest as TechStripProps)} /> : placeholder}</div>;
}
