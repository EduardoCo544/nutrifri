import type { SVGProps } from "react";

// lucide-react ya no incluye logos de marcas, así que el de Instagram va aquí.
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// Marca: una fresa sencilla con la hoja en verde lima.
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden {...props}>
      <path d="M16 9c6.5 0 10 3.6 10 8.3C26 23.5 20.4 29 16 29S6 23.5 6 17.3C6 12.6 9.5 9 16 9Z" fill="#ff6a13" />
      <path d="M16 10.5c-2.6-3.4-6.4-4-8.6-3 2 .4 3.3 1.7 4.2 3.4M16 10.5c2.6-3.4 6.4-4 8.6-3-2 .4-3.3 1.7-4.2 3.4M16 10.5V4" stroke="#8bb800" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <g fill="#ffe9da">
        <circle cx="12" cy="16" r="1" />
        <circle cx="20" cy="16" r="1" />
        <circle cx="16" cy="20" r="1" />
        <circle cx="11.5" cy="22" r="1" />
        <circle cx="20.5" cy="22" r="1" />
      </g>
    </svg>
  );
}

export function GoogleG() {
  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-white">
      <svg viewBox="0 0 48 48" className="size-3.5" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9Z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9Z" />
      </svg>
    </span>
  );
}
