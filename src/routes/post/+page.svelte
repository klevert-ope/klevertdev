<svelte:head>
  {#if $post}
    <title>{$post.title}</title>
    <meta name="description" content={$post.excerpt} />
    <meta itemprop="name" content={$post.title} />
    <meta itemprop="description" content={$post.excerpt} />
    <meta property="og:title" content={$post.title} />
    <meta property="og:description" content={$post.excerpt} />
    <meta property="twitter:title" content={$post.title} />
    <meta property="twitter:description" content={$post.excerpt} />
  {/if}
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css"
        rel="stylesheet" />
</svelte:head>

<script lang="ts">
  import { onMount } from "svelte";
  import type { PostData } from "./store";
  import { error, isLoading, post } from "./store";
  import Footer from "$lib/footer.svelte";
  import Nav from "$lib/nav.svelte";
  import { convertDeltaToHtml } from "./delta";

  export let data: PostData;
  let bodyHtml = "";

  onMount(async () => {
    if (data.success === true && data.post !== null) {
      post.set(data.post);
      bodyHtml = await convertDeltaToHtml(JSON.parse(data.post.body));
    } else if (data.error !== undefined) {
      error.set(data.error);
    }
    isLoading.set(false);
  });
</script>

<section>
  <Nav />
  <section class="container h-svh">
    {#if $isLoading}
      <div class="large-max-width">
        <div class="loading-skeleton h-small margin-top"></div>
        <div class="loading-skeleton h-large margin-top"></div>
      </div>
    {:else if $error}
      <p class="font-xs errormessage">Error: {$error}</p>
    {:else if $post}
      <div class="large-max-width">
        <h1
          class="padding-y yellow-blue-text font-lg font-semi-bold opera-font">{$post.title}</h1>
        <div
          class="padding-bottom font-sm line-h-small post-body">{@html bodyHtml}</div>
      </div>
    {/if}
  </section>
  <Footer />
</section>


<style>
    .opera-font {
	  font-family: 'Opera', sans-serif;
	  }

	.errormessage {
	  color: oklch(0.628 0.258 29.234);
		}

  .yellow-blue-text {
	  color: var(--orange-blue);
		}

	.line-h-small {
		line-height: 20px;
		}

	.h-large {
	  height: 100svh;
		}

	.h-small {
		height: 50px;
		}

	.loading-skeleton {
		-webkit-animation: shine-loading-image 2s infinite ease-out;
		animation: shine-loading-image 2s infinite ease-out;
		border-radius: 5px;
		background-image: -webkit-linear-gradient(
				left,
		oklch(0.943 0 89.876) 0px,
		oklch(0.967 0 89.876) 40px,
		oklch(0.943 0 89.876) 80px
		);
		background-image: -o-linear-gradient(
				left,
		oklch(0.943 0 89.876) 0px,
		oklch(0.967 0 89.876) 40px,
		oklch(0.943 0 89.876) 80px
		);
		background-image: linear-gradient(
				90deg,
		oklch(0.943 0 89.876) 0px,
		oklch(0.967 0 89.876) 40px,
		oklch(0.943 0 89.876) 80px
		);
		background-size: 250px;
		}

	.font-xs {
		font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
		}

	.font-sm {
		font-size: calc(clamp(0.8rem, 0.7124rem + 0.3596vw, 1rem));
		}

	.font-lg {
		font-size: calc(clamp(1.4rem, 1.2247rem + 0.7191vw, 1.8rem));
		}

	.font-semi-bold {
		font-weight: 600;
		}

	.margin-top {
		margin-top: 20px;
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

	.padding-bottom {
		padding-bottom: 20px;
		}

	.padding-y {
		padding-top: 20px;
		padding-bottom: 20px;
		}

	.large-max-width {
	  max-width: 1000px;
		}

	.h-svh {
		min-height: 100svh;
		}
</style>
