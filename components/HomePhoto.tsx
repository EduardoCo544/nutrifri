import Image, { type StaticImageData } from "next/image";
import type { HomeImage } from "@/lib/home";
import { PostCover } from "./PostCover";

// Foto del inicio: la que subió la admin (Cloudinary) o, si no hay, la original.
export function HomePhoto({
  custom,
  fallback,
  sizes,
  eager,
}: {
  custom: HomeImage;
  fallback: { src: StaticImageData; alt: string };
  sizes: string;
  eager?: boolean;
}) {
  if (custom.url) {
    return <PostCover src={custom.url} alt={custom.alt || fallback.alt} sizes={sizes} eager={eager} />;
  }
  return (
    <Image
      src={fallback.src}
      alt={fallback.alt}
      fill
      sizes={sizes}
      placeholder="blur"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      className="object-cover"
    />
  );
}
