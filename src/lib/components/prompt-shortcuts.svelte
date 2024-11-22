<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		select: string;
	}>();

	const shortcuts = [
		{
			text: '🤔 Tell me about the history of artificial intelligence',
			description: 'Get information on any topic'
		},
		{ text: "🌤️ What's the weather in San Francisco?", description: 'Get weather updates' },
		{ text: '🌡️ Convert 32°F to Celsius', description: 'Convert between °C and °F' },
		{ text: '🕐 What time is it in Tokyo?', description: 'Check time in different zones' },
		{
			text: '🔖 Remember that I prefer dark mode themes',
			description: 'Store personal preferences'
		},
		{
			text: '🦄 Tell me about unicorn companies in San Francisco tech sector',
			description: 'Get unicorn company data'
		}
	];

	function handleShortcutClick(text: string) {
		dispatch('select', text);
	}
</script>

<div class="mb-2 flex flex-wrap gap-2 rounded-xl bg-muted/50 px-4 py-2">
	{#each shortcuts as shortcut}
		<button
			class="rounded-full bg-primary/10 px-3 py-1.5 text-sm transition-colors hover:bg-primary/20"
			title={shortcut.description}
			on:click={() => handleShortcutClick(shortcut.text)}
		>
			{shortcut.text}
		</button>
	{/each}
</div>
