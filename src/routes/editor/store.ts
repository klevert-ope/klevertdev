import { writable } from "svelte/store";
import { blogPostSchema } from "./blogPostSchema";
import { z } from "zod";

export const editorContent = writable("");
export const wordCountTitle = writable(0);
export const wordCountExcerpt = writable(0);
export const wordCountBody = writable(0);
export const QuillEditor = writable<any>(null);
export const successMessage = writable("");
export const errorMessage = writable("");
export const isSubmitting = writable(false);
export const showPassword = writable(false);

export interface FormData {
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
} = {
  data: { ...initialFormData },
  errors: { ...initialFormErrors },
};
