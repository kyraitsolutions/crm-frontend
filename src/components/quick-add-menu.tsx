import {
  Bot,
  FileInput,
  MessageSquare,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CHATBOT_PATHS, LEAD_FORM_PATHS } from "@/constants/routes";
import { LEADS_PATHS } from "@/constants/routes/leads.path";
import { LIVE_CHAT_PATHS } from "@/constants/routes/livechat.path";
import { useAuthStore } from "@/stores";
import { useContactStore } from "@/pages/Contact/store/contact.store";
import { Whatsapp } from "@/icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuickAddMenu() {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const setContactOpen = useContactStore((state) => state.setOpen);

  const id = String(accountId || "");
  const disabled = !id || id === "undefined";

  const go = (path: string) => {
    if (disabled) return;
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          title="Quick add"
          disabled={disabled}
          className="p-1.5 flex items-center justify-center bg-second hover:bg-second/90 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Quick add
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => go(LEADS_PATHS.getCreate(id))}
            className="cursor-pointer"
          >
            <UserPlus />
            <div className="flex flex-col">
              <span>Lead</span>
              <span className="text-xs text-muted-foreground">
                Add a contact to your pipeline
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (disabled) return;
              setContactOpen(true);
            }}
            className="cursor-pointer"
          >
            <Users />
            <div className="flex flex-col">
              <span>Contact</span>
              <span className="text-xs text-muted-foreground">
                Save a person to your address book
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Conversations
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => go(LIVE_CHAT_PATHS.getInbox(id, "whatsapp"))}
            className="cursor-pointer"
          >
            <Whatsapp h="16px" w="16px" />
            <div className="flex flex-col">
              <span>WhatsApp chat</span>
              <span className="text-xs text-muted-foreground">
                Open WhatsApp conversations
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => go(LIVE_CHAT_PATHS.getInbox(id, "chatbot"))}
            className="cursor-pointer"
          >
            <MessageSquare />
            <div className="flex flex-col">
              <span>Chatbot conversation</span>
              <span className="text-xs text-muted-foreground">
                Open chatbot inbox
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Build
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => go(CHATBOT_PATHS.getCreate(id))}
            className="cursor-pointer"
          >
            <Bot />
            <div className="flex flex-col">
              <span>Chatbot flow</span>
              <span className="text-xs text-muted-foreground">
                Create a new chatbot
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => go(LEAD_FORM_PATHS.getCreate(id))}
            className="cursor-pointer"
          >
            <FileInput />
            <div className="flex flex-col">
              <span>Lead form</span>
              <span className="text-xs text-muted-foreground">
                Capture leads from your website
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
