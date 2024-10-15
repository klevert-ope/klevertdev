<svelte:head>
  <title>Editor</title>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css"
        rel="stylesheet" />
</svelte:head>

<script lang="ts">
  import EditorForm from "./form.svelte";
  import Footer from "$lib/footer.svelte";
  import { errorMessage, successMessage } from "./store";
  import ToastForm from "$lib/toastform.svelte";
</script>

<section>
  <section>
    <h1 class="font-bold text-center font-lg padding-y text-orange">Editor</h1>
    <EditorForm />
  </section>
  <Footer />
</section>
{#if $successMessage}
  <ToastForm message={$successMessage} type="success" />
{:else if $errorMessage}
  <ToastForm message={$errorMessage} type="error" />
{/if}

<style>
	.text-orange {
		color: var(--orange-blue);
		}

	.font-lg {
		font-size: calc(clamp(1.4rem, 1.2247rem + 0.7191vw, 1.8rem));
		}

	.font-bold {
		font-weight: 700;
		}

	.text-center {
		text-align: center;
		}

	.padding-y {
		padding-top: 20px;
		padding-bottom: 20px;
		}
</style>
