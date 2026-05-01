import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, MousePointerClick, Type } from "lucide-react";
import { Handle, Position } from "reactflow";
import type { TAppNodeData, THeader } from "../types/types";
import NodeHeader from "./NodeHeader";
import { getDocumentMeta } from "../utils/getDocumentMeta";

type TButtonNodeProps = {
  id: string;
  data: TAppNodeData;
};

const ButtonNode = ({ data }: TButtonNodeProps) => {
  const { payload } = data?.type === "button" ? data : {};

  const header = payload?.interactive?.header;
  const bodyText = payload?.interactive?.body?.text;
  const footerText = payload?.interactive?.footer?.text;
  const buttons =
    payload?.interactive?.action && "buttons" in payload.interactive.action
      ? payload.interactive.action.buttons
      : [];

  const ctaUrlButton =
    payload?.interactive?.action && "parameters" in payload.interactive.action
      ? payload.interactive.action.parameters
      : null;

  console.log(buttons);

  const renderHeader = (header: THeader) => {
    if (!header) return null;
    const { type, text, image, video, document } = header;

    const doc = type === "document" && getDocumentMeta(document?.link || "");
    const Icon = doc && doc.icon;

    return (
      <div className="w-full">
        {type === "text" && text && (
          <div className="flex items-center gap-2 text-gray-600 break-all">
            <Type size={14} />
            <span>{text}</span>
          </div>
        )}

        {type === "image" && (
          <div className="flex items-center gap-2 text-gray-600 w-full">
            <img src={image?.link} className="object-cover w-full h-40" />
          </div>
        )}

        {type === "video" && (
          <div className="flex items-center gap-2 text-gray-600 w-full">
            <video
              controls
              src={video?.link}
              className="object-cover w-full h-40"
            />
          </div>
        )}

        {type === "document" && doc && (
          <div
            style={{
              backgroundColor: doc?.badgeBg,
            }}
            className={` h-40 rounded-xl flex flex-col items-center justify-center gap-3`}
          >
            <div
              style={{
                backgroundColor: doc?.badgeBg,
                color: doc?.badgeText,
              }}
              className={` size-16 rounded-2xl flex items-center justify-center`}
            >
              {Icon && <Icon />}
            </div>

            <div className="text-center space-y-1 px-4">
              <p className={`text-sm font-medium`}>{doc.label}</p>

              <p className="text-xs truncate max-w-[220px]">
                {decodeURIComponent(document?.link?.split("/").pop() || "")}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      // className="group relative w-[260px] bg-card rounded-none shadow-node antialiased overflow-visible"
      style={{ fontFeatureSettings: '"tnum"' }}
      className="w-90 bg-white rounded-xl shadow-lg border overflow-hidden will-change-transform"
    >
      {/* HEADER */}
      <NodeHeader
        title="Button"
        className="bg-orange-400"
        icon={<MousePointerClick />}
      />

      {/* CONTENT */}
      <div className="p-3 space-y-5 text-sm">
        {/* HEADER */}
        {header && renderHeader(header)}

        {/* BODY */}
        <p className="text-gray-800">{bodyText}</p>

        {/* FOOTER */}
        {footerText && <p className="text-xs text-gray-400">{footerText}</p>}

        {/* BUTTONS */}
        <div className="space-y-2 flex flex-col">
          {buttons?.length > 0 &&
            buttons?.map((btn) => {
              const btnData = btn.type === "reply" ? btn.reply : null;
              return (
                <div key={btnData?.id} className="relative flex items-center">
                  {/* BUTTON UI */}
                  <Button className="w-full actions-btn text-center">
                    {btnData?.title}
                  </Button>

                  {/* HANDLE (NOW CORRECTLY POSITIONED PER BUTTON) */}
                  <Handle
                    id={btnData?.id}
                    type="source"
                    position={Position.Right}
                    className="bg-orange-500! size-3! right-2!"
                  />
                </div>
              );
            })}

          {ctaUrlButton && (
            <Button className="w-full actions-btn text-center">
              <ExternalLink /> {ctaUrlButton?.display_text}
            </Button>
          )}
        </div>
      </div>

      {/* HANDLES */}
      <Handle
        className="bg-slate-600! size-3!"
        type="target"
        position={Position.Left}
      />

      {!buttons?.length && (
        <Handle
          type="source"
          position={Position.Right}
          className="bg-orange-500! size-3! right-0!"
        />
      )}
    </motion.div>
  );
};

export default ButtonNode;
