<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import SendButton from './send-button.svelte';
	import type { PromptInputProps } from './types';

	let { onSubmit }: PromptInputProps = $props();
	let value = $state('');

	function handleSubmit() {
		if (!value.trim()) return;
		onSubmit?.(value.trim());
		value = '';
	}
</script>

<form class="flex items-center gap-3 px-4" onsubmit={handleSubmit}>
	<div class="relative flex-1">
		<Input
			bind:value
			placeholder="Message..."
			class="min-h-[52px] w-full rounded-xl bg-background px-4 py-6"
		/>
	</div>
	<SendButton disabled={!value.trim()} />
</form>
