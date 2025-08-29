"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import TitleSweep from "@/components/TitleSweep";

// FX pesados en lazy, solo cliente (no bloquean el render inicial)
const AmbientFX = dynamic(() => import("@/components/AmbientFX"), { ssr: false });
const GodRays = dynamic(() => import("@/components/GodRays"), { ssr: false });
const FloorReflection = dynamic(() => import("@/components/FloorReflection"), { ssr: false });

type Props = { title?: string; subtitle?: string; glowColor?: string };

export default function TubelightHero({
  title = "Allan-Dev",
  subtitle = "Desarrollador Full Stack",
  glowColor = "139,92,246", // rgb violeta
}: Props) {
  const prefersReduced = useReducedMotion();

  // Cargamos FX cuando el navegador está ocioso para no competir con LCP
  const [fxReady, setFxReady] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [density, setDensity] = useState(60);
  const [intensity, setIntensity] = useState(1.2);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    setDensity(isMobile ? 36 : 96);
    setIntensity(isMobile ? 1 : 1.4);

    // Defer de FX sin requestIdleCallback (evita 'any' y 'Function')
    const t = window.setTimeout(() => setFxReady(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  // Parallax suave solo en punteros “finos” y si no se pidió menos movimiento
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 50, damping: 20 });
  const y = useSpring(my, { stiffness: 50, damping: 20 });

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isFinePointer || prefersReduced) return;
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      mx.set(nx * 24);
      my.set(ny * 14);
    },
    [isFinePointer, prefersReduced, mx, my]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  // Fondos “glow” calculados (memo para no recalcular en cada render)
  const centralBg = useMemo(
    () =>
      `radial-gradient(120% 70% at 50% 0%, rgba(${glowColor},0.95) 0%, rgba(${glowColor},0.35) 38%, transparent 70%)`,
    [glowColor]
  );
  const sideLeftBg = useMemo(
    () => `radial-gradient(80% 70% at 0% 0%, rgba(${glowColor},0.45) 0%, transparent 70%)`,
    [glowColor]
  );
  const sideRightBg = useMemo(
    () => `radial-gradient(80% 70% at 100% 0%, rgba(${glowColor},0.45) 0%, transparent 70%)`,
    [glowColor]
  );

  return (
    <section
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-screen overflow-hidden"
      {...(isFinePointer && !prefersReduced
        ? { onPointerMove: handleMove, onPointerLeave: handleLeave }
        : {})}
    >
      {/* Fondo base */}
      <div className="absolute inset-0 bg-[#0b0b1e]" />

      {/* Reflejo de “suelo” (defer) */}
      {fxReady && <FloorReflection color={glowColor} strength={1.2} className="z-[1]" />}

      {/* Glows principales “parallax” (LazyMotion con features mínimos) */}
      <LazyMotion features={domAnimation}>
        <m.div style={{ x, y }} className="relative z-[2]">
          <m.div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[18vh] sm:top-[16vh] lg:top-[14vh] h-[70vh] sm:h-[90vh] w-[160vw] sm:w-[1100px] lg:w-[1200px] blur-[56px] sm:blur-[70px]"
            style={{ background: centralBg }}
            initial={{ opacity: 0.65 }}
            animate={
              prefersReduced ? { opacity: 0.85 } : { opacity: [0.65, 0.95, 0.75] }
            }
            transition={
              prefersReduced
                ? { duration: 0.4 }
                : { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
            }
          />
          <div
            className="pointer-events-none absolute left-2 sm:left-6 top-[18vh] sm:top-[16vh] h-[56vh] sm:h-[70vh] w-[55%] sm:w-[40%] blur-[44px] sm:blur-[60px]"
            style={{ background: sideLeftBg }}
          />
          <div
            className="pointer-events-none absolute right-2 sm:right-6 top-[18vh] sm:top-[16vh] h-[56vh] sm:h-[70vh] w-[55%] sm:w-[40%] blur-[44px] sm:blur-[60px]"
            style={{ background: sideRightBg }}
          />
          <div className="absolute inset-x-[4vw] sm:inset-x-[6vw] md:inset-x-[8vw] top-[16vh] h-4 rounded-b-2xl bg-white/25" />
          <div className="absolute inset-x-[4vw] sm:inset-x-[6vw] md:inset-x-[8vw] top-[16.8vh] h-3 rounded-b-2xl bg-white/50 blur-md" />
        </m.div>
      </LazyMotion>

      {/* God rays (defer y solo si no hay reduced motion) */}
      {fxReady && !prefersReduced && (
        <GodRays color={glowColor} strength={1.2} className="z-[3]" />
      )}

      {/* Partículas/ambient (defer) */}
      {fxReady && (
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <AmbientFX density={density} intensity={intensity} color={glowColor} startAdvance={1} />
        </div>
      )}

      {/* Contenido centrado + CTA */}
      <div className="relative z-[10] min-h-[86vh] sm:min-h-[90vh] flex flex-col items-center justify-center px-6 text-center text-white">
        <TitleSweep text={title} className="text-5xl sm:text-7xl font-extrabold tracking-tight" />

        <m.p
          className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease: "easeOut" }}
        >
          {subtitle}
        </m.p>

        <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/portfolio"
            className="group mt-7 inline-flex items-center gap-2 rounded-full
                       bg-amber-400 text-[#0b0b1e] px-6 py-3 font-semibold
                       shadow-[0_10px_30px_rgba(245,158,11,.35)]
                       hover:shadow-[0_14px_36px_rgba(245,158,11,.5)]
                       transition focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-amber-400
                       focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b1e]"
            aria-label="Ver portafolio"
          >
            Ver portafolio
            <svg
              viewBox="0 0 24 24"
              className="size-4 translate-x-0 transition-transform group-hover:translate-x-0.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.5 5.25a.75.75 0 0 1 1.06 0l5.94 5.94a.75.75 0 0 1 0 1.06l-5.94 5.94a.75.75 0 1 1-1.06-1.06l4.16-4.16H4.5a.75.75 0 0 1 0-1.5h13.16l-4.16-4.16a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </Link>
        </m.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[20] h-24 bg-gradient-to-b from-black/60 to-transparent" />
    </section>
  );
}
