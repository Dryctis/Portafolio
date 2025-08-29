import type { Metadata, Viewport } from "next";
import DashboardGrid from "@/components/DashboardGrid";
import PortfolioPrismBackground from "@/components/PortfolioPrismBackground";

export const metadata: Metadata = { title: "Inicio | Allan-Dev" };
export const dynamic = "force-static";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0e" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    
  ],
};

export default function Home() {
  return (
    // 👇 prism-page sirve para matar los overlays sólo en esta página
    <div className="prism-page relative min-h-[100dvh] isolate overflow-hidden">
      <PortfolioPrismBackground />

      <main id="contenido" className="relative z-10 pt-8 lg:pt-10 pb-10 lg:pb-12">
        <DashboardGrid />
      </main>
    </div>
  );
}
