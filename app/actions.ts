"use server";

import { createHash } from "node:crypto";
import { updateTag } from "next/cache";
import { FIRESTORE_URL, POSTS_TAG } from "@/lib/data";
import { HOME_TAG } from "@/lib/home";

// Comprueba que el token de Firebase sea de una admin. No hace falta el Admin SDK:
// Firestore valida la firma del token y las reglas solo dejan leer admins/{email}
// a la dueña de ese correo, así que si la lectura responde 200 es admin.
async function assertAdmin(idToken: string) {
  let email = "";
  try {
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString());
    email = String(payload.email ?? "").toLowerCase();
  } catch {
    throw new Error("Token inválido");
  }
  if (!email) throw new Error("Token inválido");

  const res = await fetch(`${FIRESTORE_URL}/admins/${encodeURIComponent(email)}`, {
    headers: { Authorization: `Bearer ${idToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No autorizado");
}

// Se llama después de guardar o borrar un post para que el sitio muestre el cambio al instante.
export async function refreshPosts(idToken: string) {
  await assertAdmin(idToken);
  updateTag(POSTS_TAG);
}

// Se llama después de guardar las imágenes del inicio.
export async function refreshHome(idToken: string) {
  await assertAdmin(idToken);
  updateTag(HOME_TAG);
}

// Firma una subida a Cloudinary. El API secret nunca sale del servidor.
export async function signCloudinaryUpload(idToken: string) {
  await assertAdmin(idToken);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Faltan las variables de Cloudinary en el servidor");
  }

  const folder = "nutrifri";
  const timestamp = Math.round(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return { cloudName, apiKey, folder, timestamp, signature };
}
