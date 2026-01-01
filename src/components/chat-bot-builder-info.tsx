import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lightbulb } from "lucide-react";

const BuilderBadgesMap = {
  ready: "Launch-ready",
  draft: "In review",
  idea: "Draft",
};

export default function ChatBotBuilderInfo() {
  return (
    <div className="flex flex-col gap-4 border-b border-transparent bg-[#FBFAF9] px-6 py-4 rounded-lg">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-[#37322F]">
            Create your first chatbot
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-[#847971]">
          Define how your assistant looks, feels, and answers. Everything is
          captured in structured steps so you can iterate quickly.
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(BuilderBadgesMap).map(([tone, label]) => (
          <Badge
            key={label}
            variant="secondary"
            className="gap-1 px-2 py-1 bg-[#F7F6F4] text-[#37322F] rounded-md"
          >
            {tone === "ready" && <CheckCircle2 className="h-3 w-3 text-green-600" />}
            {tone === "draft" && <Circle className="h-3 w-3 text-muted-foreground" />}
            {tone === "idea" && <Lightbulb className="h-3 w-3 text-amber-600" />}
            {label}
          </Badge>
        ))}
      </div>
    </div>

  );
}
