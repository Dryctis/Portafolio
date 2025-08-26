"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function GodRays({
  color = "139,92,246",
  strength = 1,
  className = "",
}: { color?: string; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const opacity = 0.35 * strength;
  const blur = 48 * strength;

  return (
    <motion.div
      className={
        "pointer-events-none absolute left-1/2 -translate-x-1/2 " +
        "top-[14vh] h-[72vh] w-[160vw] sm:w-[130vw] lg:w-[120vw] " +
        className
      }
      style={{
        background: `repeating-conic-gradient(
          from -8deg at 50% 0%,
          rgba(${color},${opacity}) 0deg,
          rgba(${color},${opacity}) 2.5deg,
          transparent 6deg
        )`,
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 12%, #000 55%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 12%, #000 55%, transparent 100%)",
        mixBlendMode: "screen",
        filter: `blur(${blur}px)`,
      }}
      initial={{ rotate: -4 }}
      animate={reduce ? { rotate: 0 } : { rotate: [-4, 4, -4] }}
      transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
