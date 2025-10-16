import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, GripVertical, Radio } from "lucide-react";
import { BuilderStoreManager, useBuilderStore } from "@/stores";

export function QuestionList() {
  const builderStoreManager = new BuilderStoreManager();
  const selectedQuestionId = useBuilderStore(
    (state) => state.selected_question_id
  );
  const questions = useBuilderStore(
    (state) => state.survey_form_config?.questions
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {questions?.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <div className="text-sm text-muted-foreground">
              No questions yet.
              <br />
              Add your first question above.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {questions?.map((question, index) => (
              <Card
                key={question.id}
                className={`group cursor-pointer shadow-none border rounded-xl p-4 transition ${
                  selectedQuestionId === question.id
                    ? "border-primary bg-muted/50"
                    : "border-border hover:bg-muted/30 "
                }`}
                onClick={() =>
                  builderStoreManager.setSelectedQuestionId(question.id)
                }
              >
                <div className="flex items-start gap-3">
                  {/* Drag handle */}
                  <GripVertical className="mt-1 h-4 w-4 text-muted-foreground opacity-60 group-hover:opacity-100 transition" />

                  {/* Question Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        single choice
                      </span>
                      {question.required && (
                        <span className="text-xs text-destructive">*</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {question.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Q{index + 1}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        builderStoreManager.removeQuestion(question.id);
                      }}
                      className="h-6 w-6 rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
