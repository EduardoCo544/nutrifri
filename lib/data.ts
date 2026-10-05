// Lecturas de Firestore desde el servidor vía REST: el resultado queda en la caché de Next (5 min)
// con la etiqueta "posts" y se invalida al publicar desde el panel (ver app/actions.ts).
import type { Post } from "./posts";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export const POSTS_TAG = "posts";

type FirestoreValue = Record<string, unknown>;

function decodeValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) {
    const values = (value.arrayValue as { values?: FirestoreValue[] }).values ?? [];
    return values.map(decodeValue);
  }
  if ("mapValue" in value) {
    return decodeFields((value.mapValue as { fields?: Record<string, FirestoreValue> }).fields ?? {});
  }
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue>) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

function toPost(doc: { name: string; fields?: Record<string, FirestoreValue> }): Post {
  const f = decodeFields(doc.fields ?? {}) as Partial<Post>;
  return {
    id: doc.name.split("/").pop()!,
    title: f.title ?? "",
    slug: f.slug ?? "",
    excerpt: f.excerpt ?? "",
    category: f.category ?? "",
    coverUrl: f.coverUrl ?? "",
    coverAlt: f.coverAlt ?? "",
    contentHtml: f.contentHtml ?? "",
    status: f.status ?? "draft",
    authorName: f.authorName ?? "",
    authorPhoto: f.authorPhoto ?? "",
    readingMinutes: f.readingMinutes ?? 1,
    createdAt: f.createdAt ?? null,
    updatedAt: f.updatedAt ?? null,
    publishedAt: f.publishedAt ?? null,
  };
}

type Filter = { field: string; value: string };

async function queryPosts(filters: Filter[]): Promise<Post[]> {
  if (!PROJECT_ID || !API_KEY) return [];

  const fieldFilters = filters.map((f) => ({
    fieldFilter: { field: { fieldPath: f.field }, op: "EQUAL", value: { stringValue: f.value } },
  }));

  const res = await fetch(`${FIRESTORE_URL}:runQuery?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "posts" }],
        where: { compositeFilter: { op: "AND", filters: fieldFilters } },
      },
    }),
    cache: "force-cache",
    next: { tags: [POSTS_TAG], revalidate: 300 },
  });

  if (!res.ok) {
    console.error("Firestore runQuery falló:", res.status, await res.text());
    return [];
  }

  const rows = (await res.json()) as { document?: { name: string; fields?: Record<string, FirestoreValue> } }[];
  return rows.flatMap((r) => (r.document ? [toPost(r.document)] : []));
}

export async function getPublishedPosts() {
  const posts = await queryPosts([{ field: "status", value: "published" }]);
  // Se ordena aquí para no necesitar un índice compuesto en Firestore.
  return posts.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPostBySlug(slug: string) {
  const posts = await queryPosts([
    { field: "status", value: "published" },
    { field: "slug", value: slug },
  ]);
  return posts[0] ?? null;
}
