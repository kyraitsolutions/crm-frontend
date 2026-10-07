import ButtonNode from "./ButtonNode";
import CarouselNode from "./CarouselNode";
import ListNode from "./ListNode";
import QuestionNode from "./QuestionNode";
import SendMessageNode from "./SendMessageNode";
import FlowActionNode from "./FlowActionNode";
import TemplateNode from "./TemplateNode";

const actionNode = FlowActionNode;

export const nodeTypes = {
  // chat: ChatNode,
  send_message: SendMessageNode,
  button: ButtonNode,
  list: ListNode,
  carousel: CarouselNode,
  question: QuestionNode,
  template: TemplateNode,
  keyword: actionNode,
  condition: actionNode,
  set_attribute: actionNode,
  add_tag: actionNode,
  remove_tag: actionNode,
  delay: actionNode,
  goto: actionNode,
  end: actionNode,
  api_request: actionNode,
  handoff: actionNode,
  ask_address: actionNode,
  ask_location: actionNode,
  ask_media: actionNode,
  connect_flow: actionNode,
};
