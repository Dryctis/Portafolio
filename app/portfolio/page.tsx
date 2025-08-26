// app/page.tsx
import DashboardGrid from "@/components/DashboardGrid";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Inicio | Allan-Dev" };

// ✅ Generación estática (mejor TTFB) 
export const dynamic = "force-static";

// ✅ (Opcional si despliegas en Vercel) ejecuta en Edge Runtime
export const runtime = "edge";

// (Opcional) meta de viewport con theme-color
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0e" },
  ],
};

export default function Home() {
  return (
    // un poco menos de padding para acercarlo al navbar sin pegarlo
    <main className="pt-8 lg:pt-10 pb-10 lg:pb-12">
      <DashboardGrid />
      <Navbar />
    </main>
  );
}
