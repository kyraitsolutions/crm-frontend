import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onContinue: () => void;
};

export const OnboardingSuccessModal = ({ open, onContinue }: Props) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onContinue(); // 👈 auto redirect after 3s
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [open, onContinue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 backdrop-blur-sm">
      <div className="bg-white/85 backdrop-blur-xs w-full max-w-xl rounded-2xl shadow-xl p-12 text-center space-y-6 border border-white/20">
        {/* ICON */}
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <CheckCircle2 className="text-primary size-12" />
          </div>
        </div>

        {/* TITLE */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Onboarding Completed
          </h2>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard in 3 seconds...
          </p>
        </div>

        {/* ACTION */}
        <button
          onClick={onContinue}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};
