import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MessageCircleQuestion, Sparkles } from "lucide-react";
import { getHomeSettings, getPublishedPosts } from "@/lib/data";
import { defaultAbout, defaultHero } from "@/lib/home-defaults";
import { site } from "@/lib/site";
import { PostCard } from "@/components/PostCard";
import { HomeHighlights } from "@/components/HomeHighlights";
import { InstagramIcon } from "@/components/icons";
import { HomePhoto } from "@/components/HomePhoto";
import plato from "@/public/images/plato.jpg";

export default async function Home() {
  const [posts, home] = await Promise.all([getPublishedPosts(), getHomeSettings()]);
  // Recuadros del inicio: primero los destacados, luego se completan con los más recientes.
  const highlights = [...posts.filter((p) => p.featured), ...posts.filter((p) => !p.featured)].slice(0, 3);
  // "Lo más reciente" no repite lo que ya aparece arriba.
  const [latest, ...rest] = posts.filter((p) => !highlights.includes(p));

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden px-5 pb-12 pt-16 text-center md:pt-24">
        <p className="animate-rise mb-4 inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-3.5 py-1.5 text-[13px] font-semibold text-forest">
          <Sparkles className="size-3.5" /> Tu lugar seguro para comer mejor
        </p>
        <h1
          className="animate-rise mx-auto max-w-4xl font-display text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[64px] md:text-[80px]"
          style={{ animationDelay: "80ms" }}
        >
          Come rico.
          <br />
          <span className="bg-linear-to-r from-orange via-[#ff4f7b] to-lavender-ink bg-clip-text text-transparent">
            Vive mejor.
          </span>
        </h1>
        <p
          className="animate-rise mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-muted md:text-[21px]"
          style={{ animationDelay: "160ms" }}
        >
          Nutrición real, sin dietas imposibles. Pequeñas acciones que se convierten en hábitos, recetas
          sencillas y respuestas a tus preguntas.
        </p>
        <div
          className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/blog"
            className="rounded-full bg-orange px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgb(255_106_19/0.35)] transition hover:bg-[#f25e08]"
          >
            Leer el blog
          </Link>
          <Link href="#sobre-mi" className="group flex items-center text-[17px] text-orange-ink">
            Conóceme <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mosaico de fotos */}
        <div
          className="animate-rise mx-auto mt-16 grid max-w-6xl grid-cols-6 gap-3 md:mt-20 md:gap-5"
          style={{ animationDelay: "320ms" }}
        >
          <div className="relative col-span-2 hidden aspect-[3/4] translate-y-10 overflow-hidden rounded-card md:block">
            <HomePhoto custom={home.hero[0]} fallback={defaultHero[0]} sizes="33vw" />
          </div>
          <div className="relative col-span-6 aspect-[4/3] overflow-hidden rounded-card shadow-lift md:col-span-2 md:aspect-[3/4]">
            <HomePhoto custom={home.hero[1]} fallback={defaultHero[1]} sizes="(min-width: 768px) 33vw, 100vw" eager />
          </div>
          <div className="relative col-span-2 hidden aspect-[3/4] translate-y-10 overflow-hidden rounded-card md:block">
            <HomePhoto custom={home.hero[2]} fallback={defaultHero[2]} sizes="33vw" />
          </div>
        </div>
      </section>

      {/* Bento: lo que vas a encontrar */}
      <section className="mx-auto mt-16 max-w-6xl px-5 md:mt-28">
        <h2 className="max-w-2xl font-display text-[36px] font-semibold leading-tight tracking-tight md:text-[48px]">
          Nada de restricciones. <span className="text-faint">Solo hábitos que sí puedes sostener.</span>
        </h2>

        <HomeHighlights posts={highlights} />
      </section>

      {/* Últimos posts (se oculta si todos ya están en los recuadros de arriba) */}
      {(latest || posts.length === 0) && (
        <section className="mx-auto mt-28 max-w-6xl px-5 md:mt-36">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[36px] font-semibold tracking-tight md:text-[48px]">Lo más reciente</h2>
            {posts.length > 0 && (
              <Link href="/blog" className="group mb-2 flex shrink-0 items-center text-[17px] text-orange-ink">
                Ver todo <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
      )}
        </div>

        {latest ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PostCard post={latest} featured />
            {rest.slice(0, 6).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-5 rounded-card bg-canvas px-6 py-16 text-center md:flex-row md:text-left">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full">
              <Image src={plato} alt="" fill sizes="112px" className="object-cover" />
            </div>
            <div>
              <h3 className="font-display text-[24px] font-semibold tracking-tight">Muy pronto, primeros artículos</h3>
              <p className="mt-1 text-[17px] text-muted">
                Estamos cocinando el contenido. Mientras tanto, sígueme en Instagram.
              </p>
            </div>
          </div>
        )}
      </section>
      )}

      {/* Sobre mí */}
      <section id="sobre-mi" className="mx-auto mt-28 max-w-6xl scroll-mt-20 px-5 md:mt-36">
        <div className="grid items-center gap-10 overflow-hidden rounded-card bg-canvas md:grid-cols-2 md:gap-0">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[520px]">
            <HomePhoto custom={home.about} fallback={defaultAbout} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="px-8 pb-12 md:px-14 md:py-16">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-orange">¿Quién soy?</p>
            <h2 className="mt-3 font-display text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]">
              Bienvenido a tu lugar seguro para mejorar tus hábitos.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              Soy {site.authorTitle.toLowerCase()} y mi enfoque es simple: comer bien no debería sentirse como un
              castigo. Aquí vas a encontrar información clara, sin mitos y sin culpas.
            </p>
            <p className="mt-4 font-hand text-[28px] text-pink-ink">Spoiler: soy enemiga de las restricciones.</p>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-white p-5 shadow-soft">
              <MessageCircleQuestion className="mt-0.5 size-6 shrink-0 text-lavender-ink" />
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">¿Tienes dudas?</span> Cada artículo tiene un panel de
                preguntas al costado. Yo misma te respondo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="mx-auto mt-6 max-w-6xl px-5">
        <div className="relative overflow-hidden rounded-card bg-forest px-8 py-14 text-center text-white md:py-20">
          <div className="absolute -left-16 -top-16 size-64 rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 size-72 rounded-full bg-orange/25 blur-3xl" />
          <InstagramIcon className="relative mx-auto size-10 text-lime" />
          <h2 className="relative mt-5 font-display text-[32px] font-semibold tracking-tight md:text-[44px]">
            Más tips todos los días.
          </h2>
          <p className="relative mt-3 text-[17px] text-white/70">Recetas, mitos y consejos en @{site.instagramHandle}</p>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[17px] font-medium text-forest transition hover:bg-lime"
          >
            Seguir en Instagram <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}
