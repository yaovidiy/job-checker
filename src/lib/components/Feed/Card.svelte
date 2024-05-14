<script lang="ts">
	import { fade } from 'svelte/transition';
	import { type CardProps } from '$lib/types';

	const { item, clickOnItem }: CardProps = $props();
	const { generalInfo, additionalInfo, analitics, score } = item;
	let showFullText = $state(false);
	const text = $derived.by(() => {
		if (showFullText) {
			return generalInfo.description;
		}

		return generalInfo.shortDescription;
	});

	function toggleText(e: Event) {
		e.preventDefault();
		showFullText = !showFullText;
	}
</script>

<div transition:fade class="card w-full bg-neutral text-neutral-content">
	<div class="card-body gap-5 justify-between">
		<div class="flex md:flex-row flex-col gap-2">
			<div class="flex w-full md:w-2/3 gap-2 flex-col">
				<h2 class="card-title">{generalInfo.title}</h2>
				<p>
					{@html text}
					<button onclick={toggleText} class="link link-secondary"
						>{showFullText ? 'Show less' : 'Show more'}</button
					>
				</p>
			</div>
			<div class="divider md:flex hidden divider-horizontal"></div>
			<div class="flex sticky top-4 flex-col gap-4 w-full md:w-1/3 items-center">
				<h2 class="card-title">Score</h2>
				<div
					class="radial-progress"
					style={`--value:${score}`}
					class:text-success={score >= 40}
					class:text-warning={score >= 15 && score <= 39}
					class:text-error={score < 15}
				>
					{score}
				</div>
				<ul class="list-none m-0 p-0 w-full">
					<li>
						<h3 class="truncate w-full font-semibold" title="Job creation date">
							{generalInfo.postDate}
						</h3>
					</li>
					<li>
						<h3 class="truncate w-full text-base">
							Applied:
							<span class:text-success={analitics.isApplied} class:text-error={!analitics.isApplied}
								>{analitics.isApplied ? 'Yes' : 'No'}</span
							>
						</h3>
					</li>
					<li class="h-6">
						<h3
							class="truncate text-left w-full text-base tooltip"
							data-tip={generalInfo.companyName}
						>
							Company:
							<a
								href={`https://jobs.dou.ua/companies/${generalInfo.companyName.toLowerCase()}/reviews/`}
								class="link link-accent"
								target="_blank"
								title={generalInfo.companyName}>{generalInfo.companyName}</a
							>
						</h3>
					</li>
					<li>
						<h3 class="truncate w-full text-base">
							Exp: {additionalInfo.experience}
						</h3>
					</li>
					<li>
						<h3>Viewed: {analitics.reviews}</h3>
					</li>
					<li>
						<h3>Applied: {analitics.applies}</h3>
					</li>
				</ul>
			</div>
		</div>
		<div class="card-actions justify-end">
			<a href="/" onclick={() => clickOnItem(item)} class="btn btn-primary">Open job details</a>
			<a href={generalInfo.link} target="_blank" class="btn btn-ghost">Go to Djinni</a>
		</div>
	</div>
</div>
