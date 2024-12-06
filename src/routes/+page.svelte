<script lang="ts">
	import { goto } from '$app/navigation';
	import ChatInterface from '$lib/components/chat/chat-interface.svelte';
	import { type MessageState } from '$lib/types';

	const { data } = $props();
	let input = $state('');

	const onSendFirstMessage = () => {
		console.log('Sending first message', {chatId: data.chatId, message: input});
		goto(`/chat/${data.chatId}`, {
			state: { isFirstMessage: true, initialMessage: input } as MessageState
		});
	};
</script>

<ChatInterface bind:input onSendMessage={onSendFirstMessage} />
