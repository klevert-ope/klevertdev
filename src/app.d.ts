// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    declare module "svelte-icons/*";
    declare module "gsap/types/*";
    declare module "@sveltejs/kit/*";
    declare module "svelte/*";
    declare module "@types/dompurify/*";
    declare module "@types/quill/*";
    declare module "$env/*";
    declare module "sveltekit-superforms/*";

    interface Error {
      code: string;
      id: string;
    }

    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
