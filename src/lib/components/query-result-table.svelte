<script lang="ts">
	import QueryViewer from './query-viewer.svelte';

	type Props = {
		data: any;
		query: string;
	};

	let { data, query }: Props = $props();
	let showFullData = $state(false);

	// Get preview data (first 10 rows)
	let previewData = $derived(data.slice(0, 10));

	function toggleFullData() {
		showFullData = !showFullData;
	}
</script>

<div class="w-full rounded-lg border bg-card p-4">
	<QueryViewer {query} />

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr>
					{#each Object.keys(data[0]) as header}
						<th class="border-b p-2 text-left font-medium">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each showFullData ? data : previewData as row}
					<tr>
						{#each Object.values(row) as cell}
							<td class="border-b p-2">
								{typeof cell === 'number'
									? cell.toLocaleString(undefined, {
											maximumFractionDigits: 2
										})
									: cell}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="mt-4 flex items-center justify-end">
		{#if data.length > 10}
			<button
				onclick={toggleFullData}
				class="rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
			>
				{showFullData ? 'Show Preview' : `Show All (${data.length} rows)`}
			</button>
		{/if}
	</div>
</div>

{#if showFullData}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="h-[90vh] w-[90vw] overflow-auto rounded-lg bg-background p-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Full Results ({data.length} rows)</h2>
				<button onclick={toggleFullData} class="rounded p-2 hover:bg-muted"> ✕ </button>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr>
							{#each Object.keys(data[0]) as header}
								<th class="sticky top-0 border-b bg-background p-2 text-left font-medium"
									>{header}</th
								>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data as row}
							<tr>
								{#each Object.values(row) as cell}
									<td class="border-b p-2">
										{typeof cell === 'number'
											? cell.toLocaleString(undefined, {
													maximumFractionDigits: 2
												})
											: cell}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
