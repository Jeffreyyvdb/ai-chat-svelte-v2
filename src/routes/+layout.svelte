<script lang="ts">
	import { page } from '$app/stores';
	import { SignOut } from '@auth/sveltekit/components';
	import SignInDialog from '$lib/components/auth/sign-in-dialog.svelte';
	import '../app.css';

	let { children } = $props();
	let showSignInDialog = $state(false);
</script>

<div class="relative flex h-screen flex-col">
	<!-- Gradient background -->
	<div
		class="bg-gradient-radial fixed inset-0 from-purple-500/20 via-background to-background"
	></div>

	<!-- Content -->
	<div class="relative flex h-full flex-col">
		<header class="sticky top-0 z-10 border-b border-gray-700/50 bg-background/80 backdrop-blur-sm">
			<nav class="mx-auto flex max-w-7xl items-center justify-between p-4">
				<div class="truncate text-lg font-bold text-gray-200 sm:text-xl">
					<span class="hidden sm:inline">Jeffreyyvdb/</span>ai-chat-svelte-v2
				</div>

				<div class="flex items-center gap-2 sm:gap-4">
					{#if $page.data.session}
						<div class="flex items-center gap-2 sm:gap-3">
							<span class="hidden text-sm text-gray-300 sm:inline"
								>{$page.data.session.user?.name}</span
							>
							<img
								src={$page.data.session.user?.image ?? 'https://i.pravatar.cc/300'}
								alt="User Avatar"
								class="h-8 w-8 rounded-full border border-gray-700/50"
							/>
							<SignOut>
								<span
									slot="submitButton"
									class="rounded-md border border-primary/20 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-primary/20 sm:px-4 sm:py-2"
								>
									<span class="hidden sm:inline">Sign out</span>
									<span class="sm:hidden">Sign out</span>
								</span>
							</SignOut>
						</div>
					{:else}
						<button
							class="flex items-center gap-2 rounded-md border border-primary/20 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-primary/20 sm:px-4 sm:py-2"
							onclick={() => (showSignInDialog = true)}
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="hidden sm:inline">Sign in with GitHub</span>
							<span class="sm:hidden">Sign in</span>
						</button>
					{/if}
				</div>
			</nav>
		</header>
		{@render children()}
	</div>
</div>

<SignInDialog show={showSignInDialog} onClose={() => (showSignInDialog = false)} />
