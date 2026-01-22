import { Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Sales",
      company: "TechScale Inc.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      quote: "Kyra AI CRM transformed our lead qualification process. We went from spending 10 hours a week on manual data entry to having AI-qualified leads ready for our sales team every morning.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Founder & CEO",
      company: "GrowthHub",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "The AI summaries are a game-changer. My team can now see intent, budget, and timeline at a glance. We've closed 40% more deals since switching to Kyra.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "Scale Agency",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote: "Managing lead capture for 12 clients used to be chaos. Now with multi-account support, I can see all campaigns in one dashboard. The ROI is incredible.",
      rating: 5,
    },
    {
      name: "David Park",
      role: "Head of Growth",
      company: "Nexus Startups",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote: "We tried HubSpot, Salesforce, even Pipedrive. Nothing came close to how fast we got set up with Kyra AI CRM. Literally 5 minutes and we were capturing leads.",
      rating: 5,
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
            {/* <img
              src={testimonials[activeTestimonial].image}
              alt={testimonials[activeTestimonial].name}
              className="h-24 w-24 rounded-xl object-cover border border-gray-200"
              style={{
                opacity: isTransitioning ? 0.6 : 1,
                transform: isTransitioning ? "scale(0.96)" : "scale(1)",
                transition: "all 0.6s ease",
              }}
            /> */}

            {/* Content */}
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonials[activeTestimonial].rating)]?.map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
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
                  {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
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
