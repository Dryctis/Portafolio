"use client";
import React from "react";

/** Colores por tecnología (para la variante byTech) */
const TECH_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f7df1e",
  python: "#3776ab",
  "c#": "#682876",
  react: "#61dafb",
  nextjs: "#000000",
  tailwindcss: "#06b6d4",
  html: "#e34f26",
  css: "#1572b6",
  angular: "#dd0031",
  nodejs: "#5fa04e",
  dotnet: "#512bd4",
  aspnet: "#512bd4",
  aspnetcore: "#512bd4",
  apirest: "#ef4444",
  rest: "#ef4444",
  api: "#ef4444",
  jwt: "#7f57f1",
  oauth2: "#3b82f6",
  jwtoauth2: "#7f57f1",
  sql: "#00618a",
  sqlserver: "#cc2927",
  postgresql: "#336791",
  docker: "#2496ed",
  railway: "#0b0d0e",
  vercel: "#000000",
  netlify: "#00ad9f",
  github: "#000000",
  cicd: "#10b981",
  selenium: "#43B02A",
  expressjs: "#000000",
  postman: "#ff6c37",
};

function norm(s: string) {
  return s.toLowerCase().replaceAll(/\s+/g, "").replaceAll(/[.&-]/g, "");
}
function hexToRgba(hex: string, a = 1) {
  const h = hex.replace("#", "");
  const n = h.length === 3
    ? parseInt(h.split("").map(ch => ch + ch).join(""), 16)
    : parseInt(h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type Props = {
  children: React.ReactNode;
  /** "neutral" para proyectos (alto contraste), "byTech" para coloreados del Stack */
  variant?: "neutral" | "byTech";
  className?: string;
};

export default function TechBadge({ children, variant = "neutral", className = "" }: Props) {
  const label = String(children);
  const k = norm(label);

  
  let style: React.CSSProperties = {};
  let classes =
    "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 transition " +
   
    (variant === "neutral"
      ? "bg-gray-200 text-gray-800 ring-gray-300 hover:bg-gray-300/60 " +
        "dark:bg-white/10 dark:text-white/80 dark:ring-white/15 dark:hover:bg-white/15"
      : "");

  
  if (variant === "byTech" && TECH_COLORS[k]) {
    const base = TECH_COLORS[k];
    style = {
      backgroundColor: hexToRgba(base, 0.22),
      borderColor: hexToRgba(base, 0.6),
      color: "var(--color-foreground)",
      fontWeight: 600,
    };
    classes =
      "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 transition " +
      "bg-white/5 dark:bg-white/5"; 
  }

  return (
    <span className={`${classes} ${className}`} style={style}>
      {label}
    </span>
  );
}
