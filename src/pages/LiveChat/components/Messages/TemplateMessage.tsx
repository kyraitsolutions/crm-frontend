import { Link2 } from "lucide-react";
import type { TMessage } from "../../types/message.type";

type TemplateComponent = {
  type: string;
  text?: string;
  format?: string;
  buttons?: Array<{
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }>;
};

type TemplateMessageProps = {
  message: TMessage;
};

const TemplateMessage = ({ message }: TemplateMessageProps) => {
  if (message.type !== "template" || !message.template) {
    return null;
  }

  const components = (message.template.components as TemplateComponent[]) ?? [];

  const header = components.find((c) => c.type.toUpperCase() === "HEADER");
  const body = components.find((c) => c.type.toUpperCase() === "BODY");
  const footer = components.find((c) => c.type.toUpperCase() === "FOOTER");
  const buttons = components.find((c) => c.type.toUpperCase() === "BUTTONS");

  return (
    <div className="bg-whatsapp-background rounded-xl p-1.5 rounded-xl">
      <div className="overflow-hidden bg-white rounded-xl">
        {/* HEADER */}
        {header?.text && (
          <div className="px-4 pt-3.5 pb-1">
            <p className="font-semibold text-[15px] text-gray-900 leading-snug">
              {header.text}
            </p>
          </div>
        )}

        {/* BODY */}
        {body?.text && (
          <div className={`px-4 ${header?.text ? "pt-1" : "pt-3.5"} pb-2`}>
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-gray-700">
              {body.text}
            </p>
          </div>
        )}

        {/* FOOTER */}
        {footer?.text && (
          <div className="px-4 pb-3">
            <p className="text-[12px] text-gray-400">{footer.text}</p>
          </div>
        )}

        {/* BUTTONS */}
        {buttons?.buttons && buttons.buttons.length > 0 && (
          <div className="border-t border-gray-100">
            {buttons.buttons.map((button, index) => {
              const isLink = button.type?.toUpperCase() === "URL";
              return (
                <button
                  key={`${button.text}-${index}`}
                  type="button"
                  className="w-full border-b last:border-b-0 border-gray-100 px-3 py-2.5 text-[14px] font-medium text-blue-600 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  {isLink && <Link2 className="w-3.5 h-3.5" />}
                  {button.text}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateMessage;

// import type { TMessage } from "../../types/message.type";

// type TemplateComponent = {
//   type: string;
//   text?: string;
//   format?: string;
//   buttons?: Array<{
//     type: string;
//     text: string;
//     url?: string;
//     phone_number?: string;
//   }>;
// };

// type TemplateMessageProps = {
//   message: TMessage;
// };

// const TemplateMessage = ({ message }: TemplateMessageProps) => {
//   if (message.type !== "template" || !message.template) {
//     return null;
//   }

//   const components = (message.template.components as TemplateComponent[]) ?? [];

//   const header = components.find(
//     (component) => component.type.toUpperCase() === "HEADER",
//   );

//   const body = components.find(
//     (component) => component.type.toUpperCase() === "BODY",
//   );

//   const footer = components.find(
//     (component) => component.type.toUpperCase() === "FOOTER",
//   );

//   const buttons = components.find(
//     (component) => component.type.toUpperCase() === "BUTTONS",
//   );

//   return (
//     <div className="bg-white text-sm overflow-hidden">
//       {/* HEADER */}
//       {header?.text && (
//         <div className="px-3 pt-3 pb-2">
//           <p className="font-semibold text-sm">{header.text}</p>
//         </div>
//       )}

//       {/* BODY */}
//       {body?.text && (
//         <div className="px-3 py-2">
//           <p className="text-sm leading-relaxed whitespace-pre-wrap">
//             {body.text}
//           </p>
//         </div>
//       )}

//       {/* FOOTER */}
//       {footer?.text && (
//         <div className="px-3 pt-1 pb-2">
//           <p className="text-[11px] opacity-60">{footer.text}</p>
//         </div>
//       )}

//       {/* BUTTONS */}
//       {buttons?.buttons && buttons.buttons.length > 0 && (
//         <div className="border-t border-black/10">
//           {buttons.buttons.map((button, index) => (
//             <button
//               key={`${button.text}-${index}`}
//               type="button"
//               className="w-full border-b last:border-b-0 border-black/10 px-3 py-2.5 text-sm font-medium text-primary hover:bg-black/5 transition"
//             >
//               {button.text}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateMessage;
