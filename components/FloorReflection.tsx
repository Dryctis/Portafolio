"use client";

export default function FloorReflection({
  color = "139,92,246",
  strength = 1,
  className = "",
}: { color?: string; strength?: number; className?: string }) {
  const o1 = 0.35 * strength;
  const o2 = 0.16 * strength;

  return (
    <div
      className={
        "pointer-events-none absolute left-1/2 -translate-x-1/2 " +
        "top-[22vh] sm:top-[18vh] h-[90vh] w-[180vw] sm:w-[140vw] lg:w-[120vw] " +
        className
      }
      style={{
        background: `radial-gradient(
          120% 100% at 50% 0%,
          rgba(${color},${o1}) 0%,
          rgba(${color},${o2}) 35%,
          rgba(${color},0.06) 58%,
          transparent 78%
        )`,
        mixBlendMode: "screen",
        filter: "blur(70px)",
      }}
    />
  );
}
