import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { QuestionBuilderHelper } from "@/helpers";
import type { QuestionType } from "@/types";
import { BuilderStoreManager } from "@/stores";

const BuilderToolHeader = () => {
  const builderStoreManager = new BuilderStoreManager();
  const questionBuilderHelper = new QuestionBuilderHelper();

  const addQuestionHandler = () => {
    const random = Math.floor(Math.random() * 100) + 1;
    const questionType = (random % 11) as QuestionType;
    const question = questionBuilderHelper.createQuestion(questionType);
    builderStoreManager.addQuestion(question);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Button variant="secondary" size="sm" onClick={addQuestionHandler}>
          <Plus className="mr-2 h-4 w-4" /> Question
        </Button>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
};

export default BuilderToolHeader;
