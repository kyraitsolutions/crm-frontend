import { Loader2, Workflow } from "lucide-react";

const FlowEditorLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border bg-card shadow-sm p-10">
        <div className="flex flex-col items-center text-center">
          {/* ICON */}
          <div className="relative flex items-center justify-center">
            <div className="absolute size-20 rounded-full bg-primary/10 animate-ping" />

            <div className="relative flex items-center justify-center size-20 rounded-2xl bg-primary/10">
              <Workflow className="size-10 text-primary" />
            </div>
          </div>

          {/* TITLE */}
          <h2 className="mt-6 text-2xl font-semibold tracking-tight">
            Loading Flow Builder
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-sm">
            Preparing your chatbot flow and syncing the latest conversation
            graph configuration.
          </p>

          {/* LOADER */}
          <div className="flex items-center gap-2 mt-6 text-primary">
            <Loader2 className="size-4 animate-spin" />

            <span className="text-sm font-medium">Please wait...</span>
          </div>

          {/* SKELETON INFO */}
          <div className="w-full mt-8 space-y-3">
            <div className="h-3 rounded-full bg-muted animate-pulse" />

            <div className="h-3 w-5/6 mx-auto rounded-full bg-muted animate-pulse" />

            <div className="h-3 w-4/6 mx-auto rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditorLoading;
