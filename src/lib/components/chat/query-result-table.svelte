<script lang="ts">
	import QueryViewer from './query-viewer.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

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

<Dialog.Root open={showFullData} onOpenChange={(open) => (showFullData = open)}>
	<Dialog.Content class="max-h-[90vh] max-w-[90vw]">
		<div class="flex items-center justify-between">
			<Dialog.Title>Full Results ({data.length} rows)</Dialog.Title>
			<Dialog.Close />
		</div>
		<div class="mt-4 overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr>
						{#each Object.keys(data[0]) as header}
							<th class="sticky top-0 border-b bg-background p-2 text-left font-medium">{header}</th
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
	</Dialog.Content>
</Dialog.Root>
