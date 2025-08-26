// app/stack/page.tsx
import BackButton from "@/components/BackButton";
import StackView from "@/components/StackView";

export const metadata = { title: "Stack | Allan-Dev" };

export default function StackPage() {
  return (
    <main className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Cabecera con botón VOLVER a la derecha */}
        <div className="mb-2 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Stack</h1>

          {/* Puedes personalizar los tonos con from/to si quieres */}
          {/* <BackButton from="#7C3AED" to="#6366F1" /> */}
          <BackButton className="shrink-0" />
        </div>

        <p className="mb-8 text-[color:var(--color-muted)]">
          Tecnologías, lenguajes y herramientas que uso con frecuencia. Aquí tienes una
          vista detallada con nivel de dominio, años de uso y para qué las empleo.
        </p>

        <StackView />
      </div>
    </main>
  );
}
