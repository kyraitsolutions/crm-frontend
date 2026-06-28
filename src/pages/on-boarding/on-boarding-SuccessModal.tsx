import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onContinue: () => void;
};

const COUNTDOWN = 3;
const CIRCUMFERENCE = 2 * Math.PI * 38;

export const OnboardingSuccessModal = ({ open, onContinue }: Props) => {
  const [seconds, setSeconds] = useState(COUNTDOWN);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;
    setSeconds(COUNTDOWN);

    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          // onContinue();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [open, onContinue]);

  if (!open) return null;

  const progress = (COUNTDOWN - seconds) / COUNTDOWN;
  const offset = CIRCUMFERENCE * progress;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md mx-4 rounded-2xl p-10 text-center flex flex-col items-center gap-5 bg-white border border-violet-100 shadow-2xl shadow-violet-200/50">
        {/* CONFETTI */}
        <div className="flex gap-2 text-2xl animate-bounce">🎉 ✨ 🚀</div>

        {/* COUNTDOWN RING + ICON */}
        <div className="relative w-24 h-24">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88">
            <circle
              cx="44"
              cy="44"
              r="38"
              fill="none"
              stroke="#E9D5FF"
              strokeWidth="5"
            />
            <circle
              cx="44"
              cy="44"
              r="38"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-[900ms] linear"
            />
          </svg>

          <div className="absolute inset-2.5 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
            <CheckCircle2 className="text-white w-9 h-9" />
          </div>
        </div>

        {/* TEXT */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">You're all set!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your account is ready. Heading to your dashboard in{" "}
            <span className="text-violet-600 font-semibold">{seconds}</span>{" "}
            {seconds === 1 ? "second" : "seconds"}.
          </p>
        </div>

        <p className="text-xs font-medium tracking-wide text-violet-400">
          Redirecting automatically…
        </p>

        {/* ACTIONS */}
        <Button onClick={onContinue} className="w-full rounded-xl bg-primary">
          Go to Dashboard →
        </Button>
        {/* <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white bg--to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-300/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-300/60 transition-all duration-150 cursor-pointer"
        >
          Go to Dashboard →
        </button> */}

        <Button
          onClick={() => clearInterval(timerRef.current!)}
          className="w-full actions-btn py-2.5!"
        >
          Stay on this page
        </Button>
      </div>
    </div>
  );
};

// import { useEffect } from "react";
// import { CheckCircle2 } from "lucide-react";

// type Props = {
//   open: boolean;
//   onContinue: () => void;
// };

// export const OnboardingSuccessModal = ({ open, onContinue }: Props) => {
//   useEffect(() => {
//     if (!open) return;

//     const timer = setTimeout(() => {
//       onContinue(); // 👈 auto redirect after 3s
//     }, 3000);

//     return () => clearTimeout(timer); // cleanup
//   }, [open, onContinue]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 backdrop-blur-sm">
//       <div className="bg-white/85 backdrop-blur-xs w-full max-w-xl rounded-2xl shadow-xl p-12 text-center space-y-6 border border-white/20">
//         {/* ICON */}
//         <div className="flex justify-center">
//           <div className="bg-primary/10 p-4 rounded-full">
//             <CheckCircle2 className="text-primary size-12" />
//           </div>
//         </div>

//         {/* TITLE */}
//         <div className="space-y-2">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Onboarding Completed
//           </h2>
//           <p className="text-sm text-gray-500">
//             Redirecting to dashboard in 3 seconds...
//           </p>
//         </div>

//         {/* ACTION */}
//         <button
//           onClick={onContinue}
//           className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
//         >
//           Go to Dashboard Now
//         </button>
//       </div>
//     </div>
//   );
// };
