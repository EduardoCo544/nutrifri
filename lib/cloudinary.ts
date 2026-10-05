// Inserta transformaciones de Cloudinary (formato y calidad automáticos, ancho máximo)
// en una URL de entrega. Las URLs que no son de Cloudinary se devuelven igual.
export function cld(url: string, width = 1600) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace(/\/upload\/(?:[a-z]_[^/]+\/)*/, `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

// Loader para next/image: Cloudinary redimensiona, así no se gasta la optimización de Vercel.
export function cloudinaryLoader({ src, width }: { src: string; width: number }) {
  return cld(src, width);
}
