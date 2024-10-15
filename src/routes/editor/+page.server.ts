import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const apiURL = env.VITE_POSTSAPI_URL;

export const actions = {
  default: async ({ request }: { request: Request }) => {
    try {
      const data = await request.formData();
      const title = data.get("title") as string;
      const excerpt = data.get("excerpt") as string;
      const body = data.get("body") as string;
      const token = data.get("token") as string;

      const response = await fetch(`${apiURL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-sveltekit-action": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, excerpt, body }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, {
          message: errorData.message || "Failed to create post"
        });
      }

      return { success: true, message: "Post created successfully" };
    } catch (error) {
      console.error("Server error:", error);
      return fail(500, { message: "Server error" });
    }
  },
};
