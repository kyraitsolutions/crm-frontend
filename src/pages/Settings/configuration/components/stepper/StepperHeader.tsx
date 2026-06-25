import React from "react";
import { STEPS } from "../../constants/automation.constants";

interface StepperHeaderProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepperHeader: React.FC<StepperHeaderProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-6 px-2">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => isCompleted && onStepClick?.(step.id)}
            >
              <div
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold transition-all duration-200
                  ${isCompleted
                    ? "bg-primary text-white"
                    : isActive
                      ? "bg-primary text-white ring-4 ring-primary/30"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap transition-colors
                  ${isActive ? "text-primary" : isCompleted ? "text-primary/90" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300
                  ${currentStep > step.id ? "bg-violet-600" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepperHeader;
