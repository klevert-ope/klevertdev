<script lang="ts">
  import { enhance } from "$app/forms";
  import FaRegEye from "svelte-icons/fa/FaRegEye.svelte";
  import FaRegEyeSlash from "svelte-icons/fa/FaRegEyeSlash.svelte";
  import QuillEditorForm from "./quillEditor.svelte";
  import {
    editorContent,
    errorMessage,
    form,
    initialFormData,
    initialFormErrors,
    isSubmitting,
    QuillEditor,
    showPassword,
    successMessage,
    wordCountExcerpt,
    wordCountTitle
  } from "./store";
  import { blogPostSchema } from "./blogPostSchema";

  $: form.data.body = $editorContent;

  function handleInputTitle(event: Event) {
    form.errors = { ...initialFormErrors };
    const inputElement = event.target as HTMLTextAreaElement;
    form.data.title = inputElement.value;
    wordCountTitle.set(form.data.title.trim().split(/\s+/).length);
  }

  function handleInputExcerpt(event: Event) {
    form.errors = { ...initialFormErrors };
    const inputElement = event.target as HTMLTextAreaElement;
    form.data.excerpt = inputElement.value;
    wordCountExcerpt.set(form.data.excerpt.trim().split(/\s+/).length);
  }

  function handleInputBody(event: Event) {
    form.errors = { ...initialFormErrors };
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.trim();
    form.data.body = inputValue;
    editorContent.set(inputValue);

    if (inputValue === "") {
      editorContent.set("");
      form.errors.body = "Body cannot be empty";
    } else {
      editorContent.set(inputValue);
      form.errors.body = "";
    }
  }

  function validateForm(): boolean {
    isSubmitting.set(false);
    const result = blogPostSchema.safeParse(form.data);
    form.errors = { ...initialFormErrors };
    errorMessage.set("");
    successMessage.set("");

    if (!result.success) {
      form.errors = result.error.issues.reduce((acc: typeof initialFormErrors, curr) => {
        if (curr.path[0] === 'title' && curr.code === 'custom') {
          acc[curr.path[0]] = curr.message;
        } else if (curr.path[0] === 'excerpt' && curr.code === 'custom') {
          acc[curr.path[0]] = curr.message;
        } else if (curr.path[0] === 'body' && curr.code === 'custom') {
          acc[curr.path[0]] = curr.message;
        } else {
          acc[curr.path[0] as keyof typeof initialFormErrors] = curr.message;
        }
        return acc;
      }, { ...initialFormErrors });
    }

    return result.success && !form.errors.title && !form.errors.excerpt &&
      !form.errors.body && !form.errors.token;
  }

  function resetForm() {
    form.data = { ...initialFormData };
    form.errors = { ...initialFormErrors };
    wordCountTitle.set(0);
    wordCountExcerpt.set(0);
    showPassword.set(false);
    if ($QuillEditor !== null && $QuillEditor !== undefined) {
      $QuillEditor.setContents([{ insert: "" }]);
      editorContent.set("");
    }
  }
</script>

<form action="/editor"
      class="padding-y container"
      method="POST"
      use:enhance={async () => {
        const isValid = validateForm();
        if (isValid) {
          isSubmitting.set(true);
          return async ({result }) => {
            if (result.type === "success") {
              successMessage.set("Post created successfully");
              resetForm()
            } else {
              errorMessage.set("An error occurred while submitting post");
            }
            isSubmitting.set(false);
          };
        }
      }}
>


  <label class="font-sm" for="title">TITLE</label>
  <textarea bind:value={form.data.title}
            id="title"
            name="title"
            on:input={ event=> {handleInputTitle(event);}}
            placeholder="Write your title..."
  />
  <p class="font-xs flex-end">{$wordCountTitle}/15 Words</p>
  {#if form.errors.title}
    <p class="font-xs errormessage">{form.errors.title}</p>
  {/if}

  <label class="padding-top font-sm"
         for="excerpt">EXCERPT</label>
  <textarea bind:value={form.data.excerpt}
            id="excerpt"
            name="excerpt"
            on:input={ event=> { handleInputExcerpt(event);}}
            placeholder="Write your excerpt..."
  />
  <p class="font-xs flex-end">{$wordCountExcerpt}/60 Words</p>
  {#if form.errors.excerpt}
    <p class="font-xs errormessage">{form.errors.excerpt}</p>
  {/if}

  <QuillEditorForm on:input={ event=> {handleInputBody(event);}} />
  {#if form.errors.body}
    <p class="font-xs errormessage">{form.errors.body}</p>
  {/if}

  <label class="padding-top font-sm" for="token">
    TOKEN
  </label>
  <div class="password-field flex-row">
    {#if $showPassword}
      <input type="text" autocomplete="off"
             bind:value={form.data.token}
             id="token"
             name="token"
      />
    {:else}
      <input type="password" autocomplete="new-password"
             bind:value={form.data.token}
             id="token"
             name="token"
      />
    {/if}
    <button
      class="unset"
      on:click={() => $showPassword = !$showPassword}
      type="button">
      {#if $showPassword}
        <div class="icon-password flex-col-center">
          <FaRegEye />
        </div>
      {:else}
        <div class="icon-password flex-col-center">
          <FaRegEyeSlash />
        </div>
      {/if}
    </button>
  </div>
  {#if form.errors.token}
    <p class="font-xs errormessage">{form.errors.token}</p>
  {/if}

  <div
    class="flex-end padding-y font-xs text-center nowrap font-medium">
    <button
      class="submit-button"
      disabled={$isSubmitting}
      type="submit">
      {$isSubmitting ? "Submitting..." : "Submit Post"}
    </button>
  </div>
</form>

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
	  border: 1px solid var(--white-black);
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
	  outline: 1px solid oklch(0.479 0.001 17.203);
		}

	textarea::placeholder {
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
	  color: oklch(0.479 0.001 17.203);
		}

	textarea::-webkit-input-placeholder {
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
	  color: oklch(0.479 0.001 17.203);
		}

	textarea:-moz-placeholder {
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
	  color: oklch(0.479 0.001 17.203);
		}

	textarea::-ms-input-placeholder {
		font-size: 13px;
		font-weight: normal;
		font-style: italic;
	  color: oklch(0.479 0.001 17.203);
		}

	.nowrap {
		white-space: nowrap;
		}

	button {
		all: unset;
		}

	.submit-button {
		width: 100px;
		height: 15px;
		padding: 10px;
		cursor: pointer;
		transition: color 0.3s ease;
	  color: var(--black-white);
		border: none;
		border-radius: 4px;
	  background-color: var(--white-black);
		}

	.submit-button:disabled {
		cursor: default;
		opacity: 0.5;
		}

	.submit-button:hover {
	  color: var(--orange-blue);
		}

  .icon-password {
		width: 26px;
		height: 26px;
		margin-left: 5px;
	  color: var(--white-black);
		}

  label {
	  color: var(--orange-blue);
	  }

	.errormessage {
	  color: oklch(0.628 0.258 29.234);
		}

	.font-xs {
		font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
		}

	.font-sm {
		font-size: calc(clamp(0.8rem, 0.7124rem + 0.3596vw, 1rem));
		}

	.font-medium {
		font-weight: 500;
		}

	.text-center {
		text-align: center;
		}

	.container {
		width: 100%;
		margin-right: auto;
		margin-left: auto;
		padding-right: 15px;
		padding-left: 15px;

		@media (min-width: 540px) {
			width: 540px;
			}
		@media (min-width: 720px) {
			width: 720px;
			}
		@media (min-width: 960px) {
			width: 960px;
			}
		@media (min-width: 1140px) {
			width: 1140px;
			}
		}

	.padding-top {
		padding-top: 20px;
		}

	.padding-y {
		padding-top: 20px;
		padding-bottom: 20px;
		}

	.flex-row {
		display: flex;
		flex-direction: row;
		}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		}

	.flex-col-center {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		}
</style>
