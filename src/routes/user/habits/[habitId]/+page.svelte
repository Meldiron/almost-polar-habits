<script lang="ts">
	import Chart from 'chart.js/auto';

	import { goto, invalidateAll } from '$app/navigation';
	import { AppwriteService } from '$lib/AppwriteService';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';

	export let data: PageData;

	const json: {
		[key: string]: {
			points: number;
			momentum: number;
			completed: boolean;
		};
	} = JSON.parse(data.habit?.data ?? '{}');

	let difficulty = data.habit?.difficulty ?? 'easy';
	let multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;

	function updateJson() {
		let firstDay = null;
		let firstDayTime = -1;

		for (const dateKey in json) {
			if (json[dateKey].completed) {
				const date = new Date(dateKey);
				if (firstDayTime === -1 || firstDayTime > date.getTime()) {
					firstDayTime = date.getTime();
					firstDay = dateKey;
				}
			}
		}

		if (firstDay === null) {
			for (const dateKey in json) {
				json[dateKey].points = 0;
				json[dateKey].momentum = 0;
			}
			return;
		}

		let loopDate = new Date(firstDay);
		loopDate.setHours(4);
		const timeNow = Date.now();
		let lastCompleted = false;
		let momentum = 0;
		let points = 0;

		while (loopDate.getTime() <= timeNow) {
			const key = loopDate.toISOString().substring(0, 10);

			const completed = json[key] && json[key].completed ? true : false;

			if (lastCompleted) {
				if (completed) {
					momentum++;
				} else {
					momentum = -1 * multiplier;
				}
			} else {
				if (completed) {
					momentum = 1;
				} else {
					momentum -= 1 * multiplier;
				}
			}

			if (!json[key]) {
				json[key] = {
					points: 0,
					momentum: 0,
					completed: false
				};
			}

			points += momentum;
			points = Math.max(points, 0);

			json[key].momentum = momentum;
			json[key].points = points;

			lastCompleted = completed;

			loopDate.setDate(loopDate.getDate() + 1);
		}
	}

	function getDateData(date: Date) {
		const key = date.toISOString().substring(0, 10);

		return (
			json[key] ?? {
				points: 0,
				momentum: 0,
				completed: false
			}
		);
	}

	function toggleDay(date: Date) {
		const key = date.toISOString().substring(0, 10);

		if (!json[key]) {
			json[key] = {
				points: 0,
				momentum: 0,
				completed: false
			};
		}

		json[key].completed = !json[key].completed;

		if (json[key].completed === false) {
			delete json[key];
		}

		updateJson();
		updateChart();
		onEditData();
	}

	async function onEditName() {
		const name = prompt('New habit name:');
		if (name) {
			await AppwriteService.editHabitName(data.habit?.$id ?? '', name);
			await invalidateAll();
		}
	}

	async function onEditData() {
		await AppwriteService.editHabitData(data.habit?.$id ?? '', JSON.stringify(json));
		await invalidateAll();
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

	let chart: any = null;

	function generateChartData(): any {
		const dates = Object.keys(json).sort((a, b) => {
			return new Date(a).getTime() < new Date(b).getTime() ? -1 : 1;
		});

		const dataArr = [];

		for (const date of dates) {
			dataArr.push(json[date].points);
		}

		return {
			labels: dates.map((d) => {
				const name = d.split('-');
				return `${+name[2]}.${+name[1]}`;
			}),
			datasets: [
				{
					label: 'Points',
					tension: 0.4,
					data: dataArr,
					borderWidth: 1,
					borderColor: '#22c55e',
					fill: true,
					backgroundColor: '#dcfce7',
					pointStyle: false
				}
			]
		};
	}

	function updateChart() {
		const ctx: any = document.getElementById('chart');
		if (ctx) {
			if (!chart) {
				chart = new Chart(ctx, {
					type: 'line',
					data: generateChartData(),
					options: {
						responsive: true,
						plugins: {
							title: {
								display: false
							},
							legend: {
								display: false
							}
						},
						interaction: {
							intersect: false
						},
						scales: {
							x: {
								display: true,
								title: {
									display: true
								}
							},
							y: {
								display: false,
								title: {
									display: false
								},
								min: 0
							}
						}
					}
				});
			} else {
				chart.data = generateChartData();
				chart.update();
			}
		}
	}

	async function onMakeEasier() {
		const newDifficulty = difficulty === 'medium' ? 'easy' : 'medium';

		await AppwriteService.editHabitDifficulty(data.habit?.$id ?? '', newDifficulty);

		difficulty = newDifficulty;
		multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;

		updateJson();
		updateChart();
		onEditData();

		await invalidateAll();
	}

	async function onMakeHarder() {
		const newDifficulty = difficulty === 'medium' ? 'hard' : 'medium';

		await AppwriteService.editHabitDifficulty(data.habit?.$id ?? '', newDifficulty);

		difficulty = newDifficulty;
		multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;

		updateJson();
		updateChart();
		onEditData();

		await invalidateAll();
	}

	onMount(() => {
		if (browser) {
			updateChart();
		}
	});
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
								} text-xs rounded-full`}>{dayJson.momentum > 0 ? '+' : ''}{dayJson.momentum}</span
							>
						</div>

						<p class="font-bold mt-2">{day.getDate()}</p>
						<p class="text-xs">{monthNames[day.getMonth()]}</p>
					</button>
				{/each}
			{/key}
		</div>

		<div class="bg-white border border-gray-300 p-3 rounded-md flex flex-col gap-3 mt-2">
			<h4 class="font-bold text-gray-900 text-xl">Your momentum</h4>

			<canvas id="chart" />
		</div>

		<div class="bg-white border border-gray-300 p-3 rounded-md flex flex-col gap-3">
			<div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
				<h4 style="text-transform: capitalize" class="font-bold text-gray-900 text-xl">{difficulty} Difficulty</h4>

				<div class="flex items-center justify-end gap-1">
					{#if difficulty !== 'easy'}
						<button
							on:click={onMakeEasier}
							class="relative inline-flex justify-center flex-none px-3 py-3 ml-1 overflow-hidden text-sm font-medium text-slate-900 transition-colors bg-slate-100 rounded-xl outline-2 outline-offset-2 before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-slate-200 active:text-slate-700 before:transition-colors"
							type="button"
						>
							<span class="inline"> Make Easier </span>
						</button>
					{/if}

					{#if difficulty !== 'hard'}
						<button
							on:click={onMakeHarder}
							class="relative inline-flex justify-center flex-none px-3 py-3 ml-1 overflow-hidden text-sm font-medium text-slate-900 transition-colors bg-slate-100 rounded-xl outline-2 outline-offset-2 before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-slate-200 active:text-slate-700 before:transition-colors"
							type="button"
						>
							<span class="inline"> Make Hadrer </span>
						</button>
					{/if}
				</div>
			</div>
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
