<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import IoIosMoon from "svelte-icons/io/IoIosMoon.svelte";
  import IoIosSunny from "svelte-icons/io/IoIosSunny.svelte";

  const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  const theme = writable<"light" | "dark">(storedTheme === "dark" ? "dark" : "light");

  const dispatch = createEventDispatcher();

  function toggleTheme() {
    theme.update(current => {
      const newTheme = current === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.dataset.theme = newTheme;
      dispatch("theme", newTheme);
      return newTheme;
    });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  }

  onMount(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = storedTheme === "dark" ? "dark" : "light";
    }
  });
</script>

<div
  aria-label="theme toggle"
  class="theme"
  on:click={toggleTheme}
  on:keydown={handleKeydown}
  role="button"
  tabindex="0"
>
  {#if $theme === "light"}
    <div class="moon">
    <IoIosMoon/>
    </div>
{:else}
    <div class="sun">
    <IoIosSunny/>
  </div>
{/if}
</div>

<style>
	.theme {
		cursor: pointer;
		}

	.moon {
        width: 24px;
        height: 24px;
        color: #1D1D1D;
        }

	.sun{
		width: 24px;
		height: 24px;
		color: #FCFCFD;
		}
</style>
