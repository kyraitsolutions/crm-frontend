import { ChatBotBuilder } from "@/components/chat-bot-builder";

const ChatBotNew = () => {
  return <div className="mx-24 py-5 h-[calc(100vh-64px)] hide-scrollbar">
    {/* <div className="mx-24 py-10 overflow-y-scroll h-[calc(100vh-64px)] hide-scrollbar"> */}
    <ChatBotBuilder />
  </div>
};

export { ChatBotNew };
