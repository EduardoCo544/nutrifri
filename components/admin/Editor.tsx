"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { uploadImage } from "@/lib/upload";
import { Toolbar } from "./Toolbar";

type Props = {
  initialHtml: string;
  onChange: (html: string) => void;
};

export function Editor({ initialHtml, onChange }: Props) {
  const [uploading, setUploading] = useState(0);
  const editorRef = useRef<TiptapEditor | null>(null);

  // Sube imágenes (botón, arrastrar o pegar) y las inserta en la posición indicada.
  const insertImages = async (files: File[], pos?: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    for (const file of files) {
      setUploading((n) => n + 1);
      try {
        const src = await uploadImage(file);
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        const chain = editor.chain().focus();
        if (pos !== undefined) {
          chain.insertContentAt(pos, { type: "image", attrs: { src, alt } }).run();
        } else {
          chain.setImage({ src, alt }).run();
        }
      } catch (err) {
        alert((err as Error).message);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const imageFiles = (list: FileList | null | undefined) =>
    Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Image.configure({ resize: { enabled: true, alwaysPreserveAspectRatio: true, minWidth: 80 } }),
      Placeholder.configure({ placeholder: "Escribe aquí tu artículo… Puedes arrastrar o pegar imágenes." }),
      CharacterCount,
    ],
    content: initialHtml,
    editorProps: {
      attributes: { class: "post-content" },
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        insertImages(files);
        return true;
      },
      handleDrop: (view, event) => {
        const files = imageFiles(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertImages(files, pos);
        return true;
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className="h-[520px] animate-pulse rounded-card bg-canvas" />;
  }

  const words = editor.storage.characterCount.words();

  return (
    <div className="rounded-card bg-white shadow-soft ring-1 ring-black/[0.05]">
      <Toolbar editor={editor} uploading={uploading > 0} onPickImages={(files) => insertImages(files)} />
      <div className="px-6 py-8 md:px-12">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-end border-t border-black/[0.05] px-6 py-2.5 text-[12px] text-faint">
        {words} palabra{words === 1 ? "" : "s"} · ~{Math.max(1, Math.round(words / 200))} min de lectura
      </div>
    </div>
  );
}
