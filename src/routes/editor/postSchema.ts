import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .trim()
    .refine((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount <= 15 ? true : "Title cannot exceed 15 words";
    }),
  excerpt: z
    .string()
    .min(1, "Excerpt cannot be empty")
    .refine((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount <= 60 ? true : "Excerpt cannot exceed 60 words";
    }),
  body: z
    .string()
    .min(1, "Body cannot be empty")
    .refine((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount <= 1500 ? true : "Body cannot exceed 1500 words";
    }),
  token: z.string().min(1, "Token cannot be empty"),
});
