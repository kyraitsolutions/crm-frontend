import React, { useState } from "react";
import { TemplateComposerPanel } from "./TemplateComposerPanel";
import { TemplatePreviewPanel } from "./TemplatePreviewPanel";
// import { TemplateHeader } from "./TemplateHeader";
import {
  TemplateStepIndicator,
  type WizardStepKey,
} from "./TemplateStepIndicator";
import { TemplateSetupStep } from "./TemplateSetupStep";
import { useTemplateStore } from "../../store/template-builder.store";
import { mapTemplateToPayload } from "../../utils/template/mapper";
import { whatsappTemplateService } from "../../services/whatsapp-template.service";
import { useAuthStore } from "@/stores";
import { FormProvider } from "react-hook-form";
import { useTemplateForm } from "../../hooks/useTemplateForm";
import type { TemplateForm } from "../../validations/template.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { handleHistoryBack } from "@/utils/back.utils";
// import { useTemplateStore } from "../../store/template-builder.store";

export const TemplateBuilder: React.FC = () => {
  const methods = useTemplateForm();

  const [step, setStep] = useState<WizardStepKey>("setup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountId = useAuthStore((state) => state.accountId);

  const handleSubmitTemplate = async (data: TemplateForm) => {
    setIsSubmitting(true);
    console.log("data", data);
    const payload = mapTemplateToPayload(data);

    console.log("payload", payload);

    const response = await whatsappTemplateService.create(
      String(accountId),
      payload,
    );

    try {
      console.log("Template data");
      // await api.createTemplate(templateData) — build payload from your store here
      setStep("review");
    } catch (err) {
      console.error(err);
      // surface error to the user, e.g. toast
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
      <div className="">
        {/* <TemplateHeader /> */}


        {/* <TemplateHeader /> */}
        <FormProvider {...methods}>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleHistoryBack}
              className="actions-btn rounded-full!"
            >
              <ArrowLeft />
            </Button>
            <TemplateStepIndicator currentStep={step} />

          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-2 h-full mt-6 items-start bg-white p-5 rounded-2xl">
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
