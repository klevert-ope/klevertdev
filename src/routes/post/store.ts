import { writable } from "svelte/store";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  body: string;
}

export const post = writable<Post | null>(null);
export const isLoading = writable(true);
export const error = writable<string | null>(null);
