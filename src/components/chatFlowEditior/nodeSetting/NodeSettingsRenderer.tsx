import React from "react";
import type { TAppNode } from "../types/types";
import ButtonNodeSetting from "./ButtonNodeSetting";
import ListNodeSetting from "./ListNodeSetting";
import CarouselNodeSetting from "./CarouselNodeSetting";
// import ButtonClose from "@/components/ui/Buttons/ButtonClose";

type TNodeSettingsRendererProps = {
  node: TAppNode;
  open: boolean;
  onClose?: () => void;
};

const nodeSettingsRegistry: Record<string, React.FC<any>> = {
  button: ButtonNodeSetting,
  list: ListNodeSetting,
  carousel: CarouselNodeSetting,
};

const NodeSettingsRenderer = ({
  node,
  open,
  onClose,
}: TNodeSettingsRendererProps) => {
  const Component = nodeSettingsRegistry[node?.type ?? ""];

  if (!Component) {
    return null;
  }

  return (
    <div
      className={`fixed max-w-125 w-full right-0 top-0 h-full bg-gray-100 border-l border-gray-100   backdrop-blur-xl overflow-hidden ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} duration-300 z-100`}
    >
      {/* <div className="flex justify-end p-3">
        <ButtonClose onClose={() => onClose && onClose()} />
      </div> */}

      <Component data={node?.data} id={node?.id} onClose={onClose} />
    </div>
  );
};

export default NodeSettingsRenderer;
