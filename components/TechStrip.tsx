"use client";

import { memo, useMemo } from "react";
import LogoLoop from "@/components/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiAngular,
  SiNodedotjs,
  SiExpress,
  SiVercel,
  SiGithub,
  SiDocker,
  SiPostgresql,
  SiDotnet,
} from "react-icons/si";
import { AiOutlineDatabase } from "react-icons/ai"; // Fallback SQL Server

type StripProps = {
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
};

function TechStrip({
  speed = 26,
  direction = "left",
  logoHeight = 26,
  gap = 32,
  pauseOnHover = true,
  fadeOut = true,
  fadeOutColor = "var(--color-background)",
  ariaLabel = "Tecnologías principales",
}: StripProps) {
  const logos = useMemo(
    () => [
      { node: <span aria-hidden><SiReact size={logoHeight} /></span>,       title: "React",        href: "https://react.dev" },
      { node: <span aria-hidden><SiNextdotjs size={logoHeight} /></span>,   title: "Next.js",      href: "https://nextjs.org" },
      { node: <span aria-hidden><SiTypescript size={logoHeight} /></span>,  title: "TypeScript",   href: "https://www.typescriptlang.org" },
      { node: <span aria-hidden><SiTailwindcss size={logoHeight} /></span>, title: "Tailwind CSS", href: "https://tailwindcss.com" },
      { node: <span aria-hidden><SiAngular size={logoHeight} /></span>,     title: "Angular",      href: "https://angular.dev" },
      { node: <span aria-hidden><SiNodedotjs size={logoHeight} /></span>,   title: "Node.js",      href: "https://nodejs.org" },
      { node: <span aria-hidden><SiExpress size={logoHeight} /></span>,     title: "Express",      href: "https://expressjs.com" },
      { node: <span aria-hidden><SiDotnet size={logoHeight} /></span>,      title: ".NET",         href: "https://dotnet.microsoft.com" },
      // Fallback para SQL Server (ícono genérico de DB)
      { node: <span aria-hidden><AiOutlineDatabase size={logoHeight} /></span>, title: "SQL Server", href: "https://www.microsoft.com/sql-server" },
      { node: <span aria-hidden><SiPostgresql size={logoHeight} /></span>,  title: "PostgreSQL",   href: "https://www.postgresql.org" },
      { node: <span aria-hidden><SiVercel size={logoHeight} /></span>,      title: "Vercel",       href: "https://vercel.com" },
      { node: <span aria-hidden><SiGithub size={logoHeight} /></span>,      title: "GitHub",       href: "https://github.com" },
      { node: <span aria-hidden><SiDocker size={logoHeight} /></span>,      title: "Docker",       href: "https://www.docker.com" },
    ],
    [logoHeight]
  );

  return (
    <LogoLoop
      logos={logos}
      speed={speed}
      direction={direction}
      logoHeight={logoHeight}
      gap={gap}
      pauseOnHover={pauseOnHover}
      fadeOut={fadeOut}
      fadeOutColor={fadeOutColor}
      ariaLabel={ariaLabel}
    />
  );
}

export default memo(TechStrip);
