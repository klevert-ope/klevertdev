import { env } from "$env/dynamic/private";
import type { PostData } from "./store";

const apiURL = env.VITE_POSTSAPI_URL;
const Token = env.VITE_BEARER_TOKEN;

export async function load({ url }): Promise<PostData> {
  const id = url.searchParams.get("id");

  if (!id) {
    return {
      success: false,
      error: "Missing [id] ID in the URL.",
      post: null,
      message: "Missing [id] ID in the URL."
    };
  }

  try {
    const response = await fetch(`${apiURL}/posts?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching post: ${response.statusText}`);
    }

    const postData = await response.json();
    return {
      success: true,
      error: "",
      message: "Post loaded successfully.",
      post: {
        id: postData.id,
        title: postData.title,
        excerpt: postData.excerpt,
        body: postData.body,
      },
    };
  } catch (error:any) {
    return {
      success: false,
      error: error.message,
      post: null,
      message: "Failed to load [id]. Please try again later."
    };
  }
}
