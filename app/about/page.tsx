import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import AboutExpanded from "@/components/AboutExpanded";

export const metadata: Metadata = { title: "Sobre mí | Allan-Dev" };

export default function AboutPage() {
  return (
    // 👇 Clip horizontal para que nada “empuje” el layout
    <main className="mx-auto max-w-6xl px-6 py-12 overflow-x-clip">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="sr-only">Sobre mí</h1>
        <BackButton />
      </div>

      <AboutExpanded />
    </main>
  );
}
