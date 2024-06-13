<script lang="ts">
  import { page } from "$app/stores";
  import Theme from "$lib/theme.svelte";
</script>

<nav>
  <div
    class="font-md font-medium padding-top padding-bottom container flex-row-between bg-blur">
  <a aria-current={$page.url.pathname === '/'}
     href="/"
  >
    /həʊm/
  </a>
    <Theme />
  </div>
  <div class="border-top-out container"></div>
</nav>


<style>
	nav {
		position: sticky;
		z-index: 999;
		top: 0;
		}

	.bg-blur {
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		}

	a:focus {
		outline: none;
		}

	nav a {
		transition: color 0.3s ease;
		text-decoration: underline;
		color: var(--white-black);
		}

	nav a:hover {
	  color: var(--orange-blue);
		}

  .font-md {
	  font-size: calc(clamp(1.1rem, 1.0124rem + 0.3596vw, 1.3rem));
	  }

  .font-medium {
	  font-weight: 500;
	  }

  .padding-top {
	  padding-top: 15px;
	  }

  .padding-bottom {
	  padding-bottom: 15px;
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

	.flex-row-between {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		}

	.border-top-out {
		padding: 10px;
		border-top: solid 2px var(--orange-blue);
		border-radius: 200px;
		}
</style>
