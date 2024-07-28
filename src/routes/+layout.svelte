<script>
  import ThemeSwitcher from "$lib/components/Buttons/ThemeSwitcher.svelte";
  import "../app.css";

  const { children } = $props();
</script>

<header class="px-5 py-3 flex justify-end">
  <ThemeSwitcher />
</header>
<main class="px-5 py-10">
  {#if children}
    {@render children()}
  {:else}
    <h1 class="text-center text-5xl">404</h1>
  {/if}
</main>
<footer>
  <p class="text-center text-gray-500 text-sm">© {new Date().getFullYear()} job parser, for personal use only.</p>
</footer>