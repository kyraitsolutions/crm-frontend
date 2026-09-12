import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TTemplate } from "@/pages/Channels/whatsapp/types/templates";
import type { TemplateVariable } from "@/pages/Channels/whatsapp/types/templates/template.type";
import { MdClose } from "react-icons/md";

interface ITemplateVariablePopupProps {
  open: boolean;
  template: TTemplate | null;
  variables: TemplateVariable[];
  values: Record<string, string>;

  onChange: (variableId: string, value: string) => void;

  onClose: () => void;
  onSend: () => void;
}

export const TemplateVariablePopup = ({
  open,
  template,
  variables,
  values,
  onChange,
  onClose,
  onSend,
}: ITemplateVariablePopupProps) => {
  if (!open || !template) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Send Template
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Review the template values before sending.
            </p>
          </div>

          <Button type="button" onClick={onClose} className="actions-btn">
            <MdClose size={18} />
          </Button>
        </div>

        {/* Template information */}
        <div className="border-b bg-gray-50 px-5 py-3">
          <p className="text-xs text-gray-400">Template</p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {template.name}
          </p>
        </div>

        {/* Variables */}
        <div className="max-h-100 space-y-5 overflow-y-auto px-5 py-5">
          {variables.map((variable) => (
            <div key={variable.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">
                  {variable.component === "HEADER"
                    ? `${variable.name}`
                    : `${variable.name}`}
                </label>

                {variable.exampleValue && (
                  <span className="text-[11px] text-gray-400">
                    Default: {variable.exampleValue}
                  </span>
                )}
              </div>

              <Input
                value={values[variable.id] ?? ""}
                onChange={(e) => onChange(variable.id, e.target.value)}
                placeholder={`Enter value`}
                className="input-field"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          <Button
            type="button"
            className="actions-btn rounded-xl! py-1.5! px-4!"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onSend}
            disabled={variables.some(
              (variable) => !values[variable.id]?.trim(),
            )}
            className="rounded-xl"
          >
            Send Template
          </Button>
        </div>
      </div>
    </div>
  );
};
