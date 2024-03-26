<svelte:head>
  <title>Klevert Opee</title>
  <meta content="A software engineer based in kenya" name="description" />
</svelte:head>

<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import timeSince from "$lib/timeago";
  import Smoother from "$lib/smoothscroll.svelte";
  import Footer from "$lib/footer.svelte";
  import Nav from "$lib/nav.svelte";
  import MailButton from "$lib/mailbutton.svelte";

  const postsApiUrl = import.meta.env.VITE_POSTSAPI_URL;
  const bearerAuthToken = import.meta.env.VITE_BEARER_TOKEN;

  interface Post {
    id: string;
    title: string;
    excerpt: string;
    created_at: string;
  }

  let numberPosts = 10;

  export const posts = writable<Post[]>([]);
  export const isLoading = writable(true);
  export const error = writable<string | null>(null);

  async function fetchPosts() {
    isLoading.set(true);
    error.set(null);

    try {
      const response = await fetch(`${postsApiUrl}/posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerAuthToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.statusText}`);
      }

      const fetchedPosts = await response.json();
      const sortedPosts = fetchedPosts.sort((a: Post, b: Post) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      posts.set(sortedPosts);
    } catch (err) {
      error.set("Failed to load posts. Please try again later.");
    } finally {
      isLoading.set(false);
    }
  }

  onMount(fetchPosts);
</script>


<Smoother>
  <Nav />
  <section class="container">
    <h1 class="font-xl padding-top-small">Klevert Opee</h1>
    <p
      class="font-md font-light padding-bottom xlarge-max-width padding-top-small">
      Software Engineer based in Kenya, specializing in backend
      development, frontend development, and DevOps strategies. I am eager
      to collaborate and create exceptional solutions together.
    </p>
    <h2 class="font-lg padding-top text-center large-max-width">Blog</h2>
    <p
      class="font-sm font-normal padding-bottom padding-top-small large-max-width">
      Here, I share my programming experiences and insights into the
      ever-evolving world of technology, from tackling programming
      challenges to exploring the latest trends. Interested? Give it a
      read!
    </p>

    {#if $isLoading}
      <div class="large-max-width">
        {#each Array(numberPosts) as _, index}
          <div {...{ key: index }} class="padding-bottom">
            <div class="loading-skeleton"></div>
          </div>
        {/each}
      </div>
    {:else if $error}
      <p>Error: {$error}</p>
    {:else}
      <ul>
        {#each $posts as post}
          <li class="padding-y border-top large-max-width">
            <h3
              class="font-md font-semi-bold uppercase green-text">{post.title}</h3>
            <p class="font-sm padding-top-small capitalize-first-letter">
              {post.excerpt}
            </p>
            <div class="flex-end padding-top">
              <button class="button">
                <a href={`/post/?id=${post.id}`}
                   class="font-xs"
                   aria-current={$page.url.pathname === '/post/?id=${post.id}'}
                >
                  Read More
                </a>
              </button>
            </div>
            <p class="font-xs">{timeSince(post.created_at)}</p>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
  <Footer />
</Smoother>
<MailButton />


<style>
	.button {
		width: 100px;
		padding: 0 0 3px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		transform: rotate(5deg);
		transform-origin: center;
		text-decoration: none;
		border: none;
		border-radius: 5px;
		background-color: rgb(0, 175, 80);
		box-shadow: 0 2px 0 rgb(73, 74, 75);
		}

	.button a {
		display: block;
		padding: 0.5rem 1rem;
		border: 2px solid rgb(73, 74, 75);
		border-radius: 5px;
		background: rgb(241, 245, 248);
		}

	.button:active {
		padding-bottom: 0;
		transform: translateY(5px);
		outline: 0;
		}

	.loading-skeleton {
		height: 150px;
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
