<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import SendIcon from 'lucide-svelte/icons/send';

	let { input, handleSubmit } = $props<{
		input: string;
		handleSubmit: (e: SubmitEvent) => void;
	}>();
</script>

<div
	class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 from-50% to-transparent pb-4 pt-6"
>
	<div class="mx-auto max-w-3xl">
		<form class="flex items-center gap-3 px-4" onsubmit={handleSubmit}>
			<div class="relative flex-1">
				<Input
					bind:value={input}
					placeholder="Message..."
					class="min-h-[52px] w-full rounded-xl bg-background px-4 py-6"
				/>
			</div>
			<Button
				type="submit"
				size="icon"
				disabled={!input?.trim()}
				class="h-[52px] w-[52px] rounded-xl"
			>
				<SendIcon class="h-5 w-5" />
			</Button>
		</form>
	</div>
</div>
