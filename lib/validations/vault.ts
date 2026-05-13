import { z } from "zod";

export const fileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  category: z.enum(["TRUST", "PMA", "LLC", "PERSONAL", "TAX", "LEGAL"]),
  type: z.string(),
  size: z.number(),
  lastModified: z.string(),
  tags: z.array(z.string()).optional(),
});

export type FileMetadata = z.infer<typeof fileSchema>;
