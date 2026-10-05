import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-canvas text-[12px] text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. La información de este blog es educativa y no
          sustituye una consulta personalizada.
        </p>
        <div className="flex gap-5">
          <Link href="/blog" className="hover:text-ink">Blog</Link>
          <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            Instagram
          </a>
          <Link href="/admin" className="hover:text-ink">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
