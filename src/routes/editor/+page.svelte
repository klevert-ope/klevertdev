<svelte:head>
  <title>Editor</title>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.4/dist/quill.snow.css"
        rel="stylesheet" />
</svelte:head>

<script lang="ts">
  import EditorForm from "./form.svelte";
  import Footer from "$lib/footer.svelte";
  import Smoother from "$lib/smoothscroll.svelte";
  import { errorMessage, successMessage } from "./store";
  import ToastForm from "$lib/toastform.svelte";
</script>

<Smoother>
  <section>
    <h1 class="font-bold text-center font-xl padding-y">Editor</h1>
    <EditorForm />
  </section>
  <Footer />
</Smoother>
{#if $successMessage}
  <ToastForm message={$successMessage} type="success" />
{:else if $errorMessage}
  <ToastForm message={$errorMessage} type="error" />
{/if}

<style>
	.font-xl {
		font-size: calc(clamp(1.7rem, 1.3933rem + 1.2584vw, 2.4rem));
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
