import React from "react";
import { Check } from "lucide-react";

export type WizardStepKey = "setup" | "edit" | "review";

const STEPS: { key: WizardStepKey; label: string }[] = [
  { key: "setup", label: "Set up template" },
  { key: "edit", label: "Edit template" },
  { key: "review", label: "Submit for Review" },
];

interface TemplateStepIndicatorProps {
  currentStep: WizardStepKey;
}

export const TemplateStepIndicator: React.FC<TemplateStepIndicatorProps> = ({
  currentStep,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-3">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  isDone
                    ? "bg-green-500"
                    : isActive
                      ? "border-2 border-primary"
                      : "border-2 border-gray-300"
                }`}
              >
                {isDone && <Check className="w-2.5 h-2.5 text-white" />}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </span>
              <span
                className={`text-sm ${
                  isActive
                    ? "font-semibold text-primary"
                    : isDone
                      ? "font-medium text-green-700"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="w-1 h-1 rounded-full bg-gray-300" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
