import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';
import { chatService } from '$lib/services/chat.service';

export const POST = (async ({ request, locals }) => {
	// Check if user is authenticated
	const session = await locals.auth();
	if (!session?.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const { messages } = await request.json();
		const result = await chatService.handleChatRequest(messages);
		return result.toDataStreamResponse();
	} catch (error) {
		logger.error('Chat API Error', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}) satisfies RequestHandler;
