<script lang="ts">
	import { type JobProps, type djinniResponse, type douResponse } from '$lib/types';
	import { onMount } from 'svelte';

	const { applied, reviews, isApplied, url, score, moveBack, companyName }: JobProps = $props();
	let loading = $state(true);
	let djinniData = $state<djinniResponse>(null);
	let douData = $state<douResponse>(null);

	async function loadJobData() {
		try {
			const djinniResp = await fetch('/api/job/djinni', {
				method: 'POST',
				body: JSON.stringify({ url })
			});
			const djinniRes: djinniResponse = await djinniResp.json();

			djinniData = djinniRes;

			const douResp = await fetch('/api/job/dou', {
				method: 'post',
				body: JSON.stringify({
					url: `https://jobs.dou.ua/companies/${companyName.split(' ').join('-').split('.').join('-')}/`
				})
			});

			const douRes: douResponse = await douResp.json();

			douData = douRes;
			loading = false;
		} catch (err) {}
	}

	onMount(loadJobData);
</script>

{#if douData}
  {#if douData.reviewsData}
	<h2>Dou reviews</h2>
	<h3>Latest comment, Total comments: {douData.reviewsData.totalComments}</h3>
	<p>Date: {douData.reviewsData.lastComment.time}</p>
	<p>
		Authour: <a href={douData.reviewsData.lastComment.author.link}
			>{douData.reviewsData.lastComment.author.name}</a
		>
	</p>
	<p>{@html douData.reviewsData.lastComment.comment}</p>
	{:else}
		<span class="text-error">No reviews on DOU for this company!</span>
	{/if}

	{#if douData.vacanciesdData}
		<h2>Dou vacancies</h2>
		<h3>Total vacancies: {douData.vacanciesdData.vacancies.totalVacancies}</h3>
		<p>Company Score: {douData.vacanciesdData.companyScore}</p>
	{:else}
		<span class="text-error">No vacancies on DOU for this company</span>
	{/if}
{:else if loading && !douData}
	<span class="loading loading-spinner loading-lg"></span>
{:else}
	<span class="text-error">No DOU data is loaded!</span>
{/if}

{#if djinniData}
	<h1>Djinni short list</h1>
	<ul>
		<li>{djinniData.vacancyData?.mainTag}</li>
		<li>{djinniData.vacancyData?.domain}</li>
		<li>{djinniData.vacancyData?.jobLocType}</li>
		<li>{djinniData.vacancyData?.jobType}</li>
		<li>{djinniData.vacancyData?.location}</li>
		<li>{djinniData.vacancyData?.tags.join(', ')}</li>
	</ul>

	{#if djinniData.dialogData}
		<h1>Djinni Dialog data</h1>
		<ul>
			<li>
				Am I wrote last: {djinniData.dialogData?.isYouLastWroote ? 'Yes' : 'No'}
			</li>
			<li>
				{djinniData.dialogData.lastMessageDate}
			</li>
			<li>
				{djinniData.dialogData.readMessageData}
			</li>
		</ul>
	{/if}
	
	{#if djinniData.expLevel && djinniData.salaryLevel}
		<h1>Djinni stats!</h1>
		<ul>
			<li>{djinniData.expLevel}</li>
			<li>{djinniData.salaryLevel}</li>
		</ul>
	{/if}
{:else if loading && !djinniData}
	<span class="loading loading-spinner loading-lg"></span>
{:else}
	<span class="text-error">No Djinni data is loaded!</span>
{/if}
