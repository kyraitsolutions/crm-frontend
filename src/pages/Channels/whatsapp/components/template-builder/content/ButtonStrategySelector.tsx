import { cn } from "@/lib/utils";
import { useTemplateStore } from "../../../store/template-builder.store";
import { Button } from "@/components/ui/button";

const BUTTON_STRATEGIES = [
  "No Buttons",
  "Quick Replies",
  "Call To Action",
  "Mixed Actions",
] as const;

export const ButtonStrategySelector = () => {
  const { buttonStrategy, setButtonStrategy } = useTemplateStore();

  return (
    <div className="space-y-2 p-2">
      <div>
        <h4 className="text-sm font-medium">Button Type</h4>

        <p className="text-xs text-muted-foreground">
          Choose how users can interact with this template.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {BUTTON_STRATEGIES.map((strategy) => (
          <Button
            key={strategy}
            type="button"
            onClick={() => setButtonStrategy(strategy)}
            className={cn(
              "border px-3 py-1.5! text-xs font-medium transition-all rounded-xl",
              buttonStrategy === strategy
                ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                : "border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-700 bg-transparent!",
            )}
          >
            {strategy}
          </Button>
        ))}
      </div>
    </div>
  );
};
