import type { EOnBoardingQuestionType } from "@/enums";

type QuestionBottomNavInfoProps = {
  questionType: EOnBoardingQuestionType;
};

export default function QuestionBottomNavInfo({
  questionType,
}: QuestionBottomNavInfoProps) {
  console.log(questionType, "990");
  return (
    <div className="w-full pt-4 text-sm text-muted-foreground">
      <div
        className="
          flex flex-col items-center justify-center gap-3
          sm:flex-row sm:justify-between sm:items-center
        "
      >
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd>
          <span className="text-xs sm:text-sm">to navigate</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="text-xs sm:text-sm">Press</span>
          <kbd className="kbd">Enter</kbd>
          <span className="text-xs sm:text-sm">to select / deselect</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="text-xs sm:text-sm">Press</span>
          <kbd className="kbd">Shift + Enter</kbd>
          <span className="text-xs sm:text-sm">to continue</span>
        </div>
      </div>
    </div>
  );
}
