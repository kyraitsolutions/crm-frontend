import {
  CAROUSEL_MAX_BUTTONS,
} from "@/pages/Channels/whatsapp/constants/template.constants";
import { AddButtonAction } from "../../ui/buttons/AddButtonAction";
import { ButtonsList } from "../../ui/buttons/ButtonList";
import { CarouselCardButtonsProvider } from "../../ui/buttons/buttons-field.context";

interface CarouselButtonsEditorProps {
  cardIndex: number;
}

export function CarouselButtonsEditor({ cardIndex }: CarouselButtonsEditorProps) {
  return (
    <CarouselCardButtonsProvider cardIndex={cardIndex}>
      <section className="rounded-2xl border border-gray-200 px-5 py-3">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-800">
                Buttons
              </span>
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </div>
          </div>

          <p className="mb-4 text-xs text-gray-500">
            Add up to {CAROUSEL_MAX_BUTTONS} buttons per card. Only Quick reply,
            Visit website, and Call phone are supported. The same button types
            are applied to every card.
          </p>
        </div>

        <div className="space-y-2">
          <ButtonsList />
          <AddButtonAction />
        </div>
      </section>
    </CarouselCardButtonsProvider>
  );
}
