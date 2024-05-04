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

		salaryExp = {
			items: [
				{
					title: '',
					value: fetchRes.expLevel,
					desc: ''
				},
				{
					title: '',
					value: fetchRes.salaryLevel,
					desc: ''
				}
			]
		};

		tags = {
			items: [
				{
					title: 'Main Tag',
					value: fetchRes.vacancyData.mainTag,
					desc: ''
				},
				{
					title: 'Can Apply to vacancy?',
					value: fetchRes.vacancyData.canApply ? 'Yes' : 'No',
					desc: ''
				}
			]
		};

		locations = {
			items: [
				{
					title: 'Job location type',
					value: fetchRes.vacancyData.jobLocType,
					desc: ''
				},
				{
					title: 'Job type',
					value: fetchRes.vacancyData.jobType,
					desc: ''
				},
				{
					title: 'Location',
					value: fetchRes.vacancyData.location,
					desc: ''
				}
			]
		};

		messages = {
			items: [
				{
					title: 'I wrote last?',
					value: fetchRes.dialogData.isYouLastWroote ? 'Yes' : 'No',
					desc: ''
				},
				{
					title: 'Messaged was readed?',
					value: fetchRes.dialogData.readMessageData,
					desc: ''
				},
				{
					title: 'Last message date',
					value: fetchRes.dialogData.lastMessageDate,
					desc: ''
				}
			]
		};
	}

	const appliedReviewed: StatsProps = {
		items: [
			{
				title: 'Applied',
				value: applied,
				desc: 'Amount of people applied for the vacancy'
			},
			{
				title: 'Reviewed',
				value: reviews,
				desc: 'Amount of people reviewed vacancy'
			},
			{
				title: 'Correlation',
				value: Math.floor((parseInt(applied) / parseInt(reviews)) * 100).toString(),
				desc: 'Persenrage of reviews to applied'
			}
		]
	};

	const scoreApplied: StatsProps = {
		items: [
			{
				title: 'Applied',
				value: isApplied ? 'Yes' : 'No',
				desc: 'Have I applied for this vacancy?'
			},
			{
				title: 'Score',
				value: score.toString(),
				desc: 'How good this vacancy is good for me'
			},
			{
				title: 'Apply to vacancy',
				value: isApplied ? 'Go to djinni' : 'Apply',
				desc: 'Go to the djinni to apply for the vacancy'
			}
		]
	};

	onMount(loadJobData);
</script>

{#snippet statSnippet({title, value, desc}: StatProps)}
	<div class="stat place-items-center">
		<div class="stat-title text-neutral-content">{title}</div>
		{#if title === 'Apply to vacancy'}
			<div class="stat-value text-neutral-content">
				<button class="btn btn-primary">{value}</button>
			</div>
		{:else}
			<div class="stat-value text-neutral-content">{value}</div>
		{/if}
		<div class="stat-desc text-neutral-content">{desc}</div>
	</div>
{/snippet}

<div class="px-5 py-10">
	<a href="/" onclick={moveBack} class="btn btn-ghost mb-5">Back to feed</a>

	<div class="flex flex-col flex-wrap lg:flex-row gap-5">
		<Stats {...appliedReviewed} />
		<Stats {...scoreApplied} {statSnippet} />
		{#if !salaryExp}
			<div class="skeleton w-1/3 h-36"></div>
		{:else}
			<Stats {...salaryExp} />
		{/if}
		{#if !tags}
			<div class="skeleton w-1/3 h-36"></div>
		{:else}
			<Stats {...tags} />
		{/if}
		{#if !locations}
			<div class="skeleton w-1/3 h-36"></div>
		{:else}
			<Stats {...locations} />
		{/if}
		{#if !messages}
			<div class="skeleton w-1/3 h-36"></div>
		{:else}
			<Stats {...messages} />
		{/if}
	</div>
</div>
