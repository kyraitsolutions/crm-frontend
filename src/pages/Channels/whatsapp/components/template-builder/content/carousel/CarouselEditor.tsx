import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CAROUSEL_CARD_BODY_MAX,
  CAROUSEL_MAX_CARDS,
  CAROUSEL_MIN_CARDS,
} from "@/pages/Channels/whatsapp/constants/template.constants";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import {
  createCarouselCard,
  createDefaultCarousel,
} from "@/pages/Channels/whatsapp/utils/template/carousel.utils";
import { createButton } from "@/pages/Channels/whatsapp/utils/template/template.utils";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CardMediaUploader } from "./CardMediaUploader";
import { CarouselButtonsEditor } from "./CarouselButtonsEditor";

export function CarouselEditor() {
  const { control, setValue, getValues } = useFormContext<TemplateForm>();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const carousel = useWatch({ control, name: "carousel" });

  useEffect(() => {
    if (!getValues("carousel")) {
      setValue("carousel", createDefaultCarousel(), {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [getValues, setValue]);

  if (!carousel) return null;

  const cards = carousel.cards;
  const safeIndex = Math.min(activeCardIndex, Math.max(cards.length - 1, 0));
  const activeCard = cards[safeIndex];

  const updateCarousel = (next: TemplateForm["carousel"]) => {
    setValue("carousel", next, { shouldDirty: true, shouldValidate: true });
  };

  const handleMediaFormatChange = (mediaFormat: "IMAGE" | "VIDEO") => {
    updateCarousel({
      ...carousel,
      mediaFormat,
      cards: carousel.cards.map((card) => ({ ...card, media: undefined })),
    });
  };

  const handleIncludeCardBodyChange = (includeCardBody: boolean) => {
    updateCarousel({
      ...carousel,
      includeCardBody,
      cards: includeCardBody
        ? carousel.cards
        : carousel.cards.map((card) => ({ ...card, bodyText: "" })),
    });
  };

  const handleAddCard = () => {
    if (cards.length >= CAROUSEL_MAX_CARDS) return;
    const structureButtons = cards[0]?.buttons || [];
    const newCard = {
      ...createCarouselCard(),
      buttons: structureButtons.map((button) => createButton(button.kind)),
    };
    updateCarousel({
      ...carousel,
      cards: [...cards, newCard],
    });
    setActiveCardIndex(cards.length);
  };

  const handleRemoveCard = (index: number) => {
    if (cards.length <= CAROUSEL_MIN_CARDS) return;
    const nextCards = cards.filter((_, i) => i !== index);
    updateCarousel({ ...carousel, cards: nextCards });
    setActiveCardIndex(Math.max(0, Math.min(safeIndex, nextCards.length - 1)));
  };

  const updateActiveCard = (patch: Partial<(typeof cards)[number]>) => {
    const nextCards = cards.map((card, index) =>
      index === safeIndex ? { ...card, ...patch } : card,
    );
    updateCarousel({ ...carousel, cards: nextCards });
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Carousel cards</h3>
        <p className="mt-1 text-xs text-gray-500">
          Marketing media carousels need {CAROUSEL_MIN_CARDS}–{CAROUSEL_MAX_CARDS}{" "}
          cards. Every card must use the same media format, body setting, and
          button types.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Card media format
          </label>
          <Select
            value={carousel.mediaFormat}
            onValueChange={(value) =>
              handleMediaFormatChange(value as "IMAGE" | "VIDEO")
            }
          >
            <SelectTrigger className="input-field rounded-xl! w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl!">
              <SelectItem value="IMAGE">Image</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox
              checked={carousel.includeCardBody}
              onCheckedChange={(checked) =>
                handleIncludeCardBodyChange(checked === true)
              }
            />
            Include body text on every card
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {cards.map((card, index) => (
          <Button
            key={card.id}
            type="button"
            variant="outline"
            onClick={() => setActiveCardIndex(index)}
            className={`rounded-xl! px-3 py-1.5 text-xs font-medium ${
              index === safeIndex
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            Card {index + 1}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          className="h-8 gap-1 rounded-xl! px-2 text-xs"
          onClick={handleAddCard}
          disabled={cards.length >= CAROUSEL_MAX_CARDS}
        >
          <Plus className="h-3.5 w-3.5" />
          Add card
        </Button>
      </div>

      {activeCard && (
        <div className="space-y-4 rounded-xl border border-dashed border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Card {safeIndex + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              className="h-8 gap-1 rounded-xl! text-xs text-red-500 hover:text-red-600"
              onClick={() => handleRemoveCard(safeIndex)}
              disabled={cards.length <= CAROUSEL_MIN_CARDS}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">
              {carousel.mediaFormat === "IMAGE" ? "Image" : "Video"} header
            </p>
            <CardMediaUploader
              mediaFormat={carousel.mediaFormat}
              value={activeCard.media}
              onChange={(media) => updateActiveCard({ media })}
            />
          </div>

          {carousel.includeCardBody && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700">Card body</p>
                <span className="text-[11px] text-gray-400">
                  {(activeCard.bodyText || "").length}/{CAROUSEL_CARD_BODY_MAX}
                </span>
              </div>
              <Textarea
                value={activeCard.bodyText || ""}
                maxLength={CAROUSEL_CARD_BODY_MAX}
                onChange={(e) => updateActiveCard({ bodyText: e.target.value })}
                placeholder="Optional product description for this card"
                className="input-field min-h-20 resize-none rounded-xl!"
              />
            </div>
          )}

          <CarouselButtonsEditor cardIndex={safeIndex} />
        </div>
      )}
    </div>
  );
}
