<script>
  import ThemeSwitcher from "$lib/components/Buttons/ThemeSwitcher.svelte";
  import "../app.css";
</script>

<header class="p-3 flex justify-end">
  <ThemeSwitcher />
</header>
<slot />