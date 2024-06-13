import type { Actions } from "./$types";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const apiURL = env.VITE_POSTSAPI_URL;
export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get("title");
    const excerpt = data.get("excerpt");
    const body = data.get("body");
    const token = data.get("token");

    try {
      const submission = await fetch(`${apiURL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-sveltekit-action": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, excerpt, body }),
      });

      if (!submission.ok) {
        const errorData = await submission.json();
        return fail(submission.status, {
          message: errorData.message || "Invalid data",
        });
      }

      return { success: true, message: "Post created successfully" };
    } catch (error) {
      return fail(500, { message: "Server error" });
    }
  },
};

