"use client";

import { PostForm, emptyDraft } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return <PostForm initial={emptyDraft} />;
}
