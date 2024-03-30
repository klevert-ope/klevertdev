<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

  export let message = "";
  export let type = "success";

  let toast: HTMLElement | null = null;

  const showToast = () => {
    gsap.set(toast, { autoAlpha: 1, y: 0 });
    setTimeout(() => {
      gsap.to(toast, {
        duration: 0.5,
        autoAlpha: 0,
        y: -50,
        ease: "power2.out"
      });
    }, 3000);
  };

  const hideToast = () => {
    gsap.set(toast, { autoAlpha: 0, y: -50 });
  };

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    showToast();
  });

  onDestroy(() => {
    hideToast();
  });
</script>

<div
  bind:this={toast}
  class="toast"
  class:error={type === 'error'}
  class:success={type === 'success'}
  style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%);"
>
  <p class="font-xs font-semi-bold">{message}</p>
</div>

<style>
	.toast {
		z-index: 9999;
		padding: 10px;
		pointer-events: none;
		border-radius: 5px;
		background-color: #141414;
		box-shadow: 0 4px 30px #ccc;
		}

	.error {
		color: red;
		}

	.success {
		color: green;
		}
</style>
