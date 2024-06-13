<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { writable } from "svelte/store";
  import IoIosMoon from "svelte-icons/io/IoIosMoon.svelte";
  import IoIosSunny from "svelte-icons/io/IoIosSunny.svelte";

  let storedTheme: string | null = null;
  if (typeof window !== "undefined" && "localStorage" in window) {
    storedTheme = localStorage.getItem("theme");
  }

  let currentTheme: "light" | "dark" = storedTheme === "dark" ? "dark" : "light";

  const theme = writable<"light" | "dark">(currentTheme);

  const dispatch = createEventDispatcher();

  function toggleTheme() {
    if (currentTheme === "light") {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }
    localStorage.setItem("theme", currentTheme);
    theme.set(currentTheme);
    document.body.dataset.theme = currentTheme;
    dispatch("theme", currentTheme);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  }

  onMount(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = currentTheme;
    }
  });
</script>

{#if $theme === "light"}
    <div  class="moon"
          on:click={toggleTheme}
          on:keydown={handleKeydown}
          role="button"
          tabindex="0"
          transition:fly={{ y: 20, duration: 900 }}
    >
    <IoIosMoon/>
    </div>
{:else}
  <div  class="sun"
        on:click={toggleTheme}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
        transition:fly={{ y: 20, duration: 900 }}
  >
    <IoIosSunny/>
  </div>
{/if}

<style>
    .moon{
        width: 24px;
        height: 24px;
        color: #1D1D1D;
        cursor: pointer;
        }
	.sun{
		width: 24px;
		height: 24px;
		color: #FCFCFD;
		cursor: pointer;
		}
</style>
