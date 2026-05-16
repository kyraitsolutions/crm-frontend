import { sourceOptions } from "@/constants";
import { X, ChevronDown } from "lucide-react";
import { useContactStore } from "../store/contact.store";
import {
    CreateContactSchema,
    type TCreateContact,
} from "../types/contact.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useAuthStore } from "@/stores";


const ContactPopup = () => {
    const { open, setOpen, createContact } = useContactStore((state) => state);
    const { accountId } = useAuthStore((state) => state)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {
            errors,
            isSubmitting,
            isValid,
        },
    } = useForm<z.input<typeof CreateContactSchema>>({
        resolver: zodResolver(
            CreateContactSchema
        ),
        mode: "onChange",
        defaultValues: {
            accountId: accountId || "",
            name: "",
            email: "",
            phone: "",
            tags: [],
            source: "manual",
            status: "subscribed",
        },
    });

    const nameValue = watch("name") || "";

    const onSubmit = async (data: TCreateContact) => {
        const success = await createContact(data);

    };

    if (!open) return null;


    return (
        <div
            onClick={() =>
                setOpen(false)
            }
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
        >
            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
                className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-medium text-gray-800">
                        Create Contact
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            setOpen(false)
                        }
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={28} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-[200px_1fr] gap-y-4">
                        {/* Name */}
                        <label className="text-gray-700 font-medium">
                            Name{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div>
                            <input
                                type="text"
                                required
                                placeholder="User Name"
                                maxLength={100}
                                {...register("name")}
                                className="w-full h-14 rounded-lg border border-gray-200 bg-gray-100 px-4 outline-none"
                            />

                            <div className="flex justify-between mt-2">
                                {errors.name ? (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.name
                                                .message
                                        }
                                    </p>
                                ) : (
                                    <div />
                                )}

                                <p className="text-sm text-gray-500">
                                    {
                                        nameValue.length
                                    }
                                    /100 characters
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <label className="text-gray-700 font-medium">
                            Mobile Number{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div>
                            <div className="flex gap-3">
                                <div className="relative w-40">
                                    <select className="w-full h-14 rounded-lg border border-gray-200 bg-gray-100 px-4 appearance-none outline-none">
                                        <option>
                                            India
                                        </option>
                                    </select>

                                    <ChevronDown
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        size={18}
                                    />
                                </div>

                                <div className="flex flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                    <div className="flex items-center px-5 border-r border-gray-300 text-gray-600">
                                        +91
                                    </div>

                                    <input
                                        required
                                        type="tel"
                                        placeholder="WhatsApp Number"
                                        {...register(
                                            "phone"
                                        )}
                                        className="flex-1 bg-transparent px-4 outline-none"
                                    />
                                </div>
                            </div>

                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-500">
                                    {
                                        errors.phone
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <label className="text-gray-700 font-medium">
                            Email
                        </label>

                        <div>
                            <input
                                type="email"
                                required
                                {...register(
                                    "email"
                                )}
                                placeholder="Enter email"
                                className="h-14 w-full rounded-lg border border-gray-200 bg-gray-100 px-4 outline-none"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">
                                    {
                                        errors.email
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <label className="text-gray-700 font-medium">
                            Tags
                        </label>

                        <div className="relative">
                            <select
                                {...register(
                                    "tags"
                                )}
                                required
                                className="w-full h-14 rounded-lg border border-gray-200 bg-gray-100 px-4 appearance-none outline-none"
                            >
                                <option value="">
                                    Select Tags
                                </option>
                                <option value="hot">
                                    Hot
                                </option>
                                <option value="warm">
                                    Warm
                                </option>
                                <option value="cold">
                                    Cold
                                </option>
                            </select>

                            <ChevronDown
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                size={18}
                            />
                        </div>

                        {/* Source */}
                        <label className="text-gray-700 font-medium">
                            Source
                        </label>

                        <div className="relative">
                            <select
                                {...register(
                                    "source"
                                )}
                                required
                                className="w-full h-14 rounded-lg border border-gray-200 bg-gray-100 px-4 appearance-none outline-none"
                            >
                                <option value="">
                                    Select Source
                                </option>

                                {sourceOptions.map(
                                    (
                                        option
                                    ) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                size={18}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={
                                !isValid ||
                                isSubmitting
                            }
                            className={`${!isValid || isSubmitting ? "border border-gray-300 bg-gray-300 text-gray-500" : "border border-primary bg-primary hover:bg-primary/90 text-white"}  text-sm px-3 py-1.5 rounded font-medium transition`}>
                            {isSubmitting
                                ? "Adding..."
                                : "Add Contact"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPopup;