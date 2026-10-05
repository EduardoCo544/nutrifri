import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-hand text-[40px] text-orange">¡Ups!</p>
      <h1 className="mt-2 font-display text-[32px] font-semibold tracking-tight">No encontramos esta página</h1>
      <p className="mt-3 text-[17px] text-muted">Puede que el artículo se haya movido o ya no exista.</p>
      <Link href="/blog" className="mt-8 rounded-full bg-ink px-6 py-2.5 text-[15px] font-medium text-white">
        Ir al blog
      </Link>
    </div>
  );
}
