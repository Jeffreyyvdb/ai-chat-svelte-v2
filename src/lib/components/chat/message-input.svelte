<script lang="ts">
	import { SendIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type Props = {
		value: string;
		onSend: (event: SubmitEvent) => void;
		disabled?: boolean;
	};

	let { value = $bindable(), onSend, disabled = false }: Props = $props();
</script>

<div class="py-4">
	<div class="mx-auto max-w-3xl">
		<form class="flex items-center gap-3 px-4" onsubmit={onSend}>
			<div class="relative flex-1">
				<Input
					{disabled}
					bind:value
					placeholder="Message..."
					class="min-h-[52px] w-full rounded-xl bg-background px-4 py-6"
				/>
			</div>
			<Button
				type="submit"
				size="icon"
				disabled={!value?.trim() || disabled}
				class="h-[52px] w-[52px] rounded-xl"
			>
				<SendIcon class="h-5 w-5" />
			</Button>
		</form>
	</div>
</div>
