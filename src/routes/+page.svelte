<script>
	import { AccountStore } from '$lib/stores/AccountStore';
</script>

<div class="flex min-h-screen bg-white">
	<div class="flex flex-col justify-center flex-1 px-8 py-8 md:px-12 lg:flex-none lg:px-24">
		<div class="lg:min-w-[36rem] w-full mx-auto lg:max-w-6xl">
			<div class="max-w-xl text-center lg:p-10 lg:text-left">
				<div>
					<p class="text-4xl tracking-tighter text-black lg:text-5xl">Almost Polar Habits</p>
					<p class="max-w-xl mt-4 text-lg tracking-tight text-gray-600">
						Habit tracker with focus on momentum instead of streaks. This tracker helps you build challenging habits and stay motivated even when you fail.
					</p>
				</div>
				<div class="flex flex-col gap-3 mt-10 sm:flex-row">
					{#if $AccountStore === null}
						<a
							class="inline-flex items-center justify-center w-full px-6 py-3 text-center text-white duration-200 bg-black border-2 border-black hover:bg-transparent hover:border-black rounded-xl hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black focus-visible:ring-black"
							href="/sign-in"
						>
							Sign In
						</a>
					{:else}
						<a
							class="inline-flex items-center justify-center w-full px-6 py-3 text-center text-white duration-200 bg-black border-2 border-black hover:bg-transparent hover:border-black rounded-xl hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black focus-visible:ring-black"
							href="/user"
						>
							Go to Dashboard
						</a>
					{/if}

					<a
						class="inline-flex items-center justify-center w-full px-6 py-3 text-center text-black duration-200 hover:text-gray-500 focus:outline-none lg:w-auto focus-visible:outline-gray-600 focus-visible:ring-gray-300"
						href="/contact"
					>
						<span> Contact </span>
						<ion-icon
							class="flex-none w-3 h-3 ml-3 fill-gray-600 group-active:fill-current md hydrated"
							name="arrow-forward-outline"
							role="img"
							aria-label="arrow forward outline"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
	<div class="relative flex-1 hidden w-0 lg:block">
		<div>
			<img
				class="absolute inset-0 object-cover w-full h-full bg-gray-200 lg:border-l"
				src="/bg.png"
				alt=""
			/>
		</div>
	</div>
</div>
