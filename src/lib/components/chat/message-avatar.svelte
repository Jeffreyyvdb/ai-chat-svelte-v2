<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import BotIcon from 'lucide-svelte/icons/bot';
	import UserIcon from 'lucide-svelte/icons/user';

	type Props = {
		role: 'data' | 'user' | 'assistant' | 'system';
	};

	let { role }: Props = $props();
</script>

<Avatar class="h-8 w-8 border border-primary/20 sm:h-10 sm:w-10 md:h-12 md:w-12">
	<div class="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
		{#if role === 'user'}
			<UserIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
		{:else}
			<BotIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
		{/if}
	</div>
</Avatar>
