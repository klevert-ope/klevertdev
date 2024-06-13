<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let errorMessage = '$page.error.message';
  let errorStatus = Number($page.status);

  onMount(() => {
    if (errorStatus === 404) {
      errorMessage = 'Page not Found';
    } else if (errorStatus === 500) {
      errorMessage = 'Server Error';
    }
  });
</script>

<div class="error-page">
  <h2 class="font-lg font-semi-bold errormessage padding-bottom">{errorStatus} |
    {errorMessage}</h2>
  <p class="font-sm">
    {#if errorStatus === 404}
      The page you are looking for does not exist or has been moved.
    {:else if errorStatus === 500}
      We are sorry, but something went wrong. Please check your internet
      connection and try again.
    {/if}
  </p>
</div>

<style>
	.error-page {
		text-align: center;
		padding: 50px;
		}

	.errormessage {
		color: red;
		}

	.font-lg {
		font-size: calc(clamp(1.4rem, 1.2247rem + 0.7191vw, 1.8rem));
		}

	.font-sm {
		font-size: calc(clamp(0.8rem, 0.7124rem + 0.3596vw, 1rem));
		}

	.font-semi-bold {
		font-weight: 600;
		}

	.padding-bottom{
		padding-bottom: 10px;
		}
</style>
