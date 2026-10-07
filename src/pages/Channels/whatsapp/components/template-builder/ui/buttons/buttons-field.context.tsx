import { createButton } from "@/pages/Channels/whatsapp/utils/template/template.utils";
import type {
  ButtonKind,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  BUTTON_TYPE_CONFIG,
  CAROUSEL_ALLOWED_BUTTON_KINDS,
  CAROUSEL_MAX_BUTTONS,
  MAX_TEMPLATE_BUTTONS,
} from "../../../../constants/template.constants";

export type TemplateButtonsApi = {
  buttons: TTemplateButton[];
  maxButtons: number;
  allowedKinds: ButtonKind[] | null;
  isKindDisabled: (kind: ButtonKind) => boolean;
  addButton: (kind: ButtonKind) => void;
  removeButton: (id: string) => void;
  updateButton: (id: string, data: Partial<TTemplateButton>) => void;
  changeButtonKind: (id: string, kind: ButtonKind) => void;
};

const TemplateButtonsContext = createContext<TemplateButtonsApi | null>(null);

export function useTemplateButtons() {
  const ctx = useContext(TemplateButtonsContext);
  if (!ctx) {
    throw new Error("useTemplateButtons must be used within a buttons provider");
  }
  return ctx;
}

function countByKind(buttons: TTemplateButton[]) {
  return buttons.reduce<Record<string, number>>((acc, button) => {
    acc[button.kind] = (acc[button.kind] ?? 0) + 1;
    return acc;
  }, {});
}

export function FormButtonsProvider({ children }: { children: ReactNode }) {
  const { control, getValues, setValue } = useFormContext<TemplateForm>();
  const buttons = (useWatch({ control, name: "buttons" }) ||
    []) as TTemplateButton[];

  const isKindDisabled = useCallback(
    (kind: ButtonKind) => {
      const counts = countByKind(buttons);
      const used = counts[kind] ?? 0;
      return (
        buttons.length >= MAX_TEMPLATE_BUTTONS ||
        used >= BUTTON_TYPE_CONFIG[kind].maxCount
      );
    },
    [buttons],
  );

  const value = useMemo<TemplateButtonsApi>(
    () => ({
      buttons,
      maxButtons: MAX_TEMPLATE_BUTTONS,
      allowedKinds: null,
      isKindDisabled,
      addButton: (kind) => {
        if (isKindDisabled(kind)) return;
        setValue("buttons", [...(getValues("buttons") || []), createButton(kind)], {
          shouldDirty: true,
          shouldValidate: true,
        });
      },
      removeButton: (id) => {
        setValue(
          "buttons",
          (getValues("buttons") || []).filter((button) => button.id !== id),
          { shouldDirty: true, shouldValidate: true },
        );
      },
      updateButton: (id, data) => {
        setValue(
          "buttons",
          (getValues("buttons") || []).map((button) =>
            button.id === id ? { ...button, ...data } : button,
          ),
          { shouldDirty: true, shouldValidate: true },
        );
      },
      changeButtonKind: (id, kind) => {
        setValue(
          "buttons",
          (getValues("buttons") || []).map((button) =>
            button.id === id ? createButton(kind) : button,
          ),
          { shouldDirty: true, shouldValidate: true },
        );
      },
    }),
    [buttons, getValues, isKindDisabled, setValue],
  );

  return (
    <TemplateButtonsContext.Provider value={value}>
      {children}
    </TemplateButtonsContext.Provider>
  );
}

interface CarouselCardButtonsProviderProps {
  cardIndex: number;
  children: ReactNode;
}

export function CarouselCardButtonsProvider({
  cardIndex,
  children,
}: CarouselCardButtonsProviderProps) {
  const { control, getValues, setValue } = useFormContext<TemplateForm>();
  const carousel = useWatch({ control, name: "carousel" });
  const buttons = (carousel?.cards?.[cardIndex]?.buttons ||
    []) as TTemplateButton[];

  const commitCards = useCallback(
    (cards: NonNullable<TemplateForm["carousel"]>["cards"]) => {
      const current = getValues("carousel");
      if (!current) return;
      setValue(
        "carousel",
        { ...current, cards },
        { shouldDirty: true, shouldValidate: true },
      );
    },
    [getValues, setValue],
  );

  const isKindDisabled = useCallback(
    (kind: ButtonKind) => {
      if (
        !CAROUSEL_ALLOWED_BUTTON_KINDS.includes(
          kind as (typeof CAROUSEL_ALLOWED_BUTTON_KINDS)[number],
        )
      ) {
        return true;
      }
      if (buttons.length >= CAROUSEL_MAX_BUTTONS) return true;

      const counts = countByKind(buttons);
      const used = counts[kind] ?? 0;
      const kindMax =
        kind === "QUICK_REPLY"
          ? CAROUSEL_MAX_BUTTONS
          : BUTTON_TYPE_CONFIG[kind].maxCount;

      return used >= kindMax;
    },
    [buttons],
  );

  const value = useMemo<TemplateButtonsApi>(
    () => ({
      buttons,
      maxButtons: CAROUSEL_MAX_BUTTONS,
      allowedKinds: [...CAROUSEL_ALLOWED_BUTTON_KINDS],
      isKindDisabled,
      addButton: (kind) => {
        if (isKindDisabled(kind)) return;
        const current = getValues("carousel");
        if (!current) return;

        commitCards(
          current.cards.map((card) => ({
            ...card,
            buttons: [...(card.buttons || []), createButton(kind)],
          })),
        );
      },
      removeButton: (id) => {
        const current = getValues("carousel");
        if (!current) return;
        const activeButtons = current.cards[cardIndex]?.buttons || [];
        const removeIndex = activeButtons.findIndex((button) => button.id === id);
        if (removeIndex < 0) return;

        commitCards(
          current.cards.map((card) => ({
            ...card,
            buttons: (card.buttons || []).filter((_, index) => index !== removeIndex),
          })),
        );
      },
      updateButton: (id, data) => {
        const current = getValues("carousel");
        if (!current) return;

        commitCards(
          current.cards.map((card, index) => {
            if (index !== cardIndex) return card;
            return {
              ...card,
              buttons: (card.buttons || []).map((button) =>
                button.id === id ? { ...button, ...data } : button,
              ),
            };
          }),
        );
      },
      changeButtonKind: (id, kind) => {
        if (
          !CAROUSEL_ALLOWED_BUTTON_KINDS.includes(
            kind as (typeof CAROUSEL_ALLOWED_BUTTON_KINDS)[number],
          )
        ) {
          return;
        }
        const current = getValues("carousel");
        if (!current) return;
        const activeButtons = current.cards[cardIndex]?.buttons || [];
        const changeIndex = activeButtons.findIndex(
          (button) => button.id === id,
        );
        if (changeIndex < 0) return;

        commitCards(
          current.cards.map((card) => ({
            ...card,
            buttons: (card.buttons || []).map((button, index) =>
              index === changeIndex ? createButton(kind) : button,
            ),
          })),
        );
      },
    }),
    [buttons, cardIndex, commitCards, getValues, isKindDisabled],
  );

  return (
    <TemplateButtonsContext.Provider value={value}>
      {children}
    </TemplateButtonsContext.Provider>
  );
}
