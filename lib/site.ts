// Datos generales del sitio. Edita aquí nombre, redes y categorías.
export const site = {
  name: "nutrifri",
  tagline: "Nutrición real, sin restricciones.",
  description:
    "Blog de nutrición con consejos, recetas y respuestas a tus preguntas. Pequeñas acciones que se convierten en hábitos.",
  instagramHandle: "_nutrifri",
  instagramUrl: "https://www.instagram.com/_nutrifri",
  authorTitle: "Nutrióloga",
  authorName: "Frida",
  authorFullName: "L.N. Frida Monserrath Uribe Celis",
  authorDegree: "Licenciada en Nutrición · UAEM",
};

// Contenido de la página "Sobre mí" (tomado de sus publicaciones de Instagram).
export const about = {
  intro: "Bienvenido a tu lugar seguro para mejorar tus hábitos alimenticios.",
  spoiler: "Spoiler: soy enemiga de las restricciones.",
  goal:
    "Mi meta como tu nutrióloga es ayudarte a crear una relación sana con los alimentos, donde no sea necesaria la restricción ni la satanización de los mismos; sino que con educación nutricional y la formación de hábitos saludables en consulta, aprendas a alimentarte correctamente y sepas priorizar el consumo de alimentos que le aporten los nutrientes necesarios y esenciales a tu cuerpo. Así alcanzaremos un bienestar nutricional y una vida saludable.",
  education: [
    { emoji: "🍉", title: "Licenciada en Nutrición", text: "Egresada de la Universidad Autónoma del Estado de Morelos (UAEM)." },
    {
      emoji: "🥕",
      title: "Enfoque clínico",
      text: "Mis prácticas y servicio social los realicé en hospitales. Lejos de trabajar en tu aspecto físico, vamos a cuidar tu cuerpo desde el interior.",
    },
    {
      emoji: "🍋",
      title: "Constante actualización",
      text: "Cursos de tratamiento nutricio en diferentes etapas de la vida y en enfermedades (FNNC, INSP/ESPM).",
    },
    {
      emoji: "🌽",
      title: "Asesora en lactancia materna",
      text: "Acompañamiento y asesoría nutricia durante esta etapa.",
    },
  ],
  yes: [
    "Planes nutricionales adaptados a tus costumbres, gustos y preferencias.",
    "Recomendaciones y educación nutricional enfocada en formar hábitos nuevos y saludables.",
    "Material didáctico y de apoyo para llevar tu proceso y cambio a un nuevo estilo de vida saludable.",
    "Una consulta donde se toma en cuenta tu contexto, tus hábitos y las metas que quieres lograr, con bases para que esos cambios sean sostenibles en el tiempo.",
  ],
  no: [
    "Dietas o planes restrictivos, insostenibles y fuera de tus costumbres y gustos.",
    "Alimentos “prohibidos” o “cheat meals” ciertas veces a la semana o al mes.",
    "Suplementos “necesarios” para optimizar tus resultados y “acelerar” el proceso.",
    "Una consulta cerrada donde no se tome en cuenta tu contexto.",
  ],
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
