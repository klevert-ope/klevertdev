<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-BD8JKHKXSF">
  </script>
  <script>
    window.dataLayer = window.dataLayer || []

    function gtag() {
      dataLayer.push(arguments)
    }

    gtag('js', new Date())
    gtag('config', 'G-BD8JKHKXSF')
  </script>
</svelte:head>

<script lang="ts">
  import { page } from "$app/stores";

  $: {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-BD8JKHKXSF', {
        page_title: document.title,
        page_path: $page.url.pathname,
      })
    }
  }
</script>


