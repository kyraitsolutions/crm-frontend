import { Button } from "@/components/ui/button";
import { Bell, KeyRound, Megaphone } from "lucide-react";
import React, { useState } from "react";
import {
  TEMPLATE_CATEGORIES,
  TYPE_OPTIONS_BY_CATEGORY,
} from "../../constants/template.constants";
import { useTemplateStore } from "../../store/template-builder.store";

import { FooterActions } from "./shared/FooterActions";
import type { TemplateCategory, TemplateType } from "../../types/templates";
import { useFormContext } from "react-hook-form";
import type { TemplateForm } from "../../validations/template.schema";
import { createDefaultAuthentication } from "../../utils/template/auth.utils";
import { createDefaultCarousel } from "../../utils/template/carousel.utils";

const CATEGORY_ICONS: Record<TemplateCategory, React.ElementType> = {
  Marketing: Megaphone,
  Utility: Bell,
  Authentication: KeyRound,
};

interface TemplateSetupStepProps {
  onNext: () => void;
}

export const TemplateSetupStep: React.FC<TemplateSetupStepProps> = ({
  onNext,
}) => {
  const { category, setCategory } = useTemplateStore((state) => state);
  const { setValue, getValues } = useFormContext<TemplateForm>();
  const [type, setType] = useState<TemplateType>(
    () => (getValues("templateType") as TemplateType) || "CUSTOM",
  );

  const activeCategory = (category ??
    TEMPLATE_CATEGORIES[0].value) as TemplateCategory;

  const typeOptions =
    TYPE_OPTIONS_BY_CATEGORY[
      activeCategory as keyof typeof TYPE_OPTIONS_BY_CATEGORY
    ];

  const handleCategoryChange = (next: TemplateCategory) => {
    setCategory(next);
    const nextType =
      TYPE_OPTIONS_BY_CATEGORY[next as keyof typeof TYPE_OPTIONS_BY_CATEGORY][0]
        .value;
    setType(nextType);
  };

  const handleNext = () => {
    const nextType =
      activeCategory === "Authentication" ? "AUTHENTICATION" : type;

    setValue("category", activeCategory, { shouldDirty: true });
    setValue("templateType", nextType, { shouldDirty: true });

    if (nextType === "CAROUSEL") {
      setValue("carousel", getValues("carousel") ?? createDefaultCarousel(), {
        shouldDirty: true,
      });
      setValue("headerType", "Image");
      setValue("headerText", "");
      setValue("footerText", "");
      setValue("buttons", []);
    }

    if (nextType === "AUTHENTICATION") {
      setValue(
        "authentication",
        getValues("authentication") ?? createDefaultAuthentication(),
        { shouldDirty: true },
      );
      setValue("bodyText", "", { shouldDirty: true });
      setValue("bodyVariables", [], { shouldDirty: true });
      setValue("headerText", "", { shouldDirty: true });
      setValue("headerVariables", [], { shouldDirty: true });
      setValue("footerText", "", { shouldDirty: true });
      setValue("buttons", [], { shouldDirty: true });
    }

    onNext();
  };

  return (
    <section>
      <div className="w-full space-y-4">
        <div>
          <h1 className="text-base font-semibold text-gray-800">
            Set up your template
          </h1>

          <p className="text-xs text-gray-500 max-w-2xl mt-1">
            Choose the category that best describes your message template. Then,
            select the type of message that you want to send.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Learn more about categories.
            </a>
          </p>
        </div>

        {/* Category tabs */}
        <div className="grid grid-cols-3 gap-1">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.value as TemplateCategory];
            const active = cat.value === activeCategory;
            return (
              <Button
                key={cat.value}
                type="button"
                onClick={() =>
                  handleCategoryChange(cat.value as TemplateCategory)
                }
                className={`actions-btn p-2! flex items-center justify-center gap-2 rounded-xl! border px-3 py-2.5 text-sm font-medium transition-colors  ${
                  active
                    ? "bg-primary! text-white!"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Type list */}
        <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {typeOptions.map((opt: any) => {
            const active = opt.value === type;
            return (
              <label
                key={opt.value}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  active ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="template-type"
                  checked={active}
                  onChange={() => setType(opt.value)}
                  className="mt-1 accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {opt.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <FooterActions onNext={handleNext} />
      </div>
    </section>
  );
};
