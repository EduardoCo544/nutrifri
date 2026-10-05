import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { getHomeSettings } from "@/lib/data";
import { defaultAbout } from "@/lib/home-defaults";
import { about, site } from "@/lib/site";
import { HomePhoto } from "@/components/HomePhoto";
import { InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: `${site.authorFullName}, ${site.authorDegree}. ${about.intro}`,
};

export default async function AboutPage() {
  const home = await getHomeSettings();

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Presentación */}
      <section className="grid items-center gap-10 pt-12 md:grid-cols-[1fr_1.1fr] md:gap-16 md:pt-20">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-card shadow-lift">
          <HomePhoto custom={home.about} fallback={defaultAbout} sizes="(min-width: 768px) 45vw, 100vw" eager />
        </div>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-orange">¿Quién soy?</p>
          <h1 className="mt-3 font-display text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[56px]">
            Hola, soy {site.authorName}.
          </h1>
          <p className="mt-3 text-[17px] font-medium text-muted">
            {site.authorFullName} · {site.authorDegree}
          </p>
          <p className="mt-6 text-[21px] leading-relaxed text-ink/85">{about.intro}</p>
          <p className="mt-4 font-hand text-[30px] leading-tight text-pink-ink">{about.spoiler}</p>
        </div>
      </section>

      {/* Mi meta */}
      <section className="mt-24 md:mt-32">
        <div className="relative overflow-hidden rounded-card bg-forest px-8 py-14 text-white md:px-16 md:py-20">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-orange/20 blur-3xl" />
          <p className="relative text-[28px]" aria-hidden>
            🍉🥕🍋🌽
          </p>
          <p className="relative mt-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-lime">Mi meta</p>
          <blockquote className="relative mt-4 max-w-4xl font-serif text-[22px] leading-relaxed md:text-[28px]">
            “{about.goal}”
          </blockquote>
        </div>
      </section>

      {/* Formación */}
      <section className="mt-24 md:mt-32">
        <h2 className="font-display text-[36px] font-semibold tracking-tight md:text-[48px]">Formación</h2>
        <p className="mt-2 max-w-xl text-[19px] text-muted">Preparación clínica para acompañarte en cada etapa de tu vida.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.education.map((e) => (
            <div key={e.title} className="rounded-card bg-canvas p-7">
              <span className="text-[34px]" aria-hidden>
                {e.emoji}
              </span>
              <h3 className="mt-4 text-[19px] font-semibold tracking-tight">{e.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Qué sí / qué no */}
      <section className="mt-24 md:mt-32">
        <h2 className="font-display text-[36px] font-semibold tracking-tight md:text-[48px]">Mi consulta</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-card bg-lime-soft p-8 md:p-10">
            <h3 className="font-display text-[26px] font-semibold tracking-tight text-forest">
              Qué <span className="rounded-lg bg-lime px-2">sí</span> vas a encontrar
            </h3>
            <ul className="mt-6 space-y-4">
              {about.yes.map((t) => (
                <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-forest/90">
                  <Check className="mt-1 size-5 shrink-0 rounded-full bg-forest p-1 text-lime" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-pink-soft p-8 md:p-10">
            <h3 className="font-display text-[26px] font-semibold tracking-tight text-pink-ink">
              Qué <span className="rounded-lg bg-pink px-2 text-white">no</span> vas a encontrar
            </h3>
            <ul className="mt-6 space-y-4">
              {about.no.map((t) => (
                <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-ink/80">
                  <X className="mt-1 size-5 shrink-0 rounded-full bg-pink-ink p-1 text-white" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="mt-24 flex flex-col items-center text-center md:mt-32">
        <h2 className="max-w-2xl font-display text-[32px] font-semibold leading-tight tracking-tight md:text-[44px]">
          ¿Lista o listo para empezar?
        </h2>
        <p className="mt-3 max-w-xl text-[18px] text-muted">
          Escríbeme por Instagram para agendar tu consulta o empieza leyendo el blog.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgb(255_106_19/0.35)] transition hover:bg-[#f25e08]"
          >
            <InstagramIcon className="size-5" /> Escríbeme
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-canvas px-7 py-3 text-[17px] font-medium transition hover:bg-black/[0.07]"
          >
            Leer el blog <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
