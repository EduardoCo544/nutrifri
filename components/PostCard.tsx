import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { cloudinaryLoader } from "@/lib/cloudinary";
import { formatDate, type Post } from "@/lib/posts";
import { CategoryPill } from "./CategoryPill";

export function PostCover({ post, sizes, preload }: { post: Post; sizes: string; preload?: boolean }) {
  if (!post.coverUrl) {
    return <div className="absolute inset-0 bg-linear-to-br from-orange-soft via-pink-soft to-lime-soft" />;
  }
  return (
    <Image
      src={post.coverUrl}
      alt={post.coverAlt || post.title}
      fill
      sizes={sizes}
      preload={preload}
      loader={post.coverUrl.includes("res.cloudinary.com") ? cloudinaryLoader : undefined}
      unoptimized={!post.coverUrl.includes("res.cloudinary.com")}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
        featured ? "flex-col md:col-span-2 md:flex-row lg:col-span-3" : "flex-col"
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/10] md:aspect-auto md:w-3/5" : "aspect-[16/10]"}`}>
        <PostCover
          post={post}
          preload={featured}
          sizes={featured ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
        />
      </div>
      <div className={`flex flex-1 flex-col gap-3 p-6 ${featured ? "md:justify-center md:p-10" : ""}`}>
        {post.category && <CategoryPill category={post.category} />}
        <h3
          className={`font-display font-semibold tracking-tight text-ink ${
            featured ? "text-[28px] leading-tight md:text-[36px]" : "text-[21px] leading-snug"
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={`text-muted ${featured ? "text-[17px] leading-relaxed" : "line-clamp-3 text-[15px] leading-relaxed"}`}>
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-2 text-[13px] text-faint">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {post.readingMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
