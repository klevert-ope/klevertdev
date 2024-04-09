<svelte:head>
  <title>Klevert Opee</title>
  <meta content="A software engineer based in kenya" name="description" />
</svelte:head>

<script lang="ts">
  import { page } from "$app/stores";
  import type { PostsData } from "./store";
  import { error, isLoading, posts } from "./store";
  import { onMount } from "svelte";
  import timeSince from "$lib/timeago";
  import Smoother from "$lib/smoothscroll.svelte";
  import Footer from "$lib/footer.svelte";
  import Nav from "$lib/nav.svelte";
  import MailButton from "$lib/mailbutton.svelte";

  const numberPosts = 10;
  export let data: PostsData;

  onMount(() => {
    if (data.success === true && data.posts !== null) {
      posts.set(data.posts);
    } else if (data.error !== undefined) {
      error.set(data.error);
    }
    isLoading.set(false);
  });
</script>

<Smoother>
  <Nav />
  <section class="container line-h-1">
    <h1 class="font-xl font-bold padding-top-small">Klevert Opee</h1>
    <p
      class="font-md font-light padding-bottom xlarge-max-width padding-top-small">
      Software Engineer based in Kenya, specializing in backend
      development, frontend development, and DevOps strategies. I am eager
      to collaborate and create exceptional solutions together.
    </p>
    <h2 class="font-lg font-bold padding-top text-center large-max-width">
      Blog
    </h2>
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
      <p class="errormessage font-xs">Error: {$error}</p>
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
                   aria-current={$page.params.id === post.id}
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
	.errormessage {
		color: red;
		}

	.green-text {
		color: rgb(0, 175, 80);
		}

	.capitalize-first-letter::first-letter {
		text-transform: uppercase;
		}

	.uppercase {
		text-transform: uppercase;
		}

	.line-h-1 {
		line-height: 1.25;
		}

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
	  color: #0066cc;
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

	.font-xs {
		font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
		}

	.font-sm {
		font-size: calc(clamp(0.8rem, 0.7124rem + 0.3596vw, 1rem));
		}

	.font-md {
		font-size: calc(clamp(1.1rem, 1.0124rem + 0.3596vw, 1.3rem));
		}

	.font-lg {
		font-size: calc(clamp(1.4rem, 1.2247rem + 0.7191vw, 1.8rem));
		}

	.font-xl {
		font-size: calc(clamp(1.7rem, 1.3933rem + 1.2584vw, 2.4rem));
		}

	.font-light {
		font-weight: 300;
		}

	.font-normal {
		font-weight: 400;
		}

	.font-semi-bold {
		font-weight: 600;
		}

	.text-center {
		text-align: center;
		}

	.font-semi-bold {
		font-weight: 600;
		}

	.font-bold {
		font-weight: 700;
		}

	.container {
		width: 100%;
		margin-right: auto;
		margin-left: auto;
		padding-right: 15px;
		padding-left: 15px;

		/* Responsive breakpoints */
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

	.large-max-width {
		max-width: 600px;
		}

	.xlarge-max-width {
		max-width: 800px;
		}

	.border-top {
		border-top: 1px solid #000;
		}

	.padding-top {
		padding-top: 20px;
		}

	.padding-bottom {
		padding-bottom: 20px;
		}

	.padding-y {
		padding-top: 20px;
		padding-bottom: 20px;
		}

	.padding-top-small {
		padding-top: 5px;
		}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		}
</style>
