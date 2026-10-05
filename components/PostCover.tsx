"use client";

import Image from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";

// Componente de cliente: next/image recibe aquí la función loader, que no puede
// pasarse desde un componente de servidor.
// `eager`: solo para la imagen principal visible al cargar (la portada del artículo).
export function PostCover({ src, alt, sizes, eager }: { src: string; alt: string; sizes: string; eager?: boolean }) {
  if (!src) {
    return <div className="absolute inset-0 bg-linear-to-br from-orange-soft via-pink-soft to-lime-soft" />;
  }
  const isCloudinary = src.includes("res.cloudinary.com");
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      loader={isCloudinary ? cloudinaryLoader : undefined}
      unoptimized={!isCloudinary}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}
