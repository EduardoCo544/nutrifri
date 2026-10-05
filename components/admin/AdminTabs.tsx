"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Publicaciones" },
  { href: "/admin/inicio", label: "Página de inicio" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="inline-flex rounded-full bg-canvas p-1 text-[14px] font-medium" aria-label="Secciones del panel">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`rounded-full px-4 py-1.5 transition ${pathname === t.href ? "bg-white shadow-sm" : "text-muted hover:text-ink"}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
