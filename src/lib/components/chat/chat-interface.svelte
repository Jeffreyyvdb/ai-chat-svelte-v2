<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import { page } from '$app/stores';
	import BotIcon from 'lucide-svelte/icons/bot';
	import UserIcon from 'lucide-svelte/icons/user';
	import QueryResultTable from '$lib/components/chat/query-result-table.svelte';
	import MessageInput from '$lib/components/chat/message-input.svelte';
	import Message from '$lib/components/chat/message.svelte';
	import ToolInvocationMessage from '$lib/components/chat/tool-invocation-message.svelte';
	import PromptShortcuts from '$lib/components/chat/prompt-shortcuts.svelte';
	import SignInDialog from '$lib/components/auth/sign-in-dialog.svelte';
	import { fade, fly } from 'svelte/transition';
	import { useChat } from './use-chat';

	// State management with runes
	let messagesContainer: HTMLDivElement | undefined = $state(undefined);
	let showSignInDialog = $state(false);

	const { input, handleSubmit, messages, isLoading } = useChat({
		maxSteps: 5
	});

	const scrollToBottom = () => {
		if (!messagesContainer) return;

		requestAnimationFrame(() => {
			messagesContainer?.scrollTo({
				top: messagesContainer.scrollHeight - messagesContainer.clientHeight,
				behavior: 'smooth'
			});
		});
	};

	const handleMessageSend = (e: Event) => {
		if (!$page.data.session) {
			showSignInDialog = true;
			return;
		}
		handleSubmit(e);
	};

	// Effects using $effect
	$effect(() => {
		// Watch for messages changes and scroll
		if ($messages) {
			setTimeout(scrollToBottom, 100);
		}
	});

	$effect(() => {
		// Watch for last message changes
		const lastMessage = $messages[$messages.length - 1];
		if (lastMessage) {
			scrollToBottom();
		}
	});

	// Initialize scroll position
	$effect.pre(() => {
		scrollToBottom();
	});
</script>

<div class="flex h-[calc(100vh-65px)] flex-col">
	<main class="relative flex-1 overflow-hidden">
		<div bind:this={messagesContainer} class="absolute inset-0 overflow-y-auto scroll-smooth">
			{#if $messages.length === 0}
				<div
					in:fade={{ duration: 1000 }}
					class="flex h-full flex-col items-center justify-center px-4 text-center"
				>
					<h1 class="mb-4 text-4xl font-medium">👋 Hello! I'm your AI assistant</h1>
					<p class="text-xl text-muted-foreground">What can I help you with today?</p>
				</div>
			{:else}
				<div class="mx-auto max-w-3xl pb-36">
					<div class="space-y-4 p-4 sm:space-y-6">
						{#each $messages as message, i (message.id)}
							<div
								in:fly={{ y: 20, duration: 1000 }}
								class="flex {message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}"
							>
								<div class="px-2 sm:px-4" in:fade={{ duration: 1000 }}>
									<Avatar class="h-8 w-8 border border-primary/20 sm:h-10 sm:w-10 md:h-12 md:w-12">
										<div
											class="flex h-full w-full items-center justify-center rounded-full bg-primary/10"
										>
											{#if message.role === 'assistant'}
												<BotIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
											{:else}
												<UserIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
											{/if}
										</div>
									</Avatar>
								</div>
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
	</main>

	<footer
		class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background from-50% to-transparent pb-4 pt-6"
		in:fly={{ y: 20, duration: 1000 }}
	>
		<div class="mx-auto max-w-3xl px-4">
			{#if $messages.length === 0}
				<div class="mb-4">
					<PromptShortcuts on:select={(e) => ($input = e.detail)} />
				</div>
			{/if}
			<MessageInput bind:value={$input} disabled={$isLoading} onSend={handleMessageSend} />
		</div>
	</footer>
</div>

<SignInDialog show={showSignInDialog} onClose={() => (showSignInDialog = false)} />
