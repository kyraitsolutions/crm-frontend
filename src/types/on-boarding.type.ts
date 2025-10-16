import { EOnBoardingQuestionType } from "@/enums";
import { z } from "zod";
const ZBaseOnBoardingQuestion = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
});

const ZBaseOption = z.object({
    id: z.string(),
    label: z.string(),
});

const ZMultiSelectOnBoardingQuestion = ZBaseOnBoardingQuestion.extend({
    type: z.literal(EOnBoardingQuestionType.MULTI_SELECT),
    options: z.array(ZBaseOption),
    maxOptions: z.number().optional(),
    minOptions: z.number().optional(),
});

const ZTextOnBoardingQuestion = ZBaseOnBoardingQuestion.extend({
    type: z.literal(EOnBoardingQuestionType.TEXT),
    placeholder: z.string(),
    multiline: z.boolean(),
});

export const ZOnBoardingQuestion = z.union([
    ZMultiSelectOnBoardingQuestion,
    ZTextOnBoardingQuestion,
]);

export type BaseOnBoardingQuestionProp<T> = {
    question: T
    value: string[] | string
    onChange: (value: string[] | string) => void
    onNext?: () => void
    questionNumber?: number
}
export type OnBoardingMultiSelectQuestion = z.infer<typeof ZMultiSelectOnBoardingQuestion>;
export type OnBoardingTextQuestion = z.infer<typeof ZTextOnBoardingQuestion>;
export type OnBoardingQuestion = z.infer<typeof ZOnBoardingQuestion>;
