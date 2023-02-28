<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { AppwriteService } from '$lib/AppwriteService';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const jsConfetti = new JSConfetti();

	const json: {
		[key: string]: {
			points: number;
			momentum: number;
		};
	} = JSON.parse(data.habit?.data ?? '{}');

	function getDateData(date: Date) {
		const key = `${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;

		return (
			json[key] ?? {
				points: 0,
				momentum: 0
			}
		);
	}

	function toggleDay(date: Date) {
		const key = `${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;
		if (!json[key] || json[key].momentum < 0) {
			json[key] = {
				points: 0,
				momentum: 1
			};
			jsConfetti.addConfetti();
		} else {
			json[key] = {
				points: 0,
				momentum: -1
			};
		}
	}

	async function onEditName() {
		const name = prompt('New habit name:');
		if (name) {
			await AppwriteService.editHabitName(data.habit?.$id ?? '', name);
			await invalidateAll();
		}
	}

	async function onDelete() {
		const pass = confirm(`Are you sure to delete habit "${data.habit?.name ?? ''}"?`);
		if (pass) {
			await AppwriteService.deleteHabit(data.habit?.$id ?? '');
			await goto('/user');
			await invalidateAll();
		}
	}

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	let days: Date[] = [];

	let date = new Date();
	days.push(date);
	for (let i = 0; i < 6; i++) {
		date = new Date(date);
		date.setDate(date.getDate() - 1);
		days = [date, ...days];
	}
</script>

{#if data.habit}
	<div class="flex flex-col gap-3">
		<div class="bg-white border border-gray-300 p-3 rounded-md flex flex-col gap-3">
			<div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
				<div>
					<h4 class="font-bold text-gray-900 text-xl">{data.habit.name}</h4>
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

		<div class="w-full grid grid-cols-7 gap-3 mt-2">
			{#key json}
				{#each days as day}
					{@const dayJson = getDateData(day)}
					<button
						on:click={() => toggleDay(day)}
						id={`${day.getDate()}_${day.getMonth()}_${day.getFullYear()}`}
						class="col-span-1 relative rounded-md p-3 bg-white border border-gray-300 text-center"
					>
						<div
							class="absolute top-0 left-0 w-full transform flex items-center justify-center translate-y-[-50%] z-10"
						>
							<span
								class={`px-3 py-[3px] ${
									dayJson.momentum === 0
										? 'bg-gray-200 text-gray-600'
										: dayJson.momentum > 0
										? 'bg-green-500 text-white'
										: 'bg-black text-white'
								} text-xs rounded-full`}>{dayJson.momentum}</span
							>
						</div>

						<p class="font-bold mt-2">{day.getDate()}</p>
						<p class="text-xs">{monthNames[day.getMonth()]}</p>
					</button>
				{/each}
			{/key}
		</div>
	</div>
{:else}
	<div class="bg-white border border-gray-300 p-3 rounded-md flex flex-col gap-3">
		<h3 class="text-4xl">🚨</h3>

		<div>
			<h4 class="font-bold text-gray-900 text-lg">You got lost!</h4>
			<p class="text-gray-700 text-sm max-w-md">
				Habit you are looking for does not exist. Pick one from left panel, or make a new one.
			</p>
		</div>
	</div>
{/if}
