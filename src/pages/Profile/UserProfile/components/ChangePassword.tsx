import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChangePasswordSchema } from "../types/profile.type";

const ChangePassword = () => {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.input<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (
        data: z.input<typeof ChangePasswordSchema>
    ) => {
        console.log(data);
    };

    const PasswordInput = ({
        label,
        placeholder,
        registerName,
        visible,
        setVisible,
        error,
    }: any) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                    type={visible ? "text" : "password"}
                    placeholder={placeholder}
                    {...register(registerName)}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />

                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                    {visible ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error.message}
                </p>
            )}
        </div>
    );

    return (
        <div className="">
            <div className="mb-8">
                <h2 className="text-md font-semibold text-gray-900">
                    Change Password
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <PasswordInput
                    label="Current Password"
                    placeholder="Enter current password"
                    registerName="oldPassword"
                    visible={showOld}
                    setVisible={setShowOld}
                    error={errors.oldPassword}
                />

                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    registerName="newPassword"
                    visible={showNew}
                    setVisible={setShowNew}
                    error={errors.newPassword}
                />

                <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    registerName="confirmPassword"
                    visible={showConfirm}
                    setVisible={setShowConfirm}
                    error={errors.confirmPassword}
                />

                <div className="flex justify gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl px-6"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl px-6"
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;