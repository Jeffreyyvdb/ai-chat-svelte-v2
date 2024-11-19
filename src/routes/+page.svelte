<script lang="ts">
	import { useChat } from '@ai-sdk/svelte';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import BotIcon from 'lucide-svelte/icons/bot';
	import UserIcon from 'lucide-svelte/icons/user';
	import SendIcon from 'lucide-svelte/icons/send';

	const { input, handleSubmit, messages } = useChat({ maxSteps: 5 });
</script>

<div class="flex h-screen flex-col">
	<main class="flex-1 overflow-hidden">
		<div class="relative h-full">
			<div class="h-full overflow-y-auto pb-32">
				<div class="mx-auto max-w-3xl pt-6">
					<div class="space-y-6">
						{#each $messages as message}
							<div class="flex gap-4 px-4">
								<Avatar>
									<div
										class="flex h-full w-full items-center justify-center rounded-full bg-primary/10"
									>
										{#if message.role === 'assistant'}
											<BotIcon />
										{:else}
											<UserIcon />
										{/if}
									</div>
								</Avatar>
								<div class="prose dark:prose-invert break-words">
									{message.content}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</main>

	<div
		class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 from-50% to-transparent pb-4 pt-6"
	>
		<div class="mx-auto max-w-3xl">
			<form class="flex items-center gap-3 px-4" on:submit={handleSubmit}>
				<div class="relative flex-1">
					<Input
						bind:value={$input}
						placeholder="Message..."
						class="min-h-[52px] w-full rounded-xl bg-background px-4 py-6"
					/>
				</div>
				<Button
					type="submit"
					size="icon"
					disabled={!$input?.trim()}
					class="h-[52px] w-[52px] rounded-xl"
				>
					<SendIcon class="h-5 w-5" />
				</Button>
			</form>
		</div>
	</div>
</div>
