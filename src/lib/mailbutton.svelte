<script lang="ts">
  import { gsap } from "gsap";
  import { Observer } from "gsap/dist/Observer";
  import { onDestroy, onMount } from "svelte";
  import IoIosSend from "svelte-icons/io/IoIosSend.svelte";

  let mailtoButton: HTMLElement | null = null;
  let observer: Observer | null = null;
  let tl: gsap.core.Timeline | null = null;

  onMount(() => {
    gsap.registerPlugin(Observer);
    mailtoButton = document.getElementById("mailto-button");

    tl = gsap.timeline({ paused: true });

    tl.fromTo(
      mailtoButton,
      {
        opacity: 0,
        bottom: -50,
        duration: 0.5,
        ease: "power2.inOut"
      },
      { opacity: 1, bottom: 10, duration: 0.5, ease: "power2.inOut" }
    );

    observer = Observer.create({
      target: window,
      type: "wheel,touch,scroll",
      onUp: () => {
        tl?.play();
      },
      onDown: () => {
        tl?.reverse();
      }
    });
  });

  onDestroy(() => {
    if (observer) {
      observer.kill();
    }
    if (tl) {
      tl.kill();
    }
  });
</script>

<button class="mailto-button" id="mailto-button" type="button">
  <a href="mailto:inquiries@klevertopee.app">
    <div class="flex-row">
      <p class="font-xs font-semi-bold padding-right-small">
        Reach Out
      </p>
      <div class="icon-send">
        <IoIosSend />
      </div>
    </div>
  </a>
</button>
<style>
	.icon-send {
		width: 14px;
		height: 14px;
		margin-left: 2px;
		color: white;
		}

	a {
		all: unset;
		}

	button {
		all: unset;
		}

	.mailto-button {
		position: fixed;
		z-index: 100;
		bottom: -50px;
		left: 50%;
		padding: 8px 16px;
		cursor: pointer;
		transition: transform 0.3s ease-in-out;
		transform: translateX(-50%);
		opacity: 0;
		color: white;
		border-width: 2px;
	  border-style: solid oklch(0.191 0 89.876);
		border-radius: 40px;
	  background-color: var(--orange-blue);
	  box-shadow: 0 4px 30px oklch(0 0 0 / 0.2);
		}

	.font-xs {
		font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
		}

	.font-semi-bold {
		font-weight: 600;
		}

	.padding-right-small {
		padding-right: 5px;
		}

	.flex-row {
		display: flex;
		flex-direction: row;
		}
</style>
