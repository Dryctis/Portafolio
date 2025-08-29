"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Carga Prism sólo en cliente
const Prism = dynamic(() => import("@/components/Prism"), { ssr: false });

type Props = { className?: string };

export default function PortfolioPrismBackground({ className = "" }: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const requestIdle = (cb: () => void) => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback;
      return ric ? ric(cb) : window.setTimeout(cb, 120);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) requestIdle(() => setActive(true));
        else setActive(false);
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={ref}
      className={[
        // z-0 para quedar dentro del stacking context del wrapper y detrás del contenido (que ya tiene z-10)
        "absolute inset-0 z-0 pointer-events-none",
        className,
      ].join(" ")}
      aria-hidden
    >
      {active && (
        <Prism
          animationType="3drotate"
          timeScale={0.5}
          height={3.2}
          baseWidth={5.2}
          scale={3.4}
          hueShift={0}
          colorFrequency={0.95}
          noise={0.2}
          glow={0.95}
          bloom={0.9}
          suspendWhenOffscreen

          // 👇 Fuerza máxima nitidez en desktop
          dprCap={2}
          // 👇 Sube opacidad para que “cante” el shader (sin lavar)
          opacityLight={2}
          opacityDark={2}
          // 👇 Mantén escala 1:1 en móvil (si quieres menos carga, pon 0.9)
          mobileScale={1}
        />
      )}
    </div>
  );
}
