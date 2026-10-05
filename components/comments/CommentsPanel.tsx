"use client";

import { useMemo, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { BadgeCheck, CornerDownRight, LogOut, Send, Trash } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { site } from "@/lib/site";
import { timeAgo, type CommentKind, type PostComment } from "@/lib/posts";
import { Avatar } from "../Avatar";
import { GoogleG } from "../icons";

const MAX = 2000;

type Props = { postId: string; comments: PostComment[]; loaded: boolean };

export function CommentsPanel({ postId, comments, loaded }: Props) {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [onlyPending, setOnlyPending] = useState(false);

  const { threads, pendingCount } = useMemo(() => {
    const top = comments.filter((c) => !c.parentId);
    const replies = (id: string) => comments.filter((c) => c.parentId === id);
    const all = top
      .map((c) => {
        const r = replies(c.id);
        const pending = c.kind === "question" && !r.some((x) => x.isAdmin) && !c.isAdmin;
        return { comment: c, replies: r, pending };
      })
      .reverse(); // Lo más nuevo arriba, junto al formulario.
    return { threads: all, pendingCount: all.filter((t) => t.pending).length };
  }, [comments]);

  const visible = onlyPending ? threads.filter((t) => t.pending) : threads;

  const publish = async (text: string, kind: CommentKind, parentId: string | null) => {
    if (!user) return;
    await addDoc(collection(db, "posts", postId, "comments"), {
      text,
      kind,
      authorUid: user.uid,
      authorName: user.displayName ?? "Anónimo",
      authorPhoto: user.photoURL ?? "",
      isAdmin,
      parentId,
      createdAt: serverTimestamp(),
    });
  };

  const remove = async (c: PostComment) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    const batch = writeBatch(db);
    batch.delete(doc(db, "posts", postId, "comments", c.id));
    // Las admins también borran las respuestas para no dejar hilos huérfanos.
    if (isAdmin) {
      comments
        .filter((r) => r.parentId === c.id)
        .forEach((r) => batch.delete(doc(db, "posts", postId, "comments", r.id)));
    }
    await batch.commit();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-6 pb-4 pt-6">
        <h2 className="font-display text-[22px] font-semibold tracking-tight">Preguntas y comentarios</h2>
        <p className="mt-1 text-[14px] text-muted">
          {comments.length ? `${comments.length} mensaje${comments.length === 1 ? "" : "s"}` : "Sé la primera persona en escribir."}
        </p>

        <div className="mt-4">
          {loading ? (
            <div className="h-28 animate-pulse rounded-2xl bg-white" />
          ) : user ? (
            <>
              <Composer onSubmit={(text, kind) => publish(text, kind, null)} withKind />
              <div className="mt-2 flex items-center justify-between text-[12px] text-faint">
                <span className="truncate">Como {user.displayName}</span>
                <button onClick={signOut} className="flex items-center gap-1 hover:text-ink">
                  <LogOut className="size-3" /> Salir
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-white p-5 shadow-soft">
              <p className="text-[15px] leading-relaxed text-muted">
                ¿Tienes una duda sobre este tema? Entra con tu cuenta de Google para preguntar o comentar.
              </p>
              <button
                onClick={signIn}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-[15px] font-medium text-white transition hover:bg-black"
              >
                <GoogleG /> Continuar con Google
              </button>
            </div>
          )}
        </div>

        {isAdmin && threads.length > 0 && (
          <div className="mt-4 inline-flex rounded-full bg-black/5 p-1 text-[13px] font-medium">
            <button
              onClick={() => setOnlyPending(false)}
              className={`rounded-full px-3 py-1 ${!onlyPending ? "bg-white shadow-sm" : "text-muted"}`}
            >
              Todo
            </button>
            <button
              onClick={() => setOnlyPending(true)}
              className={`rounded-full px-3 py-1 ${onlyPending ? "bg-white shadow-sm" : "text-muted"}`}
            >
              Sin responder{pendingCount ? ` (${pendingCount})` : ""}
            </button>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 pb-8">
        {!loaded && <div className="h-24 animate-pulse rounded-2xl bg-white" />}
        {loaded && visible.length === 0 && threads.length > 0 && (
          <p className="py-6 text-center text-[14px] text-muted">¡Todo respondido! 🎉</p>
        )}
        {visible.map(({ comment, replies, pending }) => (
          <Thread
            key={comment.id}
            comment={comment}
            replies={replies}
            pending={isAdmin && pending}
            canReply={Boolean(user)}
            canDelete={(c) => isAdmin || c.authorUid === user?.uid}
            onReply={(text) => publish(text, "comment", comment.id)}
            onDelete={remove}
          />
        ))}
      </div>
    </div>
  );
}

function Thread({
  comment,
  replies,
  pending,
  canReply,
  canDelete,
  onReply,
  onDelete,
}: {
  comment: PostComment;
  replies: PostComment[];
  pending: boolean;
  canReply: boolean;
  canDelete: (c: PostComment) => boolean;
  onReply: (text: string) => Promise<void>;
  onDelete: (c: PostComment) => void;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className={`rounded-2xl bg-white p-4 shadow-soft ${pending ? "ring-2 ring-orange/40" : ""}`}>
      <Message comment={comment} canDelete={canDelete(comment)} onDelete={onDelete} pending={pending} />

      {replies.length > 0 && (
        <div className="mt-3 space-y-3 border-l-2 border-line pl-3">
          {replies.map((r) => (
            <Message key={r.id} comment={r} canDelete={canDelete(r)} onDelete={onDelete} small />
          ))}
        </div>
      )}

      {canReply &&
        (replying ? (
          <div className="mt-3">
            <Composer
              autoFocus
              placeholder="Escribe tu respuesta…"
              onSubmit={async (text) => {
                await onReply(text);
                setReplying(false);
              }}
              onCancel={() => setReplying(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setReplying(true)}
            className="mt-2 flex items-center gap-1 text-[13px] font-medium text-orange-ink hover:underline"
          >
            <CornerDownRight className="size-3.5" /> Responder
          </button>
        ))}
    </div>
  );
}

function Message({
  comment,
  canDelete,
  onDelete,
  pending,
  small,
}: {
  comment: PostComment;
  canDelete: boolean;
  onDelete: (c: PostComment) => void;
  pending?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`group ${comment.isAdmin && small ? "-ml-1 rounded-xl bg-lime-soft/60 p-2.5" : ""}`}>
      <div className="flex items-center gap-2">
        <Avatar src={comment.authorPhoto} name={comment.authorName} className={small ? "size-6" : "size-8"} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold leading-tight">
            <span className="truncate">{comment.authorName}</span>
            {comment.isAdmin && (
              <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-orange">
                <BadgeCheck className="size-3.5" /> {site.authorTitle}
              </span>
            )}
          </p>
          <p className="text-[12px] text-faint">
            {timeAgo(comment.createdAt)}
            {comment.kind === "question" && !small && (
              <span className="ml-1.5 rounded-full bg-lavender-soft px-1.5 py-px font-semibold text-lavender-ink">
                Pregunta
              </span>
            )}
            {pending && (
              <span className="ml-1.5 rounded-full bg-orange-soft px-1.5 py-px font-semibold text-orange-ink">
                Sin responder
              </span>
            )}
          </p>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(comment)}
            className="rounded-full p-1.5 text-faint opacity-60 transition hover:bg-canvas hover:text-pink-ink group-hover:opacity-100"
            aria-label="Eliminar"
          >
            <Trash className="size-3.5" />
          </button>
        )}
      </div>
      <p className={`mt-2 whitespace-pre-wrap break-words leading-relaxed text-ink/90 ${small ? "text-[14px]" : "text-[15px]"}`}>
        {comment.text}
      </p>
    </div>
  );
}

function Composer({
  onSubmit,
  onCancel,
  withKind,
  autoFocus,
  placeholder,
}: {
  onSubmit: (text: string, kind: CommentKind) => Promise<void>;
  onCancel?: () => void;
  withKind?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<CommentKind>("question");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    setError("");
    try {
      await onSubmit(value, kind);
      setText("");
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/[0.04] focus-within:ring-2 focus-within:ring-orange/40">
      {withKind && (
        <div className="mb-2 inline-flex rounded-full bg-canvas p-0.5 text-[12px] font-medium">
          {(["question", "comment"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-full px-3 py-1 transition ${kind === k ? "bg-white shadow-sm" : "text-muted"}`}
            >
              {k === "question" ? "Pregunta" : "Comentario"}
            </button>
          ))}
        </div>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          if (e.key === "Escape") onCancel?.();
        }}
        autoFocus={autoFocus}
        rows={3}
        placeholder={placeholder ?? (kind === "question" ? "¿Qué te gustaría saber?" : "Escribe tu comentario…")}
        className="block w-full resize-none bg-transparent px-1 text-[15px] leading-relaxed outline-none placeholder:text-faint"
      />
      {error && <p className="px-1 text-[12px] text-pink-ink">{error}</p>}
      <div className="mt-1 flex items-center justify-end gap-2">
        {text.length > MAX * 0.8 && <span className="mr-auto px-1 text-[11px] text-faint">{MAX - text.length}</span>}
        {onCancel && (
          <button onClick={onCancel} className="rounded-full px-3 py-1.5 text-[13px] text-muted hover:bg-canvas">
            Cancelar
          </button>
        )}
        <button
          onClick={submit}
          disabled={!text.trim() || sending}
          className="flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#f25e08] disabled:opacity-40"
        >
          <Send className="size-3.5" /> {sending ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </div>
  );
}
