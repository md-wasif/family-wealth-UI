import { z } from "zod";

export const taxSchema = z.object({
  filingStatus: z.enum(["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"]),
  wages: z.coerce.number().min(0),
  businessIncome: z.coerce.number().min(0),
  dividends: z.coerce.number().min(0),
  capitalGains: z.coerce.number().min(0),
  otherIncome: z.coerce.number().min(0),
  standardDeduction: z.boolean().default(true),
  itemizedDeductions: z.coerce.number().min(0).optional(),
  taxCredits: z.coerce.number().min(0).optional(),
});

export type TaxFormValues = z.infer<typeof taxSchema>;
