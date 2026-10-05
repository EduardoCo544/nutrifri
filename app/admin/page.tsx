"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, type Timestamp } from "firebase/firestore";
import { ExternalLink, FileText, Pencil, Plus, Trash } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { cld } from "@/lib/cloudinary";
import { refreshPosts } from "@/app/actions";
import { CategoryPill } from "@/components/CategoryPill";
import { AdminTabs } from "@/components/admin/AdminTabs";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  category: string;
  coverUrl: string;
  updatedAt: Date | null;
};

type Filter = "all" | "published" | "draft";

export default function AdminDashboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snap) =>
      setRows(
        snap.docs.map((d) => {
          const data = d.data({ serverTimestamps: "estimate" });
          return {
            id: d.id,
            title: data.title || "Sin título",
            slug: data.slug ?? "",
            status: data.status === "published" ? "published" : "draft",
            category: data.category ?? "",
            coverUrl: data.coverUrl ?? "",
            updatedAt: (data.updatedAt as Timestamp | undefined)?.toDate() ?? null,
          };
        }),
      ),
    );
  }, []);

  const remove = async (row: Row) => {
    if (!confirm(`¿Eliminar “${row.title}”? Esta acción no se puede deshacer.`)) return;
    await deleteDoc(doc(db, "posts", row.id));
    const token = await auth.currentUser?.getIdToken();
    if (token) await refreshPosts(token);
  };

  const visible = rows?.filter((r) => filter === "all" || r.status === filter) ?? [];
  const count = (f: Filter) => rows?.filter((r) => f === "all" || r.status === f).length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-5 pt-12">
      <AdminTabs />
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[40px] font-semibold tracking-tight">Publicaciones</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 text-[15px] font-medium text-white shadow-[0_8px_24px_rgb(255_106_19/0.3)] transition hover:bg-[#f25e08]"
        >
          <Plus className="size-4" /> Nueva publicación
        </Link>
      </div>

      <div className="mt-8 inline-flex rounded-full bg-canvas p-1 text-[14px] font-medium">
        {(
          [
            ["all", "Todas"],
            ["published", "Publicadas"],
            ["draft", "Borradores"],
          ] as const
        ).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 transition ${filter === f ? "bg-white shadow-sm" : "text-muted"}`}
          >
            {label} <span className="text-faint">{count(f)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-black/[0.04]">
        {rows === null ? (
          <div className="space-y-px">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-canvas/60" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileText className="size-10 text-line" />
            <p className="text-[17px] text-muted">Aún no hay publicaciones aquí.</p>
            <Link href="/admin/posts/new" className="text-[15px] font-medium text-orange-ink hover:underline">
              Escribe la primera
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {visible.map((r) => (
              <li key={r.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-orange-soft to-pink-soft">
                  {r.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cld(r.coverUrl, 160)} alt="" className="size-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/posts/${r.id}`} className="line-clamp-1 text-[16px] font-semibold hover:underline">
                    {r.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-faint">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        r.status === "published" ? "bg-lime-soft text-forest" : "bg-canvas text-muted"
                      }`}
                    >
                      {r.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                    {r.category && <span className="hidden sm:inline"><CategoryPill category={r.category} /></span>}
                    {r.updatedAt && (
                      <span>
                        Editada{" "}
                        {new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(r.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {r.status === "published" && (
                    <Link
                      href={`/blog/${r.slug}`}
                      target="_blank"
                      className="rounded-full p-2 text-muted hover:bg-canvas hover:text-ink"
                      aria-label="Ver publicada"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/${r.id}`}
                    className="rounded-full p-2 text-muted hover:bg-canvas hover:text-ink"
                    aria-label="Editar"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    onClick={() => remove(r)}
                    className="rounded-full p-2 text-muted hover:bg-pink-soft hover:text-pink-ink"
                    aria-label="Eliminar"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-[13px] text-faint">
        Para responder preguntas, abre cualquier artículo publicado: verás tus respuestas marcadas como
        nutrióloga y un filtro de “Sin responder”.
      </p>
    </div>
  );
}
