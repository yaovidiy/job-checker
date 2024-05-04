<script lang="ts">
	import { type jobItem } from '$lib/types/';
	import { onMount } from 'svelte';

	const { data } = $props();
	let items = $state<jobItem[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const respItems = await fetch('/api/feed');
		const resItems = await respItems.json();
		items = resItems.jobsDataArray;
	});
</script>

{#if !items.length}
	loading!
{:else}
	{#each items as item}
		<div>
			{item.generalInfo.title} --- {item.generalInfo.postDate} --- {item.analitics.isApplied
				? 'applied!'
				: 'no applied!'} --- {item.additionalInfo.typeOfJob} --- {item.analitics.reviews} ---
			{item.analitics.applies} --- {item.score}%
		</div>
	{/each}
{/if}
