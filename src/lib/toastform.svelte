<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { gsap } from "gsap";
  import IoIosInformationCircle
    from "svelte-icons/io/IoIosInformationCircle.svelte";
  import IoIosCheckmarkCircle
    from "svelte-icons/io/IoIosCheckmarkCircle.svelte";

  export let message = "";
  export let type = "success";

  let toast: HTMLElement | null = null;
  let toastTween: gsap.core.Tween | null = null;

  onMount(() => {
    if (toast) {
      gsap.from(toast, {
        duration: 0.3,
        autoAlpha: 0,
        y: 30,
        ease: "power2.in"
      });
      toastTween = gsap.to(toast, {
        duration: 9,
        delay: 1,
        autoAlpha: 0,
        y: -30,
        ease: "power2.out"
      });
    }
  });

  onDestroy(() => {
    if (toastTween) {
      toastTween.kill();
    }
  });
</script>

<div
  bind:this={toast}
  class="toast"
  class:error={type === 'error'}
  class:success={type === 'success'}
>
  {#if type === 'success'}
    <div class="success-icon">
      <IoIosCheckmarkCircle />
    </div>
  {:else if type === 'error'}
    <div class="error-icon">
      <IoIosInformationCircle />
    </div>
  {/if}
  <p class="font-xs font-semi-bold">{message}</p>
</div>


<style>
	.toast {
	  position: fixed;
		z-index: 9999;
	  top: 20px;
	  left: 50%;
	  display: flex;
	  align-items: center;
	  flex-flow: row;
		padding: 10px;
	  transform: translateX(-50%);
		pointer-events: none;
		border-radius: 5px;
		background-color: #141414;
		box-shadow: 0 4px 30px #ccc;
		}

	.error {
	  color: #f63636;
		}

	.success {
	  color: #b1ee81;
	  }

  .error-icon {
	  width: 14px;
	  height: 14px;
	  margin-right: 2px;
	  }

  .success-icon {
	  width: 14px;
	  height: 14px;
	  margin-right: 2px;
	  }

  .font-xs {
	  font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
	  }

  .font-semi-bold {
	  font-weight: 600;
		}
</style>
