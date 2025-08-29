"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

/* ----------------------------- Tipos de logos ----------------------------- */
type NodeLogo = { node: React.ReactNode; title: string; href?: string };
type ImgLogo  = { src: string; alt: string; href?: string; title?: string };
export type Logo = NodeLogo | ImgLogo;

type Props = {
  logos: Logo[];
  /** velocidad en px/seg */
  speed?: number;
  direction?: "left" | "right";
  /** altura del logo en px */
  logoHeight?: number;
  /** separación horizontal entre logos en px */
  gap?: number;
  pauseOnHover?: boolean;
  /** escalar logo al hacer hover */
  scaleOnHover?: boolean;
  /** degradado de desvanecimiento en bordes */
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  className?: string;
};

function isImg(l: Logo): l is ImgLogo {
  return (l as ImgLogo).src !== undefined;
}

/**
 * Carrusel infinito y **suave**: mueve el contenedor por tiempo con rAF,
 * y hace wrap del offset con el ancho de UNA secuencia.
 * Al duplicar la secuencia (A + A) el bucle no tiene cortes perceptibles.
 */
export default function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  logoHeight = 44,
  gap = 40,
  pauseOnHover = true,
  scaleOnHover = false,
  fadeOut = true,
  fadeOutColor = "transparent",
  ariaLabel = "Clientes",
  className = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);   // contenedor que se mueve
  const seqRef = useRef<HTMLDivElement>(null);     // primera secuencia (A)
  const [seqWidth, setSeqWidth] = useState(0);

  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // medir ancho de la secuencia A y observar cambios de tamaño
  useEffect(() => {
    const measure = () => {
      if (seqRef.current) setSeqWidth(seqRef.current.scrollWidth);
    };
    measure();

    if (typeof ResizeObserver !== "undefined" && seqRef.current) {
      const ro = new ResizeObserver(measure);
      ro.observe(seqRef.current);
      return () => ro.disconnect();
    }
    return;
  }, [logos, gap, logoHeight]);

  // Animación continua con rAF (sin reiniciar keyframes)
  useEffect(() => {
    let raf: number | null = null;
    let lastTs: number | null = null;
    let offset = 0;

    const dir = direction === "left" ? 1 : -1;

    const tick = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (!pausedRef.current && seqWidth > 0) {
        offset = (offset + dir * speed * dt) % seqWidth;
        if (offset < 0) offset += seqWidth; // mantener positivo

        const el = trackRef.current;
        if (el) {
          // 3D para forzar aceleración por GPU y suavidad
          el.style.transform = `translate3d(-${offset}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [speed, direction, seqWidth]);

  // (No necesitamos la constante `doubled`; renderizamos A y A duplicada explícitamente)
  return (
    <div
      className={[
        "relative overflow-hidden",
        "rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60",
        className,
      ].join(" ")}
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      style={
        fadeOut
          ? {
              WebkitMaskImage: `linear-gradient(to right, ${fadeOutColor}00 0%, ${fadeOutColor}FF 12%, ${fadeOutColor}FF 88%, ${fadeOutColor}00 100%)`,
              maskImage: `linear-gradient(to right, ${fadeOutColor}00 0%, ${fadeOutColor}FF 12%, ${fadeOutColor}FF 88%, ${fadeOutColor}00 100%)`,
            }
          : undefined
      }
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: `${gap}px`, alignItems: "center", height: `${logoHeight + 24}px` }}
      >
        {/* Secuencia A (referencia para medir ancho) */}
        <div ref={seqRef} className="flex items-center" style={{ gap: `${gap}px` }}>
          {logos.map((l, i) => (
            <LogoItem key={`a-${i}`} logo={l} height={logoHeight} scaleOnHover={scaleOnHover} />
          ))}
        </div>

        {/* Secuencia A duplicada */}
        <div className="flex items-center" aria-hidden style={{ gap: `${gap}px` }}>
          {logos.map((l, i) => (
            <LogoItem key={`b-${i}`} logo={l} height={logoHeight} scaleOnHover={scaleOnHover} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Logo item -------------------------------- */
function LogoItem({
  logo,
  height,
  scaleOnHover,
}: {
  logo: Logo;
  height: number;
  scaleOnHover?: boolean;
}) {
  const isImage = isImg(logo);
  const href = logo.href; // presente en ambos tipos
  const aria = isImage ? logo.alt : logo.title;
  const titleAttr = isImage ? (logo.title ?? logo.alt) : logo.title;

  const content = isImage ? (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={Math.round(height * 1.1)}
      height={height}
      style={{ height, width: "auto", objectFit: "contain", opacity: 0.9 }}
      draggable={false}
    />
  ) : (
    <span
      title={logo.title}
      className="opacity-90"
      style={{ display: "inline-grid", placeItems: "center", height, fontSize: height }}
    >
      {logo.node}
    </span>
  );

  const cls = [
    "inline-grid place-items-center",
    "opacity-90 hover:opacity-100",
    scaleOnHover ? "transition-transform hover:scale-[1.06]" : "",
  ].join(" ");

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cls}
      style={{ height }}
      aria-label={aria}
      title={titleAttr}
      draggable={false}
    >
      {content}
    </a>
  ) : (
    <span className={cls} style={{ height }} draggable={false}>
      {content}
    </span>
  );
}
