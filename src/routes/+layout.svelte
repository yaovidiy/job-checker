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