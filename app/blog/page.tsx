import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";
import { categories } from "@/lib/site";
import { PostCard } from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos de nutrición, hábitos y recetas.",
};

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { categoria } = await searchParams;
  const active = typeof categoria === "string" ? categoria : null;
  const all = await getPublishedPosts();
  const posts = active ? all.filter((p) => p.category === active) : all;

  const pill = (selected: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition ${
      selected ? "bg-ink text-white" : "bg-canvas text-muted hover:text-ink"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 md:pt-20">
      <h1 className="font-display text-[48px] font-semibold tracking-[-0.03em] md:text-[64px]">Blog</h1>
      <p className="mt-3 max-w-xl text-[19px] text-muted">
        Todo lo que necesitas saber para comer bien, explicado sin complicaciones.
      </p>

      <nav className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2" aria-label="Categorías">
        <Link href="/blog" className={pill(!active)}>
          Todo
        </Link>
        {categories.map((c) => (
          <Link key={c} href={`/blog?categoria=${encodeURIComponent(c)}`} className={pill(active === c)}>
            {c}
          </Link>
        ))}
      </nav>

      {posts.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 rounded-card bg-canvas py-16 text-center text-[17px] text-muted">
          Aún no hay artículos {active ? `en “${active}”` : ""}. ¡Vuelve pronto!
        </p>
      )}
    </div>
  );
}
