// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Sora, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

const sora = Sora({ subsets: ["latin"], weight: ["400","600","800"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Allan-Dev",
  description: "Portafolio y CV — Allan Dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="theme-deepblue" suppressHydrationWarning>
      <head>
        {/* Aplica el tema antes de hidratar para evitar parpadeos */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var saved = localStorage.getItem('theme');
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var dark = saved ? saved === 'dark' : mq.matches;
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e){}
})();
            `.trim(),
          }}
        />
      </head>
      <body
        className={[
          sora.variable,
          mono.variable,
          "font-sans antialiased min-h-screen",
          "bg-[color:var(--color-background)]",
          "text-[color:var(--color-foreground)]",
        ].join(" ")}
      >
        {/* Déjalo global. El propio Navbar decide si se muestra o no en "/" */}
        
        <Navbar />
        {children}
      </body>
    </html>
  );
}
