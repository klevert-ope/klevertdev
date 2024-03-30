<script>
  import { page } from "$app/stores";
</script>

<nav class="font-md font-medium padding-top padding-bottom container">
  <a aria-current={$page.url.pathname === '/'}
     href="/"
  >
    /həʊm/
  </a>
</nav>
<style>
	nav a {
		transition: color 0.3s ease;
		text-decoration: underline;
		color: black;
		}

	nav a:hover {
		color: rgb(0, 175, 80);
		}
</style>
