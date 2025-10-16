import { CardDescription, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex-col gap-4 border-b bg-muted/40 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create your first chatbot
          </CardTitle>
        </div>
        <CardDescription className="text-xs leading-relaxed text-muted-foreground">
          Define how your assistant looks, feels, and answers. Everything is
          captured in structured steps so you can iterate quickly.
        </CardDescription>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(BuilderBadgesMap).map(([tone, label]) => (
          <Badge key={label} variant="secondary" className="gap-1 px-2 py-1">
            {tone === "ready" && <CheckCircle2 className="h-3 w-3" />}
            {tone === "draft" && <Circle className="h-3 w-3" />}
            {tone === "idea" && <Lightbulb className="h-3 w-3" />}
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
