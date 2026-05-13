import { z } from "zod";

export const donationSchema = z.object({
  donor: z.string().min(3, "Donor name must be at least 3 characters"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  bucket: z.enum(["Religious", "Educational", "Wellness", "Charitable", "Family Welfare", "Operations"]),
  type: z.enum(["Cash", "Check", "Wire", "Crypto", "Asset"]),
  goodsServices: z.string().optional(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;
