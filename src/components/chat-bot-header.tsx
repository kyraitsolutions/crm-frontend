import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ArrowRight, MessageCircle, Table } from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
  matchPath,
} from "react-router-dom";
import { ChatBotEvents, emitter } from "@/events";

const UrlForHeaderChatBot = {
  INDEX_CHAT_BOT: "/chat-bot",
  NEW_CHAT_BOT: "/chat-bot/new",
  CHAT_BOT_EDIT: "/chat-bot/:chatBotId/edit",
  USERS_CHAT_BOT: "/chat-bot/:chatBotId/users",
  USER_RESPONSE: "/chat-bot/:chatBotId/users/:chatBotUserId/response",
};

export function ChatBotHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Chat Bot</h1>
        <div className="ml-auto flex items-center gap-2">
          <RightHeader />
        </div>
      </div>
    </header>
  );
}

const RightHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams<{ chatBotId: string; chatBotUserId: string }>();

  const isMatch = (pattern: string) =>
    !!matchPath({ path: pattern, end: true, caseSensitive: true }, pathname);

  // Default: Chat Bot Index Page
  if (isMatch(UrlForHeaderChatBot.INDEX_CHAT_BOT)) {
    return (
      <Button variant="default" onClick={() => navigate("/chat-bot/new")}>
        Create Your First Chat Bot
        <ArrowRight />
      </Button>
    );
  }

  // New Chat Bot Page
  if (isMatch(UrlForHeaderChatBot.NEW_CHAT_BOT)) {
    return (
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => navigate("/chat-bot")}>
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={() => emitter.emit(ChatBotEvents.CHATBOT_CREATE)}
        >
          Create
        </Button>
      </div>
    );
  }

  // Edit Chat Bot Page
  if (isMatch(UrlForHeaderChatBot.CHAT_BOT_EDIT) && params.chatBotId) {
    return (
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => navigate("/chat-bot")}>
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={() => emitter.emit(ChatBotEvents.CHATBOT_UPDATE)}
        >
          Save
        </Button>
      </div>
    );
  }

  // Users of Chat Bot Page
  if (isMatch(UrlForHeaderChatBot.USERS_CHAT_BOT) && params.chatBotId) {
    return (
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={() => navigate(`/chat-bot/${params.chatBotId}/edit`)}
        >
          Edit Chat Bot
        </Button>
      </div>
    );
  }

  // Individual User Response Page
  if (
    isMatch(UrlForHeaderChatBot.USER_RESPONSE) &&
    params.chatBotId &&
    params.chatBotUserId
  ) {
    return (
      <div className="flex gap-2">
        <Button
          variant="default"
          size="icon"
          className=""
          onClick={() => navigate(`/chat-bot/${params.chatBotId}/users`)}
        >
          <Table />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() =>
            console.log(`Save Response for User ${params.chatBotUserId}`)
          }
        >
          <MessageCircle />
        </Button>
      </div>
    );
  }

  // Default fallback
  return null;
};
