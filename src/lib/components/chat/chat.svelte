<script lang="ts">
	import type { ChatProps } from './types';
	import ChatMessages from './chat-messages.svelte';
	import PromptInput from './prompt-input.svelte';

	let { messages = [], onSubmit }: ChatProps = $props();
</script>

<div class="flex h-screen flex-col">
	<main class="flex-1 overflow-hidden">
		<div class="relative h-full">
			<div class="h-full overflow-y-auto pb-32">
				<div class="mx-auto max-w-3xl pt-6">
					<ChatMessages {messages} />
				</div>
			</div>
		</div>
	</main>

	<div
		class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 from-50% to-transparent pb-4 pt-6"
	>
		<div class="mx-auto max-w-3xl">
			<PromptInput {onSubmit} />
		</div>
	</div>
</div>
