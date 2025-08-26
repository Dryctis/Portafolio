"use client";

import * as React from "react";

type Tint =
  | "accent"
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "pink"
  | "slate";

const TINTS: Record<Tint, [string, string]> = {
  // usa tu paleta del tema para acentuar
  accent: ["var(--accent)", "var(--accent-2)"],
  // opciones por si quieres variar por tarjeta
  blue: ["#60a5fa", "#22d3ee"],
  purple: ["#a78bfa", "#f472b6"],
  green: ["#34d399", "#22d3ee"],
  orange: ["#fb923c", "#f59e0b"],
  pink: ["#f472b6", "#fb7185"],
  slate: ["#64748b", "#94a3b8"],
};

function gradientTextStyle(tint: Tint): React.CSSProperties {
  const [from, to] = TINTS[tint] ?? TINTS.accent;
  return {
    backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
}

type Props = {
  value: string | number;
  label: string;
  tint?: Tint;          // color del texto (no del fondo)
  className?: string;
};

export default function StatCard({ value, label, tint = "accent", className = "" }: Props) {
  return (
    <div
      className={[
        "rounded-2xl border border-[color:var(--color-border)]",
        "bg-[color:var(--color-card)]/70 backdrop-blur-sm p-5",
        "shadow-[0_8px_24px_rgba(2,6,23,0.04)] dark:shadow-none",
        className,
      ].join(" ")}
    >
      <div
        className="text-4xl font-extrabold leading-none tracking-tight"
        style={gradientTextStyle(tint)}
      >
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-[color:var(--color-muted)]">
        {label}
      </div>
    </div>
  );
}
