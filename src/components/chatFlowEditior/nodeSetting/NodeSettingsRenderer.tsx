import React from "react";
import type { TAppNode } from "../types/types";
import ButtonNodeSetting from "./ButtonNodeSetting";
import ListNodeSetting from "./ListNodeSetting";
import CarouselNodeSetting from "./CarouselNodeSetting";
import FlowActionNodeSetting from "./FlowActionNodeSetting";
import TemplateNodeSetting from "./TemplateNodeSetting";
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
  template: TemplateNodeSetting,
  keyword: FlowActionNodeSetting,
  condition: FlowActionNodeSetting,
  set_attribute: FlowActionNodeSetting,
  add_tag: FlowActionNodeSetting,
  remove_tag: FlowActionNodeSetting,
  delay: FlowActionNodeSetting,
  goto: FlowActionNodeSetting,
  end: FlowActionNodeSetting,
  api_request: FlowActionNodeSetting,
  handoff: FlowActionNodeSetting,
  ask_address: FlowActionNodeSetting,
  ask_location: FlowActionNodeSetting,
  ask_media: FlowActionNodeSetting,
  connect_flow: FlowActionNodeSetting,
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
      className={`fixed top-0 right-0 z-80 h-full w-full max-w-125 overflow-hidden border-l border-white/10 bg-slate-900 backdrop-blur-xl duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      {/* <div className="flex justify-end p-3">
        <ButtonClose onClose={() => onClose && onClose()} />
      </div> */}

      <Component key={node?.id} data={node?.data} id={node?.id} onClose={onClose} />
    </div>
  );
};

export default NodeSettingsRenderer;
