<svelte:head>
  <title>Editor</title>
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.js"
          type="module">
  </script>
</svelte:head>

<script lang="ts" type="module">
  import Footer from "$lib/footer.svelte";
  import Smoother from "$lib/smoothscroll.svelte";
  import ToastForm from "$lib/toastform.svelte";
  import FaRegEye from "svelte-icons/fa/FaRegEye.svelte";
  import FaRegEyeSlash from "svelte-icons/fa/FaRegEyeSlash.svelte";
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
            <div class="icon flex-col-center">
              <FaRegEye />
            </div>
          {:else}
            <div class="icon flex-col-center">
              <FaRegEyeSlash />
            </div>
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
        <ToastForm message={form.successMessage} type="success" />
      {/if}
      {#if form.errorMessage}
        <ToastForm message={form.errorMessage} type="error" />
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

	.icon {
		width: 26px;
		height: 26px;
		margin-left: 5px;
		color: #141414;
		}

	.errormessage {
		color: red;
		}
</style>
