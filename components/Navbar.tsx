"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { site } from "@/lib/site";
import { InstagramIcon } from "./icons";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre-mi", label: "Sobre mí" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo className="h-[22px] w-auto" />
        </Link>

        <div className="hidden items-center gap-8 text-[13px] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:bg-black sm:flex"
            >
              <LayoutDashboard className="size-3.5" /> Panel
            </Link>
          )}
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="rounded-full p-2 text-muted transition hover:bg-canvas hover:text-ink"
          >
            <InstagramIcon className="size-[18px]" />
          </a>
          <button
            className="rounded-full p-2 text-muted hover:bg-canvas md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/[0.06] px-5 pb-5 pt-2 md:hidden">
          {[...links, ...(isAdmin ? [{ href: "/admin", label: "Panel" }] : [])].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-black/[0.06] py-3 text-[17px] font-medium last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
