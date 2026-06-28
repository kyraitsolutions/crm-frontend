import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
});

export const companySchema = z.object({
  // ── Company basics ──────────────────────────────────────────
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  companySize: z.string().min(1, "Company size is required"),
  currency: z.string().min(1, "Default currency is required"),
  taxId: z.string().optional(),

  // ── Registered address ───────────────────────────────────────
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pincode: z
      .string()
      .regex(/^\d{4,10}$/, "Enter a valid postal code")
      .optional()
      .or(z.literal("")),
  }),

  // ── Legal & compliance (optional) ───────────────────────────
  privacyPolicy: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  terms: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export const onboardingSchema = z.object({
  ...personalSchema.shape,
  ...companySchema.shape,
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// import { z } from "zod";

// export const personalSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z.email("Enter valid email"),
// });

// export const companySchema = z.object({
//   name: z.string().optional(),
//   industry: z.string().min(1, "Industry is required"),

//   address: z.object({
//     line1: z.string().optional(),
//     line2: z.string().optional(),
//     city: z.string().optional(),
//     state: z.string().optional(),
//     country: z.string().optional(),
//     pincode: z
//       .string()
//       .regex(/^\d{6}$/, "Pincode must be 6 digits")
//       .optional()
//       .or(z.literal("")),
//   }),

//   website: z.string().url("Enter valid URL").optional().or(z.literal("")),

//   phone: z.string().optional(),

//   privacyPolicy: z.url("Enter valid URL").optional().or(z.literal("")),

//   terms: z.url("Enter valid URL").optional().or(z.literal("")),
// });

// export const onboardingSchema = z.object({
//   ...personalSchema.shape,
//   ...companySchema.shape,
// });

// export type OnboardingFormData = z.infer<typeof onboardingSchema>;
