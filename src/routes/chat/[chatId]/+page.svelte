<script lang="ts">
	import ChatInterface from '$lib/components/chat/chat-interface.svelte';
	import { useChat } from '$lib/components/chat/use-chat';
	import { page } from '$app/stores';
    import {type MessageState} from '$lib/types';

	const initialMessageState = $page.state as MessageState;
	const { input, handleSubmit, messages, isLoading } = useChat({
		maxSteps: 5
	});

	$effect(() => {
        if (initialMessageState?.initialMessage) {
            console.log('Sending initial message', initialMessageState.initialMessage);
            input.set(initialMessageState.initialMessage);
            handleSubmit();
        }
    });
</script>

<ChatInterface 
	bind:input={$input} 
	onSendMessage={handleSubmit} 
	messages={$messages} 
	isLoading={$isLoading}
	noAnimations={initialMessageState?.isFirstMessage} 
/>
