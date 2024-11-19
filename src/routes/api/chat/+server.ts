import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { env } from '$env/dynamic/private';

const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY ?? '',
});

// Tool definitions
const tools = {
    weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
            console.log(`🌤️  Weather request for location: ${location}`);
            // Simulate weather API call
            const temperature = Math.round(Math.random() * (90 - 32) + 32);
            console.log(`🌡️  Generated temperature: ${temperature}°F for ${location}`);
            return {
                location,
                temperature,
                unit: 'fahrenheit'
            };
        },
    }),

    convertTemperature: tool({
        description: 'Convert temperature between Celsius and Fahrenheit',
        parameters: z.object({
            value: z.number().describe('The temperature value to convert'),
            from: z.enum(['celsius', 'fahrenheit']).describe('Source unit'),
            to: z.enum(['celsius', 'fahrenheit']).describe('Target unit')
        }),
        execute: async ({ value, from, to }) => {
            console.log(`🔄 Converting temperature: ${value}°${from.charAt(0).toUpperCase()} to ${to}`);
            if (from === to) return { value, unit: to };
            const result = from === 'fahrenheit'
                ? (value - 32) * (5 / 9)  // F to C
                : (value * 9 / 5) + 32;   // C to F
            console.log(`✨ Conversion result: ${Math.round(result * 10) / 10}°${to.charAt(0).toUpperCase()}`);
            return {
                value: Math.round(result * 10) / 10,
                unit: to
            };
        },
    }),

    calculateTime: tool({
        description: 'Calculate time in different timezones',
        parameters: z.object({
            timezone: z.string().describe('Target timezone (e.g., "America/New_York", "Europe/London")'),
        }),
        execute: async ({ timezone }) => {
            console.log(`🕒 Time request for timezone: ${timezone}`);
            const time = new Date().toLocaleString('en-US', { timeZone: timezone });
            console.log(`⏰ Time in ${timezone}: ${time}`);
            return { timezone, time };
        },
    }),
};

export const POST = (async ({ request }) => {
    try {
        console.log('📝 Received new chat request');
        const { messages } = await request.json();
        console.log(`💬 Processing ${messages.length} messages in conversation`);

        const result = streamText({
            model: openai('gpt-4-turbo-preview'),
            messages,
            tools,
        });

        console.log('✅ Stream created successfully');
        return result.toDataStreamResponse();
    } catch (error) {
        console.error('❌ Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}) satisfies RequestHandler;
