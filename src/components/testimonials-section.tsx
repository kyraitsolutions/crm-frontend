import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      quote:
        "Kyra helped us turn website conversations into real leads almost instantly. Setup was quick, and everything flows directly into the CRM.",
      name: "Amit Verma",
      company: "Founder, SaaS Startup",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    {
      quote:
        "The no-code chatbot builder is extremely intuitive. We launched multiple chatbot flows without any developer support.",
      name: "Priya Sharma",
      company: "Marketing Manager",
      image: "https://avatars.githubusercontent.com/u/2?v=4",
    },
    {
      quote:
        "What stands out is the CRM-first approach. Every conversation automatically becomes a lead, making our sales pipeline crystal clear.",
      name: "Rahul Mehta",
      company: "Head of Sales, GrowthCo",
      image: "https://avatars.githubusercontent.com/u/3?v=4",
    },
    {
      quote:
        "Managing multiple clients is effortless with Kyra. Separate workspaces, shared analytics, and clean lead tracking make it perfect for agencies.",
      name: "Sneha Patel",
      company: "Agency Owner, DigitalCraft",
      image: "https://avatars.githubusercontent.com/u/4?v=4",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }, 12000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNavigationClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTestimonial(index);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  return (
    <section className="w-full bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Modern Teams
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            See how founders, marketers, and sales teams use Kyra to turn conversations into revenue.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12 items-start">

            {/* Avatar */}
            <img
              src={testimonials[activeTestimonial].image}
              alt={testimonials[activeTestimonial].name}
              className="h-24 w-24 rounded-xl object-cover border border-gray-200"
              style={{
                opacity: isTransitioning ? 0.6 : 1,
                transform: isTransitioning ? "scale(0.96)" : "scale(1)",
                transition: "all 0.6s ease",
              }}
            />

            {/* Content */}
            <div className="flex flex-col gap-6 flex-1">
              <p
                className="text-xl md:text-2xl font-medium leading-relaxed text-gray-900"
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
                <span className="text-base font-semibold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </span>
                <span className="text-sm text-gray-500">
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
              className="h-10 w-10 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center transition"
            >
              ←
            </button>

            <button
              onClick={() =>
                handleNavigationClick(
                  (activeTestimonial + 1) % testimonials.length
                )
              }
              className="h-10 w-10 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center transition"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
