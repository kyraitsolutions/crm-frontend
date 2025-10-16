import { EFormQuestionType } from "@/enums";
import type { BaseQuestion, Question, QuestionType } from "@/types";
import { v4 as uuidv4 } from "uuid";

class QuestionBuilderHelper {
  private generateId(): string {
    return uuidv4();
  }

  private getBaseQuestion(): BaseQuestion {
    return {
      id: this.generateId(),
      title: "Untitled Question",
      description: "",
      required: false,
      visible: true,
      randomize: false,
    };
  }

  private MultiChoiceDefaultConfig(): any {
    return {
      options: [
        { id: this.generateId(), label: "Option 1", imageUrl: "" },
        { id: this.generateId(), label: "Option 2", imageUrl: "" },
      ],
      allow_multiple_selection: false,
      vertical_alignment: false,
      other_option: false,
    };
  }

  private TextDefaultConfig(): any {
    return {
      subtype: "short",
      placeholder: "",
      max_length: 200,
      validation: {
        regex: "",
        min: undefined,
        max: undefined,
      },
    };
  }

  private RatingDefaultConfig(): any {
    return {
      style: "stars",
      scale: 5,
      labels: { left: "Bad", center: "Okay", right: "Good" },
    };
  }

  private OpinionScaleDefaultConfig(): any {
    return {
      steps: 5,
      start_at_one: false,
      labels: { left: "Disagree", center: "Neutral", right: "Agree" },
    };
  }

  private YesNoDefaultConfig(): any {
    return {
      labels: { yes: "Yes", no: "No" },
    };
  }

  private DropdownDefaultConfig(): any {
    return {
      options: [
        { id: this.generateId(), label: "Option 1", value: "option1" },
        { id: this.generateId(), label: "Option 2", value: "option2" },
      ],
      searchable: false,
      allow_multiple: false,
    };
  }

  private FileUploadDefaultConfig(): any {
    return {
      allowed_types: ["image/*", "document/*"],
      max_files: 1,
      max_size_mb: 10,
    };
  }

  private DateDefaultConfig(): any {
    return {
      format: "date",
      min_date: undefined,
      max_date: undefined,
      allow_past: true,
      allow_future: true,
    };
  }

  private MatrixDefaultConfig(): any {
    return {
      rows: [
        { id: this.generateId(), label: "Row 1" },
        { id: this.generateId(), label: "Row 2" },
      ],
      columns: [
        { id: this.generateId(), label: "Column 1", value: 1 },
        { id: this.generateId(), label: "Column 2", value: 2 },
      ],
      single_selection_per_row: true,
    };
  }

  private RankingDefaultConfig(): any {
    return {
      options: [
        { id: this.generateId(), label: "Option 1", imageUrl: "" },
        { id: this.generateId(), label: "Option 2", imageUrl: "" },
      ],
      max_choices: undefined,
    };
  }

  private PictureChoiceDefaultConfig(): any {
    return {
      options: [
        {
          id: this.generateId(),
          imageUrl: "https://via.placeholder.com/150",
          label: "Image 1",
        },
        {
          id: this.generateId(),
          imageUrl: "https://via.placeholder.com/150",
          label: "Image 2",
        },
      ],
      multiple_selection: false,
      display_style: "grid",
    };
  }

  // ---- Dispatcher ---- //
  private getDefaultConfig(questionType: QuestionType): any {
    switch (questionType) {
      case EFormQuestionType.MULTI_CHOICE:
        return this.MultiChoiceDefaultConfig();
      case EFormQuestionType.TEXT:
        return this.TextDefaultConfig();
      case EFormQuestionType.RATING:
        return this.RatingDefaultConfig();
      case EFormQuestionType.OPINION_SCALE:
        return this.OpinionScaleDefaultConfig();
      case EFormQuestionType.YES_NO:
        return this.YesNoDefaultConfig();
      case EFormQuestionType.DROPDOWN:
        return this.DropdownDefaultConfig();
      case EFormQuestionType.FILE_UPLOAD:
        return this.FileUploadDefaultConfig();
      case EFormQuestionType.DATE:
        return this.DateDefaultConfig();
      case EFormQuestionType.MATRIX:
        return this.MatrixDefaultConfig();
      case EFormQuestionType.RANKING:
        return this.RankingDefaultConfig();
      case EFormQuestionType.PICTURE_CHOICE:
        return this.PictureChoiceDefaultConfig();
      default:
        return null;
    }
  }

  public createQuestion(questionType: QuestionType): Question {
    return {
      ...this.getBaseQuestion(),
      config: this.getDefaultConfig(questionType),
      type: questionType,
    };
  }
}

export { QuestionBuilderHelper };
