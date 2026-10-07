import { useState, useMemo } from "react";
import {
  Smartphone,
  Monitor,
  X,
  SquareArrowOutUpRightIcon,
  Reply,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  TMetaTemplateButton,
  TTemplate,
  TTemplateComponent,
} from "../types/templates";

type HeaderComponent = Extract<TTemplateComponent, { type: "HEADER" }>;
type BodyComponent = Extract<TTemplateComponent, { type: "BODY" }>;
type FooterComponent = Extract<TTemplateComponent, { type: "FOOTER" }>;
type ButtonsComponent = Extract<TTemplateComponent, { type: "BUTTONS" }>;

/** Minimal shape for preview — full TTemplate or a list subset both work. */
export type TemplatePreviewSource = Pick<
  TTemplate,
  "name" | "category" | "language" | "components"
> & {
  variableMappings?: TTemplate["variableMappings"];
};

interface GlobalTemplatePreviewProps {
  open: boolean;
  onClose: () => void;
  template: TemplatePreviewSource | null;
  embedded?: boolean;
}

// Replaces {{1}}, {{name}}... with fallback/sample values
const resolveVariables = (
  text: string,
  variableMappings?: TemplatePreviewSource["variableMappings"],
) => {
  if (!text) return text;
  return text.replace(/{{\s*([^}]+)\s*}}/g, (_, key: string) => {
    const mapping = variableMappings?.find((v) => v.variable === key.trim());
    return mapping?.fallbackValue || `[Sample ${key.trim()}]`;
  });
};

const GlobalTemplatePreview = ({
  open,
  onClose,
  template,
  embedded = false,
}: GlobalTemplatePreviewProps) => {
  const [viewMode, setViewMode] = useState<"Mobile View" | "Desktop View">(
    "Mobile View",
  );

  const headerComponent = template?.components.find(
    (component): component is HeaderComponent => component.type === "HEADER",
  );

  const bodyComponent = template?.components.find(
    (component): component is BodyComponent => component.type === "BODY",
  );

  const footerComponent = template?.components.find(
    (component): component is FooterComponent => component.type === "FOOTER",
  );

  const buttonsComponent = template?.components.find(
    (component): component is ButtonsComponent => component.type === "BUTTONS",
  );

  console.log(buttonsComponent);

  const resolvedHeader = useMemo(() => {
    if (!headerComponent?.text) return "";
    return resolveVariables(headerComponent.text, template?.variableMappings);
  }, [headerComponent, template]);

  const resolvedBody = useMemo(() => {
    if (!bodyComponent?.text) return "";
    return resolveVariables(bodyComponent.text, template?.variableMappings);
  }, [bodyComponent, template]);

  const footerText = footerComponent?.text || "";
  const buttons = buttonsComponent?.buttons || [];
  const isMobile = viewMode === "Mobile View";

  if (!template || (!embedded && !open)) return null;

  const renderButtonPreview = (button: TMetaTemplateButton, index: number) => (
    <Button
      key={index}
      className="actions-btn w-full text-green-600! border-none flex items-center justify-center gap-1.5 py-2 text-xs! font-medium hover:bg-whatsapp-background/60! transition-colors p-3! rounded-none!"
    >
      {button.type === "URL" && <SquareArrowOutUpRightIcon size={5} />}
      {button.type === "QUICK_REPLY" && <Reply />}
      {button.type === "PHONE_NUMBER" && <Phone />}
      {button.text}
    </Button>
  );

  const preview = (
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-white pb-4 pt-4">
          {/* Toggle */}
          <div className="mb-4 flex overflow-hidden rounded-lg px-3">
            {(["Mobile View", "Desktop View"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {mode === "Mobile View" ? (
                  <Smartphone size={13} />
                ) : (
                  <Monitor size={13} />
                )}
                {mode}
              </button>
            ))}
          </div>

          <div className="px-3">
            {/* Phone mockup */}
            <div
              className={`mx-auto overflow-hidden rounded-2xl bg-[#ECE5DD] shadow-lg ${
                isMobile ? "max-w-65" : "max-w-full"
              }`}
            >
              {/* WhatsApp header bar */}
              <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300 text-xs font-bold text-green-800">
                  Y
                </div>
                <span className="flex-1 text-xs font-semibold text-white">
                  Your Business ✓
                </span>
                <span className="text-xs text-green-200">⋯</span>
              </div>

              {/* Chat area */}
              <div className="min-h-50 p-3">
                <div className="max-w-[95%] overflow-hidden rounded-2xl rounded-tl-none bg-white shadow-sm">
                  <div className="p-3">
                    {/* Header text */}
                    {resolvedHeader && (
                      <p className="mb-2 break-all text-xs font-semibold text-gray-800">
                        {resolvedHeader}
                      </p>
                    )}
                    {/* Body text */}
                    <pre className="whitespace-pre-line break-all font-serif text-xs leading-relaxed text-gray-700">
                      {resolvedBody || (
                        <span className="italic text-gray-400">
                          Message body will appear here...
                        </span>
                      )}
                    </pre>
                    {/* Footer */}
                    {footerText && (
                      <p className="mt-2 text-xs text-gray-400">{footerText}</p>
                    )}
                  </div>
                  {/* Buttons */}
                  {buttons.length > 0 && (
                    <div className="border-t border-gray-100">
                      {buttons.map((button, index) => (
                        <div
                          key={`${button.type}-${index}`}
                          className="border-b border-gray-100"
                        >
                          {renderButtonPreview(button, buttons.indexOf(button))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop limitation warning */}
            {!isMobile && buttons.length > 3 && (
              <div className="mt-3 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3">
                <span className="text-sm text-amber-500">⚠️</span>
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    Desktop Limitation
                  </p>
                  <p className="mt-0.5 text-xs text-amber-600">
                    This template contains {buttons.length} buttons. WhatsApp
                    Desktop users may see "View on Phone" instead.
                  </p>
                  <button className="mt-1 text-xs text-blue-600 underline">
                    Learn more
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
  );

  if (embedded) return preview;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {template.name}
            </h2>
            <p className="text-xs text-gray-400">
              {template.category} · {template.language}
            </p>
          </div>
          <Button onClick={onClose} className="actions-btn">
            <X size={18} />
          </Button>
        </div>
        {preview}
      </div>
    </div>
  );
};

export default GlobalTemplatePreview;
