import { CalendarDays, Mail, Phone, Type } from "lucide-react";
import type { TMessage } from "../../types/message.type";

type TQuestionMessageProps = {
  message: TMessage;
};

const inputIcons = {
  text: Type,
  email: Mail,
  phone: Phone,
  date: CalendarDays,
};

// const inputPlaceholders = {
//   text: "Type your answer...",
//   email: "Enter your email...",
//   phone: "Enter your phone number...",
//   date: "Select a date...",
// };

const QuestionMessage = ({ message }: TQuestionMessageProps) => {
  const question = message.type === "question" ? message.question : null;

  if (!question) return null;

  // const isIncoming = message.from === "user";
  const Icon =
    inputIcons[question.inputType as keyof typeof inputIcons] || Type;

  return (
    <div
    // className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-xl w-full border border-primary/30 text-slate-900 ${isIncoming ? "bg-white  rounded-tl-sm" : "bg-white/60  rounded-tr-sm"}`}
    >
      {/* QUESTION */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 opacity-80">
          <Icon size={15} />
          <span className="text-xs font-medium uppercase tracking-wide">
            {question.inputType}
          </span>
        </div>

        <p className="text-[15px] leading-relaxed font-medium">
          {question.text}
        </p>
      </div>

      {/* INPUT PREVIEW */}
      {/* <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-black/10
            border
            border-white/10
            px-3
            py-2.5
            opacity-80
          "
        >
          <Icon size={16} className="shrink-0 opacity-70" />

          <span className="text-sm opacity-70">
            {
              inputPlaceholders[
                question.inputType as keyof typeof inputPlaceholders
              ]
            }
          </span>
        </div> */}
    </div>
  );
};

export default QuestionMessage;
