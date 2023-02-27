import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

export const AccountStore = writable<null | Models.Account<any>>(null);
