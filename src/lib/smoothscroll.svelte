<script lang="ts" type="module">
  import { gsap } from "gsap";
  import { ScrollSmoother } from "gsap/dist/ScrollSmoother";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
  import { onDestroy, onMount } from "svelte";

  export let Smoother: any = null;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    Smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      effects: true,
      smoothTouch: 0.2
    });

    ScrollTrigger.normalizeScroll(true);
  });

  onDestroy(() => {
    if (Smoother) {
      Smoother.kill();
    }
  });
</script>

<div id="smooth-wrapper">
  <div id="smooth-content">
    <slot />
  </div>
</div>
