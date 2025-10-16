import { create } from "zustand";
import type { Question, FormConfig } from "@/types";
import { immer } from "zustand/middleware/immer";

interface IBuilderStoreState {
  selected_question_id: string | null;
  survey_form_config: FormConfig | null;
}

export const useBuilderStore = create<IBuilderStoreState>()(
  immer((_) => ({
    selected_question_id: null,
    survey_form_config: null,
  }))
);

class BuilderStoreManager {
  private store: typeof useBuilderStore;
  constructor() {
    this.store = useBuilderStore;
  }

  public setSelectedQuestionId(id: string | null) {
    this.store.setState((state) => {
      state.selected_question_id = id;
    });
  }

  public setSurveyFormConfig(config: FormConfig | null) {
    this.store.setState((state) => {
      state.survey_form_config = config;
    });
  }

  public setFormInfo(info: Partial<FormConfig>) {
    this.store.setState((state) => {
      if (!state.survey_form_config) return;
      Object.assign(state.survey_form_config, info);
    });
  }
  public addQuestion(question: Question) {
    this.store.setState((state) => {
      if (!state.survey_form_config) return;
      if (!state.survey_form_config.questions)
        state.survey_form_config.questions = [];

      state.survey_form_config.questions.push(question);
    });
  }
  public updateQuestion(id: string, updates: Partial<Question>) {
    this.store.setState((state) => {
      if (!state.survey_form_config?.questions) return;

      const questionIndex = state.survey_form_config.questions.findIndex(
        (q) => q.id === id
      );
      if (questionIndex !== -1) {
        Object.assign(
          state.survey_form_config.questions[questionIndex],
          updates
        );
      }
    });
  }
  public removeQuestion(id: string) {
    this.store.setState((state) => {
      if (!state.survey_form_config?.questions) return;
      state.survey_form_config.questions =
        state.survey_form_config.questions.filter((q) => q.id !== id);
    });
  }
}

export { BuilderStoreManager };
