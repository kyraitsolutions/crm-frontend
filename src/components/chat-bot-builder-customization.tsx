
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert } from "./ui/alert";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Info, Lightbulb, Plus, X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ChatBotFormData } from "@/types";

export default function ChatBotBuilderCustomization() {
  const { setValue, control } = useFormContext<ChatBotFormData>();

  const conversation = useWatch({
    name: "conversation",
    control: control,
  });

  const suggestions = useWatch({
    name: "suggestions",
    control: control,
  });

  const addQuestion = () => {
    setValue("suggestions", [...(suggestions || []), ""]);
  };

  const removeQuestion = (index: number) => {
    const updatedSuggestions = [...(suggestions || [])];
    updatedSuggestions.splice(index, 1);
    setValue("suggestions", updatedSuggestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedSuggestions = [...(suggestions || [])];
    updatedSuggestions[index] = value;
    setValue("suggestions", updatedSuggestions);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2 py-6 px-2">
      {/* ───────── Conversation Settings ───────── */}
      <div className="space-y-6 bg-transparent">
        <h2 className="text-lg font-medium text-[#37322F]">Conversation Settings</h2>
        <p className="text-sm text-[#847971]">
          Configure how your chatbot interacts with users
        </p>

        {/* Welcome message */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg py-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-[#37322F]">Welcome message</Label>
              <p className="text-xs text-[#847971]">Show when the widget opens</p>
            </div>
            <Switch
              checked={conversation?.showWelcomeMessage}
              onCheckedChange={(value) => {
                setValue("conversation.showWelcomeMessage", value);
              }}
            />
          </div>

          {conversation?.showWelcomeMessage && (
            <div className="space-y-2">
              <Label htmlFor="welcome-message" className="text-sm font-medium text-[#37322F]">
                Message content
              </Label>
              <Textarea
                id="welcome-message"
                rows={3}
                value={conversation?.welcomeMessage}
                onChange={(event) =>
                  setValue("conversation.welcomeMessage", event.target.value)
                }
                placeholder="Hello! How can I help you today?"
                className="resize-none bg-[#F7F6F4] rounded-lg border-none text-[#37322F] placeholder:text-[#847971] focus-visible:ring-0 p-2"
              />
            </div>
          )}
        </div>

        {/* Suggested questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-[#37322F]">Suggested questions</Label>
              <p className="text-xs text-[#847971]">Help users get started</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              disabled={Array.isArray(suggestions) && suggestions.length >= 5}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {suggestions?.map((question, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={question}
                  onChange={(event) =>
                    handleQuestionChange(index, event.target.value)
                  }
                  placeholder={`Suggested question ${index + 1}`}
                  className="h-9 bg-[#F7F6F4] rounded-lg border-none text-[#37322F] placeholder:text-[#847971] focus-visible:ring-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                  disabled={suggestions.length <= 1}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── Advanced Settings ───────── */}
      <div className="space-y-6 bg-transparent">
        <h2 className="text-lg font-medium text-[#37322F]">Advanced Settings</h2>
        <p className="text-sm text-[#847971]">Fine-tune chatbot behavior and fallback options</p>

        {/* Email capture */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg py-4 ">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-[#37322F]">Email capture</Label>
              <p className="text-xs text-[#847971]">Ask for email when needed</p>
            </div>
            <Switch
              checked={conversation?.emailCapture}
              onCheckedChange={(value) =>
                setValue("conversation.emailCapture", value)
              }
            />
          </div>

          {conversation?.emailCapture && (
            <Alert className="bg-blue-50 border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-1" />
              <div className="text-sm">
                <p className="font-medium text-blue-700">Email capture enabled</p>
                <p className="text-blue-600">
                  The chatbot will ask for email when it detects high-intent questions.
                </p>
              </div>
            </Alert>
          )}
        </div>

        {/* Fallback response */}
        <div className="space-y-2">
          <Label htmlFor="fallback-message" className="text-sm font-medium text-[#37322F]">
            Fallback response
          </Label>
          <Textarea
            id="fallback-message"
            rows={4}
            value={conversation?.fallbackResponse}
            onChange={(event) =>
              setValue("conversation.fallbackResponse", event.target.value)
            }
            placeholder="I'm not sure about that. Could you please rephrase your question?"
            className="resize-none bg-[#F7F6F4] rounded-lg border-none text-[#37322F] placeholder:text-[#847971] focus-visible:ring-0 p-2"
          />
          <p className="text-xs text-[#847971]">
            This message shows when the chatbot doesn't understand the question.
          </p>
        </div>

        {/* Best practice */}
        <Alert className="bg-amber-50 border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600 mt-1" />
          <div className="text-sm">
            <p className="font-medium text-amber-700">Best practice</p>
            <p className="text-amber-600">
              Include your brand voice and next steps so users feel supported even when the bot is unsure.
            </p>
          </div>
        </Alert>
      </div>
    </section>

  );
}
