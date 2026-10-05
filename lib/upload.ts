"use client";

import { signCloudinaryUpload } from "@/app/actions";
import { auth } from "./firebase";
import { cld } from "./cloudinary";

const MAX_MB = 10;

// Sube una imagen a Cloudinary con una firma generada en el servidor
// y devuelve la URL ya optimizada.
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("El archivo no es una imagen");
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`La imagen pesa más de ${MAX_MB} MB`);

  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Inicia sesión para subir imágenes");

  const { cloudName, apiKey, folder, timestamp, signature } = await signCloudinaryUpload(token);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("folder", folder);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "No se pudo subir la imagen");

  return cld(data.secure_url as string);
}
