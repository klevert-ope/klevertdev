<svelte:head>
  <title>Editor</title>
  <script
    src="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.js"></script>
  <link
    href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.snow.css"
    rel="stylesheet"
  />
</svelte:head>

<script lang="ts">
  import { blogPostSchema } from "./postSchema";
  import QuillEditorForm from "./quillEditor.svelte";
  import {
    editorContent,
    form,
    initialFormData,
    initialFormErrors,
    QuillEditor,
    wordCountExcerpt,
    wordCountTitle
  } from "./store";

  import Smoother from "$lib/smoothscroll.svelte";
  import Footer from "$lib/footer.svelte";
  import ToastSuccess from "$lib/toastsuccess.svelte";
  import ToastError from "$lib/toasterror.svelte";


  const postsApiUrl = import.meta.env.VITE_POSTSAPI_URL;
  const bearerAuthToken = import.meta.env.VITE_BEARER_TOKEN;


  let showPassword = false;


  $: form.data.body = $editorContent;

  function resetForm() {
    form.data = { ...initialFormData };
    form.errors = { ...initialFormErrors };
    wordCountTitle.set(0);
    wordCountExcerpt.set(0);
    showPassword = false;
  }

  function resetEditorContent() {
    if ($QuillEditor !== null && $QuillEditor !== undefined) {
      $QuillEditor.setContents([{ insert: "" }]);
      editorContent.set("");
    }
  }

  function handleInputChangeError() {
    form.errors = { ...initialFormErrors };
  }

  function handleInputTitle(event: Event) {
    handleInputChangeError();
    if (event.target instanceof HTMLTextAreaElement) {
      form.data.title = event.target.value;
      wordCountTitle.set(form.data.title.trim().split(/\s+/).length);
    }
  }

  function handleInputExcerpt(event: Event) {
    if (event.target instanceof HTMLTextAreaElement) {
      form.data.excerpt = event.target.value;
      wordCountExcerpt.set(form.data.excerpt.trim().split(/\s+/).length);
    }
  }

  export async function handleSubmit() {
    form.isSubmitting = true;
    form.successMessage = "";
    form.errorMessage = "";
    form.errors = { ...initialFormErrors };

    if ($wordCountTitle > 15) {
      form.errors.title = "Title cannot exceed 15 words";
      form.isSubmitting = false;
      return;
    }
    if ($wordCountExcerpt > 60) {
      form.errors.excerpt = "Excerpt cannot exceed 60 words";
      form.isSubmitting = false;
      return;
    }

    if (form.data.token.trim() !== bearerAuthToken) {
      form.errors.token = "Token is incorrect";
      form.isSubmitting = false;
      return;
    }

    const validation = blogPostSchema.safeParse(form.data);

    if (!validation.success) {
      form.errors = validation.error.issues.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      form.isSubmitting = false;
      return;
    }

    try {
      const response = await fetch(`${postsApiUrl}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${form.data.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        const responseData = await response.json();
        form.errorMessage = `Error from API: ${responseData.message}`;
        form.isSubmitting = false;
        return form;
      }

      form.successMessage = "Post submitted successfully!";
      resetForm();
      resetEditorContent();
      form.isSubmitting = false;

      return form;

    } catch (error) {
      form.errorMessage = "Error submitting post. Please try again.";
      form.isSubmitting = false;
      return form;
    }
  }
</script>

<Smoother>
  <section>
    <h1 class="font-bold text-center font-xl padding-y">Editor</h1>
    <form class="padding-y container"
          method="post"
          on:submit|preventDefault={handleSubmit}
    >
      <label class="font-sm font-semi-bold" for="title">TITLE</label>
      <textarea bind:value={form.data.title}
                id="title"
                on:input={ event=> {
                          handleInputChangeError();
                          handleInputTitle(event);
                      }}
                placeholder="Write your title..."
      />
      <p class="font-xs flex-end">{$wordCountTitle}/15 Words</p>
      {#if form.errors.title}
        <p class="font-xs errormessage">{form.errors.title}</p>
      {/if}

      <label class="padding-top font-sm font-semi-bold"
             for="excerpt">EXCERPT</label>
      <textarea bind:value={form.data.excerpt}
                id="excerpt"
                on:input={ event=> {
                          handleInputChangeError();
                          handleInputExcerpt(event);
                      }}
                placeholder="Write your excerpt..."
      />
      <p class="font-xs flex-end">{$wordCountExcerpt}/60 Words</p>
      {#if form.errors.excerpt}
        <p class="font-xs errormessage">{form.errors.excerpt}</p>
      {/if}

      <label class="padding-top font-sm font-semi-bold"
             for="editorBody">BODY</label>
      <QuillEditorForm on:input={handleInputChangeError} />
      {#if form.errors.body}
        <p class="font-xs errormessage">{form.errors.body}</p>
      {/if}

      <label class="padding-top font-sm font-semi-bold" for="token">
        TOKEN
      </label>
      <div class="password-field flex-row">
        {#if showPassword}
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
          on:click={() => showPassword = !showPassword}
          type="button">
          {#if showPassword}
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

      {#if form.successMessage && !form.errorMessage}
        <ToastSuccess message={form.successMessage} />
      {/if}
      {#if form.errorMessage}
        <ToastError message={form.errorMessage} />
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

	input,
	textarea {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		}

	input {
		height: 30px;
		margin-right: 2px;
		}

	textarea {
		height: 100px;
		resize: vertical;
		}

	input,
	textarea:focus {
		outline: 1px solid #5e5d5d;
		}

	textarea::placeholder {
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
		color: #5e5d5d;
		}

	textarea::-webkit-input-placeholder { /* WebKit browsers (Chrome, Safari) */
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
		color: #5e5d5d;
		}

	textarea:-moz-placeholder { /* Mozilla Firefox */
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
		color: #5e5d5d;
		}

	textarea::-ms-input-placeholder { /* Internet Explorer 10-11 */
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
		color: #5e5d5d;
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
