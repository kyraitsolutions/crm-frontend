import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image,
  Reply,
} from "lucide-react";
import { useState } from "react";
import type { TMessage } from "../../types/message.type";

type TCarouselMessageProps = {
  message: TMessage;
};

const CARD_WIDTH = 280;
const GAP = 14;

const InteractiveCarouselMessage = ({ message }: TCarouselMessageProps) => {
  const msg =
    message?.type === "interactive" && message?.interactive?.type === "carousel"
      ? message?.interactive
      : null;

  const cards = msg?.action.cards || [];

  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, cards.length - 1);

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="space-y-3 max-w-[300px]">
      {/* BODY */}
      {msg?.body?.text && (
        <div className="px-1">
          <p className="text-sm leading-relaxed text-slate-800 break-words">
            {msg.body.text}
          </p>
        </div>
      )}

      {/* CAROUSEL */}
      <div className="relative">
        {/* LEFT BUTTON */}
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full border bg-white/95 backdrop-blur shadow-md flex items-center justify-center transition-all ${
            index === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={handleNext}
          disabled={index === maxIndex}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full border bg-white/95 backdrop-blur shadow-md flex items-center justify-center transition-all ${
            index === maxIndex
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105"
          }`}
        >
          <ChevronRight size={16} />
        </button>

        {/* VIEWPORT */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(-${(CARD_WIDTH + GAP) * index}px)`,
            }}
          >
            {cards.map((card, i) => {
              const header =
                card.header?.type === "image"
                  ? card.header?.image?.link
                  : card.header?.video?.link;

              const isUrlButton =
                card.action && "parameters" in card.action ? card.action : null;

              return (
                <div
                  key={i}
                  className="min-w-[280px] bg-white overflow-hidden border-slate-200 "
                >
                  {/* MEDIA */}
                  <div className="relative ">
                    {header ? (
                      card.header?.type === "image" ? (
                        <img
                          src={header}
                          className="w-full object-cover rounded-2xl h-44"
                        />
                      ) : (
                        <video
                          src={header}
                          controls
                          className="w-full h-44 object-cover k rounded-2xl"
                        />
                      )
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center text-slate-400">
                        <Image size={54} strokeWidth={1.5} />
                      </div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  </div>

                  {/* CONTENT */}
                  <div className="space-y-4">
                    {/* BODY */}
                    {card.body?.text && (
                      <div>
                        <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
                          {card.body.text}
                        </p>
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="space-y-2 mt-2">
                      {/* URL CTA */}
                      {isUrlButton && (
                        <Button className="bg-transparent w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-sky-600 transition cursor-pointer hover:bg-transparent">
                          <ExternalLink className="size-4" />

                          <span className="truncate">
                            {isUrlButton.parameters?.display_text}
                          </span>
                        </Button>
                      )}

                      {/* QUICK REPLIES */}
                      {!isUrlButton &&
                        "buttons" in card.action &&
                        card.action.buttons.map((btn) => {
                          const btnData =
                            btn.type === "quick_reply" ? btn.quick_reply : null;

                          return (
                            <button
                              key={btnData?.id}
                              className="bg-transparent w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-sky-600 transition cursor-pointer hover:bg-transparent"
                            >
                              <div className="size-7 rounded-full bg-white border flex items-center justify-center shrink-0">
                                <Reply className="size-3.5" />
                              </div>

                              <span className="truncate">{btnData?.title}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INDICATORS */}
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all rounded-full ${
                  index === i
                    ? "w-5 h-2 bg-slate-800"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveCarouselMessage;

// import { Button } from "@/components/ui/button";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ExternalLink,
//   Image,
//   Reply,
// } from "lucide-react";
// import { useState } from "react";
// import type { TMessage } from "../../types/message.type";

// type TCarouselMessageProps = {
//   message: TMessage;
// };

// const CARD_WIDTH = 260;
// const GAP = 12;

// const InteractiveCarouselMessage = ({ message }: TCarouselMessageProps) => {
//   const msg =
//     message?.type === "interactive" && message?.interactive?.type === "carousel"
//       ? message?.interactive
//       : null;

//   const cards = msg?.action.cards || [];

//   const [index, setIndex] = useState(0);

//   const maxIndex = Math.max(0, cards.length - 1);

//   const handlePrev = () => {
//     setIndex((prev) => Math.max(prev - 1, 0));
//   };

//   const handleNext = () => {
//     setIndex((prev) => Math.min(prev + 1, maxIndex));
//   };

//   return (
//     <div>
//       {/* BODY */}
//       {msg?.body?.text && (
//         <div className="text-sm leading-relaxed break-words">
//           {msg.body.text}
//         </div>
//       )}

//       {/* CAROUSEL */}
//       <div className="relative">
//         {/* LEFT */}
//         <button
//           onClick={handlePrev}
//           disabled={index === 0}
//           className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 size-7 rounded-full bg-white border shadow flex items-center justify-center ${
//             index === 0 ? "opacity-40 cursor-not-allowed" : ""
//           }`}
//         >
//           <ChevronLeft size={16} />
//         </button>

//         {/* RIGHT */}
//         <button
//           onClick={handleNext}
//           disabled={index === maxIndex}
//           className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 size-7 rounded-full bg-white border shadow flex items-center justify-center ${
//             index === maxIndex ? "opacity-40 cursor-not-allowed" : ""
//           }`}
//         >
//           <ChevronRight size={16} />
//         </button>

//         {/* VIEWPORT */}
//         <div className="overflow-hidden">
//           <div
//             className="flex transition-transform duration-300 ease-out gap-3"
//             style={{
//               transform: `translateX(-${(CARD_WIDTH + GAP) * index}px)`,
//             }}
//           >
//             {cards.map((card, i) => {
//               const header =
//                 card.header?.type === "image"
//                   ? card.header?.image?.link
//                   : card.header?.video?.link;

//               const isUrlButton =
//                 card.action && "parameters" in card.action ? card.action : null;

//               return (
//                 <div
//                   key={i}
//                   className="min-w-[260px] bg-white rounded-2xl border overflow-hidden shadow-sm"
//                 >
//                   {/* MEDIA */}
//                   {header ? (
//                     card.header?.type === "image" ? (
//                       <img src={header} className="w-full h-40 object-cover" />
//                     ) : (
//                       <video
//                         src={header}
//                         controls
//                         className="w-full h-40 object-cover"
//                       />
//                     )
//                   ) : (
//                     <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400">
//                       <Image size={48} />
//                     </div>
//                   )}

//                   {/* CONTENT */}
//                   <div className="p-3 space-y-3">
//                     {/* BODY */}
//                     {card.body?.text && (
//                       <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
//                         {card.body.text}
//                       </p>
//                     )}

//                     {/* ACTIONS */}
//                     <div className="space-y-2">
//                       {/* URL BUTTON */}
//                       {isUrlButton && (
//                         <Button
//                           variant="outline"
//                           className="w-full justify-center"
//                         >
//                           <ExternalLink className="size-4" />

//                           {isUrlButton.parameters?.display_text}
//                         </Button>
//                       )}

//                       {/* QUICK REPLIES */}
//                       {!isUrlButton &&
//                         "buttons" in card.action &&
//                         card.action.buttons.map((btn) => {
//                           const btnData =
//                             btn.type === "quick_reply" ? btn.quick_reply : null;

//                           return (
//                             <Button
//                               key={btnData?.id}
//                               variant="outline"
//                               className="w-full justify-start"
//                             >
//                               <Reply className="size-4" />

//                               {btnData?.title}
//                             </Button>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InteractiveCarouselMessage;
