// Datos generales del sitio. Edita aquí nombre, redes y categorías.
export const site = {
  name: "nutrifri",
  tagline: "Nutrición real, sin restricciones.",
  description:
    "Blog de nutrición con consejos, recetas y respuestas a tus preguntas. Pequeñas acciones que se convierten en hábitos.",
  instagramHandle: "_nutrifri",
  instagramUrl: "https://www.instagram.com/_nutrifri",
  authorTitle: "Nutrióloga",
};

export const categories = [
  "Hábitos",
  "Recetas",
  "Frutas y verduras",
  "Mitos",
  "Consulta nutricional",
  "Bienestar",
] as const;

export type Category = (typeof categories)[number];

// Colores de marca por categoría (fondo pastel + texto).
export const categoryColors: Record<string, string> = {
  "Hábitos": "bg-lime-soft text-forest",
  Recetas: "bg-orange-soft text-orange-ink",
  "Frutas y verduras": "bg-pink-soft text-pink-ink",
  Mitos: "bg-lavender-soft text-lavender-ink",
  "Consulta nutricional": "bg-sky-soft text-sky-ink",
  Bienestar: "bg-lime-soft text-forest",
};
