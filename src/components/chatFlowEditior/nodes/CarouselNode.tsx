import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image,
  MousePointerClick,
  Reply,
} from "lucide-react";
import { useState } from "react";
import { Handle, Position } from "reactflow";
import type { TAppNodeData } from "../types/types";
import NodeHeader from "./NodeHeader";

type TCarouselNodeProps = {
  id: string;
  data: TAppNodeData;
};

const CARD_WIDTH = 260;
const GAP = 12;

const CarouselNode = ({ data }: TCarouselNodeProps) => {
  const payload = data?.type === "carousel" ? data?.payload : null;

  const cards = payload?.interactive?.action?.cards || [];
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, cards.length - 1);

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <motion.div
      className="w-90 bg-gray-100 rounded-xl shadow-lg border overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <NodeHeader
        title="Carousel"
        className="bg-indigo-500"
        icon={<MousePointerClick />}
      />

      <div className="p-2 space-y-2">
        {/* BODY TEXT */}
        {payload?.interactive?.body?.text && (
          <pre className="text-sm text-gray-700 whitespace-pre-wrap px-3 bg-white rounded-xl font-medium shadow-xs p-2">
            {payload.interactive.body.text}
          </pre>
        )}

        {/* SLIDER */}
        <div className="relative">
          {/* LEFT BUTTON */}
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white shadow 
          ${index === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={handleNext}
            disabled={index === maxIndex}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white shadow 
          ${index === maxIndex ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <ChevronRight size={16} />
          </button>

          {/* VIEWPORT */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-2"
              animate={{
                x: -(CARD_WIDTH + GAP) * index,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {cards?.length > 0 &&
                cards.map((card, i) => {
                  const header =
                    card.header?.type === "image"
                      ? card.header?.image?.link
                      : card.header?.video?.link;

                  const isUrlButton =
                    card.action && "parameters" in card.action
                      ? card.action
                      : null;

                  return (
                    <div
                      key={i}
                      className="min-w-80 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col"
                    >
                      {/* IMAGE / VIDEO */}
                      {header ? (
                        <div className="w-full h-40 object-cover rounded-t-xl">
                          {card.header.type === "image" ? (
                            <img
                              src={header}
                              className="w-full h-40 object-cover rounded-t-xl"
                            />
                          ) : (
                            <video
                              src={header}
                              className="w-full h-40 object-cover rounded-t-xl"
                              controls
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-40 flex justify-center items-center object-cover rounded-t-xl text-gray-400">
                          <Image size={60} />
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="p-2 flex flex-col justify-between flex-1">
                        {/* BODY */}
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {card.body?.text}
                        </pre>

                        {/* ACTION */}
                        <div className="mt-3 border-t border-gray-300 pt-2">
                          {/* URL BUTTON */}
                          {isUrlButton && (
                            <Button className="actions-btn w-full">
                              <ExternalLink />
                              {isUrlButton?.parameters?.display_text}
                            </Button>
                          )}

                          {/* QUICK REPLY BUTTONS */}
                          <div className="space-y-2">
                            {!isUrlButton &&
                              "buttons" in card.action &&
                              card.action.buttons.map((btn) => (
                                <div
                                  key={btn.quick_reply.id}
                                  className="flex items-center gap-2 text-blue-600 text-sm"
                                >
                                  <Button className="actions-btn w-full">
                                    <Reply /> {btn.quick_reply.title}
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* HANDLES */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-slate-600! size-3!"
      />
    </motion.div>
  );
};

export default CarouselNode;
