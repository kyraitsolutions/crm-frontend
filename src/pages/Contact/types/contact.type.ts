import {z} from "zod";




export const ContactStatusSchema=z.enum([
    "subscribed" , "unsubscribed" ,"bounced"
])
export const ContactSourcesSchema=z.enum(["chatbot", "webform", "google_ads", "manual", "import","instagram","whatsapp","facebook","webhook","website"]);
export const ContactFormSchema = z.object({
    accountId: z.string(),
    name: z.string().min(1, "Name is required"),
    email: z
        .string()
        .trim()
        .optional()
        .refine(
            (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            "Invalid email",
        ),
    phone: z.string().min(10, "Phone number must have 10 digits").max(10, "Phone number must not have more than 10 digits"),
    status: ContactStatusSchema,
    source: ContactSourcesSchema,
    tags: z.string().optional(),
});
export const CreateContactSchema=z.object({
    accountId: z.string(),
    name:z.string().min(1, "Name is required"),
    email: z
        .string()
        .trim()
        .optional()
        .refine(
            (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            "Invalid email",
        ),
    phone:z.string().min(10,"Phone number must have 10 digits").max(16,"Phone number is too long"),
    status:ContactStatusSchema.default("subscribed"),
    source:ContactSourcesSchema,
    tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
        typeof val === "string" ? [val] : val
    )
    .nullable()
    .optional(),
})
export const ContactSchema=z.object({
    _id:z.string().optional(),
    id:z.string().optional(),
    accountId: z.string(),
    name:z.string(),
    email:z.string().nullable().optional(),
    phone:z.string().nullable().optional(),
    status:ContactStatusSchema.default("subscribed"),
    source:ContactSourcesSchema,
     tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      typeof val === "string" ? [val] : val
    )
    .nullable()
    .optional(),
    lastActivity:z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TContact = z.infer<typeof ContactSchema>;
export type TCreateContact = z.infer<typeof CreateContactSchema>;