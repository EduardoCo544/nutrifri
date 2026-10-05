"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type FieldValue,
} from "firebase/firestore";
import { ChevronLeft, ExternalLink, ImagePlus, LoaderCircle, Trash } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";
import { cld } from "@/lib/cloudinary";
import { readingMinutes, slugify, type PostStatus } from "@/lib/posts";
import { categories } from "@/lib/site";
import { refreshPosts } from "@/app/actions";
import { Editor } from "./Editor";

export type PostDraft = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverUrl: string;
  coverAlt: string;
  contentHtml: string;
  status: PostStatus;
  hasPublishedAt: boolean;
};

export const emptyDraft: PostDraft = {
  title: "",
  slug: "",
  excerpt: "",
  category: categories[0],
  coverUrl: "",
  coverAlt: "",
  contentHtml: "",
  status: "draft",
  hasPublishedAt: false,
};

export function PostForm({ postId, initial }: { postId?: string; initial: PostDraft }) {
  const router = useRouter();
  const { user } = useAuth();
  const [draft, setDraft] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState<PostStatus | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<PostDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  // Aviso al salir con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onTitle = (title: string) => update(slugTouched ? { title } : { title, slug: slugify(title) });

  const onCover = async (file?: File) => {
    if (!file) return;
    setCoverUploading(true);
    try {
      update({ coverUrl: await uploadImage(file) });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCoverUploading(false);
    }
  };

  const save = async (status: PostStatus) => {
    setMessage(null);
    const slug = slugify(draft.slug || draft.title);
    if (!draft.title.trim()) return setMessage({ type: "error", text: "Ponle un título a la publicación." });
    if (!slug) return setMessage({ type: "error", text: "La URL no es válida." });
    if (status === "published" && !draft.contentHtml.replace(/<[^>]+>/g, "").trim()) {
      return setMessage({ type: "error", text: "El artículo está vacío." });
    }

    setSaving(status);
    try {
      const dup = await getDocs(query(collection(db, "posts"), where("slug", "==", slug)));
      if (dup.docs.some((d) => d.id !== postId)) {
        setMessage({ type: "error", text: "Ya existe otra publicación con esa URL. Cámbiala en Ajustes." });
        return;
      }

      const ref = postId ? doc(db, "posts", postId) : doc(collection(db, "posts"));
      const data: Record<string, string | number | FieldValue> = {
        title: draft.title.trim(),
        slug,
        excerpt: draft.excerpt.trim(),
        category: draft.category,
        coverUrl: draft.coverUrl,
        coverAlt: draft.coverAlt.trim(),
        contentHtml: draft.contentHtml,
        status,
        readingMinutes: readingMinutes(draft.contentHtml),
        authorName: user?.displayName ?? "",
        authorPhoto: user?.photoURL ?? "",
        updatedAt: serverTimestamp(),
      };
      if (!postId) data.createdAt = serverTimestamp();
      // La fecha de publicación se fija la primera vez y no cambia al editar.
      if (status === "published" && !draft.hasPublishedAt) data.publishedAt = serverTimestamp();

      await setDoc(ref, data, { merge: true });

      const token = await auth.currentUser?.getIdToken();
      if (token) await refreshPosts(token);

      setDraft((d) => ({ ...d, slug, status, hasPublishedAt: d.hasPublishedAt || status === "published" }));
      setDirty(false);
      setMessage({ type: "ok", text: status === "published" ? "¡Publicado! Ya está en el sitio." : "Borrador guardado." });
      if (!postId) router.replace(`/admin/posts/${ref.id}`);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "No se pudo guardar. Revisa tu conexión e intenta de nuevo." });
    } finally {
      setSaving(null);
    }
  };

  const published = draft.status === "published";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16">
      {/* Barra de acciones */}
      <div className="sticky top-14 z-30 -mx-5 mb-6 flex flex-wrap items-center gap-3 border-b border-black/[0.06] bg-white/85 px-5 py-3 backdrop-blur-xl">
        <Link href="/admin" className="group flex items-center text-[15px] text-orange-ink">
          <ChevronLeft className="size-4 transition group-hover:-translate-x-0.5" /> Publicaciones
        </Link>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
            published ? "bg-lime-soft text-forest" : "bg-canvas text-muted"
          }`}
        >
          {published ? "Publicada" : "Borrador"}
          {dirty && " · cambios sin guardar"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {published && postId && (
            <Link
              href={`/blog/${draft.slug}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[14px] text-muted hover:bg-canvas hover:text-ink sm:flex"
            >
              <ExternalLink className="size-4" /> Ver
            </Link>
          )}
          <button
            onClick={() => save("draft")}
            disabled={saving !== null}
            className="rounded-full bg-canvas px-4 py-2 text-[14px] font-medium transition hover:bg-black/[0.07] disabled:opacity-50"
          >
            {saving === "draft" ? "Guardando…" : published ? "Pasar a borrador" : "Guardar borrador"}
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving !== null}
            className="rounded-full bg-orange px-5 py-2 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgb(255_106_19/0.3)] transition hover:bg-[#f25e08] disabled:opacity-50"
          >
            {saving === "published" ? "Publicando…" : published ? "Actualizar" : "Publicar"}
          </button>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`mb-6 rounded-2xl px-4 py-3 text-[14px] font-medium ${
            message.type === "ok" ? "bg-lime-soft text-forest" : "bg-pink-soft text-pink-ink"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          {/* Portada */}
          <div className="group relative aspect-[16/7] overflow-hidden rounded-card bg-canvas">
            {draft.coverUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cld(draft.coverUrl, 1400)} alt="" className="size-full object-cover" />
                <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => coverRef.current?.click()}
                    className="rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-medium shadow-soft backdrop-blur"
                  >
                    Cambiar
                  </button>
                  <button
                    onClick={() => update({ coverUrl: "" })}
                    className="rounded-full bg-white/90 p-2 text-pink-ink shadow-soft backdrop-blur"
                    aria-label="Quitar portada"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => coverRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onCover(e.dataTransfer.files[0]);
                }}
                className="flex size-full flex-col items-center justify-center gap-2 border-2 border-dashed border-line text-muted transition hover:border-orange hover:text-orange-ink"
              >
                <ImagePlus className="size-8" />
                <span className="text-[15px] font-medium">Agregar imagen de portada</span>
                <span className="text-[13px] text-faint">Haz clic o arrastra una imagen</span>
              </button>
            )}
            {coverUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <LoaderCircle className="size-7 animate-spin text-orange" />
              </div>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                onCover(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>

          <textarea
            value={draft.title}
            onChange={(e) => onTitle(e.target.value.replace(/\n/g, ""))}
            placeholder="Título de la publicación"
            rows={1}
            maxLength={200}
            className="field-sizing-content block w-full resize-none bg-transparent font-display text-[40px] font-semibold leading-tight tracking-[-0.03em] outline-none placeholder:text-line md:text-[48px]"
          />
          <textarea
            value={draft.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            placeholder="Un resumen corto que invite a leer (aparece en las tarjetas y en Google)."
            rows={2}
            maxLength={300}
            className="field-sizing-content block w-full resize-none bg-transparent text-[20px] leading-relaxed text-muted outline-none placeholder:text-line"
          />

          <Editor initialHtml={initial.contentHtml} onChange={(contentHtml) => update({ contentHtml })} />
        </div>

        {/* Ajustes */}
        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <div className="space-y-5 rounded-card bg-canvas p-6">
            <h2 className="text-[17px] font-semibold">Ajustes</h2>
            <Field label="Categoría">
              <select
                value={draft.category}
                onChange={(e) => update({ category: e.target.value })}
                className="w-full rounded-xl bg-white px-3 py-2.5 text-[15px] outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-orange/40"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="URL" hint={`/blog/${draft.slug || "…"}`}>
              <input
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update({ slug: slugify(e.target.value) });
                }}
                placeholder="mi-articulo"
                className="w-full rounded-xl bg-white px-3 py-2.5 text-[15px] outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-orange/40"
              />
            </Field>
            <Field label="Texto alternativo de la portada" hint="Describe la imagen para lectores de pantalla.">
              <input
                value={draft.coverAlt}
                onChange={(e) => update({ coverAlt: e.target.value })}
                placeholder="Ej. Plato con frutas de temporada"
                className="w-full rounded-xl bg-white px-3 py-2.5 text-[15px] outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-orange/40"
              />
            </Field>
          </div>
          <p className="px-2 text-[13px] leading-relaxed text-faint">
            Consejo: arrastra o pega imágenes directo en el texto. Selecciona una imagen para cambiarle el tamaño
            desde sus esquinas.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block truncate text-[12px] text-faint">{hint}</span>}
    </label>
  );
}
