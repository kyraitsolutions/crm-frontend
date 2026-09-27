import { useMemo, useRef } from "react";
import ReactQuill, { type DeltaStatic } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

export type RichTextEmailValue = {
  html: string;
  delta: DeltaStatic;
};

export type EmailVariable = {
  key: string;
  label: string;
};

type RichTextEmailEditorProps = {
  defaultValue?: string | DeltaStatic;
  onChange: (value: RichTextEmailValue) => void;
  placeholder?: string;
  variables?: EmailVariable[];
  className?: string;
};

const TOOLBAR = [
  [{ font: [] }, { size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "link", "image"],
  ["clean"],
];

const FORMATS = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "align",
  "blockquote",
  "link",
  "image",
  "header",
];

export function RichTextEmailEditor({
  defaultValue,
  onChange,
  placeholder = "Write your email...",
  variables,
  className,
}: RichTextEmailEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: TOOLBAR,
        handlers: {
          image: () => {
            const quill = quillRef.current?.getEditor();
            if (!quill) return;
            const url = window.prompt("Image URL (must start with https://)")?.trim();
            if (!url) return;
            if (!/^https?:\/\//i.test(url)) {
              window.alert("Use a public image URL. Uploaded or pasted images are not shown by Gmail.");
              return;
            }
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", url, "user");
            quill.setSelection(range.index + 1, 0, "user");
          },
        },
      },
      // Pasted/dropped image files become base64 data URIs, which Gmail blocks.
      uploader: { mimetypes: [] },
    }),
    [],
  );

  const insertVariable = (key: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const token = `{{${key}}}`;
    const range = quill.getSelection(true);
    quill.insertText(range.index, token, "user");
    quill.setSelection(range.index + token.length, 0, "user");
  };

  return (
    <div className={cn("rich-email-editor rounded-md border", className)}>
      {variables?.length ? (
        <div className="flex flex-wrap items-center gap-1.5 border-b bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">Insert variable:</span>
          {variables.map((variable) => (
            <button
              key={variable.key}
              type="button"
              onClick={() => insertVariable(variable.key)}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:border-primary/40 hover:text-primary"
            >
              {variable.label}
            </button>
          ))}
        </div>
      ) : null}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        defaultValue={defaultValue}
        onChange={(html, _delta, source, editor) => {
          if (source === "api") return;
          onChange({ html, delta: editor.getContents() });
        }}
        modules={modules}
        formats={FORMATS}
        useSemanticHTML={false}
        placeholder={placeholder}
      />
    </div>
  );
}
