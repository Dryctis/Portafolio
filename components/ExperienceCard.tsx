"use client";
export default function ExperienceCard() {
  return (
    <article className="rounded-2xl border border-border bg-card backdrop-blur-sm p-5 shadow-[0_8px_24px_rgb(2_6_23_/_0.06)] dark:shadow-none">
      <h3 className="font-semibold">Experiencia / Highlights</h3>
      <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted)]">
        <li>• +2 Año desarrollando aplicaciones Web (Freelance)</li>
        <li>• Desarrollo completo y despliegues en la nube (Vercel/Netlify/Railway/Azure) </li>
        <li>• APIs seguras (JWT/OAuth2), pruebas con Postman/Swagger.</li>
        <li>• Enfoque en rendimiento, accesibilidad y UX</li>
      </ul>
    </article>
  );
}
