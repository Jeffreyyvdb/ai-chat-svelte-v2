<script lang="ts">
	type Props = {
		query: string;
	};

	let { query }: Props = $props();
</script>

<pre class="whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-sm">{query}</pre>
