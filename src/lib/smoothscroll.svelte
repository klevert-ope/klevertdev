<script lang="ts">
    import {onMount} from 'svelte';
    // @ts-ignore
    import {gsap} from "gsap/dist/gsap";
    // @ts-ignore
    import {ScrollSmoother} from "gsap/dist/ScrollSmoother";
    // @ts-ignore
    import {ScrollTrigger} from "gsap/dist/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    export let Smoother: any = null;

    onMount(() => {
        Smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 2,
            effects: true,
            smoothTouch: 0.2,
        });

        ScrollTrigger.normalizeScroll(true);
    });
</script>

<div id="smooth-wrapper">
    <div id="smooth-content">
        <slot/>
    </div>
</div>


