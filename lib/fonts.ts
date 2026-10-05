import {
  Bebas_Neue,
  Caveat,
  DM_Serif_Display,
  Fraunces,
  Inter,
  Lora,
  Playfair_Display,
  Poppins,
} from "next/font/google";

// Inter es el respaldo de SF Pro (en Apple se usa la fuente del sistema).
// El resto son las tipografías que las admins pueden elegir en el editor.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", style: ["normal", "italic"] });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", style: ["normal", "italic"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins" });

export const fontVariables = [inter, fraunces, playfair, lora, dmSerif, caveat, bebas, poppins]
  .map((f) => f.variable)
  .join(" ");
