import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
// @ts-ignore
import VitePluginSass from "vite-plugin-sass";

export default ({ mode }: { mode: string }) => {
  // Extends 'process.env.*'
  // with VITE_*-variables from '.env.(mode=production|development)'
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [sveltekit(), VitePluginSass()],
    optimizeDeps: {
      include: [
        "gsap",
        "gsap/dist/ScrollSmoother",
        "gsap/dist/ScrollTrigger",
        "gsap/dist/Observer",
      ],
    },
    server: {
      fs: {
        allow: ["static"],
      },
      port: 3000,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:3000",
    },
  });
};
