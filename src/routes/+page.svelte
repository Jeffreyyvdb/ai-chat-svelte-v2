<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import BotIcon from 'lucide-svelte/icons/bot';
	import UserIcon from 'lucide-svelte/icons/user';
	import { onMount } from 'svelte';
	import { useChat } from '@ai-sdk/svelte';
	import QueryResultTable from '$lib/components/query-result-table.svelte';
	import MessageInput from '$lib/components/message-input.svelte';
	import Message from '$lib/components/message.svelte';
	import ToolInvocationMessage from '$lib/components/tool-invocation-message.svelte';
	import PromptShortcuts from '$lib/components/prompt-shortcuts.svelte';

	const { input, handleSubmit, messages } = useChat({
		maxSteps: 5
	});

	let waitingForResponse = false;

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
		waitingForResponse = false;
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
				{#if $messages.length === 0}
					<div class="flex h-full flex-col items-center justify-center text-center px-4">
						<h1 class="mb-4 text-4xl font-medium">👋 Hello! I'm your AI assistant</h1>
						<p class="text-xl text-muted-foreground">What can I help you with today?</p>
					</div>
				{:else}
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
				{/if}
			</div>
		</div>
	</main>

	<footer class="bg-gradient-to-t from-background/50 from-10% to-transparent">
		{#if $messages.length === 0}
			<div class="mx-auto max-w-3xl pt-4">
				<PromptShortcuts on:select={(e) => ($input = e.detail)} />
			</div>
		{/if}
		<MessageInput
			bind:value={$input}
			disabled={waitingForResponse}
			onSend={(e) => (waitingForResponse = true) && handleSubmit(e)}
		/>
	</footer>
</div>
