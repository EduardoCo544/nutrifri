"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { MessagesSquare, X } from "lucide-react";
import { db } from "@/lib/firebase";
import type { PostComment } from "@/lib/posts";
import { CommentsPanel } from "./CommentsPanel";

// Escucha los comentarios en tiempo real y los muestra en un panel lateral fijo (escritorio)
// o en una hoja que sube desde abajo (celular), para no tener que bajar hasta el final.
export function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
    return onSnapshot(
      q,
      (snap) => {
        setComments(
          snap.docs.map((d) => {
            const data = d.data({ serverTimestamps: "estimate" });
            return {
              id: d.id,
              text: data.text ?? "",
              kind: data.kind === "question" ? "question" : "comment",
              authorUid: data.authorUid ?? "",
              authorName: data.authorName ?? "",
              authorPhoto: data.authorPhoto ?? "",
              isAdmin: Boolean(data.isAdmin),
              parentId: data.parentId ?? null,
              createdAt: data.createdAt?.toDate?.() ?? null,
            };
          }),
        );
        setLoaded(true);
      },
      (err) => {
        console.error(err);
        setLoaded(true);
      },
    );
  }, [postId]);

  const total = useMemo(() => comments.length, [comments]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-20 flex h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-card bg-canvas">
          <CommentsPanel postId={postId} comments={comments} loaded={loaded} />
        </div>
      </aside>

      {/* Celular y tablet */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[15px] font-medium text-white shadow-lift transition active:scale-95 lg:hidden"
      >
        <MessagesSquare className="size-5" /> Preguntas{total ? ` (${total})` : ""}
      </button>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Preguntas y comentarios">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSheetOpen(false)} />
          <div className="animate-rise absolute inset-x-0 bottom-0 flex h-[88dvh] flex-col overflow-hidden rounded-t-[28px] bg-canvas shadow-lift">
            <div className="flex justify-center pt-2.5">
              <span className="h-1.5 w-10 rounded-full bg-black/15" />
            </div>
            <button
              onClick={() => setSheetOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-black/5 p-1.5 text-muted"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
            <CommentsPanel postId={postId} comments={comments} loaded={loaded} />
          </div>
        </div>
      )}
    </>
  );
}
