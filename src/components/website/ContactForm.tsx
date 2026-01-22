import { useState } from "react";
import { Input } from "../ui/input";
import { motion } from "framer-motion"
import { Mail, MapPin, MessageSquare, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const services = ["Website", "Mobile Apps", "AI Chatbot", "CRM Solution", "Email Campaign", "Other"];

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
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Animated Demo Card */}
            <div className="bg-card  rounded-xl  border border-border p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">See AI in Action</span>
                </div>

                {/* Animated Demo Visualization */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  {/* Simulated conversation flow */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 h-3 bg-primary/20 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-full w-1/3 bg-primary/40 rounded-full"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="bg-card rounded-lg p-3 border border-border"
                  >
                    <div className="text-xs text-muted-foreground mb-1">AI Processing...</div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">High Intent</span>
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-xs rounded-full">Budget: ₹25k-60k</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    className="flex items-center gap-2 text-sm text-primary"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Lead qualified and ready for sales
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
                <div className="flex gap-2">
                  <Mail className="w-6 h-6 text-primary mb-3" />
                  <h4 className="font-medium text-foreground mb-1">Email Us</h4>
                </div>


                <Link to="mailto:kyraitsolutions@gmail.com" className="text-sm text-muted-foreground">kyraitsolutions@gmail.com</Link>
              </div>
              <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
                <div className="flex gap-2">
                  <Phone className="w-6 h-6 text-primary mb-3" />
                  <h4 className="font-medium text-foreground mb-1">Call Us</h4>
                </div>

                <Link to="tel:+917906351589" className="text-sm text-muted-foreground">+91 7906351589</Link>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
              <div className="flex gap-2">
                <MapPin className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-medium text-foreground mb-1">Visit Us</h4>
              </div>


              <p className="text-sm text-muted-foreground">
                Noida sector 62, Delhi NCR, Uttar Pradesh<br />
                India
              </p>
            </div>
          </motion.div >
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border h-full p-6 sm:p-8 lg:p-10 w-full"
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
                    placeholder="name@gmail.com, you@example.com"
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
                    placeholder="+91 XXXXXXXXXX"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
