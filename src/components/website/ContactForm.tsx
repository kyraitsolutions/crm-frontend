import { useState } from "react";
import { Input } from "../ui/input";
import contactImage from "../../assets/49643.jpg";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const services = ["Website", "Mobile Apps", "Others"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <section className="w-full bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Fill out the form and our team will reach out shortly to help you
              grow with Kyra CRM.
            </p>

            <img
              src={contactImage}
              alt="Contact"
              className="w-full max-w-md rounded-2xl shadow-sm hidden lg:block"
            />
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 w-full"
          >
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-2 bg-gray-100 border-0 rounded-lg focus-visible:ring-[#16A34A]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-2 bg-gray-100 border-0 rounded-lg focus-visible:ring-[#16A34A]"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="mt-2 bg-gray-100 border-0 rounded-lg focus-visible:ring-[#16A34A]"
                  required
                />
              </div>

              {/* Service */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Service Interested In
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold transition"
              >
                {submitted ? "Submitted Successfully!" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
