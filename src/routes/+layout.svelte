<svelte:head>
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <link href="https://fonts.cdnfonts.com/css/opera" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/andale-mono" rel="stylesheet">
</svelte:head>
<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import Nav from "$lib/nav.svelte";

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

<Nav />
<slot/>

<style global>
	:root {
		font-family: Inter, sans-serif;
	  font-feature-settings: 'liga' 1, 'calt' 1;
	  --white-black-fade: #333030;
	  --white-black: #1D1D1D;
	  --black-white: #FCFCFD;
	  --orange-blue: #ff3b00;
	  --white-black-code: #1D1D1D;
	  --yellow-blue-code: #fcfcfc;
	  --text-color: #1D1D1D;
	  --bg-color: #f4f0e6;
	  }

  :global([data-theme="dark"]) {
	  --white-black-fade: #e3e3e3;
	  --white-black: #FCFCFD;
	  --black-white: #1D1D1D;
	  --orange-blue: #ff3b00;
	  --white-black-code: #f4f0e6;
	  --yellow-blue-code: #1D1D1D;
	  --bg-color: #1D1D1D;
	  --text-color: #FCFCFD;
	  }

  @supports (font-variation-settings: normal) {
		:root { font-family: InterVariable, sans-serif; }
		}

  :root::view-transition-old(root) {
	  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-top;
	  }

  :root::view-transition-new(root) {
	  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-bottom;
	  }

  @media (prefers-reduced-motion: no-preference) {
	  :root::view-transition-old(root) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-top;
		  }

	  :root::view-transition-new(root) {
		  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in, 300ms cubic-bezier(
				  0.4,
				  0,
				  0.2,
				  1
	  ) both slide-from-bottom;
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

  @keyframes slide-from-bottom {
	  from {
		transform: translateY(100px);
		  }
	  }

  @keyframes slide-to-top {
	  to {
		transform: translateY(-100px);
		  }
	  }
</style>
