"use client";

import * as React from "react";

type Props = {
  className?: string;
  title?: string;
  items?: Array<string | React.ReactNode>;
};

export default function ExperienceCard({
  className = "",
  title = "Experiencia / Highlights",
  items = [
    "+4 años desarrollando aplicaciones Web (Freelance)",
    "Desarrollo completo y despliegues en la nube (Vercel/Netlify/Railway/Azure)",
    "APIs seguras (JWT/OAuth2), pruebas con Postman/Swagger",
    "Enfoque en rendimiento, accesibilidad y UX",
  ],
}: Props) {
  const titleId = React.useId();

  return (
    <section
      role="region"
      aria-labelledby={titleId}
      className={[
        "rounded-2xl border border-border/50",
        "bg-card/80 p-5",
        "shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] dark:shadow-none",
        className,
      ].join(" ")}
    >
      <h3 id={titleId} className="font-semibold">
        {title}
      </h3>

      <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted)] list-disc pl-5 marker:text-foreground/40">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
