import { generateId } from "@/utils/generateId.utils";
import { CAROUSEL_MIN_CARDS } from "../../constants/template.constants";
import type { CarouselMediaFormat } from "../../types/templates";
import type { TemplateForm } from "../../validations/template.schema";

type CarouselForm = NonNullable<TemplateForm["carousel"]>;
type CarouselCard = CarouselForm["cards"][number];

export function createCarouselCard(): CarouselCard {
  return {
    id: generateId(),
    media: undefined,
    bodyText: "",
    buttons: [],
  };
}

export function createDefaultCarousel(): CarouselForm {
  const mediaFormat: CarouselMediaFormat = "IMAGE";

  return {
    mediaFormat,
    includeCardBody: false,
    cards: Array.from({ length: CAROUSEL_MIN_CARDS }, () =>
      createCarouselCard(),
    ),
  };
}
