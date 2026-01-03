import { useState } from "react";
import { Input } from "../ui/input";
import contactImage from "../../assets/49643.jpg"

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
        <div className="w-full bg-white border-[rgba(55,50,47,0.12)] grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 py-20 px-4">
            {/* Header */}
            <div className="w-full h-full flex flex-col gap-4">
                <div className="text-3xl md:text-[48px] font-semibold text-[#49423D] leading-tight tracking-tight font-sans">
                    Get in Touch
                </div>
                <div className="text-base text-[#605A57] leading-7 font-normal font-sans">
                    Fill out the form below and we’ll get back to you shortly.
                </div>

                <div className="flex h-full w-full justify-center items-center">
                    <img
                        src={contactImage}
                        alt="contact png"
                        className="lg:h-[400px] aspect-square"
                    />
                </div>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl rounded-xl p-4 lg:p-8 md:p-12 flex flex-col gap-6 border border-[rgba(2,6,23,0.08)]"
            >
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Name</label>
                    <Input
                        name="name"
                        value={formData.name}
                        placeholder="Your full Name"
                        onChange={handleChange}
                        className="
                                mt-2
                                bg-[#F7F6F4]
                                border-none
                                rounded-lg
                                shadow-none
                                focus-visible:ring-0
                                placeholder:text-sm
                            "
                    />

                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Email</label>
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="
                                mt-2
                                bg-[#F7F6F4]
                                border-none
                                rounded-lg
                                shadow-none
                                focus-visible:ring-0
                                placeholder:text-sm
                            "
                    />

                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#49423D]">Phone</label>
                    <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className="
                                mt-2
                                bg-[#F7F6F4]
                                border-none
                                rounded-lg
                                shadow-none
                                focus-visible:ring-0
                                placeholder:text-sm
                            "
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
                        className="w-full px-4 py-2 placeholder:text-sm bg-[#F7F6F4] border-0 rounded-lg text-[#37322F] text-sm font-sans focus:outline-none focus:ring-0 transition"
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
                    className="mt-4 w-full py-3 rounded-lg bg-[#37322F] text-white font-semibold text-sm md:text-base hover:bg-primary/90 transition"
                >
                    {submitted ? "Submitted!" : "Submit"}
                </button>
            </form>
        </div>
    );
}
