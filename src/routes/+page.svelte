<script lang="ts">
	import { type jobItem } from '$lib/types/';
	import Feed from '$lib/components/Feed/Feed.svelte';

	const { data } = $props();
	let items = $state<jobItem[]>([]);
	let totalJobs = $state(0);
	let currentPage = $state(data.page);
	let pages = $state<number[]>([]);
	const skeletonItems = [1, 2, 3, 4, 5, 6];

	function updateCurrentPage(page: string) {
		currentPage = page;
	}

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

<Feed {totalJobs} {items} {pages} {currentPage} {updateCurrentPage} />
