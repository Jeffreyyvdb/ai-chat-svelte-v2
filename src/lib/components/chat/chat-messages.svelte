<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import type { ChatProps } from './types';

	let { messages = [] }: ChatProps = $props();
</script>

<div class="space-y-6">
	{#each messages as message}
		<div class="flex gap-4 px-4">
			<Avatar>
				<div class="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
					{#if message.role === 'assistant'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="h-4 w-4"
						>
							<path
								d="M9 3.5V2m0 20v-1.5m-6.364-2.636l1.061-1.061m14.142 0l-1.061-1.061M3.5 9H2m20 0h-1.5m-6.207-4.793L13.232 5.268m4.95 10.964l-1.061 1.061M5.268 13.232l-1.061 1.061"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="h-4 w-4"
						>
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					{/if}
				</div>
			</Avatar>
			<div class="prose dark:prose-invert break-words">
				{message.content}
			</div>
		</div>
	{/each}
</div>
