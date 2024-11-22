<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import BotIcon from 'lucide-svelte/icons/bot';
	import UserIcon from 'lucide-svelte/icons/user';
	import { onMount } from 'svelte';
	import { useChat } from '@ai-sdk/svelte';
	import QueryResultTable from '$lib/components/query-result-table.svelte';
	import { initialMessages } from '$lib/data/initial-messages';
	import { derived } from 'svelte/store';
	import MessageInput from '$lib/components/message-input.svelte';
	import Message from '$lib/components/message.svelte';
	import QueryViewer from '$lib/components/query-viewer.svelte';
	import ToolInvocationMessage from '$lib/components/tool-invocation-message.svelte';

	const {
		input,
		handleSubmit,
		messages: chatMessages
	} = useChat({
		maxSteps: 5
	});

	// Combine initial messages with chat messages
	const messages = derived(chatMessages, ($chatMessages) => {
		return [...initialMessages, ...$chatMessages];
	});

	// Add a reference to the messages container
	let messagesContainer: HTMLDivElement;

	// Function to scroll to bottom
	const scrollToBottom = () => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	};

	// Scroll when messages change
	$: if ($messages) {
		// Use setTimeout to ensure DOM is updated
		setTimeout(scrollToBottom, 0);
	}

	// Scroll on initial load
	onMount(() => {
		scrollToBottom();
	});
</script>

<div class="flex h-screen flex-col">
	<main class="flex-1 overflow-hidden">
		<div class="relative h-full">
			<div bind:this={messagesContainer} class="h-full overflow-y-auto pb-32">
				<div class="mx-auto max-w-3xl pt-6">
					<div class="space-y-6">
						{#each $messages as message}
							<div class="flex gap-4 px-4 {message.role === 'user' ? 'flex-row-reverse' : ''}">
								<Avatar>
									<div
										class="flex h-full w-full items-center justify-center rounded-full bg-primary/10"
									>
										{#if message.role === 'assistant'}
											<BotIcon />
										{:else}
											<UserIcon />
										{/if}
									</div>
								</Avatar>
								<div
									class="flex flex-1 flex-col {message.role === 'user'
										? 'items-end'
										: 'items-start'}"
								>
									{#if message.toolInvocations?.length}
										<div class="w-full">
											{#each message.toolInvocations as tool}
												<div class="flex flex-col gap-2">
													<ToolInvocationMessage {tool} />
													{#if tool.toolName === 'databaseTool' && tool.state === 'result' && tool.result?.data?.length}
														<!-- <QueryViewer query={tool.result.query} /> -->
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
			</div>
		</div>
	</main>

	<MessageInput bind:value={$input} onSend={handleSubmit} />
</div>
