import React, { useState } from "react";
import { TemplateComposerPanel } from "./TemplateComposerPanel";
import { TemplatePreviewPanel } from "./TemplatePreviewPanel";
// import { TemplateHeader } from "./TemplateHeader";
import {
  TemplateStepIndicator,
  type WizardStepKey,
} from "./TemplateStepIndicator";
import { TemplateSetupStep } from "./TemplateSetupStep";
// import { useTemplateStore } from "../../store/template-builder.store";
import { mapTemplateToPayload } from "../../utils/template/mapper";
import { whatsappTemplateService } from "../../services/whatsapp-template.service";
import { useAuthStore } from "@/stores";
// import type { TemplateForm } from "../../types/template.type";
import { FormProvider } from "react-hook-form";
import { useTemplateForm } from "../../hooks/useTemplateForm";
import type { TemplateForm } from "../../validations/template.schema";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
// import { useTemplateStore } from "../../store/template-builder.store";

export const TemplateBuilder: React.FC = () => {
  const methods = useTemplateForm();
  const taostService = new ToastMessageService();
  const navigate = useNavigate();

  const [step, setStep] = useState<WizardStepKey>("setup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountId = useAuthStore((state) => state.accountId);

  const handleSubmitTemplate = async (data: TemplateForm) => {
    setIsSubmitting(true);

    const payload = mapTemplateToPayload(data);

    try {
      setStep("review");
      const response = await whatsappTemplateService.create(
        String(accountId),
        payload,
      );

      if (response?.status === 201 || response.status === 200) {
        const message = response?.message || "Template created successfully";
        taostService.success(message);

        navigate(
          `${ROUTES.DASHBOARD}/account/${accountId}/whatsapp/template-messages`,
        );
      }
    } catch (err) {
      const error = err as ApiError;
      if (error)
        taostService.error(error.message || "Failed to create template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = (step: string) => {
    switch (step) {
      case "setup":
        return <TemplateSetupStep onNext={() => setStep("edit")} />;

      case "edit":
      case "review":
        return (
          <TemplateComposerPanel
            onDiscard={() => setStep("setup")}
            onSubmit={handleSubmitTemplate}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };
  return (
    <section className="max-w-7xl mx-auto py-10 h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar">
      {/* <TemplateHeader /> */}
      <FormProvider {...methods}>
        <TemplateStepIndicator currentStep={step} />

        <div className="grid lg:grid-cols-[1fr_380px] gap-2 h-full mt-6 items-start">
          {renderStep(step)}

          <div className="flex flex-col overflow-y-auto space-y-4 sticky top-2">
            {/* <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="text-sm font-semibold text-gray-800">Preview</h2>
            </div>
          </div> */}
            <TemplatePreviewPanel />
          </div>
        </div>
      </FormProvider>
    </section>
  );
};
