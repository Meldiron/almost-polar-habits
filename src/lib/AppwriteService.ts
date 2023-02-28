import { Client, Account, type Models, Databases, ID, Permission, Role, Query } from 'appwrite';
import { get } from 'svelte/store';
import { AccountStore } from './stores/AccountStore';

export type Habit = {
	name: string;
	data: string;
} & Models.Document;

const client = new Client()
	.setEndpoint('https://appwrite.polarhabits.almostapps.eu/v1')
	.setProject('almostPolarHabitsV2');

const account = new Account(client);
const databases = new Databases(client);

export const AppwriteService = {
	login: () => {
		account.createOAuth2Session('github', `${window.location.origin}/user`, `${window.location.origin}/sign-in`);
	},
	logout: async () => {
		await account.deleteSession('current');
	},
	getAccount: async () => {
		try {
			return await account.get();
		} catch(err) {
			console.error(err);
			return null;
		}
	},
	createHabit: async (name: string) => {
		const userId = get(AccountStore)?.$id ?? '';

		return await databases.createDocument<Habit>('main', 'habits', ID.unique(), {
			name,
			data: JSON.stringify({})
		}, [
			Permission.read(Role.user(userId)),
			Permission.update(Role.user(userId)),
			Permission.delete(Role.user(userId)),
		]);
	},
	editHabitName: async (habitId: string, name: string) => {
		return await databases.updateDocument<Habit>('main', 'habits', habitId, {
			name
		});
	},
	deleteHabit: async (habitId: string) => {
		return await databases.deleteDocument('main', 'habits', habitId);
	},
	getHabits: async () => {
		return (await databases.listDocuments<Habit>('main', 'habits', [
			Query.limit(20),
			Query.orderDesc('$createdAt')
		])).documents;
	},
	getHabit: async (habitId: string) => {
		try {
			return await databases.getDocument<Habit>('main', 'habits', habitId);
		} catch(err) {
			console.error(err);
			return null;
		}
	}
};
