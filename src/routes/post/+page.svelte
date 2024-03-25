<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import Smoother from "$lib/smoothscroll.svelte";
  import Footer from "$lib/footer.svelte";
  import Nav from "$lib/nav.svelte";

  interface Post {
    id: string;
    title: string;
    body: string;
  }

  export const post = writable<Post | null>(null);
  export const isLoading = writable(true);
  export const error = writable<string | null>(null);

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
      const response = await fetch(`https://blogapi.klevertopee.com/posts?id=${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
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
        body: convertDeltaToHtml(parsedDelta)
      });
    } catch (err: any) {
      error.set(err.message);
    } finally {
      isLoading.set(false);
    }
  }

  onMount(fetchPost);
</script>

<svelte:head>
  <title>Blogpost</title>
  <meta content="Here, I share my programming experiences and insights into the
      ever-evolving world of technology, from tackling programming
      challenges to exploring the latest trends. Interested? Give it a
      read!" name="description" />
</svelte:head>
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
