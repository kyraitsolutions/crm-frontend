import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuilderStore } from "@/stores";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BuilderStoreManager } from "@/stores";

export function BuilderHeader() {
  const navigate = useNavigate();
  const builderStoreManager = new BuilderStoreManager();
  const formConfig = useBuilderStore((state) => state.survey_form_config);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(formConfig?.title ?? "Builder");

  const handleSave = () => {
    builderStoreManager.setFormInfo({
      title: draftTitle,
    });
    setIsEditing(false);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Title + Edit */}
        <div className="flex items-center gap-2 max-w-[250px]">
          {isEditing ? (
            <Input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="h-7 text-sm"
            />
          ) : (
            <div className="flex items-center gap-1">
              <h1 className="truncate text-base font-medium max-w-[200px]">
                {formConfig?.title ?? "Builder"}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
