import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTemplateStore } from "../../../store/template-builder.store";
import { Controller, useFormContext } from "react-hook-form";
import type { TemplateForm } from "../../../validations/template.schema";

type VariableFieldPrefix = "headerVariables" | "bodyVariables";

interface VariableRowProps {
  index: number;
  id: string;
  name: string;
  exampleValue: string;
  fieldPrefix: VariableFieldPrefix;
  onUpdate: (id: string, field: "name" | "exampleValue", value: string) => void;
  onRemove: (id: string) => void;
}

export const VariableRow = ({
  index,
  id,
  name,
  fieldPrefix,
  onUpdate,
  onRemove,
}: VariableRowProps) => {
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<TemplateForm>();

  const { suggestedVariables: SUGGESTED_VARIABLES } = useTemplateStore(
    (state) => state,
  );

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(name);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const inputWrapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const isNumberVariable = getValues("variableType") === "Number";
  const fieldErrors = errors[fieldPrefix]?.[index];

  useEffect(() => {
    setSearch(name);
  }, [name]);

  const updatePosition = () => {
    if (!inputWrapRef.current) return;
    const rect = inputWrapRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    const handleReposition = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", handleReposition, { capture: true });
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, { capture: true });
      window.removeEventListener("resize", handleReposition);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputWrapRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = SUGGESTED_VARIABLES.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpen = () => {
    updatePosition();
    setOpen(true);
  };

  const handleInputChange = (value: string) => {
    setSearch(value);
    onUpdate(id, "name", value);
    if (!open) handleOpen();
  };

  const handleSelect = (value: string) => {
    setSearch(value);
    onUpdate(id, "name", value);
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-[32px_1fr_1fr_20px] items-center gap-2 border-b border-gray-100 py-1.5 last:border-0">
      <span className="text-center text-sm text-gray-500">{index + 1}</span>

      <div className="relative" ref={inputWrapRef}>
        <Input
          value={isNumberVariable ? `{{${index + 1}}}` : search}
          placeholder="Pick or type variable"
          disabled={isNumberVariable}
          className="input-field rounded-xl! h-8 pr-7 text-xs"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleOpen}
        />

        {fieldErrors?.name && (
          <p className="text-[10px] font-medium text-red-500 absolute bottom-0 right-2">
            {fieldErrors.name.message}
          </p>
        )}

        {!isNumberVariable && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => (open ? setOpen(false) : handleOpen())}
          >
            <ChevronDown
              size={13}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                zIndex: 9999,
              }}
              className="rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {filtered.length > 0 ? (
                <>
                  <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Suggested
                  </p>
                  <ul className="max-h-40 overflow-y-auto pb-1">
                    {filtered.map((v) => (
                      <li
                        key={v}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(v);
                        }}
                        className={`cursor-pointer px-3 py-1.5 text-xs transition-colors hover:bg-green-50 hover:text-green-700 ${
                          name === v
                            ? "bg-green-50 font-medium text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {v}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="px-3 py-2">
                  <p className="mb-1 text-xs text-gray-400">
                    No suggestions match.
                  </p>
                  {search.trim() && (
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(search.trim());
                      }}
                      className="text-xs font-medium text-green-700 hover:text-green-800"
                    >
                      Use &ldquo;{search}&rdquo; as custom variable
                    </button>
                  )}
                </div>
              )}
            </div>,
            document.body,
          )}
      </div>

      <div className="relative">
        <Controller
          control={control}
          name={`${fieldPrefix}.${index}.exampleValue`}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder="Example value"
              className="input-field h-8 text-xs rounded-xl!"
              onChange={(e) => {
                field.onChange(e.target.value);
                onUpdate(id, "exampleValue", e.target.value);
              }}
            />
          )}
        />
        {fieldErrors?.exampleValue && (
          <p className="text-[10px] font-medium text-red-500 absolute bottom-0.5 right-2">
            {fieldErrors.exampleValue.message}
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-transparent"
          onClick={() => onRemove(id)}
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  );
};
