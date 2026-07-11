import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthService } from "@/services";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Mail,
    ShieldCheck,
    Lock,
    ArrowLeft,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

type Step = "email" | "otp" | "password" | "success";

const STEP_ORDER: Step[] = ["email", "otp", "password"];

const ForgotPassword = () => {
    const navigate = useNavigate();
    const authService = new AuthService();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [step, setStep] = useState<Step>("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const emailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const clearError = () => error && setError("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        try {
            setLoading(true);
            const response = await authService.forgotPassword({ email });
            if (response.status === 201) {
                setStep("otp");
                setResendCooldown(30);
            }
        } catch (error: any) {
            setError(error?.message || "We couldn't send the code. Try again.");
            console.error("Forgot password error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        clearError();
        try {
            setLoading(true);
            await authService.forgotPassword({ email });
            setResendCooldown(30);
        } catch (error: any) {
            setError(error?.message || "We couldn't resend the code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (otp.length !== 6) {
            setError("Enter the full 6-digit code.");
            return;
        }
        try {
            setLoading(true);
            const response = await authService.verifyOTP({ email, otp })
            console.log("rsponse", response.data.doc)
            const token = response.data.doc
            if (token) {
                setResetToken(response.data?.doc)
                setStep("password");
            }
        } catch (error: any) {
            setError(error?.message || "That code didn't work. Try again.");
            console.error("Verify OTP error:", error);
        } finally {
            setLoading(false);
        }
    };

    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        try {
            setLoading(true);
            const response = await authService.resetPassword({ resetToken, newPassword })
            console.log(response);
            const email = response.data.doc
            if (email) {
                setStep("success");
                setTimeout(() => navigate("/login"), 2000);
            }

        } catch (error: any) {
            setError(error?.message || "We couldn't reset your password. Try again.");
            console.error("Reset password error:", error);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        clearError();
        if (step === "otp") setStep("email");
        if (step === "password") setStep("otp");
    };

    const currentIndex = STEP_ORDER.indexOf(step === "success" ? "password" : step);

    return (
        <div>
            {/* Brand mark */}
            <div className="mb-8 flex justify-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">K</span>
                    </div>
                    <span className="text-lg font-semibold text-slate-900">Kyra</span>
                </div>
            </div>

            <div className="">
                {step !== "success" && (
                    <>
                        {/* Step progress */}
                        <div className="mb-6 flex items-center gap-1.5">
                            {STEP_ORDER.map((s, i) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= currentIndex ? "bg-primary" : "bg-primary/10"
                                        }`}
                                />
                            ))}
                        </div>

                        {step !== "email" && (
                            <button
                                type="button"
                                onClick={goBack}
                                className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </button>
                        )}
                    </>
                )}

                {/* STEP: EMAIL */}
                {step === "email" && (
                    <>
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/20">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-base font-semibold text-slate-900">
                                Forgot your password?
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                Enter the email linked to your account and we'll send you a
                                6-digit verification code.
                            </p>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Work email
                                </label>
                                <input
                                    ref={emailInputRef}
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="you@hotel.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearError();
                                    }}
                                    className="w-full rounded-xl border border-primary px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                            </div>

                            {error && <ErrorMessage message={error} />}

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {loading ? "Sending code..." : "Send verification code"}
                            </button>
                        </form>
                    </>
                )}

                {/* STEP: OTP */}
                {step === "otp" && (
                    <>
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 ring-1 ring-primary-100">
                                <ShieldCheck className="h-5 w-5 text-primary-600" />
                            </div>
                            <h1 className="text-base font-semibold text-slate-900">
                                Check your email
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                We sent a 6-digit code to{" "}
                                <span className="font-medium text-slate-700">{email}</span>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div className="flex justify-center">
                                <FieldOTP
                                    value={otp}
                                    onChange={(val) => {
                                        setOtp(val);
                                        clearError();
                                    }}
                                />
                            </div>

                            {error && <ErrorMessage message={error} />}

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {loading ? "Verifying..." : "Verify code"}
                            </button>

                            <p className="text-center text-sm text-slate-500">
                                Didn't get a code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendCooldown > 0}
                                    className="font-medium text-primary hover:text-primary disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
                                </button>
                            </p>
                        </form>
                    </>
                )}

                {/* STEP: PASSWORD */}
                {step === "password" && (
                    <>
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/20">
                                <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Set a new password
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                Choose a strong password you haven't used before.
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={8}
                                        placeholder="At least 8 characters"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            clearError();
                                        }}
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            clearError();
                                        }}
                                        className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-4 ${passwordsMismatch
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                            : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {passwordsMismatch && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        Passwords don't match.
                                    </p>
                                )}
                            </div>

                            {error && <ErrorMessage message={error} />}

                            <button
                                type="submit"
                                disabled={loading || !newPassword || !confirmPassword}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {loading ? "Saving..." : "Save new password"}
                            </button>
                        </form>
                    </>
                )}

                {/* STEP: SUCCESS */}
                {step === "success" && (
                    <div className="flex flex-col items-center py-4 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Password updated
                        </h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Redirecting you to sign in...
                        </p>
                    </div>
                )}
            </div>

            {step === "email" && (
                <p className="mt-6 text-center text-sm text-slate-500">
                    Remember your password?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-medium text-primary hover:text-primary"
                    >
                        Back to log in
                    </button>
                </p>
            )}
        </div>
    );
};

export default ForgotPassword;

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
        <p className="text-sm text-red-700">{message}</p>
    </div>
);

const FieldOTP = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    return (
        <InputOTP maxLength={6} value={value} onChange={onChange}>
            <InputOTPGroup className="gap-2">
                <InputOTPSlot
                    index={0}
                    className="h-12 w-11 rounded-lg border border-slate-300 text-base"
                />
                <InputOTPSlot
                    index={1}
                    className="h-12 w-11 rounded-lg border border-slate-300 text-base"
                />
                <InputOTPSlot
                    index={2}
                    className="h-12 w-11 rounded-lg border border-slate-300 text-base"
                />
                <InputOTPSlot
                    index={3}
                    className="h-12 w-11 rounded-lg border border-slate-300 text-base"
                />
                <InputOTPSlot
                    index={4}
                    className="h-12 w-11 rounded-lg border border-slate-300 text-base"
                />
                <InputOTPSlot
                    index={5}
                    className="h-12 w-11 rounded-lg border border-slate-300 text-base"
                />
            </InputOTPGroup>
        </InputOTP>
    );
};