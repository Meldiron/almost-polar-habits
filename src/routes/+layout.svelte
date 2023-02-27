<script>
	import '../app.css';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { AppwriteService } from '$lib/AppwriteService';
	import { AccountStore } from '$lib/stores/AccountStore';

	let loading = true;

	onMount(async () => {
		if(browser) {
			const account = await AppwriteService.getAccount();
			AccountStore.set(account);
			loading = false;
		}
	});
</script>

{#if !loading}
	<slot />
{/if}
