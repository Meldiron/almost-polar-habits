import { AppwriteService } from '$lib/AppwriteService';
import type { LayoutLoad } from './$types';

export const load = (async ({ depends }) => {
	depends('habits');

	const habits = await AppwriteService.getHabits();

	return {
		habits
	};
}) satisfies LayoutLoad;
