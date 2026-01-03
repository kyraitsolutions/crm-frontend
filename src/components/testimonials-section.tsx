import { useState, useEffect } from "react";

// Badge component for consistency
// function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
//   return (
//     <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
//       <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
//       <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
//         {text}
//       </div>
//     </div>
//   )
// }

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      quote:
        "Kyra helped us turn website conversations into real leads almost instantly. Setup was quick, and everything flows directly into the CRM.",
      name: "Amit Verma",
      company: "Founder, SaaS Startup",
      image:
        "https://avatars.githubusercontent.com/u/1?v=4",
    },
    {
      quote:
        "The no-code chatbot builder is extremely intuitive. We launched multiple chatbot flows without any developer support.",
      name: "Priya Sharma",
      company: "Marketing Manager",
      image:
        "https://avatars.githubusercontent.com/u/2?v=4",
    },
    {
      quote:
        "What stands out is the CRM-first approach. Every conversation automatically becomes a lead, making our sales pipeline crystal clear.",
      name: "Rahul Mehta",
      company: "Head of Sales, GrowthCo",
      image:
        "https://avatars.githubusercontent.com/u/3?v=4",
    },
    {
      quote:
        "Managing multiple clients is effortless with Kyra. Separate workspaces, shared analytics, and clean lead tracking make it perfect for agencies.",
      name: "Sneha Patel",
      company: "Agency Owner, DigitalCraft",
      image:
        "https://avatars.githubusercontent.com/u/4?v=4",
    },
    {
      quote:
        "The analytics dashboard gives us real-time insights into chatbot performance and conversions. It keeps the entire team aligned.",
      name: "Arjun Malhotra",
      company: "Operations Manager, ScaleOps",
      image:
        "https://avatars.githubusercontent.com/u/5?v=4",
    },
    {
      quote:
        "Kyra streamlined how our team collaborates on leads. Assignments, follow-ups, and conversations all happen in one place.",
      name: "Neha Gupta",
      company: "Customer Success Lead, HelpDeskPro",
      image:
        "https://avatars.githubusercontent.com/u/6?v=4",
    },
    {
      quote:
        "We saw a noticeable improvement in lead quality and conversions after switching to Kyra’s smart chatbots.",
      name: "Kunal Singh",
      company: "Growth Marketer, Marketly",
      image:
        "https://avatars.githubusercontent.com/u/7?v=4",
    },
    {
      quote:
        "Clean interface, powerful features, and zero complexity. Kyra feels like it was built specifically for modern teams.",
      name: "Ritika Jain",
      company: "Product Manager, NextGen Apps",
      image:
        "https://avatars.githubusercontent.com/u/8?v=4",
    },
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 300);
    }, 12000); // increased from 6000ms to 12000ms for longer testimonial display

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNavigationClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTestimonial(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 300);
  };

  return (
    <div className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col gap-10">

          {/* Testimonial Card */}
          <div className="relative rounded-2xl border bg-card shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12">

              {/* Avatar */}
              <img
                src={testimonials[activeTestimonial].image || "/placeholder.svg"}
                alt={testimonials[activeTestimonial].name}
                className="h-24 w-24 rounded-xl object-cover"
                style={{
                  opacity: isTransitioning ? 0.6 : 1,
                  transform: isTransitioning ? "scale(0.96)" : "scale(1)",
                  transition: "all 0.6s ease",
                }}
              />

              {/* Content */}
              <div className="flex flex-col gap-6 flex-1">
                <p
                  className="text-xl md:text-2xl font-medium leading-relaxed text-foreground"
                  style={{
                    filter: isTransitioning ? "blur(3px)" : "blur(0)",
                    transition: "filter 0.6s ease",
                  }}
                >
                  “{testimonials[activeTestimonial].quote}”
                </p>

                <div
                  className="flex flex-col gap-1"
                  style={{
                    filter: isTransitioning ? "blur(3px)" : "blur(0)",
                    transition: "filter 0.6s ease",
                  }}
                >
                  <span className="text-base font-semibold text-foreground">
                    {testimonials[activeTestimonial].name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {testimonials[activeTestimonial].company}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute right-6 bottom-6 flex gap-3">
              <button
                onClick={() =>
                  handleNavigationClick(
                    (activeTestimonial - 1 + testimonials.length) %
                    testimonials.length
                  )
                }
                className="h-9 w-9 rounded-full border bg-background hover:bg-muted flex items-center justify-center transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() =>
                  handleNavigationClick(
                    (activeTestimonial + 1) % testimonials.length
                  )
                }
                className="h-9 w-9 rounded-full border bg-background hover:bg-muted flex items-center justify-center transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
