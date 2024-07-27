<script>
  import ThemeSwitcher from "$lib/components/Buttons/ThemeSwitcher.svelte";
  import "../app.css";
</script>

<header class="px-5 py-3 flex justify-end">
  <ThemeSwitcher />
</header>
<main class="px-5 py-10">
  <slot />
</main>
<footer>
  <p class="text-center text-gray-500 text-sm">© {new Date().getFullYear()} job parser, for personal use only.</p>
</footer>