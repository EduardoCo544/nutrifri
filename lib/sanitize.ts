import sanitizeHtml from "sanitize-html";

const color = [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^var\(--[\w-]+\)$/];

// Limpia el HTML del editor antes de mostrarlo: deja formato, fuentes, colores e imágenes,
// y quita cualquier script o atributo peligroso.
export function sanitizePostHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h1", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "mark", "span",
      "ul", "ol", "li", "blockquote", "hr", "a", "img", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      mark: ["data-color", "style"],
      "*": ["style"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowedStyles: {
      "*": {
        "font-family": [/^[\w\s,'"()-]+$/],
        "font-size": [/^\d+(\.\d+)?(px|em|rem)$/],
        color,
        "background-color": color,
        "text-align": [/^(left|right|center|justify)$/],
        width: [/^\d+(\.\d+)?(px|%)$/],
        height: [/^(auto|\d+(\.\d+)?px)$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
      }),
    },
  });
}
