import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
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

  console.log("Conversation:", conversation);

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
    <section className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Conversation Settings</CardTitle>
          <CardDescription>
            Configure how your chatbot interacts with users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Welcome message</Label>
                <p className="text-xs text-muted-foreground">
                  Show when the widget opens
                </p>
              </div>
              <Switch
                checked={conversation?.showWelcomeMessage}
                onCheckedChange={(value) => {
                  setValue("conversation.showWelcomeMessage", value);
                }}
              />
            </div>

            {conversation?.showWelcomeMessage && (
              <div className="space-y-3">
                <Label
                  htmlFor="welcome-message"
                  className="text-sm font-medium"
                >
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
                  className="resize-none"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Suggested questions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Help users get started
                </p>
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

            <div className="space-y-3">
              {suggestions?.map((question, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={question}
                    onChange={(event) =>
                      handleQuestionChange(index, event.target.value)
                    }
                    placeholder={`Suggested question ${index + 1}`}
                    className="h-9"
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
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Advanced Settings</CardTitle>
          <CardDescription>
            Fine-tune chatbot behavior and fallback options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email capture</Label>
                <p className="text-xs text-muted-foreground">
                  Ask for email when needed
                </p>
              </div>
              <Switch
                checked={conversation?.emailCapture}
                onCheckedChange={(value) =>
                  setValue("conversation.emailCapture", value)
                }
              />
            </div>

            {conversation?.emailCapture && (
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>Email capture enabled</AlertTitle>
                <AlertDescription>
                  The chatbot will ask for email when it detects high-intent
                  questions.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="fallback-message" className="text-sm font-medium">
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
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This message shows when the chatbot doesn't understand the
              question.
            </p>
          </div>

          <Alert className="bg-amber-50 border-amber-200">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <AlertTitle>Best practice</AlertTitle>
            <AlertDescription>
              Include your brand voice and next steps so users feel supported
              even when the bot is unsure.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </section>
  );
}
