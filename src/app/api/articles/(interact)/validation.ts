import z from "zod";

export const articleValidationScheme = z
  .object({
    contentPreview: z.string().max(1_000_000).min(180),
    title: z.string().max(30).min(4),
  })
  .required();
