import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { AuthService, ToastMessageService, UserService } from "@/services";
import { AuthStoreManager } from "@/stores";
import {
  onboardingSchema,
  type ApiError,
  type OnboardingFormData,
} from "@/types";
import { useNavigate } from "react-router-dom";
import { OnboardingSuccessModal } from "./on-boarding-SuccessModal";
import { AccountService } from "@/services/account.service";
import { AccountsStoreManager } from "@/stores/accounts.store";
import Loader from "../Loader";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const authManager = new AuthStoreManager();
  const accountStoreManager = new AccountsStoreManager();

  const userService = new UserService();
  const accountService = new AccountService();
  const toastMessageService = new ToastMessageService();

  const authService = new AuthService();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["firstName", "lastName", "email"]);
      if (!valid) return;
      setStep(2);
    }
  };

  const handleContinue = async () => {
    const userRes: any = await authService.getMe();
    const updatedUser = userRes.data?.docs;

    authManager.setUser(updatedUser);

    const accountsRes = await accountService.getAccounts();
    const updatedAccounts = accountsRes.data?.docs;

    accountStoreManager.setAccounts(updatedAccounts);
    authManager.setAccountId(updatedAccounts[0]?.id);

    navigate("/dashboard");
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const response = await userService.createOnboarding(data);

      if (response.status === 200 || response.status === 201) {
        toastMessageService.apiSuccess(response.message);
        setShowSuccess(true);
      }
    } catch (error) {
      const err = error as ApiError;

      toastMessageService.apiError(err.message || "An error occurred");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 md:px-4">
      {!showSuccess && (
        <div className="w-full max-w-3xl md:max-h-[95vh] max-h-full overflow-y-auto bg-white rounded-2xl shadow-xl p-6 space-y-8">
          {/* HEADER */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Welcome 👋</h1>
            <p className="text-sm text-gray-500">
              Let’s set up your account in 2 quick steps
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Personal Information</h2>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <Input
                      {...register("firstName")}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input
                      {...register("lastName")}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Company Information</h2>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">
                      Company Name *
                    </label>
                    <Input {...register("name")} aria-invalid={!!errors.name} />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Industry *</label>
                    <Input
                      {...register("industry")}
                      aria-invalid={!!errors.industry}
                    />
                    {errors.industry && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.industry.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-700">
                    Address (optional)
                  </h3>

                  {/* Line 1 */}
                  {/* <div>
                  <label className="text-sm font-medium">Address Line 1</label>
                  <Input {...register("address.line1")} />
                </div> */}

                  {/* Line 2 */}
                  {/* <div>
                  <label className="text-sm font-medium">Address Line 2</label>
                  <Input {...register("address.line2")} />
                </div> */}

                  {/* City + State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <Input {...register("address.city")} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">State</label>
                      <Input {...register("address.state")} />
                    </div>
                  </div>

                  {/* Country + Pincode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <Input {...register("address.country")} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Pincode</label>
                      <Input {...register("address.pincode")} />
                      {errors.address?.pincode && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.address.pincode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Website (optional)
                    </label>
                    <Input
                      {...register("website")}
                      aria-invalid={!!errors.website}
                    />
                    {errors.website && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.website.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Phone (optional)
                    </label>
                    <Input {...register("phone")} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Privacy Policy (optional)
                  </label>
                  <Input
                    {...register("privacyPolicy")}
                    aria-invalid={!!errors.privacyPolicy}
                  />
                  {errors.privacyPolicy && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.privacyPolicy.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Terms of Use (optional)
                  </label>
                  <Input {...register("terms")} aria-invalid={!!errors.terms} />
                  {errors.terms && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.terms.message}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full border rounded-xl py-3 cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white rounded-xl py-3 hover:bg-green-700 cursor-pointer "
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-4">
                        Finishing... <Loader size={24} />
                      </span>
                    ) : (
                      "Finish"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      <OnboardingSuccessModal
        open={showSuccess}
        onContinue={() => handleContinue()}
      />
    </div>
  );
}
