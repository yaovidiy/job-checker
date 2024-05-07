<script lang="ts">
	import { type JobProps, type djinniResponse, type douResponse } from '$lib/types';
	import { onMount } from 'svelte';

	const {
		applied,
		reviews,
		isApplied,
		url,
		score,
		moveBack,
		companyName,
		title,
		shortDesc,
		description
	}: JobProps = $props();
	let loading = $state(true);
	let djinniData = $state<djinniResponse>(null);
	let douData = $state<douResponse>(null);
	let showFullText = $state(false);
	let commentModal = $state<HTMLDialogElement | null>(null);
	let vacanciesModal = $state<HTMLDialogElement | null>(null);
	let anotherLinkModal = $state<HTMLDialogElement | null>(null);
	let douUrlInput = $state<HTMLInputElement | null>(null);
	let text = $derived.by(() => {
		return showFullText ? description : shortDesc;
	});
	let douURL = $state(
		`https://jobs.dou.ua/companies/${companyName.split(' ').join('-').split('.').join('-')}/`
	);

	function toggleText() {
		showFullText = !showFullText;
	}

	function udateDouUrl() {
		douURL = douUrlInput?.value ?? douURL;

		fetchDOUData();
	}

	async function fetchDOUData() {
		try {
			loading = true;
			const douResp = await fetch('/api/job/dou', {
				method: 'post',
				body: JSON.stringify({
					url: douURL
				})
			});

			const douRes: douResponse = await douResp.json();

			douData = douRes;
		} catch (err) {
			console.log(err);
		} finally {
			loading = false;
		}
	}

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
					url: douURL
				})
			});

			const douRes: douResponse = await douResp.json();

			douData = douRes;
			loading = false;
		} catch (err) {}
	}

	onMount(loadJobData);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<a href="#!" onclick={moveBack} class="btn btn-primary btn-outline mb-10">Move back</a>

<h1 class="text-center mb-10 text-5xl">
	<a href={url} class="link" target="_blank">{title}</a>
</h1>

<section class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
	<div class="col-span-1 lg:col-span-2">
		{#if djinniData}
			{#if djinniData.vacancyData}
				<div class="flex gap-5 mb-5 justify-between">
					<ul class="text-xl max-w-[33%]">
						<li>
							<strong>Main tag:</strong>
							{djinniData.vacancyData.mainTag}
						</li>
						<li>
							<strong>Stack:</strong>
							{#each djinniData.vacancyData.tags as tag}
								<span class="badge badge-info mr-2">{tag}</span>
							{/each}
						</li>
						<li>
							<strong>Domain:</strong>
							{djinniData.vacancyData.domain}
						</li>
						<li>
							<strong>Job type:</strong>
							{djinniData.vacancyData.jobLocType}
						</li>
						<li>
							<strong>Company type:</strong>
							{djinniData.vacancyData.jobType}
						</li>
						<li>
							<strong>Location:</strong>
							{djinniData.vacancyData.location}
						</li>
					</ul>
					<ul class="text-xl">
						<li>{djinniData.expLevel}</li>
						<li>{djinniData.salaryLevel}</li>
					</ul>
					<div>
						<h3 class="text-xl mb-5">Job Score</h3>
						<div
							class="radial-progress"
							style={`--value:${score}`}
							class:text-success={score >= 40}
							class:text-warning={score >= 15 && score <= 39}
							class:text-error={score < 15}
						>
							{score}
						</div>
					</div>
				</div>
			{/if}

			{#if djinniData.dialogData}
				<div class="flex gap-5 mb-5 justify-between">
					<ul class="text-xl max-w-[33%]">
						<li>
							<strong>Am I last who send message?</strong>
							{djinniData.dialogData.isYouLastWroote ? 'Yes' : 'No'}
						</li>
						<li>
							<strong>Last message date:</strong>
							{djinniData.dialogData.lastMessageDate}
						</li>
						<li>
							<strong>When message was readed:</strong>
							{djinniData.dialogData.readMessageData}
						</li>
					</ul>
					<ul class="text-xl">
						<li>
							<strong>Job Reviews:</strong>
							{reviews}
						</li>
						<li>
							<strong>Job applient:</strong>
							{applied}
						</li>
					</ul>
					{#if djinniData.vacancyData?.canApply && !isApplied}
						<a href={url} class="btn btn-primary" target="_blank">Apply</a>
					{:else if djinniData.vacancyData?.canApply && isApplied}
						<a href={url} class="btn btn-secondary" target="_blank">You have applied</a>
					{:else}
						<button class="btn btn-error">You can't apply</button>
					{/if}
				</div>
			{/if}
			{#if !djinniData.dialogData && djinniData.vacancyData}
				<div class="flex mb-5 justify-between">
					<div class="w-[33%] h-10"></div>
					<ul class="text-xl">
						<li>
							<strong>Job Reviews:</strong>
							{reviews}
						</li>
						<li>
							<strong>Job applient:</strong>
							{applied}
						</li>
					</ul>
					{#if djinniData.vacancyData.canApply && !isApplied}
						<a href={url} class="btn btn-primary" target="_blank">Apply</a>
					{:else if djinniData.vacancyData.canApply && isApplied}
						<a href={url} class="btn btn-secondary" target="_blank">You have applied</a>
					{:else}
						<button class="btn btn-error">You can't apply</button>
					{/if}
				</div>
			{/if}

			<div class="card bg-neutral text-neutral-content">
				<div class="card-body">
					<p>
						{@html text}
						<a href="#!" class="link link-primary" onclick={toggleText}
							>{showFullText ? 'Show less' : 'Show more'}</a
						>
					</p>
				</div>
			</div>
		{:else if loading && !djinniData}
			<span class="loading loading-spinner loading-lg"></span>
		{:else}
			<span class="text-error">No Djinni data is loaded!</span>
		{/if}
	</div>
	<div class="">
		{#if douData}
			{#if douData.vacanciesdData?.companyScore && douData.vacanciesdData.companyScore !== 'No score El'}
				<div class="flex flex-col items-center mb-5">
					<h3 class="text-xl mb-5">{companyName} Score</h3>
					<div
						class="radial-progress"
						style={`--value:${+douData.vacanciesdData.companyScore}`}
						class:text-success={+douData.vacanciesdData.companyScore >= 90}
						class:text-warning={+douData.vacanciesdData.companyScore >= 50 &&
							+douData.vacanciesdData.companyScore <= 89}
						class:text-error={+douData.vacanciesdData.companyScore < 50}
					>
						{douData.vacanciesdData.companyScore}
					</div>
				</div>
			{:else}
				<p class="text-error mb-5 text-right">
					<a href={douURL} target="_blank" class="link">{companyName}</a> doesn't have a score
				</p>
			{/if}
			{#if douData.reviewsData}
				<div class="flex flex-col mb-5 items-end">
					<ul class="text-xl text-right">
						<li>
							<strong>Total comments:</strong>
							{douData.reviewsData.totalComments}
						</li>
						<li>
							<strong>Latest comment date:</strong>
							{douData.reviewsData.lastComment.time}
						</li>
						<li>
							<button onclick={() => commentModal?.showModal()} class="btn btn-ghost"
								>Show comment</button
							>
						</li>
					</ul>
				</div>
				<dialog bind:this={commentModal} id="comment_dialog" class="modal">
					<div class="modal-box">
						<h3 class="font-bold text-lg text-center">
							Last comment on <a href={`${douURL}reviews/`} target="_blank" class="link">DOU</a>
						</h3>
						<p class="py-4">
							Author: <a
								href={douData.reviewsData.lastComment.author.link}
								target="_blank"
								class="link link-primary">{douData.reviewsData.lastComment.author.name}</a
							>
						</p>
						<p class="py-4">
							{@html douData.reviewsData.lastComment.comment}
						</p>
						<div class="modal-action">
							<form method="dialog">
								<!-- if there is a button in form, it will close the modal -->
								<button class="btn">Close</button>
							</form>
						</div>
					</div>
				</dialog>
			{:else}
				<p class="text-error mb-5 text-right">No reviews on DOU for this company!</p>
			{/if}

			{#if douData.vacanciesdData}
				<ul class="text-xl text-right">
					<li>
						<strong>Total vacancies:</strong>
						{douData.vacanciesdData.vacancies.totalVacancies}
					</li>
					<li>
						<button onclick={() => vacanciesModal?.showModal()} class="btn btn-ghost"
							>Show vacancies list</button
						>
					</li>
				</ul>

				<dialog bind:this={vacanciesModal} id="vacancies_dialog" class="modal">
					<div class="modal-box">
						<h3 class="font-bold text-lg text-center">
							Latest vacancies on <a href={`${douURL}reviews/`} target="_blank" class="link">DOU</a>
						</h3>
						<ul>
							{#each douData.vacanciesdData.vacancies.vacanciesDataList as vacancy}
								<li class="py-3">
									<h3>
										<a href={vacancy.link} target="_blank" class="link">{vacancy.title}</a>
										|
										<span>{vacancy.date}</span>
										|
										<span>{vacancy.location}</span>
									</h3>
								</li>
							{/each}
							{#if douData.vacanciesdData.vacancies.vacanciesDataList.length < douData.vacanciesdData.vacancies.totalVacancies}
								<li>
									<a href={`${douURL}vacancies/`} target="_blank" class="btn btn-primary"
										>See all vacancies</a
									>
								</li>
							{/if}
						</ul>
						<div class="modal-action">
							<form method="dialog">
								<!-- if there is a button in form, it will close the modal -->
								<button class="btn">Close</button>
							</form>
						</div>
					</div>
				</dialog>
			{:else}
				<p class="text-error text-right">No vacancies on DOU for this company</p>
			{/if}
		{:else if loading && !douData}
			<span class="loading loading-spinner loading-lg"></span>
		{:else}
			<p class="text-error text-right mb-5">
				No DOU data is loaded. <a href={douURL} target="_blank" class="link">See the link</a>
			</p>
			<div class="flex justify-end">
				<button onclick={() => anotherLinkModal?.showModal()} class="btn btn-error ml-auto"
					>Try another link!</button
				>
			</div>

			<dialog bind:this={anotherLinkModal} id="anothe_link_dialog" class="modal">
				<div class="modal-box">
					<h3 class="font-bold text-lg text-center">
						Enter another company link on <a href={`${douURL}reviews/`} target="_blank" class="link"
							>DOU</a
						>
					</h3>
					<div class="join">
						<input
							bind:this={douUrlInput}
							class="input input-bordered join-item"
							placeholder="DOU url"
						/>
						<button onclick={udateDouUrl} class="btn join-item rounded-r-full">Update URL</button>
					</div>
					<div class="modal-action">
						<form method="dialog">
							<!-- if there is a button in form, it will close the modal -->
							<button class="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		{/if}
	</div>
</section>
