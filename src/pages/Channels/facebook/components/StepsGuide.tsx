const steps = [
  {
    number: 1,
    title: "Login to Meta",
    description: "Authorize your Meta account",
  },
  {
    number: 2,
    title: "Select Page",
    description: "Choose the Facebook Page to connect",
  },
  {
    number: 3,
    title: "Confirm Access",
    description: "Allow page and Instagram permissions",
  },
  {
    number: 4,
    title: "Webhook Ready",
    description: "Lead ads events start syncing",
    isLast: true,
  },
];

export default function StepsGuide() {
  return (
    <div>
      <p className="text-gray-600 font-semibold text-sm">Easy 4 Step Connection</p>

      <div className="flex gap-2 items-start relative mt-5">
        <div className="absolute top-5 left-3.5 right-3.5 h-px bg-linear-to-r from-blue-500/80 to-blue-400/40" />

        {steps.map((step) => (
          <div
            key={step.number}
            className="flex-1 flex flex-col items-center gap-1.5 relative z-10"
          >
            <div
              className={`size-10 rounded-full flex items-center justify-center text-[10px] font-bold border-[1.5px] ${
                step.isLast
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white border-blue-500/80 text-blue-600"
              }`}
            >
              {step.number}
            </div>
            <p
              className={`text-xs font-semibold text-center leading-snug ${step.isLast ? "text-blue-600" : "text-gray-600"}`}
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
