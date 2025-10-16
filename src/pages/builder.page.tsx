import { QuestionList } from "@/components/builder-question-list";
import BuilderToolHeader from "@/components/builder-tool-header";
import { SurveyCreateModal } from "@/components/survey-create-dialog";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { BuilderStoreManager, useBuilderStore } from "@/stores";
import { v4 as uuid } from "uuid";

export const BuilderPage = () => {
  const formConfig = useBuilderStore((state) => state.survey_form_config);
  const builderStoreManager = new BuilderStoreManager();
  const [askSurveyModeModalOpen, setAskSurveyModeModalOpen] = useState(false);

  useEffect(() => {
    if (!formConfig) {
      setAskSurveyModeModalOpen(true);
    }
  }, [formConfig]);

  const handleScratchMode = () => {
    builderStoreManager.setSurveyFormConfig({
      questions: [],
      id: uuid(),
      title: "New Survey",
      settings: {
        allow_going_back: false,
        confirmation_message: false,
        limit_one_response: false,
        progress_bar: false,
        shuffle_questions: false,
      },
    });
  };
  return (
    <div className="w-full h-full flex">
      <aside className="w-1/5 min-w-[220px] bg-muted p-4">
        <QuestionList />
      </aside>
      <Separator orientation="vertical" />
      <main className="flex-1 space-y-4 overflow-y-auto">
        <BuilderToolHeader />
      </main>
      <Separator orientation="vertical" />
      <aside className="w-1/5 min-w-[220px] bg-muted p-4">
        <div className="text-muted-foreground">Sidebar Right</div>
      </aside>
      <SurveyCreateModal
        open={askSurveyModeModalOpen}
        onOpenChange={setAskSurveyModeModalOpen}
        onSelect={(mode: "scratch" | "ai") => {
          if (mode === "scratch") {
            handleScratchMode();
          } else {
            handleScratchMode();
          }
        }}
      />
    </div>
  );
};
