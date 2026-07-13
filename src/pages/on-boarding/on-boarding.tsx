import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Country, State, City } from "country-state-city";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Loader from "../../components/Loader";
import { Button } from "@/components/ui/button";
import Section from "@/components/sections/Section";
import { Check } from "lucide-react";

// const STEPS = [
//   { id: 1, label: "Personal Info" },
//   { id: 2, label: "Company Info" },
// ];

const COMPANY_SIZES = [
  { value: "1-10", label: "1 – 10 employees" },
  { value: "11-50", label: "11 – 50 employees" },
  { value: "51-200", label: "51 – 200 employees" },
  { value: "201-500", label: "201 – 500 employees" },
  { value: "500+", label: "500+ employees" },
];

// const CURRENCIES = [
//   { value: "USD", label: "USD — US Dollar" },
//   { value: "EUR", label: "EUR — Euro" },
//   { value: "GBP", label: "GBP — British Pound" },
//   { value: "INR", label: "INR — Indian Rupee" },
//   { value: "AUD", label: "AUD — Australian Dollar" },
//   { value: "CAD", label: "CAD — Canadian Dollar" },
// ];

const features = [
  {
    icon: "⚡",
    title: "Instant setup",
    desc: "Get your workspace ready in under 2 minutes.",
  },
  {
    icon: "🔒",
    title: "Enterprise-grade security",
    desc: "Your data is encrypted and never shared.",
  },
  {
    icon: "🌍",
    title: "Global reach",
    desc: "Operate across regions with multi-currency support.",
  },
];

export default function Onboarding() {
  // const [step, setStep] = useState(1); // uncomment when Step 1 is restored
  const [showSuccess, setShowSuccess] = useState(false);

  // country-state-city controlled state
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");

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
    control,
    setValue,
    // trigger, // uncomment when Step 1 is restored
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });

  // ── Uncomment when Step 1 is restored ──
  // const nextStep = async () => {
  //   if (step === 1) {
  //     const valid = await trigger(["firstName", "lastName", "email"]);
  //     if (!valid) return;
  //     setStep(2);
  //   }
  // };

  const handleContinue = async () => {
    const userRes: any = await authService.getMe();
    authManager.setUser(userRes.data?.docs);
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

  // Derived lists from selected country / state
  const countries = Country.getAllCountries();
  const states = selectedCountryCode
    ? State.getStatesOfCountry(selectedCountryCode)
    : [];
  const cities =
    selectedCountryCode && selectedStateCode
      ? City.getCitiesOfState(selectedCountryCode, selectedStateCode)
      : [];

  return (
    <Section>
      <div className="h-screen flex">
        <aside
          className="hidden lg:flex flex-col gap-16 w-[45%] p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #3B1FA8 0%, #7C3AED 55%, #C026D3 100%)",
          }}
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 bg-[radial-gradient(circle,#fff,transparent)]" />
          <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full opacity-10 bg-[radial-gradient(circle,#fff,transparent)]" />

          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-white/15 backdrop-blur-sm">
                ◈
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Kyra CRM
              </span>
            </div>

            <p className="text-xs font-semibold tracking-widest uppercase text-purple-200 mb-4">
              Almost there
            </p>
            <h1 className="text-4xl font-bold text-white leading-snug mb-4">
              Set up your <br />
              <span className="text-purple-200">company profile.</span>
            </h1>
            <p className="text-purple-300 text-sm leading-relaxed max-w-xs">
              Tell us about your company so we can personalise your workspace,
              invoices, and reports from day one.
            </p>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/10">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-purple-300 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative z-10 text-purple-400/60 text-xs">
            © {new Date().getFullYear()} Kyra AI CRM · Privacy · Terms
          </p>
        </aside>

        {!showSuccess && (
          <main className="flex flex-1 justify-center py-3 bg-gray-200/40 h-full">
            <div className="w-full max-w-5xl rounded-xl p-6 space-y-7">
              {/* Header */}
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  Organisation Information
                </h2>
                <p className="text-sm text-gray-400">
                  Required fields are marked with{" "}
                  <span className="text-violet-500 font-semibold">*</span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* ── STEP 1 — Personal Info (commented out) ─────────────
                Restore this block + nextStep() + STEPS + step state
                if you need to re-collect name/email in future.
  
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" required error={errors.firstName?.message}>
                      <Input {...register("firstName")} placeholder="Jane" aria-invalid={!!errors.firstName} className="input-field" />
                    </Field>
                    <Field label="Last Name" required error={errors.lastName?.message}>
                      <Input {...register("lastName")} placeholder="Smith" aria-invalid={!!errors.lastName} className="input-field" />
                    </Field>
                  </div>
                  <Field label="Email" required error={errors.email?.message}>
                    <Input type="email" {...register("email")} placeholder="jane@company.com" aria-invalid={!!errors.email} className="input-field" />
                  </Field>
                  <Button type="button" onClick={nextStep} className="w-full rounded-xl">
                    Continue →
                  </Button>
                </div>
                ── END STEP 1 ── */}

                <InputSection title="Company Basics">
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Company Name"
                      required
                      error={errors.name?.message}
                    >
                      <Input
                        {...register("name")}
                        placeholder="Acme Inc."
                        aria-invalid={!!errors.name}
                        className="input-field"
                      />
                    </Field>
                    <Field label="Email" required error={errors.email?.message}>
                      <Input
                        {...register("email")}
                        placeholder="Acme Inc."
                        aria-invalid={!!errors.email}
                        className="input-field"
                      />
                    </Field>
                    <Field
                      label="Industry"
                      required
                      error={errors.industry?.message}
                    >
                      <Input
                        {...register("industry")}
                        placeholder="e.g. SaaS, E-commerce"
                        aria-invalid={!!errors.industry}
                        className="input-field"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone" required>
                      <Input
                        {...register("phone")}
                        placeholder="+1 555 000 0000"
                        className="input-field"
                      />
                    </Field>
                    <Field label="Website" error={errors.website?.message}>
                      <Input
                        {...register("website")}
                        placeholder="https://acme.com"
                        aria-invalid={!!errors.website}
                        className="input-field"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Field
                        label="Company Size"
                        required
                        error={errors.companySize?.message}
                      >
                        <Controller
                          control={control}
                          name="companySize"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="input-field w-full">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {COMPANY_SIZES.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>
                    </div>

                    <div>
                      <Field label="Tax / GST ID (optional)">
                        <Input
                          {...register("taxId")}
                          placeholder="e.g. 29ABCDE1234F1Z5"
                          className="input-field"
                        />
                      </Field>
                    </div>
                  </div>
                </InputSection>

                <InputSection title="Registered Address" required>
                  {/* Address Line 1 and 2 */}
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Address Line 1"
                      required
                      error={errors.address?.line1?.message}
                    >
                      <Input
                        {...register("address.line1")}
                        placeholder="123 Market Street"
                        className="input-field"
                      />
                    </Field>

                    <Field label="Address Line 2 (optional)">
                      <Input
                        {...register("address.line2")}
                        placeholder="Suite 400, Floor 2"
                        className="input-field"
                      />
                    </Field>
                  </div>

                  {/* Country and State */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Country  */}
                    <Field
                      label="Country"
                      required
                      error={errors.address?.country?.message}
                    >
                      <Controller
                        control={control}
                        name="address.country"
                        render={({ field }) => (
                          <Select
                            onValueChange={(val) => {
                              // val = "CountryName|isoCode"
                              const [name, isoCode] = val.split("|");
                              field.onChange(name);
                              setSelectedCountryCode(isoCode);
                              // reset dependent fields
                              setSelectedStateCode("");
                              setValue("address.state", "");
                              setValue("address.city", "");
                            }}
                            value={
                              field.value && selectedCountryCode
                                ? `${field.value}|${selectedCountryCode}`
                                : ""
                            }
                          >
                            <SelectTrigger className="input-field w-full">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {countries.map((c) => (
                                <SelectItem
                                  key={c.isoCode}
                                  value={`${c.name}|${c.isoCode}`}
                                >
                                  {c.flag} {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    {/* State */}
                    <Field
                      label="State / Province"
                      required
                      error={errors.address?.state?.message}
                    >
                      <Controller
                        control={control}
                        name="address.state"
                        render={({ field }) => (
                          <Select
                            onValueChange={(val) => {
                              const [name, isoCode] = val.split("|");
                              field.onChange(name);
                              setSelectedStateCode(isoCode);
                              setValue("address.city", "");
                            }}
                            value={
                              field.value && selectedStateCode
                                ? `${field.value}|${selectedStateCode}`
                                : ""
                            }
                            disabled={!selectedCountryCode}
                          >
                            <SelectTrigger className="input-field w-full">
                              <SelectValue
                                placeholder={
                                  selectedCountryCode
                                    ? "Select state"
                                    : "Select country first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {states.map((s) => (
                                <SelectItem
                                  key={s.isoCode}
                                  value={`${s.name}|${s.isoCode}`}
                                >
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                  </div>

                  {/* City and Postal Code */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <Field
                      label="City"
                      required
                      error={errors.address?.city?.message}
                    >
                      <Controller
                        control={control}
                        name="address.city"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field?.value ?? ""}
                            disabled={!selectedStateCode}
                          >
                            <SelectTrigger className="input-field w-full">
                              <SelectValue
                                placeholder={
                                  selectedStateCode
                                    ? "Select city"
                                    : "Select state first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {cities.length > 0 ? (
                                cities.map((city) => (
                                  <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="_none" disabled>
                                  No cities found
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    {/* Pincode  */}
                    <Field
                      label="ZIP / Pincode"
                      error={errors.address?.pincode?.message}
                    >
                      <Input
                        {...register("address.pincode")}
                        placeholder="94102"
                        className="input-field"
                      />
                    </Field>
                  </div>
                </InputSection>

                <InputSection title="Legal & Compliance (optional)">
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Privacy Policy URL"
                      error={errors.privacyPolicy?.message}
                    >
                      <Input
                        {...register("privacyPolicy")}
                        placeholder="https://example.com/privacy"
                        aria-invalid={!!errors.privacyPolicy}
                        className="input-field"
                      />
                    </Field>
                    <Field
                      label="Terms of Use URL"
                      error={errors.terms?.message}
                    >
                      <Input
                        {...register("terms")}
                        placeholder="https://example.com/terms"
                        aria-invalid={!!errors.terms}
                        className="input-field"
                      />
                    </Field>
                  </div>
                </InputSection>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl py-3 text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      Finishing… <Loader size={18} />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Complete Setup <Check />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </main>
        )}

        <OnboardingSuccessModal
          open={showSuccess}
          onContinue={handleContinue}
        />
      </div>
    </Section>
  );
}

function InputSection({
  title,
  required,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-xs font-bold text-gray-500 tracking-widest uppercase whitespace-nowrap">
          {title}
          {required && <span className="text-violet-500 ml-0.5">*</span>}
        </p>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase">
        {label}
        {required && <span className="text-violet-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// import { Input } from "@/components/ui/input";
// import { AuthService, ToastMessageService, UserService } from "@/services";
// import { AuthStoreManager } from "@/stores";
// import {
//   onboardingSchema,
//   type ApiError,
//   type OnboardingFormData,
// } from "@/types";
// import { useNavigate } from "react-router-dom";
// import { OnboardingSuccessModal } from "./on-boarding-SuccessModal";
// import { AccountService } from "@/services/account.service";
// import { AccountsStoreManager } from "@/stores/accounts.store";
// import Loader from "../../components/Loader";
// import { Button } from "@/components/ui/button";

// // ── Step 1 (Personal Info) is commented out intentionally.
// // ── Users already provide name + email during Google/email signup.
// // ── Uncomment STEPS, step state, nextStep(), and the Step 1 JSX block if needed in future.

// // const STEPS = [
// //   { id: 1, label: "Personal Info" },
// //   { id: 2, label: "Company Info" },
// // ];

// const features = [
//   {
//     icon: "⚡",
//     title: "Instant setup",
//     desc: "Get your workspace ready in under 2 minutes.",
//   },
//   {
//     icon: "🔒",
//     title: "Enterprise-grade security",
//     desc: "Your data is encrypted and never shared.",
//   },
//   {
//     icon: "🌍",
//     title: "Global reach",
//     desc: "Operate across regions with multi-currency support.",
//   },
// ];

// export default function Onboarding() {
//   // const [step, setStep] = useState(1); // uncomment when Step 1 is restored
//   const [showSuccess, setShowSuccess] = useState(false);
//   const navigate = useNavigate();
//   const authManager = new AuthStoreManager();
//   const accountStoreManager = new AccountsStoreManager();

//   const userService = new UserService();
//   const accountService = new AccountService();
//   const toastMessageService = new ToastMessageService();
//   const authService = new AuthService();

//   const {
//     register,
//     handleSubmit,
//     // trigger, // uncomment when Step 1 is restored
//     formState: { errors, isSubmitting },
//   } = useForm<OnboardingFormData>({
//     resolver: zodResolver(onboardingSchema),
//     mode: "onChange",
//   });

//   // ── Uncomment when Step 1 is restored ──
//   // const nextStep = async () => {
//   //   if (step === 1) {
//   //     const valid = await trigger(["firstName", "lastName", "email"]);
//   //     if (!valid) return;
//   //     setStep(2);
//   //   }
//   // };

//   const handleContinue = async () => {
//     const userRes: any = await authService.getMe();
//     const updatedUser = userRes.data?.docs;
//     authManager.setUser(updatedUser);
//     const accountsRes = await accountService.getAccounts();
//     const updatedAccounts = accountsRes.data?.docs;
//     accountStoreManager.setAccounts(updatedAccounts);
//     authManager.setAccountId(updatedAccounts[0]?.id);
//     navigate("/dashboard");
//   };

//   const onSubmit = async (data: OnboardingFormData) => {
//     try {
//       const response = await userService.createOnboarding(data);
//       if (response.status === 200 || response.status === 201) {
//         toastMessageService.apiSuccess(response.message);
//         setShowSuccess(true);
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       toastMessageService.apiError(err.message || "An error occurred");
//     }
//   };

//   return (
//     <div className="h-screen w-full flex overflow-y-auto">
//       {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
//       <aside
//         className="hidden lg:flex flex-col justify-between w-[42%] h-full p-12 relative overflow-hidden"
//         style={{
//           background:
//             "linear-gradient(145deg, #3B1FA8 0%, #7C3AED 55%, #C026D3 100%)",
//         }}
//       >
//         <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 bg-[radial-gradient(circle,_#fff,_transparent)]" />
//         <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-[radial-gradient(circle,_#fff,_transparent)]" />

//         {/* Brand */}
//         <div className="relative z-10">
//           <div className="flex items-center gap-2 mb-16">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-white/15 backdrop-blur-sm">
//               ◈
//             </div>
//             <span className="text-white font-semibold text-lg tracking-tight">
//               YourBrand
//             </span>
//           </div>

//           <p className="text-xs font-semibold tracking-widest uppercase text-purple-200 mb-4">
//             Almost there
//           </p>
//           <h1 className="text-4xl font-bold text-white leading-snug mb-4">
//             Set up your <br />
//             <span className="text-purple-200">company profile.</span>
//           </h1>
//           <p className="text-purple-300 text-sm leading-relaxed max-w-xs">
//             Tell us about your company so we can personalise your workspace,
//             invoices, and reports from day one.
//           </p>
//         </div>

//         {/* Features */}
//         <div className="relative z-10 space-y-5">
//           {features.map((f) => (
//             <div key={f.title} className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white/10">
//                 {f.icon}
//               </div>
//               <div>
//                 <p className="text-white text-sm font-semibold">{f.title}</p>
//                 <p className="text-purple-300 text-xs mt-0.5">{f.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <p className="relative z-10 text-purple-400/60 text-xs">
//           © {new Date().getFullYear()} YourBrand · Privacy · Terms
//         </p>
//       </aside>

//       {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
//       {!showSuccess && (
//         <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
//           <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8 md:p-10 space-y-7 my-6">
//             {/* Header */}
//             <div className="space-y-1">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Company Information
//               </h2>
//               <p className="text-sm text-gray-400">
//                 Required fields are marked with{" "}
//                 <span className="text-violet-500 font-semibold">*</span>
//               </p>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* ── STEP 1 — Personal Info (commented out) ─────────────
//               Restore this block + nextStep() + STEPS + step state
//               if you need to re-collect name/email in future.

//               <div className="space-y-5">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Field label="First Name" required error={errors.firstName?.message}>
//                     <Input {...register("firstName")} placeholder="Jane" aria-invalid={!!errors.firstName} />
//                   </Field>
//                   <Field label="Last Name" required error={errors.lastName?.message}>
//                     <Input {...register("lastName")} placeholder="Smith" aria-invalid={!!errors.lastName} />
//                   </Field>
//                 </div>
//                 <Field label="Email" required error={errors.email?.message}>
//                   <Input type="email" {...register("email")} placeholder="jane@company.com" aria-invalid={!!errors.email} />
//                 </Field>
//                 <Button type="button" onClick={nextStep} className="w-full rounded-xl">
//                   Continue →
//                 </Button>
//               </div>
//               ── END STEP 1 ── */}

//               {/* ── COMPANY BASICS ─────────────────────────────────────── */}
//               <Section title="Company Basics">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Field
//                     label="Company Name"
//                     required
//                     error={errors.name?.message}
//                   >
//                     <Input
//                       {...register("name")}
//                       placeholder="Acme Inc."
//                       aria-invalid={!!errors.name}
//                     />
//                   </Field>
//                   <Field
//                     label="Industry"
//                     required
//                     error={errors.industry?.message}
//                   >
//                     <Input
//                       {...register("industry")}
//                       placeholder="e.g. SaaS, E-commerce"
//                       aria-invalid={!!errors.industry}
//                     />
//                   </Field>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <Field label="Phone" required>
//                     <Input
//                       {...register("phone")}
//                       placeholder="+1 555 000 0000"
//                     />
//                   </Field>
//                   <Field label="Website" error={errors.website?.message}>
//                     <Input
//                       {...register("website")}
//                       placeholder="https://acme.com"
//                       aria-invalid={!!errors.website}
//                     />
//                   </Field>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Company size — used for onboarding personalisation */}
//                   <Field label="Company Size" required>
//                     <select
//                       {...register("companySize")}
//                       className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-700"
//                     >
//                       <option value="">Select size</option>
//                       <option value="1-10">1 – 10 employees</option>
//                       <option value="11-50">11 – 50 employees</option>
//                       <option value="51-200">51 – 200 employees</option>
//                       <option value="201-500">201 – 500 employees</option>
//                       <option value="500+">500+ employees</option>
//                     </select>
//                     {errors.companySize && (
//                       <p className="text-xs text-red-500 mt-1">
//                         ⚠ {errors.companySize.message}
//                       </p>
//                     )}
//                   </Field>

//                   {/* Currency — drives invoice / report defaults */}
//                   <Field label="Default Currency" required>
//                     <select
//                       {...register("currency")}
//                       className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-700"
//                     >
//                       <option value="">Select currency</option>
//                       <option value="USD">USD — US Dollar</option>
//                       <option value="EUR">EUR — Euro</option>
//                       <option value="GBP">GBP — British Pound</option>
//                       <option value="INR">INR — Indian Rupee</option>
//                       <option value="AUD">AUD — Australian Dollar</option>
//                       <option value="CAD">CAD — Canadian Dollar</option>
//                     </select>
//                     {errors.currency && (
//                       <p className="text-xs text-red-500 mt-1">
//                         ⚠ {errors.currency.message}
//                       </p>
//                     )}
//                   </Field>
//                 </div>

//                 {/* Tax / GST ID — standard for B2B invoicing */}
//                 <Field label="Tax / GST ID (optional)">
//                   <Input
//                     {...register("taxId")}
//                     placeholder="e.g. 29ABCDE1234F1Z5"
//                   />
//                 </Field>
//               </Section>

//               {/* ── REGISTERED ADDRESS ─────────────────────────────────── */}
//               <Section title="Registered Address" required>
//                 <Field
//                   label="Address Line 1"
//                   required
//                   error={errors.address?.line1?.message}
//                 >
//                   <Input
//                     {...register("address.line1")}
//                     placeholder="123 Market Street"
//                   />
//                 </Field>

//                 <Field label="Address Line 2 (optional)">
//                   <Input
//                     {...register("address.line2")}
//                     placeholder="Suite 400, Floor 2"
//                   />
//                 </Field>

//                 <div className="grid grid-cols-2 gap-4">
//                   <Field
//                     label="City"
//                     required
//                     error={errors.address?.city?.message}
//                   >
//                     <Input
//                       {...register("address.city")}
//                       placeholder="San Francisco"
//                     />
//                   </Field>
//                   <Field
//                     label="State / Province"
//                     required
//                     error={errors.address?.state?.message}
//                   >
//                     <Input
//                       {...register("address.state")}
//                       placeholder="California"
//                     />
//                   </Field>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <Field
//                     label="Country"
//                     required
//                     error={errors.address?.country?.message}
//                   >
//                     <Input
//                       {...register("address.country")}
//                       placeholder="United States"
//                     />
//                   </Field>
//                   <Field
//                     label="ZIP / Pincode"
//                     required
//                     error={errors.address?.pincode?.message}
//                   >
//                     <Input
//                       {...register("address.pincode")}
//                       placeholder="94102"
//                     />
//                   </Field>
//                 </div>
//               </Section>

//               {/* ── LEGAL & COMPLIANCE ─────────────────────────────────── */}
//               <Section title="Legal & Compliance (optional)">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Field
//                     label="Privacy Policy URL"
//                     error={errors.privacyPolicy?.message}
//                   >
//                     <Input
//                       {...register("privacyPolicy")}
//                       placeholder="https://acme.com/privacy"
//                       aria-invalid={!!errors.privacyPolicy}
//                     />
//                   </Field>
//                   <Field label="Terms of Use URL" error={errors.terms?.message}>
//                     <Input
//                       {...register("terms")}
//                       placeholder="https://acme.com/terms"
//                       aria-invalid={!!errors.terms}
//                     />
//                   </Field>
//                 </div>
//               </Section>

//               {/* ── SUBMIT ─────────────────────────────────────────────── */}
//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full rounded-xl py-3 text-sm font-semibold"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center gap-2">
//                     Finishing… <Loader size={18} />
//                   </span>
//                 ) : (
//                   "Complete Setup →"
//                 )}
//               </Button>
//             </form>
//           </div>
//         </main>
//       )}

//       <OnboardingSuccessModal open={showSuccess} onContinue={handleContinue} />
//     </div>
//   );
// }

// // ── Helper components ──────────────────────────────────────────────────────────

// function Section({
//   title,
//   required,
//   children,
// }: {
//   title: string;
//   required?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-3">
//         <p className="text-xs font-bold text-gray-500 tracking-widest uppercase whitespace-nowrap">
//           {title}
//           {required && <span className="text-violet-500 ml-0.5">*</span>}
//         </p>
//         <div className="flex-1 h-px bg-gray-100" />
//       </div>
//       {children}
//     </div>
//   );
// }

// function Field({
//   label,
//   required,
//   error,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   error?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase">
//         {label}
//         {required && <span className="text-violet-500 ml-0.5">*</span>}
//       </label>
//       {children}
//       {error && (
//         <p className="text-xs text-red-500 flex items-center gap-1">
//           <span>⚠</span> {error}
//         </p>
//       )}
//     </div>
//   );
// }

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// import { Input } from "@/components/ui/input";
// import { AuthService, ToastMessageService, UserService } from "@/services";
// import { AuthStoreManager } from "@/stores";
// import {
//   onboardingSchema,
//   type ApiError,
//   type OnboardingFormData,
// } from "@/types";
// import { useNavigate } from "react-router-dom";
// import { OnboardingSuccessModal } from "./on-boarding-SuccessModal";
// import { AccountService } from "@/services/account.service";
// import { AccountsStoreManager } from "@/stores/accounts.store";
// import Loader from "../../components/Loader";
// import { Button } from "@/components/ui/button";

// const STEPS = [
//   { id: 1, label: "Personal Info" },
//   { id: 2, label: "Company Info" },
// ];

// const features = [
//   {
//     icon: "⚡",
//     title: "Instant setup",
//     desc: "Get your workspace ready in under 2 minutes.",
//   },
//   {
//     icon: "🔒",
//     title: "Enterprise-grade security",
//     desc: "Your data is encrypted and never shared.",
//   },
//   {
//     icon: "🌍",
//     title: "Global reach",
//     desc: "Operate across regions with multi-currency support.",
//   },
// ];

// export default function Onboarding() {
//   const [step, setStep] = useState(1);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const navigate = useNavigate();
//   const authManager = new AuthStoreManager();
//   const accountStoreManager = new AccountsStoreManager();

//   const userService = new UserService();
//   const accountService = new AccountService();
//   const toastMessageService = new ToastMessageService();
//   const authService = new AuthService();

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     formState: { errors, isSubmitting },
//   } = useForm<OnboardingFormData>({
//     resolver: zodResolver(onboardingSchema),
//     mode: "onChange",
//   });

//   const nextStep = async () => {
//     if (step === 1) {
//       const valid = await trigger(["firstName", "lastName", "email"]);
//       if (!valid) return;
//       setStep(2);
//     }
//   };

//   const handleContinue = async () => {
//     const userRes: any = await authService.getMe();
//     const updatedUser = userRes.data?.docs;
//     authManager.setUser(updatedUser);
//     const accountsRes = await accountService.getAccounts();
//     const updatedAccounts = accountsRes.data?.docs;
//     accountStoreManager.setAccounts(updatedAccounts);
//     authManager.setAccountId(updatedAccounts[0]?.id);
//     navigate("/dashboard");
//   };

//   const onSubmit = async (data: OnboardingFormData) => {
//     try {
//       const response = await userService.createOnboarding(data);
//       if (response.status === 200 || response.status === 201) {
//         toastMessageService.apiSuccess(response.message);
//         setShowSuccess(true);
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       toastMessageService.apiError(err.message || "An error occurred");
//     }
//   };

//   return (
//     <div className="h-screen w-full flex">
//       <aside
//         className="hidden lg:flex flex-col justify-between w-[42%] h-full p-12 relative overflow-hidden"
//         style={{
//           background:
//             "linear-gradient(145deg, #3B1FA8 0%, #7C3AED 55%, #C026D3 100%)",
//         }}
//       >
//         <div
//           className="absolute -top-20 -right-20 w-[320px] h-80 rounded-full opacity-20"
//           style={{ background: "radial-gradient(circle, #fff, transparent)" }}
//         />
//         <div
//           className="absolute -bottom-15 -left-15 w-65 h-65 rounded-full opacity-10"
//           style={{ background: "radial-gradient(circle, #fff, transparent)" }}
//         />

//         {/* Logo / brand */}
//         <div className="relative z-10">
//           <div className="flex items-center gap-2 mb-16">
//             <div
//               className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold"
//               style={{
//                 background: "rgba(255,255,255,0.15)",
//                 backdropFilter: "blur(8px)",
//               }}
//             >
//               ◈
//             </div>
//             <span className="text-white font-semibold text-lg tracking-tight">
//               YourBrand
//             </span>
//           </div>

//           <p className="text-xs font-semibold tracking-widest uppercase text-purple-200 mb-4">
//             Getting Started
//           </p>
//           <h1 className="text-4xl font-bold text-white leading-snug mb-4">
//             Build something
//             <br />
//             <span style={{ color: "#E9D5FF" }}>extraordinary.</span>
//           </h1>
//           <p className="text-purple-200 text-sm leading-relaxed max-w-xs">
//             Your workspace is minutes away. Tell us a little about yourself and
//             your company so we can tailor the experience.
//           </p>
//         </div>

//         {/* Feature list */}
//         <div className="relative z-10 space-y-5">
//           {features.map((f) => (
//             <div key={f.title} className="flex items-start gap-4">
//               <div
//                 className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
//                 style={{ background: "rgba(255,255,255,0.12)" }}
//               >
//                 {f.icon}
//               </div>
//               <div>
//                 <p className="text-white text-sm font-semibold">{f.title}</p>
//                 <p className="text-purple-300 text-xs mt-0.5">{f.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer note */}
//         <p className="relative z-10 text-purple-400 text-xs">
//           © {new Date().getFullYear()} YourBrand · Privacy · Terms
//         </p>
//       </aside>

//       {!showSuccess && (
//         <main className="flex-1 flex items-center justify-center">
//           <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8 md:p-10 space-y-8">
//             {/* Top bar: step indicator */}
//             <div className="space-y-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {step === 1
//                       ? "Personal Information"
//                       : "Company Information"}
//                   </h2>
//                   <p className="text-sm text-gray-400 mt-0.5">
//                     Step {step} of {STEPS.length}
//                   </p>
//                 </div>
//                 {/* Pill steps */}
//                 <div className="flex gap-2">
//                   {STEPS.map((s) => (
//                     <div
//                       key={s.id}
//                       className="h-2 rounded-full transition-all duration-300"
//                       style={{
//                         width: s.id === step ? "2rem" : "0.75rem",
//                         background: s.id <= step ? "#7C3AED" : "#E5E7EB",
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Full progress bar */}
//               <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden">
//                 <div
//                   className="h-1 rounded-full transition-all duration-500 bg-linear-to-br from-primary via-purple-600"
//                   style={{
//                     width: step === 1 ? "50%" : "100%",
//                     // background: "linear-gradient(90deg, #7C3AED, #C026D3)",
//                   }}
//                 />
//               </div>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               {/* ── STEP 1 ── */}
//               {step === 1 && (
//                 <div className="space-y-5">
//                   <div className="grid grid-cols-2 gap-4">
//                     <Field
//                       label="First Name"
//                       required
//                       error={errors.firstName?.message}
//                     >
//                       <Input
//                         {...register("firstName")}
//                         placeholder="Jane"
//                         aria-invalid={!!errors.firstName}
//                         className="input-field"
//                       />
//                     </Field>
//                     <Field
//                       label="Last Name"
//                       required
//                       error={errors.lastName?.message}
//                     >
//                       <Input
//                         {...register("lastName")}
//                         placeholder="Smith"
//                         aria-invalid={!!errors.lastName}
//                         className="input-field"
//                       />
//                     </Field>
//                   </div>

//                   <Field label="Email" required error={errors.email?.message}>
//                     <Input
//                       type="email"
//                       {...register("email")}
//                       placeholder="jane@company.com"
//                       aria-invalid={!!errors.email}
//                       className="input-field"
//                     />
//                   </Field>

//                   <Button onClick={nextStep} className="w-full rounded-xl">
//                     Continue
//                   </Button>

//                   {/* <PrimaryButton type="button" onClick={nextStep}>
//                     Continue →
//                   </PrimaryButton> */}
//                 </div>
//               )}

//               {/* ── STEP 2 ── */}
//               {step === 2 && (
//                 <div className="space-y-5">
//                   <div className="grid grid-cols-2 gap-4">
//                     <Field
//                       label="Company Name"
//                       required
//                       error={errors.name?.message}
//                     >
//                       <Input
//                         {...register("name")}
//                         placeholder="Acme Inc."
//                         aria-invalid={!!errors.name}
//                         className="input-field"
//                       />
//                     </Field>
//                     <Field
//                       label="Industry"
//                       required
//                       error={errors.industry?.message}
//                     >
//                       <Input
//                         {...register("industry")}
//                         placeholder="SaaS"
//                         aria-invalid={!!errors.industry}
//                         className="input-field"
//                       />
//                     </Field>
//                   </div>

//                   {/* Address section */}
//                   <div className="space-y-4 pt-1">
//                     <SectionLabel>
//                       Address{" "}
//                       <span className="text-gray-400 font-normal">
//                         (optional)
//                       </span>
//                     </SectionLabel>

//                     <div className="grid grid-cols-2 gap-4">
//                       <Field label="City">
//                         <Input
//                           {...register("address.city")}
//                           placeholder="San Francisco"
//                           className="input-field"
//                         />
//                       </Field>
//                       <Field label="State">
//                         <Input
//                           {...register("address.state")}
//                           placeholder="CA"
//                           className="input-field"
//                         />
//                       </Field>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <Field label="Country">
//                         <Input
//                           {...register("address.country")}
//                           placeholder="United States"
//                           className="input-field"
//                         />
//                       </Field>
//                       <Field
//                         label="Pincode"
//                         error={errors.address?.pincode?.message}
//                       >
//                         <Input
//                           {...register("address.pincode")}
//                           placeholder="94102"
//                           className="input-field"
//                         />
//                       </Field>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 pt-1">
//                     <Field label="Website" error={errors.website?.message}>
//                       <Input
//                         {...register("website")}
//                         placeholder="https://acme.com"
//                         aria-invalid={!!errors.website}
//                         className="input-field"
//                       />
//                     </Field>
//                     <Field label="Phone">
//                       <Input
//                         {...register("phone")}
//                         placeholder="+1 555 000 0000"
//                         className="input-field"
//                       />
//                     </Field>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <Field
//                       label="Privacy Policy URL"
//                       error={errors.privacyPolicy?.message}
//                     >
//                       <Input
//                         {...register("privacyPolicy")}
//                         placeholder="https://acme.com/privacy"
//                         aria-invalid={!!errors.privacyPolicy}
//                         className="input-field"
//                       />
//                     </Field>
//                     <Field
//                       label="Terms of Use URL"
//                       error={errors.terms?.message}
//                     >
//                       <Input
//                         {...register("terms")}
//                         placeholder="https://acme.com/terms"
//                         aria-invalid={!!errors.terms}
//                         className="input-field"
//                       />
//                     </Field>
//                   </div>

//                   <div className="flex gap-3 pt-1">
//                     <Button
//                       type="button"
//                       onClick={() => setStep(1)}
//                       className="actions-btn flex-1"
//                     >
//                       ← Back
//                     </Button>
//                     <Button className="flex-1 rounded-xl">
//                       {isSubmitting ? (
//                         <span className="flex items-center justify-center gap-2">
//                           Finishing… <Loader size={18} />
//                         </span>
//                       ) : (
//                         "Finish Setup ✓"
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </form>
//           </div>
//         </main>
//       )}

//       <OnboardingSuccessModal open={showSuccess} onContinue={handleContinue} />
//     </div>
//   );
// }

// // ── Helper components ──────────────────────────────────────────────────────────

// function Field({
//   label,
//   required,
//   error,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   error?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase">
//         {label}
//         {required && <span className="text-purple-500 ml-0.5">*</span>}
//       </label>
//       {children}
//       {error && (
//         <p className="text-xs text-red-500 flex items-center gap-1">
//           <span>⚠</span> {error}
//         </p>
//       )}
//     </div>
//   );
// }

// function SectionLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase border-b border-gray-100 pb-2">
//       {children}
//     </p>
//   );
// }

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// import { Input } from "@/components/ui/input";
// import { AuthService, ToastMessageService, UserService } from "@/services";
// import { AuthStoreManager } from "@/stores";
// import {
//   onboardingSchema,
//   type ApiError,
//   type OnboardingFormData,
// } from "@/types";
// import { useNavigate } from "react-router-dom";
// import { OnboardingSuccessModal } from "./on-boarding-SuccessModal";
// import { AccountService } from "@/services/account.service";
// import { AccountsStoreManager } from "@/stores/accounts.store";
// import Loader from "../../components/Loader";

// export default function Onboarding() {
//   const [step, setStep] = useState(1);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const navigate = useNavigate();
//   const authManager = new AuthStoreManager();
//   const accountStoreManager = new AccountsStoreManager();

//   const userService = new UserService();
//   const accountService = new AccountService();
//   const toastMessageService = new ToastMessageService();

//   const authService = new AuthService();

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     formState: { errors, isSubmitting },
//   } = useForm<OnboardingFormData>({
//     resolver: zodResolver(onboardingSchema),
//     mode: "onChange",
//   });

//   const nextStep = async () => {
//     if (step === 1) {
//       const valid = await trigger(["firstName", "lastName", "email"]);
//       if (!valid) return;
//       setStep(2);
//     }
//   };

//   const handleContinue = async () => {
//     const userRes: any = await authService.getMe();
//     const updatedUser = userRes.data?.docs;

//     authManager.setUser(updatedUser);

//     const accountsRes = await accountService.getAccounts();
//     const updatedAccounts = accountsRes.data?.docs;

//     accountStoreManager.setAccounts(updatedAccounts);
//     authManager.setAccountId(updatedAccounts[0]?.id);

//     navigate("/dashboard");
//   };

//   const onSubmit = async (data: OnboardingFormData) => {
//     try {
//       const response = await userService.createOnboarding(data);

//       if (response.status === 200 || response.status === 201) {
//         toastMessageService.apiSuccess(response.message);
//         setShowSuccess(true);
//       }
//     } catch (error) {
//       const err = error as ApiError;

//       toastMessageService.apiError(err.message || "An error occurred");
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 md:px-4">
//       {!showSuccess && (
//         <div className="w-full max-w-3xl md:max-h-[95vh] max-h-full overflow-y-auto bg-white rounded-xl shadow-sm p-6 space-y-8">
//           {/* HEADER */}
//           <div className="space-y-2">
//             <h1 className="text-2xl font-semibold">Welcome 👋</h1>
//             <p className="text-sm text-gray-500">
//               Let’s set up your account in 2 quick steps
//             </p>
//           </div>

//           {/* PROGRESS BAR */}
//           <div className="w-full bg-gray-200 h-2 rounded-full">
//             <div
//               className="bg-primary h-2 rounded-full transition-all"
//               style={{ width: step === 1 ? "50%" : "100%" }}
//             />
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* STEP 1 */}
//             {step === 1 && (
//               <div className="space-y-6">
//                 <h2 className="text-lg font-medium">Personal Information</h2>

//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="text-sm font-medium">First Name *</label>
//                     <Input
//                       {...register("firstName")}
//                       aria-invalid={!!errors.firstName}
//                     />
//                     {errors.firstName && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.firstName.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Last Name *</label>
//                     <Input
//                       {...register("lastName")}
//                       aria-invalid={!!errors.lastName}
//                     />
//                     {errors.lastName && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.lastName.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Email *</label>
//                   <Input
//                     type="email"
//                     {...register("email")}
//                     aria-invalid={!!errors.email}
//                   />
//                   {errors.email && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition cursor-pointer"
//                 >
//                   Continue
//                 </button>
//               </div>
//             )}

//             {/* STEP 2 */}
//             {step === 2 && (
//               <div className="space-y-6">
//                 <h2 className="text-lg font-medium">Company Information</h2>

//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="text-sm font-medium">
//                       Company Name *
//                     </label>
//                     <Input {...register("name")} aria-invalid={!!errors.name} />
//                     {errors.name && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.name.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Industry *</label>
//                     <Input
//                       {...register("industry")}
//                       aria-invalid={!!errors.industry}
//                     />
//                     {errors.industry && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.industry.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-sm font-medium text-slate-700">
//                     Address (optional)
//                   </h3>

//                   {/* Line 1 */}
//                   {/* <div>
//                   <label className="text-sm font-medium">Address Line 1</label>
//                   <Input {...register("address.line1")} />
//                 </div> */}

//                   {/* Line 2 */}
//                   {/* <div>
//                   <label className="text-sm font-medium">Address Line 2</label>
//                   <Input {...register("address.line2")} />
//                 </div> */}

//                   {/* City + State */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium">City</label>
//                       <Input {...register("address.city")} />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium">State</label>
//                       <Input {...register("address.state")} />
//                     </div>
//                   </div>

//                   {/* Country + Pincode */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium">Country</label>
//                       <Input {...register("address.country")} />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium">Pincode</label>
//                       <Input {...register("address.pincode")} />
//                       {errors.address?.pincode && (
//                         <p className="text-xs text-red-500 mt-1">
//                           {errors.address.pincode.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium">
//                       Website (optional)
//                     </label>
//                     <Input
//                       {...register("website")}
//                       aria-invalid={!!errors.website}
//                     />
//                     {errors.website && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.website.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">
//                       Phone (optional)
//                     </label>
//                     <Input {...register("phone")} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Privacy Policy (optional)
//                   </label>
//                   <Input
//                     {...register("privacyPolicy")}
//                     aria-invalid={!!errors.privacyPolicy}
//                   />
//                   {errors.privacyPolicy && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {errors.privacyPolicy.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Terms of Use (optional)
//                   </label>
//                   <Input {...register("terms")} aria-invalid={!!errors.terms} />
//                   {errors.terms && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {errors.terms.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* ACTIONS */}
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setStep(1)}
//                     className="w-full border rounded-xl py-3 cursor-pointer"
//                   >
//                     Back
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-primary text-white rounded-xl py-3 hover:bg-green-700 cursor-pointer "
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center justify-center gap-4">
//                         Finishing... <Loader size={24} />
//                       </span>
//                     ) : (
//                       "Finish"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       )}

//       <OnboardingSuccessModal
//         open={showSuccess}
//         onContinue={() => handleContinue()}
//       />
//     </div>
//   );
// }
