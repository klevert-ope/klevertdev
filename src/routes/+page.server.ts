import { env } from "$env/dynamic/private";
import type { Post, PostsData } from "./store";

const apiURL = env.VITE_POSTSAPI_URL;
const Token = env.VITE_BEARER_TOKEN;

export async function load(): Promise<PostsData> {
  try {
    const response = await fetch(`${apiURL}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load posts.");
    }

    const fetchedPosts = await response.json();
    const sortedPosts = fetchedPosts.sort((a: Post, b: Post) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return {
      success: true,
      error: "",
      message: "Posts loaded successfully.",
      posts: sortedPosts
    };
  } catch (error:any) {
    return {
      success: false,
      message: "Failed to load posts. Please try again later.",
      error: error.message,
      posts: []
    };
  }
}
