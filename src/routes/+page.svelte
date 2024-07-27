<script lang="ts">
	import { type jobItem, type JobProps } from '$lib/types/';
	import Feed from '$lib/components/Feed/Feed.svelte';
	import Job from '$lib/components/Job/Job.svelte';

	const { data } = $props();
	let totalJobs = $state(0);
	let currentPage = $state(data.page);
	let pages = $state<number[]>([]);
	let jobData = $state<JobProps | null>(null);

	function updateCurrentPage(page: string) {
		currentPage = page;
	}

	function showJob(item: jobItem) {
		jobData = {
			applied: item.analitics.applies,
			reviews: item.analitics.reviews,
			isApplied: item.analitics.isApplied,
			url: item.generalInfo.link,
			score: item.score,
			companyName: item.generalInfo.companyName,
			title: item.generalInfo.title,
			shortDesc: item.generalInfo.shortDescription,
			description: item.generalInfo.description,
			moveBack: () => (jobData = null)
		};
	}

	async function loadFeedPage(page: string | null = null): Promise<jobItem[] | null> {
		let items = [];

		try {
			let respItems = await fetch(`/api/feed?page=${page ?? 1}`);

			if (!respItems.ok) {
				respItems = await fetch(`/api/simple/feed?page=${page ?? 1}`);
			}

			const resItems = await respItems.json();
			items = resItems.jobsDataArray;

			if (!items.length) {
				return null;
			}

			totalJobs = parseInt(resItems.totalAmount);
			const tempPages: number[] = [];
			for (let i = 1; i <= Math.ceil(resItems.totalAmount / 15); i++) {
				tempPages.push(i);
			}
			pages = tempPages;

			return items;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
</script>

{#if !jobData}
	<Feed
		{totalJobs}
		{pages}
		{currentPage}
		{updateCurrentPage}
		{loadFeedPage}
		clickOnItem={showJob}
	/>
{:else}
	<Job {...jobData} />
{/if}
