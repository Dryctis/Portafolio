"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  density?: number;
  color?: string;
  intensity?: number;
  startAdvance?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function NoiseOverlay() {
  return (
    <svg className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" aria-hidden>
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
}

function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 56%, rgba(0,0,0,0.58) 100%)",
      }}
    />
  );
}

export default function AmbientFX({ density = 48, color = "139,92,246", intensity = 1, startAdvance = 0 }: Props) {
  const rnd = (i: number, s: number) => Math.abs(Math.sin(i * 97.77 + s * 0.733));

  const { near, far } = useMemo(() => {
    const total = Math.max(8, density);
    const nearCount = Math.round(total * 0.6);
    const farCount = total - nearCount;

    const mk = (count: number, layer: "near" | "far") =>
      Array.from({ length: count }).map((_, i) => {
        const seed = layer === "near" ? i + 1 : i + 1000;
        const left = `${Math.round(rnd(seed, 1) * 100)}vw`;
        const baseSize = layer === "near" ? 10 + rnd(seed, 2) * 14 : 4 + rnd(seed, 3) * 8;
        const size = Math.round(baseSize * intensity);
        const baseBlur = layer === "near" ? 8 + rnd(seed, 4) * 8 : 10 + rnd(seed, 5) * 12;
        const blur = clamp(baseBlur / (0.8 + 0.4 * intensity), 4, 22);
        const baseOpacity = layer === "near" ? 0.1 + rnd(seed, 6) * 0.1 : 0.05 + rnd(seed, 7) * 0.08;
        const opacity = clamp(baseOpacity * (0.9 + 0.6 * intensity), 0.03, 0.45);
        const duration = layer === "near" ? 16 + rnd(seed, 8) * 12 : 28 + rnd(seed, 9) * 18;
        const delay = rnd(seed, 10) * 8;
        const xDrift = layer === "near" ? (rnd(seed, 11) - 0.5) * 40 : (rnd(seed, 12) - 0.5) * 80;
        const flickerA = 0.6 + rnd(seed, 13) * 0.4;
        const flickerB = 0.6 + rnd(seed, 14) * 0.4;
        return { left, size, blur, opacity, duration, delay, xDrift, flickerA, flickerB };
      });

    return { near: mk(nearCount, "near"), far: mk(farCount, "far") };
  }, [density, intensity]);

  const dotBg = (a: number) =>
    `radial-gradient(circle at 35% 35%, rgba(${color},${a}) 0 55%, transparent 60%)`;
  const ds = (a: number, sz: number) => `drop-shadow(0 0 ${Math.round(sz * 0.9)}px rgba(${color},${a * 0.7}))`;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {far.map((d, i) => (
          <motion.span
            key={`far-${i}`}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-20vh", x: [0, d.xDrift, 0], opacity: [0, d.flickerA, d.flickerB, d.flickerA] }}
            transition={{
              duration: d.duration,
              delay: Math.max(0, d.delay - startAdvance),
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.5, 0.75, 1],
            }}
            style={{
              left: d.left,
              width: d.size,
              height: d.size,
              filter: `blur(${d.blur}px) ${ds(d.opacity, d.size)}`,
              background: dotBg(d.opacity),
            }}
            className="absolute rounded-full mix-blend-screen"
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {near.map((d, i) => (
          <motion.span
            key={`near-${i}`}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-20vh", x: [0, d.xDrift, 0], opacity: [0, d.flickerB, d.flickerA, d.flickerB] }}
            transition={{
              duration: d.duration,
              delay: Math.max(0, d.delay - startAdvance),
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.4, 0.7, 1],
            }}
            style={{
              left: d.left,
              width: d.size,
              height: d.size,
              filter: `blur(${d.blur}px) ${ds(d.opacity, d.size)}`,
              background: dotBg(d.opacity),
            }}
            className="absolute rounded-full mix-blend-screen"
          />
        ))}
      </div>

      <NoiseOverlay />
      <Vignette />
    </>
  );
}
