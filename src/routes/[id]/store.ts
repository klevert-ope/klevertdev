import { writable } from "svelte/store";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  body: string;
}

export interface PostData {
  success: boolean;
  message: string;
  post: Post | null;
  error?: string;
}

export const post = writable<Post | null>(null);
export const error = writable<string | null>(null);
export const isLoading = writable(true);
