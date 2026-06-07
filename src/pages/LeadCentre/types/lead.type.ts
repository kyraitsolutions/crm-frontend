// export interface Lead {
//     name: string;
//     email: string;
//     phone: string;
//     mobile: string;
//     message: string;
//     customFields: Record<string, any>;
//     stage: string;
//     notes: Record<string, any>[];
//     owner: string;
//     status: string;
//     title: string;
//     attachments: string[];
//     source: {
//         name: string;
//     };
//     website: string;
//     updatedAt: string;
//     createdAt?: string;
// }

import { z } from "zod";

export const LeadSchema = z.object({
    id: z.string().min(1),
    accountId: z.string().min(1),
    name: z.string().min(1),
    email: z.string().optional(), // can be empty string
    phone: z.string().optional(),
    message: z.string().optional(),
    description: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    website: z.string().optional(),
    mobile: z.string().optional(),
    customFields: z.record(z.string(), z.any()).optional(), // empty object allowed
    stage: z.string().min(1),
    status: z.string().min(1),
    source: z.object({
        name: z.string().min(1),
        url: z.string().optional(),
        formId: z.string().optional(),
        chatbotId: z.string().optional(),
    }),
    assignedTo: z.string().optional(),
    tags: z.array(z.any()).optional(), // can refine later if needed
    notes: z.array(z.any()).optional(),
    attachments: z.array(z.string()).optional(),
    meta: z.object({
        ip: z.string().optional(),
        userAgent: z.string().optional(),
        location: z.object({
            address: z.string().optional(),
            country: z.string().optional(),
            city: z.string().optional(),
            coordinates: z.object({
                lat: z.number().nullable().optional(),
                lng: z.number().nullable().optional(),
            }).optional(),
        }).optional(),
    }).optional(),
    createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
});

export const BasicNumberSchema=z.object({
    intakeLeads:z.number(),
    qualifiedLeads:z.number(),
    conversionRate:z.number(),
    convertedLeads:z.number()
})

export type ILead = z.infer<typeof LeadSchema>;
export type BasicNumber=z.infer<typeof BasicNumberSchema>;
