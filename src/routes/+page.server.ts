import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (events) => {
	const session = await events.locals.auth();

	console.log('Session', session);
	if (!session?.user) {
		console.log('User not logged in.');
	} else {
		console.log('User logged in.', session.user.email);
	}


	const chatId = crypto.randomUUID();
	
	return {
		session,
		chatId
	};
};
