import Loader from "@/components/Loader";

interface PlanUpgradeOverlayProps {
  title: string;
  description: string;
}

export function PlanUpgradeOverlay({ title, description }: PlanUpgradeOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-white font-bold">
          K
        </div>
        <Loader color="#1e2225" size={40} className="border-4 mx-auto" />
        <h2 className="mt-5 text-lg font-semibold text-slate-800">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <p className="mt-4 text-xs text-amber-700">
          Please keep this page open until your plan is updated.
        </p>
      </div>
    </div>
  );
}
