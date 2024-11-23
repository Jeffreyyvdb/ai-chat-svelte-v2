<script lang="ts">
	import type { ToolInvocation } from 'ai';
	import { WrenchIcon } from 'lucide-svelte';

	type Props = {
		tool: ToolInvocation;
	};

	let { tool }: Props = $props();
</script>

<div class="mr-auto max-w-[80%]">
	<div
		class="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground"
	>
		<WrenchIcon class="h-4 w-4" />
		<span>Using tool: {tool.toolName}</span>
	</div>
</div>
