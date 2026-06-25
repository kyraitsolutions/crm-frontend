import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import React from "react";
import { useAutomationStore } from "../../store/automation.store";
import ChooseActionsStep from "./ChooseactionsStep";
import ReviewStep from "./ReviewStep";
import SelectTriggerStep from "./SelecttriggerStep";
import SetConditionStep from "./SetconditionStep";
import StepperHeader from "./StepperHeader";

const CreateAutomationStepper: React.FC = () => {
  const toastService = new ToastMessageService();
  const { accountId } = useAuthStore((state) => state);
  const {
    currentStep,
    draft,
    setCurrentStep,
    updateDraft,
    saveAutomation,
    setIsCreating,
    isSaving,
    setIsSaving,
  } = useAutomationStore();

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handleBack = () => setCurrentStep(currentStep - 1);

  const handleSaveAutomation = async (name: string) => {
    try {
      const response = await saveAutomation(name, String(accountId));

      if (response && response?.status === 201) {
        toastService.success(
          response?.message || "Automation created successfully!",
        );
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.apiError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectTriggerStep
            selectedTrigger={draft.trigger}
            onSelect={(trigger) => updateDraft({ trigger })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <SetConditionStep
            trigger={draft.trigger!}
            conditions={draft.conditions}
            onChange={(conditions) => updateDraft({ conditions })}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <ChooseActionsStep
            actions={draft.actions}
            onChange={(actions) => updateDraft({ actions })}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <ReviewStep
            draft={draft}
            onBack={handleBack}
            onSave={(name) => handleSaveAutomation(name)}
            loading={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[95vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-800">
            Create Automation
          </h1>
          <button
            onClick={() => setIsCreating(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-5 pb-6">
          <StepperHeader
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationStepper;
