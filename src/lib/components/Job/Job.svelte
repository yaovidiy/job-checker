<script lang="ts">
	import { type JobProps } from '$lib/types';
	import { onMount } from 'svelte';

	const { applied, reviews, isApplied, url, score, moveBack }: JobProps = $props();
	const djinniData = $state(null)

	async function loadJobData() {
		const fetchResp = await fetch('/api/job/djinni', {
			method: 'POST',
			body: JSON.stringify({ url })
		});

		const fetchRes = await fetchResp.json();
	}

	onMount(loadJobData);
</script>

