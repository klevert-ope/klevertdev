import { writable } from "svelte/store";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
}

export interface PostsData {
  success: boolean;
  message: string;
  posts: Post[] | null;
  error?: string;
}


export const posts = writable<Post[]>([]);
export const paginatedPosts = writable<Post[]>([]);
export const error = writable<string | null>(null);
export const isLoading = writable(true);
export const currentPage = writable(1);
export const totalPages = writable(0);

