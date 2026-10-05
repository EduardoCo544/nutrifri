import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { PostCover } from "./PostCover";
import buddha from "@/public/images/buddha-bowl.jpg";
import frutas from "@/public/images/frutas.jpg";

// Los 3 recuadros del inicio. Cada uno muestra un artículo (destacado o reciente);
// si todavía no hay suficientes publicados, se queda con el contenido de ejemplo.
export function HomeHighlights({ posts }: { posts: Post[] }) {
  const [big, text, image] = posts;

  return (
    <div className="mt-12 grid gap-5 md:grid-cols-3 md:grid-rows-2">
      <Tile post={big} className="relative min-h-[340px] overflow-hidden rounded-card md:col-span-2 md:row-span-2 md:min-h-[560px]">
        {big ? (
          <PostCover src={big.coverUrl || buddha.src} alt={big.coverAlt || big.title} sizes="(min-width: 768px) 66vw, 100vw" />
        ) : (
          <Image src={buddha} alt="Bowl con aguacate, garbanzos, jitomate y camote" fill sizes="(min-width: 768px) 66vw, 100vw" placeholder="blur" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-lime">{big?.category ?? "Hábitos"}</p>
          <h3 className="mt-2 max-w-lg font-display text-[28px] font-semibold leading-tight tracking-tight md:text-[38px]">
            {big?.title ?? "Pequeñas acciones que se vuelven grandes hábitos."}
          </h3>
          {big && <ReadMore className="mt-4 text-white/90" />}
        </div>
      </Tile>

      <Tile post={text} className="flex min-h-[260px] flex-col justify-between rounded-card bg-lime p-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-forest/70">{text?.category ?? "Te lo explico"}</p>
        <div>
          <h3 className="line-clamp-3 font-display text-[26px] font-bold leading-tight tracking-tight text-forest md:text-[28px]">
            {text?.title ?? "¿Macros?"}
          </h3>
          <p className="mt-2 line-clamp-3 text-[16px] leading-relaxed text-forest/80">
            {text ? text.excerpt : "Qué son, para qué sirven y por qué no tienes que contarlos para comer bien."}
          </p>
          {text && <ReadMore className="mt-3 text-forest" />}
        </div>
      </Tile>

      <Tile post={image} className="relative min-h-[260px] overflow-hidden rounded-card bg-pink-soft">
        {image ? (
          <PostCover src={image.coverUrl || frutas.src} alt={image.coverAlt || image.title} sizes="(min-width: 768px) 33vw, 100vw" />
        ) : (
          <Image src={frutas} alt="Frutas tropicales de temporada" fill sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" className="object-cover opacity-90" />
        )}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/85 p-5 backdrop-blur-md">
          {image ? (
            <>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-pink-ink">{image.category}</p>
              <p className="mt-1 line-clamp-2 font-display text-[18px] font-semibold leading-snug tracking-tight text-ink">
                {image.title}
              </p>
            </>
          ) : (
            <>
              <p className="font-hand text-[26px] leading-none text-pink-ink">Frutas y verduras del mes</p>
              <p className="mt-1 text-[14px] text-muted">Conoce qué nos aporta cada una.</p>
            </>
          )}
        </div>
      </Tile>
    </div>
  );
}

function Tile({ post, className, children }: { post?: Post; className: string; children: React.ReactNode }) {
  if (!post) return <div className={className}>{children}</div>;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group transition duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      {children}
    </Link>
  );
}

function ReadMore({ className }: { className: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[15px] font-medium ${className}`}>
      Leer artículo <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </span>
  );
}
