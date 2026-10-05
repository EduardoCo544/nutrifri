// Imágenes editables de la página de inicio (documento settings/home en Firestore).
// Una URL vacía significa "usar la foto original".

export type HomeImage = { url: string; alt: string };

export type HomeSettings = {
  hero: [HomeImage, HomeImage, HomeImage]; // mosaico: izquierda, centro, derecha
  about: HomeImage; // foto de "¿Quién soy?"
};

const empty: HomeImage = { url: "", alt: "" };

export const defaultHomeSettings: HomeSettings = {
  hero: [empty, empty, empty],
  about: empty,
};

export const HOME_TAG = "home";

export function normalizeHomeSettings(raw: unknown): HomeSettings {
  const d = (raw ?? {}) as { hero?: Partial<HomeImage>[]; about?: Partial<HomeImage> };
  const img = (v?: Partial<HomeImage>): HomeImage => ({ url: v?.url ?? "", alt: v?.alt ?? "" });
  return {
    hero: [img(d.hero?.[0]), img(d.hero?.[1]), img(d.hero?.[2])],
    about: img(d.about),
  };
}
