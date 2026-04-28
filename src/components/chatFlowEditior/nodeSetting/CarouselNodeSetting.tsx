import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastMessageService } from "@/services";
import { Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReactFlow } from "reactflow";
import { createId } from "../utils/utils";
import type { TAppNodeData, TCarouselCard, TMode } from "../types/types";
import { FILE_LIMITS } from "@/constants";
import {
  BUTTON_MODES,
  CAROUSEL_HEADER_MEDIA_SUPPORT,
  HEADER_MEDIA_TYPES,
} from "../config";

const MAX_CARDS = 10;
const MIN_CARDS = 2;
const MAX_CARDS_QUICK_REPLY_BUTTONS = 3;
const MAX_BODY = 1024;
const MAX_CARD_BODY = 160;
const MAX_CARD_BODY_LINE_BREAKS = 2;

type TCarouselCardsProps = {
  cards: TCarouselCard[];
  mode: TMode;
  updateCard: (cardIndex: number, key: string, value: unknown) => void;
  removeCard: (cardIndex: number) => void;
  // updateMode: (mode: TMode) => void;
};

type TCarouselCardItemProps = {
  card: TCarouselCard;
  mode: TMode;
  index?: number;
  onUpdateCard: (cardIndex: number, key: string, value: unknown) => void;
  onRemoveCard: (cardIndex: number) => void;
  // updateMode: (mode: TMode) => void;
};
type TCarouselNodeSettingProps = {
  id?: string;
  data: TAppNodeData;
  onClose?: () => void;
};

const CarouselNodeSetting = ({
  id,
  data,
  onClose,
}: TCarouselNodeSettingProps) => {
  const { setNodes } = useReactFlow();
  const payload = data?.type === "carousel" ? data?.payload : null;

  const toast = new ToastMessageService();

  const listRef = useRef<HTMLDivElement>(null);

  const [bodyText, setBodyText] = useState(
    payload?.interactive?.body?.text || "",
  );
  const [mode, setMode] = useState<TMode>("url");
  const [cards, setCards] = useState<TCarouselCard[]>([]);

  const validate = () => {
    if (!bodyText.trim()) return toast.error("Body text is required");

    if (cards.length < MIN_CARDS)
      return toast.error("Minimum 2 cards required");

    cards.forEach((c, i) => {
      const header =
        c.header?.type === "image"
          ? c.header?.image?.link
          : c.header?.video?.link;

      // const action =
      //   "parameters" in c.action ? c.action.parameters : c.action.buttons;

      if (!header) return toast.error(`Card ${i + 1} header required`);
      if ("parameters" in c.action) {
        if (!c.action.parameters?.display_text)
          return toast.error(`Card ${i + 1} buttons text are required`);
        return toast.error(`Card ${i + 1} buttons url are required`);
      } else {
        if (!c.action.buttons.length)
          return toast.error(`Card ${i + 1} buttons are required`);
      }
    });
  };

  const transformCardsByMode = (
    cards: TCarouselCard[],
    newMode: TMode,
  ): TCarouselCard[] => {
    return cards.map((card) => {
      if (newMode === "url") {
        return {
          ...card,
          type: "cta_url",
          action: {
            name: "cta_url",
            parameters: {
              display_text: "Buy Now",
              url: "",
            },
          },
        };
      }

      // quick_reply mode
      const defaultButtons =
        "buttons" in card.action
          ? card.action.buttons
          : [
              {
                type: "quick_reply",
                quick_reply: {
                  id: createId(),
                  title: "Option 1",
                },
              },
              {
                type: "quick_reply",
                quick_reply: {
                  id: createId(),
                  title: "Option 2",
                },
              },
            ];

      return {
        ...card,
        action: {
          buttons: defaultButtons.map((btn: any) => ({
            type: "quick_reply",
            quick_reply: {
              id: createId(),
              title: btn.quick_reply.title,
            },
          })),
        },
      };
    });
  };

  const handleModeSwitch = (newMode: TMode) => {
    const transformedCards = transformCardsByMode(cards, newMode);
    setCards(transformedCards);
    setMode(newMode);
  };

  const addCard = () => {
    if (cards.length >= MAX_CARDS) return toast.error("Max 10 cards allowed");

    setCards((prev) => [
      ...prev,
      {
        card_index: prev.length,
        type: "cta_url",

        header: {
          type: "image",
          image: {
            link: "",
          },
        },

        body: {
          text: "",
        },

        action: {
          name: "cta_url",
          parameters: {
            display_text: "Buy Now",
            url: "",
          },
        },
      },
    ]);

    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const removeCard = (cardIndex: number) => {
    if (cards.length <= MIN_CARDS)
      return toast.error("Minimum 2 cards required");
    setCards((prev) => prev.filter((c) => c.card_index !== cardIndex));
  };

  const updateCard = (cardId: string, key: string, value: any) => {
    setCards((prev) =>
      prev.map((c) =>
        c.card_index === Number(cardId) ? { ...c, [key]: value } : c,
      ),
    );
  };

  const updateQuickReply = (cardId: string, btnId: string, value: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              quickReplies: c.quickReplies?.map((b) =>
                b.id === btnId ? { ...b, title: value } : b,
              ),
            }
          : c,
      ),
    );
  };

  const handleSave = () => {
    validate();
    const payloadData = {
      label: data.label,
      type: data.type,
      payload: {
        type: "interactive",
        interactive: {
          type: "carousel",
          body: { text: bodyText },
          action: {
            cards: cards.map((c, i) => ({
              card_index: i,
              header: c.header,
              body: c.body,
              action: c.action,
            })),
          },
        },
      },
    };
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: payloadData } : n)),
    );
  };

  const setPayloadData = () => {
    const firstCardAction = payload?.interactive?.action?.cards?.[0]?.action;
    if (!firstCardAction) return;
    const isUrl = "parameters" in firstCardAction;
    setMode(isUrl ? "url" : "quick_reply");
    setCards(payload?.interactive?.action?.cards.map((c) => ({ ...c })));
  };

  useEffect(() => {
    if (payload) setPayloadData();
  }, [payload]);

  return (
    <div className="h-full flex flex-col bg-ternary text-white">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Carousel Message</h2>
          <p className="text-xs text-gray-400">Configure carousel cards</p>
        </div>
        <ButtonClose onClose={() => onClose && onClose()} />
      </div>

      {/* BODY */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* MAIN BODY */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Body *</label>
          <Textarea
            value={bodyText}
            onChange={(e) => {
              if (e.target.value.length > MAX_BODY) return;
              setBodyText(e.target.value);
            }}
            className="input-field bg-white/5 border-white/15! text-white min-h-40"
          />
          <p className="text-right text-[10px] text-gray-500">
            {bodyText.length}/{MAX_BODY}
          </p>
        </div>

        {/* MODE SWITCH */}
        <div className="flex flex-col gap-2">
          <label>Card Button Type</label>

          <div className="flex gap-2 w-full">
            {BUTTON_MODES.map((m) => (
              <Button
                key={m}
                onClick={() => handleModeSwitch(m as TMode)}
                className={`px-3 py-1! text-xs rounded cursor-pointer hover:bg-emerald-500 hover:text-white ${
                  mode === m ? "bg-emerald-500" : "bg-white/5 text-gray-400"
                }`}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>

        {/* CARDS */}
        <CarouselCards
          cards={cards}
          mode={mode}
          updateCard={updateCard}
          removeCard={removeCard}
        />

        <Button onClick={addCard} className="w-full">
          <Plus size={14} /> Add Card
        </Button>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10 flex justify-end gap-2">
        <Button className="node-setting-footer-btns" onClick={onClose}>
          Cancel
        </Button>
        <Button className="node-setting-footer-btns" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default CarouselNodeSetting;

const CarouselCards = ({
  cards,
  mode,
  updateCard,
  removeCard,
}: TCarouselCardsProps) => {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <div>
          <h2 className="mb-2">Card {index + 1}</h2>
          <CarouselCardItem
            key={card.card_index}
            card={card}
            index={index}
            mode={mode}
            onUpdateCard={updateCard}
            onRemoveCard={removeCard}
            // onUpdateMode={updateMode}
          />
        </div>
      ))}
    </div>
  );
};
const CarouselCardItem = ({
  card,
  index,
  mode,
  onUpdateCard,
  onRemoveCard,
}: TCarouselCardItemProps) => {
  const toastService = new ToastMessageService();
  const headerUrl =
    card.header?.type === "image"
      ? card.header?.image?.link
      : card.header?.video?.link;

  const bodyText = card.body?.text || "";
  const isUrl = "parameters" in card.action;

  const handleFile = (file?: File) => {
    if (!file) return;

    const fileSize = file.size;

    if (fileSize > FILE_LIMITS.IMAGE.MAX_SIZE_MB) {
      toastService.error("Max File Size 5MB");
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    onUpdateCard(card.card_index, "header", {
      type: card.header.type,
      ...(card.header.type === "image"
        ? { image: { link: fileUrl } }
        : { video: { link: fileUrl } }),
    });
  };

  return (
    <div className="group/card border border-white/5 rounded-xl p-2 space-y-4 relative shadow-sm bg-black/10">
      {/* 🔹 HEADER SECTION */}
      <div className="space-y-3 bg-white/6 p-3 rounded-xl">
        <label className="text-sm text-gray-400 inline-block">
          Header Media *
        </label>

        {/* TYPE SWITCH */}
        <div className="flex gap-2">
          {HEADER_MEDIA_TYPES.map(
            (type) =>
              CAROUSEL_HEADER_MEDIA_SUPPORT.includes(type) && (
                <Button
                  key={type}
                  onClick={() =>
                    onUpdateCard(card.card_index, "header", {
                      type,
                      ...(type === "image"
                        ? { image: { link: "" } }
                        : { video: { link: "" } }),
                    })
                  }
                  className={`node-setting-header-types rounded-full! ${
                    card.header.type === type
                      ? "bg-emerald-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {type}
                </Button>
              ),
          )}
        </div>

        {/* UPLOAD UI */}
        <div className="space-y-2">
          {headerUrl ? (
            <div className="relative group border border-white/15 p-1 rounded-lg overflow-hidden">
              {card.header.type === "image" ? (
                <img
                  src={headerUrl}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={headerUrl}
                  controls
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition cursor-pointer border-2 border-dashed border-white/20 bg-black/40 backdrop-blur-sm rounded-lg">
                <div className="size-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Upload size={18} />
                </div>

                <p className="text-sm text-white">Replace {card.header.type}</p>

                <Input
                  type="file"
                  accept={card.header.type === "image" ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition">
              <div className="size-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
                <Upload size={18} />
              </div>

              <p className="text-sm text-white/60">Upload {card.header.type}</p>

              <Input
                type="file"
                accept={
                  card.header.type === "image"
                    ? FILE_LIMITS.IMAGE.ACCEPTED_TYPES
                    : "video/*"
                }
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          )}

          <p className="text-xs text-right text-gray-400">
            {card.header.type === "image"
              ? "jpg, jpeg, png (Max 5MB)"
              : "mp4 (Max 16MB)"}
          </p>
        </div>
      </div>

      {/* 🔹 BODY SECTION */}
      <div className="space-y-2 bg-white/6 p-3 rounded-xl">
        <label
          className="text-sm text-gray-400 inline-block"
          htmlFor={`card-body-${card.card_index}`}
        >
          Card Body (Optional)
        </label>

        <Textarea
          id={`card-body-${card.card_index}`}
          value={bodyText}
          placeholder="Enter card message..."
          className="input-field bg-white/5 border-white/15! text-white min-h-30"
          onChange={(e) => {
            const value = e.target.value;

            // 🔹 limit characters
            if (value.length > MAX_CARD_BODY) return;

            const lineBreaks = (value.match(/\n/g) || []).length;
            if (lineBreaks > MAX_CARD_BODY_LINE_BREAKS) return;

            onUpdateCard(card.card_index, "body", {
              text: value,
            });
          }}
        />

        {/* Helper text */}
        <div className="flex justify-between text-xs text-gray-400">
          <span className="text-xs">Up to 2 line breaks</span>
          <span>
            {bodyText.length}/{MAX_CARD_BODY}
          </span>
        </div>
      </div>

      {/* 🔹 ACTION SECTION */}
      <div className="space-y-2 bg-white/6 p-3 rounded-xl">
        <label className="text-sm text-gray-400 inline-block">
          {mode === "url" ? "CTA Button" : "Quick Replies"}
        </label>

        {/* URL MODE */}
        {mode === "url" && isUrl && (
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={card.action.parameters.display_text}
              className="input-field bg-white/5 border-white/15! text-white"
              onChange={(e) =>
                onUpdateCard(card.card_index, "action", {
                  ...card.action,
                  parameters: {
                    ...card.action.parameters,
                    display_text: e.target.value,
                  },
                })
              }
            />

            <Input
              placeholder="https://example.com"
              value={card.action.parameters.url}
              className="input-field bg-white/5 border-white/15! text-white"
              onChange={(e) =>
                onUpdateCard(card.card_index, "action", {
                  ...card.action,
                  parameters: {
                    ...card.action.parameters,
                    url: e.target.value,
                  },
                })
              }
            />
          </div>
        )}

        {/* QUICK REPLY MODE */}
        {mode === "quick_reply" &&
          "buttons" in card.action &&
          card.action.buttons.map((btn, i) => (
            <Input
              key={btn.quick_reply.id}
              placeholder={`Option ${i + 1}`}
              value={btn.quick_reply.title}
              className="input-field bg-white/5 border-white/15! text-white"
            />
          ))}
      </div>

      {/* DELETE */}
      {index && index > 1 && (
        <Button
          onClick={() => onRemoveCard(card.card_index)}
          className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 bg-red-500"
        >
          <Trash2 size={14} />
        </Button>
      )}
    </div>
  );
};

{
  /* <div className="space-y-4">
          {cards?.length > 0 &&
            cards.map((card, index) => {
              const headerUrl =
                card.header?.type === "image"
                  ? card.header?.image?.link
                  : card?.header?.video?.link;

              const bodyText = card.body?.text || "";
              const isUrl = "parameters" in card.action;

              return (
                <div
                  key={card.card_index}
                  className="group/card bg-white/5 border border-white/10 rounded-lg p-3 space-y-3 relative"
                >
             
                  <div className="flex gap-2 mb-2">
                    {HEADER_MEDIA_TYPE.map((type) => (
                      <Button
                        key={type}
                        onClick={() =>
                          updateCard(card.card_index, "header", {
                            type,
                            ...(type === "image"
                              ? { image: { link: "" } }
                              : { video: { link: "" } }),
                          })
                        }
                        className={`px-3 py-1! text-xs cursor-pointer hover:bg-emerald-500 hover:text-white rounded ${
                          card.header.type === type
                            ? "bg-emerald-500 text-white"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                

                 
                  <Textarea
                    value={bodyText}
                    onChange={(e) =>
                      updateCard(card.card_index, "body", {
                        text: e.target.value,
                      })
                    }
                    placeholder="Card body"
                    className="input-field bg-white/5"
                  />

                  
                  {mode === "url" && isUrl && (
                    <>
                      <Input
                        placeholder="Button text"
                        value={card.action.parameters.display_text}
                        onChange={(e) =>
                          updateCard(card.card_index, "action", {
                            ...card.action,
                            parameters: {
                              ...card.action.parameters,
                              display_text: e.target.value,
                            },
                          })
                        }
                      />

                      <Input
                        placeholder="URL"
                        value={card.action.parameters.url}
                        onChange={(e) =>
                          updateCard(card.card_index, "action", {
                            ...card.action,
                            parameters: {
                              ...card.action.parameters,
                              url: e.target.value,
                            },
                          })
                        }
                      />
                    </>
                  )}

                
                  {mode === "quick_reply" &&
                    "buttons" in card.action &&
                    card.action.buttons.map((btn, i) => (
                      <Input
                        key={btn.quick_reply.id}
                        value={btn.quick_reply.title}
                        onChange={(e) =>
                          updateQuickReply(
                            card.card_index,
                            btn.quick_reply.id,
                            e.target.value,
                          )
                        }
                      />
                    ))}

              
                  {index > 0 && (
                    <Button
                      onClick={() => removeCard(card.card_index)}
                      className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 bg-red-500"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              );
            })}
</div> */
}
