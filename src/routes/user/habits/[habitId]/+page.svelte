<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { AppwriteService } from '$lib/AppwriteService';
	import type { PageData } from './$types';

	export let data: PageData;

	async function onEditName() {
		const name = prompt("New habit name:");
		if(name) {
			await AppwriteService.editHabitName(data.habit.$id, name);
			await invalidateAll();
		}
	}

	async function onDelete() {
		const pass = confirm(`Are you sure to delete habit "${data.habit.name}"?`);
		if(pass) {
			await AppwriteService.deleteHabit(data.habit.$id);
			await goto('/user');
			await invalidateAll();
		}
	}
</script>

{#if data.habit}
	<div class="bg-white border border-gray-300 p-3 rounded-md flex flex-col gap-2">
		<div class="flex flex-col sm:flex-row gap-3 items-start justify-between">
			<div>
				<h4 class="font-bold text-gray-900 text-lg">{data.habit.name}</h4>
				<p class="text-gray-700 text-sm max-w-md">{data.habit.$id}</p>
			</div>
			<div>
				<button
					on:click={onEditName}
					class="relative inline-flex justify-center flex-none px-3 py-3 ml-1 overflow-hidden text-sm font-medium text-white transition-colors bg-blue-500 rounded-xl outline-2 outline-offset-2 before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-blue-600 active:text-white/80 before:transition-colors"
					type="button"
				>
					<span class="inline"> Edit Name </span>
				</button>

				<button
					on:click={onDelete}
					class="relative inline-flex justify-center flex-none px-3 py-3 ml-1 overflow-hidden text-sm font-medium text-white transition-colors bg-red-500 rounded-xl outline-2 outline-offset-2 before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-red-600 active:text-white/80 before:transition-colors"
					type="button"
				>
					<span class="inline"> Delete </span>
				</button>
			</div>
		</div>
	</div>
	{:else}
	<div class="bg-white border border-gray-300 p-3 rounded-md flex flex-col gap-2">
		<h3 class="text-4xl">🚨</h3>
	
		<div>
			<h4 class="font-bold text-gray-900 text-lg">You got lost!</h4>
			<p class="text-gray-700 text-sm max-w-md">Habit you are looking for does not exist. Pick one from left panel, or make a new one.</p>
		</div>
	</div>
	
{/if}
