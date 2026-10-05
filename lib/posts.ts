// Tipos y utilidades compartidas entre servidor y cliente.

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverUrl: string;
  coverAlt: string;
  contentHtml: string;
  status: PostStatus;
  authorName: string;
  authorPhoto: string;
  readingMinutes: number;
  // Fechas en ISO 8601 (o null si aún no existen).
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
};

export type CommentKind = "question" | "comment";

export type PostComment = {
  id: string;
  text: string;
  kind: CommentKind;
  authorUid: string;
  authorName: string;
  authorPhoto: string;
  isAdmin: boolean;
  parentId: string | null;
  createdAt: Date | null;
};

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

export function timeAgo(date: Date | null) {
  if (!date) return "ahora";
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "hace un momento";
}
