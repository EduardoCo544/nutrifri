// Fotos originales del inicio: se usan cuando la admin no ha subido una propia.
import type { StaticImageData } from "next/image";
import verdes from "@/public/images/verdes.jpg";
import fresas from "@/public/images/fresas.jpg";
import bowl from "@/public/images/bowl.jpg";
import desayuno from "@/public/images/desayuno.jpg";

type DefaultImage = { src: StaticImageData; alt: string };

export const defaultHero: [DefaultImage, DefaultImage, DefaultImage] = [
  { src: verdes, alt: "Verduras de hoja verde acomodadas sobre fondo verde claro" },
  { src: fresas, alt: "Manos sosteniendo fresas frescas" },
  { src: bowl, alt: "Bowl de ensalada con salmón, huevo y verduras" },
];

export const defaultAbout: DefaultImage = {
  src: desayuno,
  alt: "Desayuno saludable con huevo, aguacate y verduras",
};
