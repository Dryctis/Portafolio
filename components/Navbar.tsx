// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import type { IconType } from "react-icons";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineUser,
  HiOutlineServerStack,
} from "react-icons/hi2";

function isActivePath(pathname: string, href: string) {
  // Marca activo también en subrutas: /projects/[slug]
  return pathname === href || pathname.startsWith(href + "/");
}

// 👇 Ruta del dashboard (cámbiala a "/dashboard" si lo mueves)
const DASHBOARD_PATH = "/portfolio";

export default function Navbar() {
  const pathname = usePathname();
  const shouldRender = pathname !== "/"; // oculto en la home

  // Estado
  const [mobileOpen, setMobileOpen] = useState(false);

  // ------ Indicador animado (desktop) ------
  const deskLinksWrapRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number; visible: boolean }>(
    {
      left: 0,
      width: 0,
      visible: false,
    }
  );

  const updateIndicator = useCallback(() => {
    if (!shouldRender) return;
    const wrap = deskLinksWrapRef.current;
    if (!wrap) return;

    const el = wrap.querySelector<HTMLAnchorElement>('a[data-active="true"]');
    if (!el) {
      // si no hay activo, escondemos
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - wrapRect.left,
      width: elRect.width,
      visible: true,
    });
  }, [shouldRender]);

  useEffect(() => {
    updateIndicator();
  }, [pathname, updateIndicator]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateIndicator]);

  // Bloqueo de scroll sólo si el navbar existe
  useEffect(() => {
    if (!shouldRender) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, shouldRender]);

  // Cerrar con ESC sólo si el navbar existe
  useEffect(() => {
    if (!shouldRender) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shouldRender]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // 👇 Links con iconos (Inicio a la izquierda de Proyectos)
  const links: ReadonlyArray<{ href: string; label: string; Icon: IconType }> = [
    { href: DASHBOARD_PATH, label: "Inicio", Icon: HiOutlineHome },
    { href: "/projects", label: "Proyectos", Icon: HiOutlineFolder },
    { href: "/about", label: "Sobre mí", Icon: HiOutlineUser },
    { href: "/stack", label: "Stack", Icon: HiOutlineServerStack },
  ];

  const NavLink = ({
    href,
    children,
    onClick,
    desktop = false,
    Icon,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    desktop?: boolean;
    Icon?: IconType;
  }) => {
    const active = isActivePath(pathname, href);
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        data-active={desktop && active ? "true" : undefined}
        className={[
          "px-3 py-2 rounded-lg text-sm/6 font-medium transition-colors inline-flex items-center",
          active
            ? "text-[var(--accent)] bg-[color:var(--color-card)]/40"
            : "text-[color:var(--color-foreground)]/80 hover:text-[color:var(--color-foreground)]",
        ].join(" ")}
        title={typeof children === "string" ? (children as string) : undefined}
      >
        {Icon ? <Icon className="h-4 w-4 mr-1.5" aria-hidden /> : null}
        {children}
      </Link>
    );
  };

  // ⬅️ Si estamos en "/", no renderizamos nada
  if (!shouldRender) return null;

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          "translate-y-0 opacity-100 bg-[color:var(--color-background)]/75 supports-[backdrop-filter]:backdrop-blur-md border-b border-[color:var(--color-border)]/70",
        ].join(" ")}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Marca */}
          <Link
            href={DASHBOARD_PATH} // -> dashboard
            className="min-w-0 font-semibold tracking-tight text-[color:var(--color-foreground)]"
            onClick={closeMobile}
            aria-label="Ir al dashboard"
            prefetch={false}
          >
            <span className="opacity-80">Allan</span>
            <span className="text-[var(--accent)]">Dev</span>
          </Link>

          {/* Links desktop + indicador */}
          <div className="relative hidden md:block">
            <div ref={deskLinksWrapRef} className="relative flex items-center gap-1 pb-1">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href} desktop Icon={l.Icon}>
                  {l.label}
                </NavLink>
              ))}

              {/* Indicador animado — morado suave */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-[2px] h-[2px] rounded-full bg-[var(--accent)]/80 transition-all duration-300"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.visible ? 1 : 0,
                }}
              />
            </div>
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {/* Hamburguesa (móvil) */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              className="md:hidden shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-md p-2
                         text-[color:var(--color-foreground)]/80 hover:text-[color:var(--color-foreground)]
                         hover:bg-[color:var(--color-card)]/60 transition"
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                  <path d="M6.225 4.811 4.81 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                  <path d="M3.75 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Menú móvil */}
        {mobileOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-40 bg-black/40" onClick={closeMobile} aria-hidden="true" />
            <div className="fixed z-50 inset-x-0 top-14 bg-[color:var(--color-background)]/95 supports-[backdrop-filter]:backdrop-blur-md border-b border-[color:var(--color-border)]/70">
              <div className="px-4 py-4 flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink key={l.href} href={l.href} onClick={closeMobile} Icon={l.Icon}>
                    {l.label}
                  </NavLink>
                ))}
                <div className="pt-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer para compensar el navbar fijo (sólo fuera de "/") */}
      <div className="h-14" aria-hidden="true" />
    </>
  );
}
