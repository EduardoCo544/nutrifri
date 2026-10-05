"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { PostForm, emptyDraft, type PostDraft } from "@/components/admin/PostForm";

export default function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = use(params);
  const [initial, setInitial] = useState<PostDraft | null | "missing">(null);

  useEffect(() => {
    getDoc(doc(db, "posts", id)).then((snap) => {
      if (!snap.exists()) return setInitial("missing");
      const d = snap.data();
      setInitial({
        ...emptyDraft,
        title: d.title ?? "",
        slug: d.slug ?? "",
        excerpt: d.excerpt ?? "",
        category: d.category ?? emptyDraft.category,
        coverUrl: d.coverUrl ?? "",
        coverAlt: d.coverAlt ?? "",
        contentHtml: d.contentHtml ?? "",
        status: d.status === "published" ? "published" : "draft",
        featured: Boolean(d.featured),
        hasPublishedAt: Boolean(d.publishedAt),
      });
    });
  }, [id]);

  if (initial === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        <LoaderCircle className="size-6 animate-spin" />
      </div>
    );
  }

  if (initial === "missing") {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-[19px] text-muted">Esta publicación no existe.</p>
        <Link href="/admin" className="mt-4 inline-block text-orange-ink hover:underline">
          Volver al panel
        </Link>
      </div>
    );
  }

  // key={id}: al pasar de "nueva" a "editar" se monta un formulario limpio.
  return <PostForm key={id} postId={id} initial={initial} />;
}
