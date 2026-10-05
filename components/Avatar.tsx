// Foto de perfil de Google con inicial de respaldo. Es <img> simple porque son imágenes
// pequeñas de googleusercontent que no vale la pena pasar por el optimizador.
export function Avatar({ src, name, className = "size-8" }: { src?: string; name?: string; className?: string }) {
  const initial = (name?.trim()[0] ?? "?").toUpperCase();
  if (!src) {
    return (
      <span
        className={`${className} inline-flex shrink-0 items-center justify-center rounded-full bg-orange-soft text-[0.8em] font-semibold text-orange-ink`}
        aria-hidden
      >
        {initial}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" referrerPolicy="no-referrer" className={`${className} shrink-0 rounded-full object-cover`} />
  );
}
