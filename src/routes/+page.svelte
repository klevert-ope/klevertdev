<svelte:head>
  <title>Klevert Opee</title>
  <meta content="A software engineer based in Kenya" name="description" />
</svelte:head>

<script lang="ts">
  import { page } from "$app/stores";
  import type { PostsData } from "./store";
  import {
    currentPage,
    error,
    isLoading,
    paginatedPosts,
    posts,
    totalPages
  } from "./store";
  import { beforeUpdate, onMount } from "svelte";
  import timeSince from "$lib/timeago";
  import Footer from "$lib/footer.svelte";
  import Nav from "$lib/nav.svelte";
  import MailButton from "$lib/mailbutton.svelte";
  import IoIosArrowDropleftCircle
    from "svelte-icons/io/IoIosArrowDropleftCircle.svelte";
  import IoIosArrowDroprightCircle
    from "svelte-icons/io/IoIosArrowDroprightCircle.svelte";

  export let data: PostsData;
  const numberPosts = 10;
  const numberPostsPerPage = 10;

  const getPaginatedPosts = () => {
    if (!data || !data.posts || data.posts.length === 0) {
      return [];
    }

    const startIndex = ($currentPage - 1) * numberPostsPerPage;
    const endIndex = startIndex + numberPostsPerPage;
    return data.posts.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if ($currentPage < $totalPages) {
      currentPage.set($currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if ($currentPage > 1) {
      currentPage.set($currentPage - 1);
    }
  };
  onMount(() => {
    if (data.success === true && data.posts !== null) {
      posts.set(data.posts);
    } else if (data.error !== undefined) {
      error.set(data.error);
    }
    isLoading.set(false);

    $paginatedPosts = getPaginatedPosts();
    if (data.posts !== null) {
      $totalPages = Math.ceil(data.posts.length / numberPostsPerPage);
    }
  });

  beforeUpdate(() => {
    $paginatedPosts = getPaginatedPosts();
    if (data.posts !== null) {
      $totalPages = Math.ceil(data.posts.length / numberPostsPerPage);
    }
  });
</script>

<section>
  <Nav />
  <section class="container">
    <h1 class="font-xl font-bold padding-top-md yellow-blue-text opera-font">
      Klevert Opee
    </h1>
    <p
      class="font-md font-normal padding-bottom xlarge-max-width padding-top-sm">
      They say the future is code, and I'm here to help you navigate it. Based
      in Nairobi, Kenya, I'm a full-stack developer passionate about crafting
      clean, efficient software from the ground up. When I'm not elbow-deep in
      code, I share my programming journeys and tech explorations through
      insightful blog posts.
    </p>
    <h2
      class="font-lg font-bold padding-top text-center large-max-width yellow-blue-text opera-font">
      Blog
    </h2>
    <p
      class="font-md font-normal padding-bottom padding-top-sm large-max-width">
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
        {#each $paginatedPosts as post (post.id)}
          <li class="padding-y border-top large-max-width margin-bottom">
            <h3
              class="font-md font-semi-bold uppercase yellow-blue-text opera-font">
              {post.title}
            </h3>
            <p
              class="font-sm padding-top-sm padding-bottom-sm capitalize-first-letter">
              {post.excerpt}
            </p>
            <p
              class="font-xs badge border font-semi-bold">{timeSince(post.created_at)}</p>
            <div class="flex-end padding-top">
              <a href={`/post?id=${post.id}`}
                 aria-current={$page.params.id === post.id}
              >
                <button class="button learn-more font-xs font-semi-bold"
                        aria-label="read post"
                >
                  Read More
              </button>
              </a>
            </div>
          </li>
        {/each}
      </ul>
    {/if}

    <div
      class="pagination flex-row-center padding-top padding-bottom-lg large-max-width">
      <button class="icon-direction"
              disabled={$currentPage === 1}
              on:click={handlePreviousPage}>
        <IoIosArrowDropleftCircle />
      </button>
      <span class="font-xs font-semi-bold mx-small">{$currentPage}</span>
      <button class="icon-direction"
              disabled={$currentPage === $totalPages}
              on:click={handleNextPage}>
        <IoIosArrowDroprightCircle />
      </button>
    </div>
  </section>
  <Footer />
</section>
<MailButton />

<style>
	.opera-font {
		font-family: 'Opera', sans-serif;
		}

	.margin-bottom {
		margin-bottom: 10px;
		}

	button {
		all: unset;
		}

	.badge {
		max-width: 40px;
		height: 20px;
		padding: 4px 8px 4px 8px;
		text-align: center;
		color: var(--black-white);
		border-radius: 5px;
		background-color: var(--white-black);
		}

	.icon-direction {
		width: 40px;
		height: 40px;
		cursor: pointer;
		color: var(--white-black);
		}

	.icon-direction:disabled {
		color: var(--white-black-fade);
		}

	.icon-direction:not(:disabled):hover {
		color: var(--orange-blue);
		}

	.flex-row-center {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		}

	.errormessage {
		color: oklch(0.628 0.258 29.234);
		}

	.yellow-blue-text {
		color: var(--orange-blue);
		}

	.capitalize-first-letter::first-letter {
		text-transform: uppercase;
		}

	.uppercase {
		text-transform: uppercase;
		}

	.button {
	  position: relative;
	  display: inline-block;
		cursor: pointer;
	  vertical-align: middle;
		text-decoration: none;
	  border: 0;
	  outline: none;
	  }

	.button.learn-more {
		padding: 0.75em 1.5em;
		-webkit-transition: background 150ms cubic-bezier(0, 0, 0.58, 1), -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
		transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1), -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1);
		color: #1D1D1D;
		border: 1px solid var(--white-black);
		border-radius: 0.5em;
		background: #FCFCFD;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		}

	.button.learn-more::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: '';
		transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1), -webkit-transform 150ms cubic-bezier(0, 0, 0.58, 1), -webkit-box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
		-webkit-transform: translate3d(0, 0.75em, -1em);
		transform: translate3d(0, 0.5em, -0.75em);
		border-radius: inherit;
		background: var(--orange-blue);
		}

	.button.learn-more:hover {
		-webkit-transform: translate(0, 0.25em);
		transform: translate(0, 0.25em);
		background: #FCFCFD;
		}

	.button.learn-more:hover::before {
		-webkit-transform: translate3d(0, 0.5em, -1em);
		transform: translate3d(0, 0.5em, -1em);
		}

	.button.learn-more:active {
		-webkit-transform: translate(0em, 0.75em);
		transform: translate(0em, 0.75em);
		background: #FCFCFD;
		}

	.button.learn-more:active::before {
		-webkit-transform: translate3d(0, 0, -1em);
		transform: translate3d(0, 0, -1em);
		}

	.loading-skeleton {
	  height: 150px;
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

	.font-md {
		font-size: calc(clamp(1.1rem, 1.0124rem + 0.3596vw, 1.3rem));
		}

	.font-lg {
		font-size: calc(clamp(1.4rem, 1.2247rem + 0.7191vw, 1.8rem));
		}

	.font-xl {
		font-size: calc(clamp(1.7rem, 1.3933rem + 1.2584vw, 2.4rem));
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
	  border-top: 1px solid var(--white-black);
		}

	.padding-top {
		padding-top: 20px;
		}

	.padding-bottom {
		padding-bottom: 20px;
		}

	.padding-bottom-lg {
		padding-bottom: 50px;
		}

	.padding-y {
		padding-top: 20px;
		padding-bottom: 20px;
		}

	.padding-top-sm {
		padding-top: 5px;
		}

	.padding-top-md {
		padding-top: 10px;
		}

	.padding-bottom-sm {
		padding-bottom: 5px;
		}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		}

	li {
		list-style: none;
		}

	.mx-small {
		margin-right: 8px;
		margin-left: 8px;
		}

	.border {
		border: solid 1px var(--orange-blue);
		box-shadow: 6px 3px 3px #ff3b00;
		}
</style>
