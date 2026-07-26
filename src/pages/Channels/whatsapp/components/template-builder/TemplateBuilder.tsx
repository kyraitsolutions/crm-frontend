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
import { FormProvider } from "react-hook-form";
import { useTemplateForm } from "../../hooks/useTemplateForm";
import type { TemplateForm } from "../../validations/template.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { handleHistoryBack } from "@/utils/back.utils";
// import type { TemplateForm } from "../../types/template.type";
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
    console.log("data", data);
    const payload = mapTemplateToPayload(data);

    console.log("payload", payload);

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
    <section className="max-w-7xl mx-auto pb-5">
      <div className="">
        {/* <TemplateHeader /> */}


        {/* <TemplateHeader /> */}
        <FormProvider {...methods}>
          <div className="sticky top-0 py-5 z-10 bg-gray-50">
            <div className="flex items-center gap-4 ">
              <Button
                onClick={handleHistoryBack}
                className="actions-btn rounded-full!"
              >
                <ArrowLeft />
              </Button>
              <TemplateStepIndicator currentStep={step} />

            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-2 h-full items-start bg-white p-5 rounded-2xl">
            {renderStep(step)}

            <div className="flex flex-col overflow-y-auto space-y-4 sticky top-18">
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
      </div>

    </section>
  );
};

{
  /* <div className="grid xl:grid-cols-[320px_1fr_280px] gap-2 h-full mt-6">
        Step 1: Template Details
        <div className="flex flex-col overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-sm font-semibold text-gray-800">
                Template Details
              </h2>
            </div>
            <p className="text-xs text-gray-500 ml-7">
              Provide basic information about your template.
            </p>
          </div>
          <TemplateDetailsPanel />
        </div>

        Divider
        <div className="flex flex-col overflow-y-auto border-gray-200">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-sm font-semibold text-gray-800">
                Compose Template
              </h2>
            </div>
          </div>
          <TemplateComposerPanel />
        </div>

        Step 3: Preview
        <div className="flex flex-col overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="text-sm font-semibold text-gray-800">Preview</h2>
            </div>
          </div>
          <TemplatePreviewPanel />
        </div>
</div> */
}
