import { z } from "zod";

const maxWordCount = (max: number, message: string) =>
  z.string().superRefine((value, ctx) => {
    if (value.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: `${ctx.path[0]} cannot be empty`,
      });
    }
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount > max) {
      ctx.addIssue({
        code: "custom",
        message,
      });
    }
  });

export const blogPostSchema = z.object({
  title: maxWordCount(15, "Title cannot exceed 15 words"),
  excerpt: maxWordCount(60, "Excerpt cannot exceed 60 words"),
  body: maxWordCount(1500, "Body cannot exceed 1500 words"),
  token: z.string().min(1, "Token cannot be empty"),
});
