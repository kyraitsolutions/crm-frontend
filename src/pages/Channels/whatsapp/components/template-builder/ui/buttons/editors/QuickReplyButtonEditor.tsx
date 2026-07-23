import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ButtonCard } from "../ButtonCard";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

interface IQuickReplyButtonProps {
  button: TemplateButton;
}

export function QuickReplyButtonEditor({ button }: IQuickReplyButtonProps) {
  const { updateButton, removeButton } = useTemplateStore((state) => state);

  return (
    <ButtonCard onDelete={() => removeButton(button.id)}>
      <div className="grid grid-cols-2 gap-4">
        {/* Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Type</label>

          <Select value="CUSTOM" onValueChange={() => {}}>
            <SelectTrigger className="input-field w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="CUSTOM">Custom</SelectItem>

              <SelectItem value="PRE_CONFIGURED">
                Pre-configured response
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Button Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Button text
          </label>

          <div className="relative">
            <Input
              value={button.label}
              maxLength={40}
              placeholder="Quick Reply"
              className="input-field pr-14"
              onChange={(e) =>
                updateButton(button.id, {
                  label: e.target.value,
                })
              }
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {button.label.length}/40
            </span>
          </div>

          {button.errors?.label && (
            <p className="text-xs text-destructive">{button.errors.label}</p>
          )}
        </div>
      </div>
    </ButtonCard>
  );
}
// import { Input } from "@/components/ui/input";
// import { ButtonCard } from "../ButtonCard";
// import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";
// import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";

// interface Props {
//   button: TemplateButton;
// }

// export function QuickReplyButtonEditor({ button }: Props) {
//   const { updateButton, removeButton } = useTemplateStore((state) => state);

//   return (
//     <ButtonCard onDelete={() => removeButton(button.id)}>
//       <div className="space-y-4">
//         {/* Action */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium">Type of action</label>

//           <Input value="Quick Reply" disabled />
//         </div>

//         {/* Button Text */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium">Button text</label>

//           <Input
//             maxLength={25}
//             value={button.label}
//             placeholder="Enter button text"
//             onChange={(e) =>
//               updateButton(button.id, {
//                 label: e.target.value,
//               })
//             }
//           />

//           <div className="flex justify-end">
//             <span className="text-xs text-muted-foreground">
//               {button.label.length}/25
//             </span>
//           </div>

//           {button.errors?.label && (
//             <p className="text-xs text-destructive">{button.errors.label}</p>
//           )}
//         </div>
//       </div>
//     </ButtonCard>
//   );
// }
