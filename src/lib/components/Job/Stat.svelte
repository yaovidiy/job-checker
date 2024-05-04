<script lang="ts">
	import { type StatProps } from '$lib/types';

	const { title, desc, value }: StatProps = $props();
</script>

<div class="stat place-items-center">
	<div class="stat-title text-neutral-content">{title}</div>
	<div class="stat-value text-neutral-content">{value}</div>
	<div class="stat-desc text-neutral-content">{desc}</div>
</div>
