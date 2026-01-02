import { useState } from "react";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const services = ["Website", "Mobile Apps", "Others"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You can send formData to backend API here
        console.log(formData);
        setSubmitted(true);
    };

    return (
        <div className="w-full bg-background border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center py-20 px-4 md:px-24">
            {/* Header */}
            <div className="max-w-3xl w-full text-center flex flex-col gap-4 mb-12">
                <div className="text-3xl md:text-[48px] font-semibold text-[#49423D] leading-tight tracking-tight font-sans">
                    Get in Touch
                </div>
                <div className="text-base text-[#605A57] leading-7 font-normal font-sans">
                    Fill out the form below and we’ll get back to you shortly.
                </div>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-card rounded-2xl shadow-sm p-8 md:p-12 flex flex-col gap-6 border border-[rgba(2,6,23,0.08)]"
            >
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(2,6,23,0.08)] text-[#37322F] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(2,6,23,0.08)] text-[#37322F] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(2,6,23,0.08)] text-[#37322F] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
                    />
                </div>

                {/* Service Option */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Service Interested In</label>
                    <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(2,6,23,0.08)] text-[#37322F] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm md:text-base hover:bg-primary/90 transition"
                >
                    {submitted ? "Submitted!" : "Submit"}
                </button>
            </form>
        </div>
    );
}
