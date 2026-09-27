import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TAgentInteractive } from "../../types/ai-agent.type";

type InteractiveReplyProps = {
  interactive?: TAgentInteractive | null;
  disabled?: boolean;
  onChoose?: (title: string, id?: string) => void;
};

const choiceClass =
  "w-full cursor-pointer rounded-2xl border border-primary/20 bg-white px-2.5 py-1.5 text-left text-[12px] font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50";

type ReplyCard = NonNullable<NonNullable<TAgentInteractive["action"]>["cards"]>[number];
type ReplyButton = NonNullable<NonNullable<TAgentInteractive["action"]>["buttons"]>[number];

const ChoiceButtons = ({
  buttons,
  disabled,
  onChoose,
}: {
  buttons: ReplyButton[];
  disabled?: boolean;
  onChoose?: (title: string, id?: string) => void;
}) => {
  const items = buttons.filter((button) => button.reply?.title);
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((button) => {
        const title = button.reply?.title || "";
        return (
          <button
            key={button.reply?.id || title}
            type="button"
            disabled={disabled}
            className={choiceClass}
            onClick={() => onChoose?.(title, button.reply?.id)}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
};

const CarouselSlider = ({
  cards,
  buttons,
  disabled,
  onChoose,
}: {
  cards: ReplyCard[];
  buttons: ReplyButton[];
  disabled?: boolean;
  onChoose?: (title: string, id?: string) => void;
}) => {
  const [index, setIndex] = useState(0);
  const count = cards.length;
  const card = cards[index] || cards[0];
  if (!card) return null;
  const image = card.header?.image?.link;
  const link = card.action?.parameters?.url;
  const show = (next: number) => setIndex((next + count) % count);

  return (
    <div className="mt-2 space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {image ? (
          <img src={image} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="h-40 w-full bg-slate-100" />
        )}
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute top-1/2 left-1.5 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm"
              onClick={() => show(index - 1)}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm"
              onClick={() => show(index + 1)}
            >
              <ChevronRight className="size-4" />
            </button>
            <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
              {index + 1}/{count}
            </span>
          </>
        ) : null}
      </div>
      {card.body?.text ? <p className="text-[12px] leading-4 text-slate-700">{card.body.text}</p> : null}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className={`${choiceClass} block text-center`}>
          {card.action?.parameters?.display_text || "Open"}
        </a>
      ) : null}
      {count > 1 ? (
        <div className="flex items-center justify-center gap-1.5">
          {cards.map((_, dot) => (
            <button
              key={dot}
              type="button"
              aria-label={`Show image ${dot + 1}`}
              className={`size-1.5 cursor-pointer rounded-full ${dot === index ? "bg-primary" : "bg-slate-300"}`}
              onClick={() => setIndex(dot)}
            />
          ))}
        </div>
      ) : null}
      <ChoiceButtons buttons={buttons} disabled={disabled} onChoose={onChoose} />
    </div>
  );
};

const InteractiveReply = ({ interactive, disabled, onChoose }: InteractiveReplyProps) => {
  if (!interactive?.type) return null;
  const action = interactive.action;

  if (interactive.type === "button") {
    const buttons = action?.buttons || [];
    if (!buttons.length) return null;
    return (
      <div className="mt-2">
        <ChoiceButtons buttons={buttons} disabled={disabled} onChoose={onChoose} />
      </div>
    );
  }

  if (interactive.type === "list") {
    const rows = (action?.sections || []).flatMap((section) => section.rows || []);
    if (!rows.length) return null;
    return (
      <div className="mt-2 flex flex-col gap-1.5">
        <p className="text-[11px] font-medium text-slate-400">{action?.button || "Options"}</p>
        {rows.map((row) => (
          <button
            key={row.id || row.title}
            type="button"
            disabled={disabled}
            className={choiceClass}
            onClick={() => row.title && onChoose?.(row.title, row.id)}
          >
            <span className="block">{row.title}</span>
            {row.description ? (
              <span className="mt-0.5 block text-[11px] font-normal text-slate-500">
                {row.description}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    );
  }

  if (interactive.type === "cta_url" && action?.parameters?.url) {
    return (
      <a
        href={action.parameters.url}
        target="_blank"
        rel="noreferrer"
        className={`${choiceClass} mt-2 block text-center`}
      >
        {action.parameters.display_text || "Open"}
      </a>
    );
  }

  if (interactive.type === "carousel") {
    const cards = action?.cards || [];
    if (!cards.length) return null;
    return (
      <CarouselSlider
        cards={cards}
        buttons={action?.buttons || []}
        disabled={disabled}
        onChoose={onChoose}
      />
    );
  }

  return null;
};

export default InteractiveReply;
