import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
    const { messages } = await request.json();
    console.log('API: ', messages);
    return new Response(JSON.stringify({ messages }));
}) satisfies RequestHandler;
