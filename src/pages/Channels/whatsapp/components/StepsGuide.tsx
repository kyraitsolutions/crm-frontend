const steps = [
  {
    number: 1,
    title: "Connect Meta",
    description: "Authorize your Meta account",
  },
  {
    number: 2,
    title: "Select Business",
    description: "Choose your Business Account",
  },
  {
    number: 3,
    title: "Connect Number",
    description: "Verify your phone number",
  },
  {
    number: 4,
    title: "Verify Details",
    description: "Complete business verification",
  },
  {
    number: 5,
    title: "Start Messaging",
    description: "You're all set to go and grow!",
    isLast: true,
  },
];

export default function StepsGuide() {
  return (
    <div>
      <p className="text-gray-600 font-semibold text-sm">
        Easy 5 Step Connection
      </p>

      <div className="flex gap-2 items-start relative mt-5">
        {/* Connector line */}
        <div className="absolute top-5 left-3.5 right-3.5 h-px bg-linear-to-r from-primary/80 to-primary/40" />

        {steps.map((step) => (
          <div
            key={step.number}
            className="flex-1 flex flex-col items-center gap-1.5 relative z-10"
          >
            <div
              className={`size-10 rounded-full flex items-center justify-center text-[10px] font-bold border-[1.5px] ${
                step.isLast
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary"
                  : "bg-white border-primary/80 text-primary"
              }`}
            >
              {step.number}
            </div>
            <p
              className={`text-xs font-semibold text-center leading-snug ${step.isLast ? "text-primary" : "text-gray-600"}`}
            >
              {step.title}
            </p>
            <p className="text-[11px] text-gray-500 text-center leading-snug hidden sm:block">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
