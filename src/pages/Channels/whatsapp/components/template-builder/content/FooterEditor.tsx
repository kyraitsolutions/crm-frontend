import { Input } from "@/components/ui/input";
import { useTemplateStore } from "../../../store/template-builder.store";

export const FooterEditor = () => {
  const { footerText, setFooterText } = useTemplateStore();

  const footerMaxLen = 60;

  return (
    <section className="rounded-xl border border-gray-200 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">Footer</span>

          <span className="text-xs text-gray-400">(Optional)</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          Add supporting information such as company name, disclaimer, or
          support details.
        </p>
      </div>

      <div className="relative">
        <Input
          value={footerText}
          maxLength={footerMaxLen}
          placeholder="Footer text..."
          className="input-field pr-16"
          onChange={(e) => setFooterText(e.target.value)}
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {footerText.length}/{footerMaxLen}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          Footer text does not support variables and can contain up to 60
          characters.
        </p>
      </div>
    </section>
  );
};
