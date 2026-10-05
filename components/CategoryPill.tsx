import { categoryColors } from "@/lib/site";

export function CategoryPill({ category }: { category: string }) {
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-[12px] font-semibold tracking-wide ${
        categoryColors[category] ?? "bg-canvas text-muted"
      }`}
    >
      {category}
    </span>
  );
}
