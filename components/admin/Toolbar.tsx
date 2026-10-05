"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { brandColors, editorFonts, editorFontSizes, highlightColors } from "@/lib/editor-fonts";

type Props = {
  editor: Editor;
  uploading: boolean;
  onPickImages: (files: File[]) => void;
};

export function Toolbar({ editor, uploading, onPickImages }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  // En TipTap v3 el editor no vuelve a renderizar en cada cambio: leemos el estado aquí.
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive("heading", { level: 1 })
        ? "h1"
        : e.isActive("heading", { level: 2 })
          ? "h2"
          : e.isActive("heading", { level: 3 })
            ? "h3"
            : e.isActive("heading", { level: 4 })
              ? "h4"
              : "p",
      fontFamily: (e.getAttributes("textStyle").fontFamily as string | undefined) ?? "",
      fontSize: (e.getAttributes("textStyle").fontSize as string | undefined) ?? "",
      color: (e.getAttributes("textStyle").color as string | undefined) ?? "",
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      highlight: e.isActive("highlight"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      align: (["left", "center", "right", "justify"] as const).find((a) => e.isActive({ textAlign: a })) ?? "left",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setBlock = (value: string) => {
    if (value === "p") chain().setParagraph().run();
    else chain().toggleHeading({ level: Number(value[1]) as 1 | 2 | 3 | 4 }).run();
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Pega el enlace (https://…)", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url === "https://") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="sticky top-14 z-20 flex flex-wrap items-center gap-1 rounded-t-card border-b border-black/[0.06] bg-white/90 px-3 py-2 backdrop-blur-xl">
      <Btn label="Deshacer" onClick={() => chain().undo().run()} disabled={!s.canUndo}>
        <Undo2 />
      </Btn>
      <Btn label="Rehacer" onClick={() => chain().redo().run()} disabled={!s.canRedo}>
        <Redo2 />
      </Btn>
      <Sep />

      <Select label="Estilo de párrafo" value={s.block} onChange={setBlock} className="w-[118px]">
        <option value="p">Párrafo</option>
        <option value="h1">Título 1</option>
        <option value="h2">Título 2</option>
        <option value="h3">Título 3</option>
        <option value="h4">Título 4</option>
      </Select>

      <Select
        label="Tipografía"
        value={s.fontFamily}
        onChange={(v) => (v ? chain().setFontFamily(v).run() : chain().unsetFontFamily().run())}
        className="w-[150px]"
      >
        {editorFonts.map((f) => (
          <option key={f.label} value={f.value} style={{ fontFamily: f.value || undefined }}>
            {f.label}
          </option>
        ))}
      </Select>

      <Select
        label="Tamaño"
        value={s.fontSize}
        onChange={(v) => (v ? chain().setFontSize(v).run() : chain().unsetFontSize().run())}
        className="w-[78px]"
      >
        <option value="">Auto</option>
        {editorFontSizes.map((size) => (
          <option key={size} value={size}>
            {size.replace("px", "")}
          </option>
        ))}
      </Select>
      <Sep />

      <Btn label="Negrita (Ctrl+B)" active={s.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </Btn>
      <Btn label="Cursiva (Ctrl+I)" active={s.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </Btn>
      <Btn label="Subrayado (Ctrl+U)" active={s.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </Btn>
      <Btn label="Tachado" active={s.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough />
      </Btn>

      <ColorPopover
        label="Color de texto"
        icon={<Palette />}
        current={s.color}
        colors={brandColors}
        onPick={(c) => chain().setColor(c).run()}
        onClear={() => chain().unsetColor().run()}
      />
      <ColorPopover
        label="Resaltar"
        icon={<Highlighter />}
        active={s.highlight}
        colors={highlightColors}
        onPick={(c) => chain().setHighlight({ color: c }).run()}
        onClear={() => chain().unsetHighlight().run()}
      />
      <Sep />

      <Btn label="Alinear a la izquierda" active={s.align === "left"} onClick={() => chain().setTextAlign("left").run()}>
        <TextAlignStart />
      </Btn>
      <Btn label="Centrar" active={s.align === "center"} onClick={() => chain().setTextAlign("center").run()}>
        <TextAlignCenter />
      </Btn>
      <Btn label="Alinear a la derecha" active={s.align === "right"} onClick={() => chain().setTextAlign("right").run()}>
        <TextAlignEnd />
      </Btn>
      <Btn label="Justificar" active={s.align === "justify"} onClick={() => chain().setTextAlign("justify").run()}>
        <TextAlignJustify />
      </Btn>
      <Sep />

      <Btn label="Lista con viñetas" active={s.bullet} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </Btn>
      <Btn label="Lista numerada" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </Btn>
      <Btn label="Cita" active={s.quote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </Btn>
      <Btn label="Código" active={s.code} onClick={() => chain().toggleCode().run()}>
        <Code />
      </Btn>
      <Btn label="Línea divisoria" onClick={() => chain().setHorizontalRule().run()}>
        <Minus />
      </Btn>
      <Sep />

      <Btn label="Enlace" active={s.link} onClick={setLink}>
        <LinkIcon />
      </Btn>
      {s.link && (
        <Btn label="Quitar enlace" onClick={() => chain().unsetLink().run()}>
          <Unlink />
        </Btn>
      )}
      <Btn label="Insertar imagen" onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
      </Btn>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onPickImages(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <Btn label="Quitar formato" onClick={() => chain().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting />
      </Btn>
    </div>
  );
}

function Btn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-lg transition [&>svg]:size-[17px] ${
        active ? "bg-ink text-white" : "text-ink/75 hover:bg-canvas hover:text-ink"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  className,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <select
      aria-label={label}
      title={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 cursor-pointer rounded-lg bg-canvas px-2 text-[13px] font-medium text-ink outline-none hover:bg-black/[0.06] ${className}`}
    >
      {children}
    </select>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-black/10" aria-hidden />;
}

function ColorPopover({
  label,
  icon,
  current,
  active,
  colors,
  onPick,
  onClear,
}: {
  label: string;
  icon: ReactNode;
  current?: string;
  active?: boolean;
  colors: { name: string; value: string }[];
  onPick: (c: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Btn label={label} active={active || open} onClick={() => setOpen((o) => !o)}>
        <span className="relative flex flex-col items-center [&>svg]:size-[17px]">
          {icon}
          {current && <span className="absolute -bottom-1.5 h-[3px] w-4 rounded-full" style={{ background: current }} />}
        </span>
      </Btn>
      {open && (
        <div className="absolute left-0 top-10 z-30 w-[208px] rounded-2xl bg-white p-3 shadow-lift ring-1 ring-black/[0.06]">
          <p className="mb-2 text-[12px] font-semibold text-muted">{label}</p>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(c.value);
                  setOpen(false);
                }}
                className="size-7 rounded-full ring-1 ring-black/10 transition hover:scale-110"
                style={{ background: c.value }}
              />
            ))}
            <label
              title="Otro color"
              className="relative size-7 cursor-pointer overflow-hidden rounded-full ring-1 ring-black/10"
              style={{ background: "conic-gradient(#ff6a13, #e8457a, #7b5cf0, #0a84ff, #8bb800, #ff6a13)" }}
            >
              <input
                type="color"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => onPick(e.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            className="mt-3 w-full rounded-lg bg-canvas py-1.5 text-[12px] font-medium text-muted hover:text-ink"
          >
            Quitar
          </button>
        </div>
      )}
    </div>
  );
}
