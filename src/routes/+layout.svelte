<svelte:head>
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <link href="https://fonts.cdnfonts.com/css/opera" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/andale-mono" rel="stylesheet">
</svelte:head>
<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import GoogleAnalytics from "$lib/analytics.svelte";

  interface Navigation {
    complete: Promise<void>;
  }

  onNavigate((navigation: Navigation) => {
    if (!('startViewTransition' in document)) return;

    return new Promise<void>((resolve) => {
      (document as Document & { startViewTransition: Function }).startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<GoogleAnalytics/>
<slot/>

<style global>
	:root {
		font-family: Inter, sans-serif;
		font-feature-settings: 'liga' 1, 'calt' 1;
		}

  :global([data-theme="light"]) {
	  --white-black-fade: #333030;
	  --white-black: #1D1D1D;
	  --black-white: #FCFCFD;
	  --orange-blue: #ff3b00;
	  --white-black-code: #1D1D1D;
	  --yellow-blue-code: #fcfcfc;
	  color: #1D1D1D;
	  background-color: #f4f0e6;
	  transition: color 0.9s, background-color 0.9s, transform 0.9s;
	  }

  :global([data-theme="dark"]) {
	  --white-black-fade: #e3e3e3;
	  --white-black: #FCFCFD;
	  --black-white: #1D1D1D;
	  --orange-blue: #ff3b00;
	  --white-black-code: #FFF4ED;
	  --yellow-blue-code: #1D1D1D;
	  background-color: #1D1D1D;
	  color:  #FCFCFD;
	  transition: color 0.9s, background-color 0.9s, transform 0.9s;
	  }

  @supports (font-variation-settings: normal) {
		:root { font-family: InterVariable, sans-serif; }
		}
	:root::view-transition-old(root) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
		}

	:root::view-transition-new(root) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in, 300ms cubic-bezier(0.4, 0, 0.2, 1) both
		slide-from-left;
		}

  @media (prefers-reduced-motion: no-preference) {
	  :root::view-transition-old(root) {
		  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both
		  slide-to-right;
		  }

	  :root::view-transition-new(root) {
		  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in, 300ms cubic-bezier(
				  0.4,
				  0,
				  0.2,
				  1
		  ) both slide-from-left;
		  }
	  }
  @keyframes fade-in {
	  from {
		  opacity: 0;
		  }
	  }

  @keyframes fade-out {
	  to {
		  opacity: 0;
		  }
	  }

  @keyframes slide-from-left {
	  from {
		  transform: translateX(-30px);
		  }
	  }

  @keyframes slide-to-right {
	  to {
		  transform: translateX(30px);
		  }
	  }
</style>
