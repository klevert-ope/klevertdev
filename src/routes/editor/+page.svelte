<script lang="ts">
  import { z } from "zod";
  import { blogPostSchema } from "./postSchema";
  import QuillEditor from "./quillEditor.svelte";
  import { editorContent, resetEditorContent } from "./editorContentStore";
  import Smoother from "$lib/smoothscroll.svelte";
  import Footer from "$lib/footer.svelte";
  import Toast from "$lib/toast.svelte";


  let wordCountTitle = 0;
  let wordCountExcerpt = 0;

  interface FormData {
    title: string;
    excerpt: string;
    body: string;
    token: string;
  }

  let form: {
    data: FormData;
    errors: z.infer<typeof blogPostSchema>;
    isSubmitting: boolean;
    successMessage: string;
  } = {
    data: {
      title: "",
      excerpt: "",
      body: "",
      token: ""
    },
    errors: { title: "", excerpt: "", body: "", token: "" },
    isSubmitting: false,
    successMessage: ""
  };

  let show_password = false;

  $: form.data.body = $editorContent;

  function handleInputChangeError() {
    form.errors = { title: "", excerpt: "", body: "", token: "" };
  }

  function handleInputTitle(event: Event) {
    form.errors = { title: "", excerpt: "", body: "", token: "" };
    if (event.target instanceof HTMLTextAreaElement) {
      form.data.title = event.target.value;
      wordCountTitle = form.data.title.trim().split(/\s+/).length;
    }
  }

  function handleInputExcerpt(event: Event) {
    if (event.target instanceof HTMLTextAreaElement) {
      form.data.excerpt = event.target.value;
      wordCountExcerpt = form.data.excerpt.trim().split(/\s+/).length;
    }
  }

  export async function handleSubmit() {
    form.isSubmitting = true;
    form.successMessage = "";

    const validation = blogPostSchema.safeParse(form.data);

    if (!validation.success) {
      form.errors = validation.error.issues.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      form.isSubmitting = false;
      return;
    }
    if (form.data.token.trim() !== import.meta.env.VITE_BEARER_TOKEN) {
      form.errors.token = "Invalid token";
      form.isSubmitting = false;
      return;
    }
    try {
      const response = await fetch("https://blogapi.klevertopee.com/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${form.data.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        new Error("Failed to submit post");
      }

      form.successMessage = "Post submitted successfully!";
      form.data = { title: "", excerpt: "", body: "", token: "" };
      resetEditorContent();
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      form.isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Editor</title>
</svelte:head>

<Smoother>
  <section>
    <h1 class="font-bold text-center font-xl padding-y">Blog Editor</h1>
    <form class="padding-y container"
          on:submit|preventDefault={handleSubmit}>
      <label class="font-lg font-semi-bold" for="title">Title</label>
      <textarea bind:value={form.data.title}
                id="title"
                on:input={ event=> {
                          handleInputChangeError();
                          handleInputTitle(event);
                      }}
                placeholder="Title..."
      />
      <p class="font-xs flex-end">{wordCountTitle}/15 Words</p>
      {#if form.errors.title}
        <p class="font-xs errormessage">{form.errors.title}</p>
      {/if}

      <label class="padding-top font-lg font-semi-bold"
             for="excerpt">Excerpt</label>
      <textarea bind:value={form.data.excerpt}
                id="excerpt"
                on:input={ event=> {
                          handleInputChangeError();
                          handleInputExcerpt(event);
                      }}
                placeholder="Excerpt..."
      />
      <p class="font-xs flex-end">{wordCountExcerpt}/60 Words</p>
      {#if form.errors.excerpt}
        <p class="font-xs errormessage">{form.errors.excerpt}</p>
      {/if}

      <label class="padding-top font-lg font-semi-bold"
             for="editorBody">Body</label>
      <QuillEditor on:input={handleInputChangeError} />
      {#if form.errors.body}
        <p class="font-xs errormessage">{form.errors.body}</p>
      {/if}

      <label class="padding-top font-lg font-semi-bold" for="token">Bearer
        Token</label>
      <div class="password-field flex-row">
        {#if show_password}
          <input type="text" autocomplete="off"
                 bind:value={form.data.token}
                 id="token"
                 on:input={handleInputChangeError} />
        {:else}
          <input type="password" autocomplete="new-password"
                 bind:value={form.data.token}
                 id="token"
                 on:input={handleInputChangeError} />
        {/if}
        <button
          class="unset"
          on:click={() => show_password = !show_password}
          type="button">
          {#if show_password}
            <svg width="30px" height="30px"
                 viewBox="0 0 24.00 24.00" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                 stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z"
                  stroke="#000000"
                  stroke-width="0.21600000000000003"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98"
                      stroke="#000000"
                      stroke-width="0.21600000000000003"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
                <path d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01"
                      stroke="#000000"
                      stroke-width="0.21600000000000003"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
              </g>
            </svg>
          {:else}
            <svg width="30px" height="30px" viewBox="0 0 24 24"
                 fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                 stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83"
                  stroke="#000000"
                  stroke-width="0.21600000000000003"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01"
                  stroke="#000000"
                  stroke-width="0.21600000000000003"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z"
                  stroke="#000000"
                  stroke-width="0.21600000000000003"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path d="M20.9994 3L17.6094 6.39"
                      stroke="#000000"
                      stroke-width="0.21600000000000003"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
                <path d="M6.38 17.62L3 21" stroke="#000000"
                      stroke-width="0.21600000000000003"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
                <path
                  d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23"
                  stroke="#000000"
                  stroke-width="0.21600000000000003"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </g>
            </svg>
          {/if}
        </button>
      </div>
      {#if form.errors.token}
        <p class="font-xs errormessage">{form.errors.token}</p>
      {/if}

      <div class="flex-end padding-y font-xs text-center nowrap font-medium">
        <button
          class="submit-button unset"
          disabled={form.isSubmitting}
          type="submit">
          {form.isSubmitting ? "Submitting..." : "Submit Post"}
        </button>
      </div>

      {#if form.successMessage}
        <Toast message={form.successMessage} />
      {/if}
    </form>
  </section>
  <Footer />
</Smoother>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 1000px;
		gap: 1rem;
		}

	input, textarea {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		}

	textarea {
		height: 150px;
		resize: vertical;
		}

	.nowrap {
		white-space: nowrap;
		}

	.submit-button {
		width: 100px;
		height: 15px;
		padding: 10px;
		cursor: pointer;
		transition: color 0.3s ease;
		color: white;
		border: none;
		border-radius: 4px;
		background-color: #141414;
		}

	.submit-button:disabled {
		cursor: default;
		opacity: 0.5;
		}

	.submit-button:hover {
		color: #85E13A;
		}

	.errormessage {
		color: red;
		}

</style>
