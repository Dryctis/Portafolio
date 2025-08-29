// components/StatCard.tsx
"use client";

import * as React from "react";

type Tint = "accent" | "blue" | "purple" | "green" | "orange" | "pink" | "slate";

const TINTS: Record<Tint, [string, string]> = {
  accent: ["var(--accent)", "var(--accent-2)"],
  blue: ["#60a5fa", "#22d3ee"],
  purple: ["#a78bfa", "#f472b6"],
  green: ["#34d399", "#22d3ee"],
  orange: ["#fb923c", "#f59e0b"],
  pink: ["#f472b6", "#fb7185"],
  slate: ["#64748b", "#94a3b8"],
};

function useGradientStyle(tint: Tint) {
  return React.useMemo<React.CSSProperties>(() => {
    const [from, to] = TINTS[tint] ?? TINTS.accent;
    return {
      backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    };
  }, [tint]);
}

type Props = {
  value: string | number;
  label: string;
  tint?: Tint;
  className?: string;
  locale?: string;
  compact?: boolean;
  fractionDigits?: number;
};

export default function StatCard({
  value,
  label,
  tint = "accent",
  className = "",
  locale = "es-ES",
  compact = false,
  fractionDigits,
}: Props) {
  const gradientStyle = useGradientStyle(tint);
  const labelId = React.useId();
  const valueId = React.useId();

  const formatted = React.useMemo(() => {
    if (typeof value !== "number") return value;
    const opts: Intl.NumberFormatOptions = compact
      ? { notation: "compact", maximumFractionDigits: fractionDigits ?? 1 }
      : { maximumFractionDigits: fractionDigits ?? 0 };
    return new Intl.NumberFormat(locale, opts).format(value);
  }, [value, locale, compact, fractionDigits]);

  return (
    <section
      role="group"
      aria-labelledby={labelId}
      aria-describedby={valueId}
      className={[
        "rounded-2xl border border-border bg-card p-5 shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] dark:shadow-none",
        "card-translucent",
        className,
      ].join(" ")}
    >
      <div
        id={valueId}
        className="text-4xl sm:text-5xl font-extrabold leading-none tracking-tight"
        style={gradientStyle}
        title={typeof value === "number" ? String(value) : undefined}
      >
        {formatted}
      </div>
      <div id={labelId} className="mt-1 text-sm font-medium text-[color:var(--color-muted)]">
        {label}
      </div>
    </section>
  );
}
