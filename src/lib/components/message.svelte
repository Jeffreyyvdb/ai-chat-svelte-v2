<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	type Props = {
		content: string;
	};

	let { content }: Props = $props();
</script>

<div
	class="prose dark:prose-invert max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-muted px-4 py-2"
>
	<SvelteMarkdown source={content} />
</div>
