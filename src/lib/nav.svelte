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

  .font-md {
	  font-size: calc(clamp(1.1rem, 1.0124rem + 0.3596vw, 1.3rem));
	  }

  .font-medium {
	  font-weight: 500;
	  }

  .padding-top {
	  padding-top: 20px;
	  }

  .padding-bottom {
	  padding-bottom: 20px;
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
</style>
