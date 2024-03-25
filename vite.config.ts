import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
// @ts-ignore
import VitePluginSass from "vite-plugin-sass";

export default defineConfig({
  plugins: [sveltekit(), VitePluginSass()],
  resolve: {
    alias: {
      stylesheets: "./stylesheets",
    },
  },
  optimizeDeps: {
    include: [
      "gsap/dist/gsap",
      "gsap/dist/ScrollSmoother",
      "gsap/dist/ScrollTrigger",
      "gsap/dist/Observer",
    ],
  },
});
