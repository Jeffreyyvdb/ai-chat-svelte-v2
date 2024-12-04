<script lang="ts">
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import MessageInput from '$lib/components/chat/message-input.svelte';
	import PromptShortcuts from '$lib/components/chat/prompt-shortcuts.svelte';
	import SignInDialog from '$lib/components/auth/sign-in-dialog.svelte';
	import MessageList from './message-list.svelte';
	import type { Message as AiMessage } from './use-chat';

	type Props = {
		onSendMessage: () => void;
		messages?: AiMessage[];
		isLoading?: boolean;
		input?: string;
		noAnimations?: boolean;
	};

	let {
		onSendMessage,
		messages,
		isLoading,
		input = $bindable(''),
		noAnimations = false
	}: Props = $props();

	let messagesContainer: HTMLDivElement | undefined = $state(undefined);
	let showSignInDialog = $state(false);

	const scrollToBottom = () => {
		if (!messagesContainer) return;
		requestAnimationFrame(() => {
			messagesContainer?.scrollTo({
				top: messagesContainer.scrollHeight - messagesContainer.clientHeight,
				behavior: noAnimations ? 'auto' : 'smooth'
			});
		});
	};

	const handleMessageSend = (e: Event) => {
		if (!$page.data.session) {
			showSignInDialog = true;
			return;
		}
		onSendMessage();
	};

	$effect(() => {
		if (messages) {
			setTimeout(scrollToBottom, 100);
		}
	});

	$effect(() => {
		const lastMessage = messages?.[messages.length - 1];
		if (lastMessage) {
			scrollToBottom();
		}
	});

	$effect.pre(() => {
		scrollToBottom();
	});
</script>

<div class="flex h-[calc(100vh-65px)] flex-col">
	<main class="relative flex-1 overflow-hidden">
		<div bind:this={messagesContainer} class="absolute inset-0 overflow-y-auto scroll-smooth">
			{#if !messages || messages?.length === 0}
				<div
					in:fade={{ duration: 1000 }}
					class="flex h-full flex-col items-center justify-center px-4 text-center"
				>
					<h1 class="mb-4 text-4xl font-medium">👋 Hello! I'm your AI assistant</h1>
					<p class="text-xl text-muted-foreground">What can I help you with today?</p>
				</div>
			{:else}
				<MessageList {messages} />
			{/if}
		</div>
	</main>

	<!-- Do not show animations on input to prevent looking like page navigates -->
	<footer
		class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background from-50% to-transparent pb-4 pt-6"
		class:animate-in={!noAnimations}
		class:slide-in-from-bottom-4={!noAnimations}
		class:duration-1000={!noAnimations}
	>
		<div class="mx-auto max-w-3xl px-4">
			{#if messages?.length === 0 || !messages}
				<div class="mb-4">
					<PromptShortcuts on:select={(e) => (input = e.detail)} />
				</div>
			{/if}
			<MessageInput bind:value={input} disabled={isLoading} onSend={handleMessageSend} />
		</div>
	</footer>
</div>

<SignInDialog show={showSignInDialog} onClose={() => (showSignInDialog = false)} />
