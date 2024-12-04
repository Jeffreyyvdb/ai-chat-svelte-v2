<script lang="ts">
	import { goto } from '$app/navigation';
	import ChatInterface from '$lib/components/chat/chat-interface.svelte';
	import { type MessageState } from '$lib/types';

	let input = $state('');

	const onSendFirstMessage = () => {
		const chatId = crypto.randomUUID();
		goto(`/chat/${chatId}`, {
			state: { isFirstMessage: true, initialMessage: input } as MessageState
		});
	};
</script>

<ChatInterface bind:input onSendMessage={onSendFirstMessage} />
