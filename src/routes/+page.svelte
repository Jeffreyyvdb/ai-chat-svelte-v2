<script lang="ts">
	import { Chat } from '$lib/components/chat';
	import type { Message } from '$lib/components/chat/types';

	const messages: Message[] = $state([
		{
			role: 'assistant',
			content: 'Hello! How can I help you today?'
		}
	]);

	function handleSubmit(message: string) {
		messages.push({ role: 'user', content: message });
	}
</script>

<Chat {messages} onSubmit={handleSubmit} />
