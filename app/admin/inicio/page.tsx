"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ImagePlus, LoaderCircle, RotateCcw } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { uploadImage } from "@/lib/upload";
import { cld } from "@/lib/cloudinary";
import { defaultHomeSettings, normalizeHomeSettings, type HomeImage, type HomeSettings } from "@/lib/home";
import { defaultAbout, defaultHero } from "@/lib/home-defaults";
import { refreshHome } from "@/app/actions";
import { AdminTabs } from "@/components/admin/AdminTabs";

type Slot = {
  label: string;
  hint: string;
  aspect: string;
  fallback: (typeof defaultHero)[number];
  get: (s: HomeSettings) => HomeImage;
  set: (s: HomeSettings, v: HomeImage) => HomeSettings;
};

const withHero = (s: HomeSettings, i: number, v: HomeImage): HomeSettings => {
  const hero = [...s.hero] as HomeSettings["hero"];
  hero[i] = v;
  return { ...s, hero };
};

const slots: Slot[] = [
  { label: "Mosaico · izquierda", hint: "Solo se ve en computadora. Vertical.", aspect: "aspect-[3/4]", fallback: defaultHero[0], get: (s) => s.hero[0], set: (s, v) => withHero(s, 0, v) },
  { label: "Mosaico · centro", hint: "La principal: se ve también en celular. Vertical.", aspect: "aspect-[3/4]", fallback: defaultHero[1], get: (s) => s.hero[1], set: (s, v) => withHero(s, 1, v) },
  { label: "Mosaico · derecha", hint: "Solo se ve en computadora. Vertical.", aspect: "aspect-[3/4]", fallback: defaultHero[2], get: (s) => s.hero[2], set: (s, v) => withHero(s, 2, v) },
  { label: "¿Quién soy?", hint: "Foto de la sección “Sobre mí”. Horizontal o vertical.", aspect: "aspect-[4/3]", fallback: defaultAbout, get: (s) => s.about, set: (s, v) => ({ ...s, about: v }) },
];

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    getDoc(doc(db, "settings", "home"))
      .then((snap) => setSettings(snap.exists() ? normalizeHomeSettings(snap.data()) : defaultHomeSettings))
      .catch((err) => {
        console.error(err);
        setSettings(defaultHomeSettings);
      });
  }, []);

  const update = (next: HomeSettings) => {
    setSettings(next);
    setDirty(true);
    setMessage(null);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(doc(db, "settings", "home"), settings);
      const token = await auth.currentUser?.getIdToken();
      if (token) await refreshHome(token);
      setDirty(false);
      setMessage({ type: "ok", text: "¡Listo! El inicio ya muestra las fotos nuevas." });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "No se pudo guardar. Si es la primera vez, revisa que las reglas de Firestore incluyan la colección settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pt-12">
      <AdminTabs />
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[40px] font-semibold tracking-tight">Página de inicio</h1>
          <p className="mt-1 text-[16px] text-muted">Cambia las fotos cuando quieras darle aire nuevo al sitio.</p>
        </div>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-full bg-orange px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgb(255_106_19/0.3)] transition hover:bg-[#f25e08] disabled:opacity-40 disabled:shadow-none"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      {message && (
        <p
          role="status"
          className={`mt-6 rounded-2xl px-4 py-3 text-[14px] font-medium ${
            message.type === "ok" ? "bg-lime-soft text-forest" : "bg-pink-soft text-pink-ink"
          }`}
        >
          {message.text}
        </p>
      )}

      {!settings ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {slots.map((s) => (
            <div key={s.label} className="aspect-[3/4] animate-pulse rounded-card bg-canvas" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {slots.map((slot) => (
            <SlotCard
              key={slot.label}
              slot={slot}
              value={slot.get(settings)}
              onChange={(v) => update(slot.set(settings, v))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlotCard({ slot, value, onChange }: { slot: Slot; value: HomeImage; onChange: (v: HomeImage) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const custom = Boolean(value.url);

  const pick = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      onChange({ url: await uploadImage(file), alt: value.alt });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-card bg-canvas p-3">
      <div
        className={`group relative ${slot.aspect} overflow-hidden rounded-[20px] bg-white`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files[0]);
        }}
      >
        {custom ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cld(value.url, 600)} alt="" className="size-full object-cover" />
        ) : (
          <Image src={slot.fallback.src} alt="" fill sizes="300px" className="object-cover" />
        )}
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur ${
            custom ? "bg-lime/90 text-forest" : "bg-white/85 text-muted"
          }`}
        >
          {custom ? "Personalizada" : "Original"}
        </span>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <LoaderCircle className="size-7 animate-spin text-orange" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
        <p className="text-[15px] font-semibold">{slot.label}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-faint">{slot.hint}</p>

        {custom && (
          <input
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Describe la foto (accesibilidad)"
            className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-[13px] outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-orange/40"
          />
        )}

        <div className="mt-auto flex gap-2 pt-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[13px] font-medium shadow-soft transition hover:text-orange-ink disabled:opacity-50"
          >
            <ImagePlus className="size-4" /> Cambiar
          </button>
          {custom && (
            <button
              onClick={() => onChange({ url: "", alt: "" })}
              title="Volver a la foto original"
              aria-label="Volver a la foto original"
              className="rounded-full bg-white p-2 text-muted shadow-soft transition hover:text-ink"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
