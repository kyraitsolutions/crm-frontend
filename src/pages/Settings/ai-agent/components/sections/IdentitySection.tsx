import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import StudioSection, { fieldLabel } from "../layout/StudioSection";

const IdentitySection = () => {
  const config = useAiAgentStudioStore((state) => state.config);
  const patchConfig = useAiAgentStudioStore((state) => state.patchConfig);
  const identity = config.identity;

  return (
    <StudioSection
      title="Business profile"
      description="How the agent introduces the business in conversation."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className={fieldLabel}>Agent / business name</p>
          <Input
            className="input-field mt-1.5"
            value={identity.name}
            onChange={(e) => patchConfig({ identity: { ...identity, name: e.target.value } })}
          />
        </div>
        <div>
          <p className={fieldLabel}>Industry</p>
          <Input
            className="input-field mt-1.5"
            placeholder="Hotel, real estate, restaurant..."
            value={identity.industry}
            onChange={(e) =>
              patchConfig({ identity: { ...identity, industry: e.target.value } })
            }
          />
        </div>
        <div>
          <p className={fieldLabel}>Website</p>
          <Input
            className="input-field mt-1.5"
            value={identity.website}
            onChange={(e) =>
              patchConfig({ identity: { ...identity, website: e.target.value } })
            }
          />
        </div>
        <div>
          <p className={fieldLabel}>Timezone</p>
          <Input
            className="input-field mt-1.5"
            value={identity.timezone}
            onChange={(e) =>
              patchConfig({ identity: { ...identity, timezone: e.target.value } })
            }
          />
        </div>
      </div>
      <div className="mt-5">
        <p className={fieldLabel}>Greeting</p>
        <Input
          className="input-field mt-1.5"
          placeholder="Hi, thanks for messaging us..."
          value={identity.greeting}
          onChange={(e) =>
            patchConfig({ identity: { ...identity, greeting: e.target.value } })
          }
        />
      </div>
      <div className="mt-5">
        <p className={fieldLabel}>Description</p>
        <Textarea
          className="input-field mt-1.5 resize-none"
          rows={4}
          value={identity.description}
          onChange={(e) =>
            patchConfig({ identity: { ...identity, description: e.target.value } })
          }
        />
      </div>
    </StudioSection>
  );
};

export default IdentitySection;
