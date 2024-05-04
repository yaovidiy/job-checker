<script lang="ts">
	import { type jobItem } from '$lib/types/';
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';

	const { data } = $props();
	let items = $state<jobItem[]>([]);
	let totalJobs = $state(0);
	let currentPage = $state(data.page);
	let pages = $state<number[]>([]);
	const skeletonItems = [1, 2, 3, 4, 5, 6];

	async function loadFeedPage(page: string | null = null) {
		items = [];
		const respItems = await fetch(`/api/feed?page=${page ?? 1}`);
		const resItems = await respItems.json();
		items = resItems.jobsDataArray;

		if (pages.length) {
			return;
		}

		totalJobs = parseInt(resItems.totalAmount);
		const tempPages: number[] = [];
		for (let i = 1; i <= Math.ceil(resItems.totalAmount / 15); i++) {
			tempPages.push(i);
		}
		pages = tempPages;
	}

	$effect(() => {
		loadFeedPage(currentPage);
	});
</script>

<h1 class="text-center text-5xl">
	Total Avaliable jobs
	{#if totalJobs}
		<b class="text-accent">{totalJobs}</b>
	{:else}
		<span class="loading text-accent loading-dots loading-lg"></span>
	{/if}
</h1>
<div class="grid gap-5 px-5 py-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
	{#if !items.length}
		{#each skeletonItems as item}
			<div id={`skeleton-${item}`} class="skeleton w-full h-80"></div>
		{/each}
	{:else}
		{#each items as item}
			<Card {...item} />
		{/each}
		<div class="join mx-auto md:col-span-2 lg:col-span-3">
			{#each pages as page}
				<a
					href={`/?page=${page}`}
					onclick={() => (currentPage = page.toString())}
					class="join-item btn"
					class:btn-primary={currentPage ? parseInt(currentPage) === page : page === 1}>{page}</a
				>
			{/each}
		</div>
	{/if}
</div>
