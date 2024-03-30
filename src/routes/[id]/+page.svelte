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
  <script
    src="https://cdn.jsdelivr.net/npm/dompurify@3.0.11/dist/purify.min.js">
  </script>
  <script
    src="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from "svelte";
  import { error, isLoading, post } from "../post/store";

  import Smoother from "$lib/smoothscroll.svelte";
  import Footer from "$lib/footer.svelte";
  import Nav from "$lib/nav.svelte";

  const postsApiUrl = import.meta.env.VITE_POSTSAPI_URL;
  const bearerAuthToken = import.meta.env.VITE_BEARER_TOKEN;

  function convertDeltaToHtml(delta: any): string {
    // @ts-ignore
    const quill = new Quill(document.createElement("div"));
    quill.setContents(delta);
    const rawHtml = quill.root.innerHTML;
    // @ts-ignore
    return DOMPurify.sanitize(rawHtml);
  }

  async function fetchPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
      error.set("Missing post ID in the URL.");
      return;
    }

    try {
      const response = await fetch(`${postsApiUrl}/posts?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerAuthToken}`
        }
      });

      if (!response.ok) {
        new Error(`Error fetching post: ${response.statusText}`);
      }

      const postData = await response.json();
      const parsedDelta = JSON.parse(postData.body);
      post.set({
        id: postData.id,
        title: postData.title,
        excerpt: postData.excerpt,
        body: convertDeltaToHtml(parsedDelta)
      });
    } catch (err) {
      error.set("Failed to load post. Please try again later.");
    } finally {
      isLoading.set(false);
    }
  }

  onMount(fetchPost);
</script>

<Smoother>
  <Nav />
  <section class="container h-svh">
    {#if $isLoading}
      <div class="large-max-width">
        <div class="loading-skeleton h-small margin-top"></div>
        <div class="loading-skeleton h-large margin-top"></div>
      </div>
    {:else if $error}
      <p>Error: {$error}</p>
    {:else if $post}
      <div class="large-max-width">
        <h1
          class="padding-y green-text font-lg font-semi-bold">{$post.title}</h1>
        <div
          class="padding-bottom font-sm line-h-small">{@html $post.body}</div>
      </div>
    {/if}
  </section>
  <Footer />
</Smoother>


<style>
	.h-large {
		height: 100vh;
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
				rgb(236, 236, 236) 0px,
				rgb(244, 244, 244) 40px,
				rgb(236, 236, 236) 80px
		);
		background-image: -o-linear-gradient(
				left,
				rgb(236, 236, 236) 0px,
				rgb(244, 244, 244) 40px,
				rgb(236, 236, 236) 80px
		);
		background-image: linear-gradient(
				90deg,
				rgb(236, 236, 236) 0px,
				rgb(244, 244, 244) 40px,
				rgb(236, 236, 236) 80px
		);
		background-size: 250px;
		}
</style>
