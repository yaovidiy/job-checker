<script lang="ts">
	import { type JobProps, type StatProps, type StatsProps } from '$lib/types';
	import Stats from './Stats.svelte';
	import { onMount } from 'svelte';

	const { applied, reviews, isApplied, url, score, moveBack }: JobProps = $props();
	let salaryExp = $state<StatsProps | null>(null);
	let tags = $state<StatsProps | null>(null);
	let locations = $state<StatsProps | null>(null);
	let messages = $state<StatsProps | null>(null);

	async function loadJobData() {
		const fetchResp = await fetch('/api/job/djinni', {
			method: 'POST',
			body: JSON.stringify({ url })
		});

		const fetchRes = await fetchResp.json();
	}

	onMount(loadJobData);
</script>

