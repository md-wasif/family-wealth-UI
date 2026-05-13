import { z } from "zod";

export const assetSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters"),
  costBasis: z.coerce.number().min(0, "Cost basis must be a positive number"),
  coa: z.string().min(1, "COA code is required"),
  dateAcquired: z.string().min(1, "Acquisition date is required"),
  noteHolder: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;

export const drawSchema = z.object({
  noteId: z.string().min(1, "Please select a demand note"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  purpose: z.string().min(3, "Purpose must be at least 3 characters"),
});

export type DrawFormValues = z.infer<typeof drawSchema>;
