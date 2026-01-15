import { useState, useEffect } from "react";
import type React from "react";
import DashboardImag2 from "../assets/image2.png";
import DashboardImag3 from "../assets/image3.png";
import DashboardImag4 from "../assets/image4.png";
// Badge component for consistency
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">
      <div className="text-[#16A34A]">{icon}</div>
      <span className="text-sm font-medium text-green-700">
        {text}
      </span>
    </div>
  );
}


export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const cards = [
    {
      title: "Plan your boost",
      description:
        "Automate customer flow and boost conversions with smart chatbots.",
      image: DashboardImag3,
    },
    {
      title: "Analytics & insights",
      description:
        "Transform your business data into actionable insights with real-time analytics.",
      image: DashboardImag2,
    },
    {
      title: "Collaborate seamlessly",
      description:
        "Keep your team aligned with shared dashboards and collaborative workflows.",
      image: DashboardImag4,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length);
      setAnimationKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            icon={<span className="w-2 h-2 bg-[#16A34A] rounded-full inline-block" />}
            text="Platform Features"
          />

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Streamline your business operations
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Manage schedules, analyze data, and collaborate with your team —
            all in one powerful CRM platform.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Feature Cards */}
          <div className="flex flex-col gap-6">
            {cards.map((card, index) => {
              const isActive = index === activeCard;

              return (
                <div
                  key={index}
                  onClick={() => {
                    setActiveCard(index);
                    setAnimationKey((p) => p + 1);
                  }}
                  className={`rounded-2xl transition cursor-pointer overflow-hidden
                    ${isActive
                      ? "bg-white shadow-md border border-green-100"
                      : "bg-white/70 border border-gray-200 hover:bg-white"
                    }`}
                >
                  {/* Progress bar */}
                  <div className="h-1 bg-gray-100">
                    {isActive && (
                      <div
                        key={animationKey}
                        className="h-full bg-[#16A34A] animate-[progressBar_5s_linear_forwards]"
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
            <div className="w-full h-[260px] md:h-[420px]">
              <img
                src={cards[activeCard].image}
                alt={cards[activeCard].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes progressBar {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}
