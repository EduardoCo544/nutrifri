import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock } from "lucide-react";
import { getPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/posts";
import { sanitizePostHtml } from "@/lib/sanitize";
import { site } from "@/lib/site";
import { cld } from "@/lib/cloudinary";
import { CategoryPill } from "@/components/CategoryPill";
import { PostCover } from "@/components/PostCard";
import { PostComments } from "@/components/comments/PostComments";
import { Avatar } from "@/components/Avatar";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "No encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.coverUrl ? [cld(post.coverUrl, 1200)] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
      <article className="min-w-0">
        <Link href="/blog" className="group inline-flex items-center text-[15px] text-orange-ink">
          <ChevronLeft className="size-4 transition group-hover:-translate-x-0.5" /> Blog
        </Link>

        <header className="mx-auto mt-8 max-w-[720px]">
          {post.category && <CategoryPill category={post.category} />}
          <h1 className="mt-4 font-display text-[38px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[54px]">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 text-[21px] leading-relaxed text-muted">{post.excerpt}</p>}
          <div className="mt-7 flex items-center gap-3 text-[14px] text-muted">
            <Avatar src={post.authorPhoto} name={post.authorName} className="size-10" />
            <div>
              <p className="font-semibold text-ink">{post.authorName || site.name}</p>
              <p className="flex items-center gap-2">
                {formatDate(post.publishedAt)} <span aria-hidden>·</span>
                <Clock className="size-3.5" /> {post.readingMinutes} min de lectura
              </p>
            </div>
          </div>
        </header>

        {post.coverUrl && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-card">
            <PostCover post={post} preload sizes="(min-width: 1024px) 860px, 100vw" />
          </div>
        )}

        <div
          className="post-content mx-auto mt-12 max-w-[720px]"
          dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.contentHtml) }}
        />
      </article>

      <PostComments postId={post.id} />
    </div>
  );
}
