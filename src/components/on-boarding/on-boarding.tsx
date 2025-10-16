import { useState } from "react";
import { MultiSelectQuestion, OpenEndedQuestion } from "../questions";
import { useNavigate } from "react-router-dom";
import { EOnBoardingQuestionType } from "@/enums";
import type { OnBoardingQuestion } from "@/types";

const defaultAnswers: Record<string, any> = {
  [EOnBoardingQuestionType.MULTI_SELECT]: [],
  [EOnBoardingQuestionType.TEXT]: "",
};

export const questions: OnBoardingQuestion[] = [
  {
    id: "q1",
    type: EOnBoardingQuestionType.MULTI_SELECT,
    title: "Which programming languages do you use?",
    options: [
      { id: "opt1", label: "JavaScript" },
      { id: "opt2", label: "Python" },
      { id: "opt3", label: "TypeScript" },
      { id: "opt4", label: "Go" },
    ],
  },
  {
    id: "q2",
    type: EOnBoardingQuestionType.MULTI_SELECT,
    title: "Which frameworks do you use?",
    options: [
      { id: "opt1", label: "React" },
      { id: "opt2", label: "Django" },
      { id: "opt3", label: "Next.js" },
      { id: "opt4", label: "Nest.js" },
    ],
  },
  {
    id: "q3",
    type: EOnBoardingQuestionType.TEXT,
    title: "What do you like most about coding?",
    placeholder: "Write your answer here...",
    multiline: true,
  },
  {
    id: "q4",
    type: EOnBoardingQuestionType.TEXT,
    title: "What is your favorite framework?",
    placeholder: "Eg. React, Django, Next.js...",
    multiline: false,
  },
];

export function OnBoarding() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const handleAnswerChange = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const handleNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      navigate("/dashboard");
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const QUESTION_COMPONENTS = {
    [EOnBoardingQuestionType.MULTI_SELECT]: MultiSelectQuestion,
    [EOnBoardingQuestionType.TEXT]: OpenEndedQuestion,
  };
  const CurrentQuestionComponent =
    QUESTION_COMPONENTS[questions[currentQuestion].type];

  const currentQuestionData: OnBoardingQuestion = questions[currentQuestion];
  return (
    <div className="space-y-10 w-full flex flex-col items-center">
      <CurrentQuestionComponent
        question={currentQuestionData as never}
        value={
          answers[currentQuestionData.id] ??
          defaultAnswers[currentQuestionData.type]
        }
        onChange={(val) => handleAnswerChange(currentQuestionData.id, val)}
        questionNumber={currentQuestion + 1}
        onNext={handleNextQuestion}
      />
    </div>
  );
}
