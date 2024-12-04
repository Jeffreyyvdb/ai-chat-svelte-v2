<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Message as AiMessage } from './use-chat';
	import Message from './message.svelte';
	import MessageAvatar from './message-avatar.svelte';
	import ToolInvocationMessage from './tool-invocation-message.svelte';
	import QueryResultTable from './query-result-table.svelte';

	type Props = {
		messages: AiMessage[];
		noAnimations?: boolean;
	};

	let { messages, noAnimations = false }: Props = $props();
</script>

<div class="mx-auto max-w-3xl pb-36">
	<div class="space-y-4 p-4 sm:space-y-6">
		{#each messages as message, i (message.id)}
			<div
				class="flex {message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}"
				class:animate-in={!noAnimations}
				class:slide-in-from-bottom-4={!noAnimations}
				class:duration-1000={!noAnimations}
			>
				<div 
					class="px-2 sm:px-4"
					class:animate-in={!noAnimations}
					class:fade-in={!noAnimations}
					class:duration-1000={!noAnimations}
				>
					<MessageAvatar role={message.role} />
				</div>
				<div
					class="flex flex-1 flex-col {message.role === 'user' ? 'items-end' : 'items-start'}"
				>
					{#if message.toolInvocations?.length}
						<div class="w-full">
							{#each message.toolInvocations as tool}
								<div class="flex flex-col gap-2">
									<ToolInvocationMessage {tool} />
									{#if tool.toolName === 'databaseTool' && tool.state === 'result' && tool.result?.data?.length}
										<QueryResultTable data={tool.result.data} query={tool.result.query} />
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<Message content={message.content} />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
