<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import { AppwriteService } from '$lib/AppwriteService';
	import { AccountStore } from '$lib/stores/AccountStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	if (browser) {
		if ($AccountStore === null) {
			goto('/sign-in');
		}
	}

	async function onSignout() {
		await AppwriteService.logout();
		AccountStore.set(null);
		await goto('/');
	}

	async function onNewHabit() {
		const name = prompt('Enter habit:');

		if (name) {
			const habit = await AppwriteService.createHabit(name);
			await goto(`/user/habits/${habit.$id}`);
			await invalidateAll();
		}
	}

	let open = false;
</script>

<div class="w-full bg-white border-b border-gray-200">
	<div class="max-w-4xl mx-auto">
		<div
			class="relative flex flex-col w-full p-5 mx-auto bg-white md:items-center md:justify-between md:flex-row md:px-6 lg:px-8"
		>
			<div class="flex flex-row items-center justify-between lg:justify-start">
				<a class="text-lg  text-black focus:outline-none focus:ring lg:text-2xl" href="/">
					<span class="lg:text-lg font-bold focus:ring-0"> Almost Polar Habits </span>
				</a>
				<button
					on:click={() => (open = !open)}
					class="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:text-black md:hidden"
				>
					<svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
						{#if open}
							<path
								class="inline-flex"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								class="inline-flex"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>

			<nav
				class={`${
					!open ? 'hidden' : ''
				} justify-center flex flex-col items-center flex-grow md:pb-0 md:flex md:justify-end md:flex-row`}
			>
				<a
					class="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600 lg:ml-auto"
					href="/user"
				>
					Dashboard
				</a>

				<div class="inline-flex items-center gap-3 list-none lg:ml-auto">
					<a
						href="https://almost-polar-habits.authui.site/"
						class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-black rounded-full group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-gray-700 active:bg-gray-800 active:text-white focus-visible:outline-black"
					>
						Manage Account
					</a>
				</div>
			</nav>
		</div>
	</div>
</div>

<div class="max-w-4xl mx-auto">
	<div class="p-5 md:px-6 lg:px-8">
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
				{#each data.habits as habit}
					<a
						href={`/user/habits/${habit.$id}`}
						class="flex overflow-y-auto border bg-black text-white border-black rounded-md p-3 items-center justify-between"
					>
						<h3 class="font-bold">{habit.name}</h3>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-4 h-4 text-gray-500"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
							/>
						</svg>
					</a>
				{/each}

				<button
					on:click={onNewHabit}
					class="flex items-center justify-between overflow-y-auto border bg-white border-gray-200 rounded-md p-3"
				>
					<h3 class="font-bold">New Habit</h3>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-4 h-4 text-gray-500"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			</div>

			<div class="col-span-12 lg:col-span-8">
				<slot />
			</div>
		</div>
	</div>
</div>
