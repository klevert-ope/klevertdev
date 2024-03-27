import { writable } from "svelte/store";
import { blogPostSchema } from "./postSchema";
import { z } from "zod";

export const editorContent = writable("");
export const wordCountTitle = writable(0);
export const wordCountExcerpt = writable(0);
export const wordCountBody = writable(0);
export const QuillEditor = writable<any>(null);

interface FormData {
  title: string;
  excerpt: string;
  body: string;
  token: string;
}

export const initialFormData = { title: "", excerpt: "", body: "", token: "" };
export const initialFormErrors = {
  title: "",
  excerpt: "",
  body: "",
  token: "",
};
export const form: {
  data: FormData;
  errors: z.infer<typeof blogPostSchema>;
  isSubmitting: boolean;
  successMessage: string;
  errorMessage: string;
} = {
  data: { ...initialFormData },
  errors: { ...initialFormErrors },
  isSubmitting: false,
  successMessage: "",
  errorMessage: "",
};
