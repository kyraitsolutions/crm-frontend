export const EMAIL_BODY_STYLE =
  "font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: #1f2937;";

const INDENT_EM = 3;
const LIST_INDENT_PX = 24;

const SIZE_STYLES: Record<string, string> = {
  small: "0.75em",
  large: "1.5em",
  huge: "2.5em",
};

const FONT_STYLES: Record<string, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  monospace: "Monaco, 'Courier New', monospace",
};

const BULLET_STYLES = ["disc", "circle", "square"];
const ORDERED_STYLES = ["decimal", "lower-alpha", "lower-roman"];

const HTML_TAG_PATTERN = /<\/?[a-z][a-z0-9]*(\s[^>]*)?>/i;

export const looksLikeHtml = (value: string) => HTML_TAG_PATTERN.test(value);

export const isRichTextEmpty = (html: string) => {
  if (!html) return true;
  if (/<img\s/i.test(html)) return false;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return text.length === 0;
};

export const extractTemplateVariables = (html: string) =>
  Array.from(new Set(Array.from(html.matchAll(/\{\{(\w+)\}\}/g), (m) => m[1])));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const fillTemplateVariables = (
  value: string,
  values: Record<string, string>,
  options: { escape?: boolean } = {},
) =>
  String(value || "").replace(/\{\{(\w+)\}\}/g, (token, key: string) => {
    if (!Object.prototype.hasOwnProperty.call(values, key)) return token;
    return options.escape ? escapeHtml(values[key]) : values[key];
  });

const preserveWhitespace = (text: string) =>
  text.replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0").replace(/ (?= )/g, "\u00a0");

const appendStyle = (el: HTMLElement, property: string, value: string) => {
  if (!el.style.getPropertyValue(property)) {
    el.style.setProperty(property, value);
  }
};

const indentLevel = (el: Element) => {
  const match = Array.from(el.classList).find((c) => c.startsWith("ql-indent-"));
  return match ? Number(match.slice("ql-indent-".length)) || 0 : 0;
};

const rebuildQuillLists = (root: HTMLElement) => {
  const doc = root.ownerDocument;

  root.querySelectorAll("ol").forEach((ol) => {
    const items = Array.from(ol.children).filter(
      (child): child is HTMLLIElement => child.tagName === "LI",
    );
    if (!items.some((li) => li.hasAttribute("data-list"))) return;

    const fragment = doc.createDocumentFragment();
    const stack: { list: HTMLElement; depth: number; tag: "ul" | "ol" }[] = [];

    for (const li of items) {
      const tag = li.getAttribute("data-list") === "ordered" ? "ol" : "ul";
      const depth = indentLevel(li);
      li.removeAttribute("data-list");

      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.depth > depth || (top.depth === depth && top.tag !== tag)) {
          stack.pop();
        } else {
          break;
        }
      }

      const parent = stack[stack.length - 1];
      if (!parent || parent.depth < depth) {
        const list = doc.createElement(tag);
        const styles = tag === "ol" ? ORDERED_STYLES : BULLET_STYLES;
        list.style.setProperty("list-style-type", styles[stack.length % styles.length]);
        if (parent) {
          (parent.list.lastElementChild ?? parent.list).appendChild(list);
        } else {
          fragment.appendChild(list);
        }
        stack.push({ list, depth, tag });
      }

      stack[stack.length - 1].list.appendChild(li);
    }

    ol.replaceWith(fragment);
  });
};

const inlineQuillClasses = (el: HTMLElement) => {
  const quillClasses = Array.from(el.classList).filter((c) => c.startsWith("ql-"));
  if (!quillClasses.length) return;

  for (const cls of quillClasses) {
    if (cls.startsWith("ql-indent-") && el.tagName !== "LI") {
      const level = Number(cls.slice("ql-indent-".length)) || 0;
      if (level > 0) appendStyle(el, "padding-left", `${level * INDENT_EM}em`);
    } else if (cls.startsWith("ql-align-")) {
      appendStyle(el, "text-align", cls.slice("ql-align-".length));
    } else if (cls.startsWith("ql-size-")) {
      const size = SIZE_STYLES[cls.slice("ql-size-".length)];
      if (size) appendStyle(el, "font-size", size);
    } else if (cls.startsWith("ql-font-")) {
      const font = FONT_STYLES[cls.slice("ql-font-".length)];
      if (font) appendStyle(el, "font-family", font);
    } else if (cls === "ql-direction-rtl") {
      el.setAttribute("dir", "rtl");
    }
    el.classList.remove(cls);
  }

  if (!el.classList.length) el.removeAttribute("class");
};

const applyBlockDefaults = (el: HTMLElement) => {
  switch (el.tagName) {
    case "P":
    case "H1":
    case "H2":
    case "H3":
    case "H4":
    case "H5":
    case "H6":
      appendStyle(el, "margin", "0");
      break;
    case "UL":
    case "OL":
      appendStyle(el, "margin", "0");
      appendStyle(el, "padding-left", `${LIST_INDENT_PX}px`);
      appendStyle(el, "list-style-type", el.tagName === "OL" ? "decimal" : "disc");
      break;
    case "LI":
      appendStyle(el, "margin", "0");
      break;
    case "BLOCKQUOTE":
      appendStyle(el, "margin", "5px 0");
      appendStyle(el, "padding-left", "16px");
      appendStyle(el, "border-left", "4px solid #cccccc");
      break;
    case "A":
      appendStyle(el, "color", "#2563eb");
      appendStyle(el, "text-decoration", "underline");
      break;
    case "IMG":
      appendStyle(el, "max-width", "100%");
      appendStyle(el, "height", "auto");
      break;
  }
};

const walkTextNodes = (root: HTMLElement, visit: (node: Text) => void) => {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    visit(node as Text);
    node = walker.nextNode();
  }
};

/**
 * Quill 2 renders every list as `<ol><li data-list="bullet|ordered">` and
 * stores indent/size/font/alignment as `ql-*` classes that only exist in the
 * editor stylesheet, so its raw HTML loses formatting in Gmail/Outlook.
 */
export const quillHtmlToEmailHtml = (html: string) => {
  if (isRichTextEmpty(html)) return "";

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const root = doc.body;

  root.querySelectorAll(".ql-ui").forEach((node) => node.remove());
  root.querySelectorAll(".ql-cursor").forEach((node) => node.replaceWith(...Array.from(node.childNodes)));
  rebuildQuillLists(root);
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    inlineQuillClasses(el);
    applyBlockDefaults(el);
  });
  walkTextNodes(root, (node) => {
    node.data = preserveWhitespace(node.data.replace(/\ufeff/g, ""));
  });

  return `<div style="${EMAIL_BODY_STYLE}">${root.innerHTML}</div>`;
};

export const plainTextToEmailHtml = (text: string) => {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const body = lines
    .map((line) => {
      const content = preserveWhitespace(escapeHtml(line)).replace(/\u00a0/g, "&nbsp;");
      return `<p style="margin: 0;">${content || "<br>"}</p>`;
    })
    .join("");
  return `<div style="${EMAIL_BODY_STYLE}">${body}</div>`;
};

export const toDisplayEmailHtml = (value?: string) => {
  const html = String(value || "");
  if (!html.trim()) return "";
  return looksLikeHtml(html) ? html : plainTextToEmailHtml(html);
};
