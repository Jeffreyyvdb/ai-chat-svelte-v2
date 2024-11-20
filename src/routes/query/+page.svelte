<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import SendIcon from 'lucide-svelte/icons/send';

	let question = $state('');
	let loading = $state(false);
	let query = $state<string | null>();
	let results = $state<any[] | null>(null);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		query = null;
		results = null;

		try {
			const generateResponse = await fetch('/api/query/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ input: question })
			});

			const generateData = await generateResponse.json();

			if (!generateResponse.ok) {
				throw new Error(generateData.error || 'Failed to generate query');
			}

			query = generateData.query;

			const executeResponse = await fetch('/api/query/execute', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: generateData.query })
			});

			const executeData = await executeResponse.json();

			if (!executeResponse.ok) {
				throw new Error(executeData.error || 'Failed to execute query');
			}

			results = executeData.results;
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex h-screen flex-col">
	<div class="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="mx-auto max-w-3xl px-4 py-4">
			<form class="flex items-center gap-3" onsubmit={handleSubmit}>
				<div class="relative flex-1">
					<Input
						bind:value={question}
						placeholder="Ask a question about your data..."
						class="min-h-[52px] w-full rounded-xl bg-background px-4 py-6 text-lg"
						disabled={loading}
					/>
				</div>
				<Button
					type="submit"
					size="icon"
					disabled={!question?.trim() || loading}
					class="h-[52px] w-[52px] rounded-xl"
				>
					<SendIcon class="h-5 w-5" />
				</Button>
			</form>
		</div>
	</div>

	<main class="flex-1 overflow-hidden">
		<div class="relative h-full">
			<div class="h-full overflow-y-auto">
				<div class="mx-auto max-w-3xl p-4">
					<div class="space-y-6">
						{#if query}
							<div class="rounded-lg border bg-card p-4">
								<h3 class="mb-2 font-semibold">Generated Query:</h3>
								<pre class="whitespace-pre-wrap break-words text-sm">{query}</pre>
							</div>
						{/if}

						{#if results && results.length > 0}
							<div class="rounded-lg border bg-card p-4">
								<h3 class="mb-4 font-semibold">Results:</h3>
								<div class="overflow-x-auto">
									<table class="w-full">
										<thead>
											<tr>
												{#each Object.keys(results[0]) as header}
													<th class="border-b p-2 text-left font-medium">{header}</th>
												{/each}
											</tr>
										</thead>
										<tbody>
											{#each results as row}
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
						{/if}
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
