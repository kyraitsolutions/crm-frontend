import { EFormQuestionType } from "@/enums";
import { z } from "zod";

const BaseQuestionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Question title is required"),
  description: z.string().optional(),
  required: z.boolean().default(false),
  visible: z.boolean().default(true),
  randomize: z.boolean().default(false),
});

const MultipleChoiceSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.MULTI_CHOICE),
  config: z.object({
    options: z
      .array(
        z.object({
          id: z.string().uuid(),
          label: z.string().min(1, "Option label is required"),
          imageUrl: z.string().url().optional(),
        })
      )
      .min(1, "At least one option is required"),
    allow_multiple_selection: z.boolean().default(false),
    vertical_alignment: z.boolean().default(false),
    other_option: z.boolean().default(false),
  }),
});

const TextQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.TEXT),
  config: z.object({
    subtype: z.enum(["short", "long", "email", "number", "phone"]),
    placeholder: z.string().optional(),
    max_length: z.number().min(1).max(5000).optional(),
    validation: z
      .object({
        regex: z.string().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional(),
  }),
});

const RatingQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.RATING),
  config: z.object({
    style: z.enum(["stars", "numbers", "smileys", "hearts"]),
    scale: z.number().min(2).max(10).default(5),
    labels: z
      .object({
        left: z.string().optional(),
        center: z.string().optional(),
        right: z.string().optional(),
      })
      .optional(),
  }),
});

// Opinion scale question
const OpinionScaleSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.OPINION_SCALE),
  config: z.object({
    steps: z.number().min(3).max(11).default(5),
    start_at_one: z.boolean().default(false),
    labels: z
      .object({
        left: z.string().optional(),
        center: z.string().optional(),
        right: z.string().optional(),
      })
      .optional(),
  }),
});

// Yes/No question
const YesNoSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.YES_NO),
  config: z.object({
    labels: z
      .object({
        yes: z.string().default("Yes"),
        no: z.string().default("No"),
      })
      .optional(),
  }),
});

// Dropdown question
const DropdownSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.DROPDOWN),
  config: z.object({
    options: z
      .array(
        z.object({
          id: z.string().uuid(),
          label: z.string().min(1, "Option label is required"),
          value: z.string().optional(),
        })
      )
      .min(1, "At least one option is required"),
    searchable: z.boolean().default(false),
    allow_multiple: z.boolean().default(false),
  }),
});

// File upload question
const FileUploadSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.FILE_UPLOAD),
  config: z.object({
    allowed_types: z
      .array(
        z.enum([
          "image/*",
          "document/*",
          "video/*",
          "audio/*",
          ".pdf",
          ".doc",
          ".docx",
          ".jpg",
          ".png",
        ])
      )
      .default(["image/*", "document/*"]),
    max_files: z.number().min(1).max(10).default(1),
    max_size_mb: z.number().min(1).max(100).default(10),
  }),
});

// Date question
const DateQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.DATE),
  config: z.object({
    format: z.enum(["date", "datetime", "time"]).default("date"),
    min_date: z.string().datetime().optional(),
    max_date: z.string().datetime().optional(),
    allow_past: z.boolean().default(true),
    allow_future: z.boolean().default(true),
  }),
});

// Matrix question (rating grid)
const MatrixQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.MATRIX),
  config: z.object({
    rows: z
      .array(
        z.object({
          id: z.string().uuid(),
          label: z.string().min(1, "Row label is required"),
        })
      )
      .min(1, "At least one row is required"),
    columns: z
      .array(
        z.object({
          id: z.string().uuid(),
          label: z.string().min(1, "Column label is required"),
          value: z.number().optional(),
        })
      )
      .min(2, "At least two columns are required"),
    single_selection_per_row: z.boolean().default(true),
  }),
});

// Ranking question
const RankingQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.RANKING),
  config: z.object({
    options: z
      .array(
        z.object({
          id: z.string().uuid(),
          label: z.string().min(1, "Option label is required"),
          imageUrl: z.string().url().optional(),
        })
      )
      .min(2, "At least two options are required"),
    max_choices: z.number().min(1).optional(),
  }),
});

// Picture choice question
const PictureChoiceSchema = BaseQuestionSchema.extend({
  type: z.literal(EFormQuestionType.PICTURE_CHOICE),
  config: z.object({
    options: z
      .array(
        z.object({
          id: z.string().uuid(),
          imageUrl: z.string().url("Valid image URL is required"),
          label: z.string().optional(),
        })
      )
      .min(1, "At least one image is required"),
    multiple_selection: z.boolean().default(false),
    display_style: z.enum(["grid", "list"]).default("grid"),
  }),
});

export const QuestionSchema = z.discriminatedUnion("type", [
  MultipleChoiceSchema,
  TextQuestionSchema,
  RatingQuestionSchema,
  OpinionScaleSchema,
  YesNoSchema,
  DropdownSchema,
  FileUploadSchema,
  DateQuestionSchema,
  MatrixQuestionSchema,
  RankingQuestionSchema,
  PictureChoiceSchema,
]);

export const FormConfigSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  welcome_screen: z
    .object({
      enabled: z.boolean().default(false),
      title: z.string().optional(),
      description: z.string().optional(),
      button_text: z.string().default("Start"),
    })
    .optional(),
  thank_you_screen: z
    .object({
      enabled: z.boolean().default(true),
      title: z.string().default("Thank you!"),
      description: z.string().optional(),
      button_text: z.string().default("Submit another response"),
    })
    .optional(),
  questions: z
    .array(QuestionSchema)
    .min(1, "At least one question is required"),
  settings: z.object({
    progress_bar: z.boolean().default(true),
    allow_going_back: z.boolean().default(true),
    shuffle_questions: z.boolean().default(false),
    confirmation_message: z.boolean().default(true),
    limit_one_response: z.boolean().default(false),
  }),
});

export type Question = z.infer<typeof QuestionSchema>;
export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;
export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceSchema>;
export type TextQuestion = z.infer<typeof TextQuestionSchema>;
export type RatingQuestion = z.infer<typeof RatingQuestionSchema>;
export type OpinionScaleQuestion = z.infer<typeof OpinionScaleSchema>;
export type YesNoQuestion = z.infer<typeof YesNoSchema>;
export type DropdownQuestion = z.infer<typeof DropdownSchema>;
export type FileUploadQuestion = z.infer<typeof FileUploadSchema>;
export type DateQuestion = z.infer<typeof DateQuestionSchema>;
export type MatrixQuestion = z.infer<typeof MatrixQuestionSchema>;
export type RankingQuestion = z.infer<typeof RankingQuestionSchema>;
export type PictureChoiceQuestion = z.infer<typeof PictureChoiceSchema>;
export type FormConfig = z.infer<typeof FormConfigSchema>;
export type QuestionType = Question["type"];
