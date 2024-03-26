<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  export let message;

  let isVisible = false;
  let scrollPosition = 0;

  const updateScrollPosition = () => {
    scrollPosition = window.scrollY || document.documentElement.scrollTop;
  };
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: Parameters<T>) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  const debouncedScroll = debounce(updateScrollPosition, 9);

  const showToast = () => {
    isVisible = true;
    updateScrollPosition();
    window.addEventListener("scroll", debouncedScroll);
  };

  const hideToast = () => {
    isVisible = false;
    window.removeEventListener("scroll", debouncedScroll);
  };

  onMount(() => {
    showToast();
    setTimeout(hideToast, 3000);
  });

  onDestroy(() => {
    hideToast();
  });
</script>

{#if isVisible}
  <div class="toast" style="top: {scrollPosition + 20}px;">
    <p class="font-xs font-semi-bold">{message}</p>
  </div>
{/if}

<style>
	.toast {
		position: fixed;
		z-index: 9999;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px;
		color: red;
		border-radius: 5px;
		background-color: #141414;
		box-shadow: 0 4px 30px #ccc;
		}
</style>
