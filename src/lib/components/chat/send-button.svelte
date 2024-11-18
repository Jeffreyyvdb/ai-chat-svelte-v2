<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import SendIcon from 'lucide-svelte/icons/send';
	import type { SendButtonProps } from './types';

	let { disabled = false }: SendButtonProps = $props();
</script>

<Button type="submit" size="icon" {disabled} class="h-[52px] w-[52px] rounded-xl">
	<SendIcon class="h-5 w-5" />
</Button>
