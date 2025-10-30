import { useState } from "react";
import { MultiSelectQuestion, OpenEndedQuestion } from "../questions";
import { useNavigate } from "react-router-dom";
import { EOnBoardingQuestionType } from "@/enums";
import type { OnBoardingQuestion } from "@/types";
import { UserprofileService } from "@/services/userprofile.service";

const defaultAnswers: Record<string, any> = {
  [EOnBoardingQuestionType.MULTI_SELECT]: [],
  [EOnBoardingQuestionType.TEXT]: "",
};

export const questions: OnBoardingQuestion[] = [
  {
    id: "q1",
    type: EOnBoardingQuestionType.MULTI_SELECT,
    title: "Are you an agency or individual",
    options: [
      { id: "organization", label: "Organization" },
      { id: "individual", label: "Individual" },
    ],
  },
  // {
  //   id: "q2",
  //   type: EOnBoardingQuestionType.MULTI_SELECT,
  //   title: "What is your team size?",
  //   options: [
  //     { id: "0 - 10", label: "0 - 10" },
  //     { id: "10 - 50", label: "10 - 50" },
  //     { id: "50 - 500", label: "50 - 500" },
  //     { id: "500 - 1k", label: "500 - 1k" },
  //     { id: "1k - 100k", label: "1k - 100k" },
  //   ],
  // },
  {
    id: "q2",
    type: EOnBoardingQuestionType.TEXT,
    title: "What is you first name?",
    placeholder: "Write your answer here...",
    multiline: false,
  },
  {
    id: "q3",
    type: EOnBoardingQuestionType.TEXT,
    title: "What is you last name?",
    placeholder: "Write your answer here...",
    multiline: false,
  },

  {
    id: "q4",
    type: EOnBoardingQuestionType.TEXT,
    title: "What is your organization name?",
    placeholder: "Eg. Novotel, Booking.com, Estate...",
    multiline: false,
  },
];

export function OnBoarding() {
  const navigate = useNavigate();
  const userprofileService = new UserprofileService();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const handleAnswerChange = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const handleNextQuestion = async () => {
    if (currentQuestion === questions.length - 1) {
      const account = answers.q1;

      console.log(account[0])
      const apiBody = {
        firstName: answers.q2,
        lastName: answers.q3,
        organizationName: answers.q4,
        accountType: account[0],
      };

      console.log(apiBody)
      const response = await userprofileService.createUserProfile(apiBody);
      const data = response?.data?.docs;
      if (data) {
        navigate("/dashboard");
      } else {
        return null;
      }
    }
    setCurrentQuestion((prev) => prev + 1);
  };
  console.log(answers)
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
