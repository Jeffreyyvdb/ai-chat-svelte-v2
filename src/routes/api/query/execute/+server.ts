import { db } from '$lib/server/db';
import { logger } from '$lib/utils/logger';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
	const { query } = await request.json();

	if (!query) {
		return new Response(JSON.stringify({ error: 'No query provided' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		// Execute the query
		const results = await db.execute(query);

		return new Response(JSON.stringify({ results }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		logger.error('Query Execution Error', error);
		return new Response(JSON.stringify({ error: 'Failed to execute query' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}) satisfies RequestHandler;
