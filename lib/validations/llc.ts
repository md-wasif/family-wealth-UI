import { z } from "zod";

export const llcSchema = z.object({
  name: z.string().min(3, "LLC name must be at least 3 characters"),
  state: z.string().min(1, "Formation state is required"),
  ein: z.string().optional(),
  manager: z.string().min(1, "Manager name is required"),
  purpose: z.string().min(5, "Business purpose is required"),
});

export const memberSchema = z.object({
  name: z.string().min(1, "Member name is required"),
  ownership: z.coerce.number().min(0.01).max(100),
  contribution: z.coerce.number().min(0),
  role: z.enum(["Member", "Manager", "Managing Member"]),
});

export type LLCFormValues = z.infer<typeof llcSchema>;
export type MemberFormValues = z.infer<typeof memberSchema>;
