"use client";

import type { ReactNode } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GoogleG } from "../icons";

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        <LoaderCircle className="size-6 animate-spin" />
      </div>
    );
  }

  if (isAdmin) return <>{children}</>;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-card bg-canvas p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white shadow-soft">
          <ShieldCheck className="size-7 text-orange" />
        </span>
        <h1 className="mt-5 font-display text-[26px] font-semibold tracking-tight">Panel de administración</h1>

        {user ? (
          <>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              La cuenta <span className="font-semibold text-ink">{user.email}</span> no tiene permisos de
              administradora.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-faint">
              Para darle acceso, crea un documento en Firestore en la colección <code>admins</code> con este correo
              como ID.
            </p>
            <button onClick={signOut} className="mt-6 text-[15px] font-medium text-orange-ink hover:underline">
              Usar otra cuenta
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-[15px] text-muted">Entra con tu cuenta de Google para administrar el blog.</p>
            <button
              onClick={signIn}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-[15px] font-medium text-white transition hover:bg-black"
            >
              <GoogleG /> Continuar con Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
