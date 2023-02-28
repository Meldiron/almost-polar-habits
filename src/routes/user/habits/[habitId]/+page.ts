import { AppwriteService } from '$lib/AppwriteService';
import type { PageLoad } from './$types';

export const load = (async ({ depends, params }) => {
	const habitId = params.habitId;
	
	depends('habits');
	depends('habits:' + habitId);

	const habit = await AppwriteService.getHabit(habitId);

	return {
		habit
	};
}) satisfies PageLoad;
