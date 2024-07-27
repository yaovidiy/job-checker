<script lang="ts">
	import { type FeedProps } from '$lib/types';
	import Card from './Card.svelte';

	const { totalJobs, items, pages, currentPage, updateCurrentPage, clickOnItem }: FeedProps =
		$props();
	const skeletonItems = [1, 2, 3, 4, 5, 6];
</script>

<svelte:head>
	<title>Jobs Feed</title>
</svelte:head>

{#if items?.length}
	<h1 class="text-center text-5xl mb-10">
		Total Avaliable jobs
		{#if totalJobs}
			<b class="text-accent">{totalJobs}</b>
		{:else}
			<span class="loading text-accent loading-dots loading-lg"></span>
		{/if}
	</h1>
	<div class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#if !items.length}
			{#each skeletonItems as item}
				<div id={`skeleton-${item}`} class="skeleton w-full h-80"></div>
			{/each}
		{:else}
			{#each items as item}
				<Card {item} {clickOnItem} />
			{/each}
			<div class="flex justify-center w-[90vw]">
				<div class="join max-w-full overflow-x-auto mx-auto md:col-span-2 lg:col-span-3">
					{#each pages as page}
						<a
							href={`/?page=${page}`}
							onclick={() => updateCurrentPage(page.toString())}
							class="join-item btn"
							class:btn-primary={currentPage ? parseInt(currentPage) === page : page === 1}
							>{page}</a
						>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<h1>Something hapened and we can't show you the results. Please try again later.</h1>
{/if}
