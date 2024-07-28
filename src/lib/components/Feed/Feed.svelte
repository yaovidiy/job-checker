<script lang="ts">
	import { type FeedProps, type jobItem } from '$lib/types';
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	const { totalJobs, pages, currentPage, updateCurrentPage, clickOnItem, loadFeedPage }: FeedProps =
		$props();
	const skeletonItems = [1, 2, 3, 4, 5, 6];

	let loadPromise: Promise<jobItem[] | null> = $state(Promise.resolve(null));

	onMount(() => {
		loadPromise = loadFeedPage(currentPage?.toString() ?? '1');
	});
</script>

<svelte:head>
	<title>Jobs Feed</title>
</svelte:head>

{#await loadPromise}
	<h1 class="text-center text-5xl mb-10">
		Total Avaliable jobs
		<span class="loading text-accent loading-dots loading-lg"></span>
	</h1>
	<div class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each skeletonItems as item}
			<div id={`skeleton-${item}`} class="skeleton w-full h-80"></div>
		{/each}
	</div>
{:then items}
	{#if items !== null}
		<h1 class="text-center text-5xl mb-10">
			Total Avaliable jobs
			<b class="text-accent">{totalJobs}</b>
		</h1>
		<div class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{#each items as item}
				<Card {item} {clickOnItem} />
			{/each}
			<div class="flex justify-center w-[90vw]">
				<div class="join max-w-full overflow-x-auto mx-auto md:col-span-2 lg:col-span-3">
					{#each pages as page}
						<a
							href={`/?page=${page}`}
							onclick={(e) => {
								updateCurrentPage(page.toString());
								loadPromise = loadFeedPage(page.toString());
							}}
							class="join-item btn"
							class:btn-primary={currentPage ? parseInt(currentPage) === page : page === 1}
							>{page}</a
						>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<h1 class="text-center text-5xl mb-10">No jobs found</h1>
	{/if}
{:catch _}
	<h1 class="text-center text-5xl mb-10">
		Something hapened and we can't show you the results. Please try again later.
	</h1>
{/await}
