<script lang="ts">
	import { type StatsProps } from '$lib/types';
	import Stat from './Stat.svelte';

	const { items, statSnippet }: StatsProps = $props();
</script>

<div class="stats bg-neutral text-neutral-content shadow">
	{#each items as item}
		{#if statSnippet}
			{@render statSnippet(item)}
		{:else}
			<Stat {...item} />
		{/if}
	{/each}
</div>
