import { writable } from "svelte/store";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
}

export const posts = writable<Post[]>([]);
export const isLoading = writable(true);
export const error = writable<string | null>(null);
