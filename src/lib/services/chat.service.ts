import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { embeddingService } from './embedding.service';
import { resourceService } from './resource.service';
import { logger } from '../utils/logger';

export class ChatService {
	private openai;
	private tools;

	constructor() {
		this.openai = createOpenAI({
			apiKey: env.OPENAI_API_KEY ?? ''
		});

		this.tools = {
			weather: this.createWeatherTool(),
			convertTemperature: this.createTemperatureConversionTool(),
			calculateTime: this.createTimeCalculationTool(),
			addResource: this.createAddResourceTool(),
			getInformation: this.createGetInformationTool()
		};
	}

	private createWeatherTool() {
		return tool({
			description: 'Get the weather in a location (fahrenheit)',
			parameters: z.object({
				location: z.string().describe('The location to get the weather for')
			}),
			execute: async ({ location }) => {
				logger.debug('Weather request', { location });
				const temperature = Math.round(Math.random() * (90 - 32) + 32);
				return { location, temperature, unit: 'fahrenheit' };
			}
		});
	}

	private createTemperatureConversionTool() {
		return tool({
			description: 'Convert temperature between Celsius and Fahrenheit',
			parameters: z.object({
				value: z.number().describe('The temperature value to convert'),
				from: z.enum(['celsius', 'fahrenheit']).describe('Source unit'),
				to: z.enum(['celsius', 'fahrenheit']).describe('Target unit')
			}),
			execute: async ({ value, from, to }) => {
				logger.debug('Converting temperature', { value, from, to });
				if (from === to) return { value, unit: to };
				const result = from === 'fahrenheit' ? (value - 32) * (5 / 9) : (value * 9) / 5 + 32;
				return {
					value: Math.round(result * 10) / 10,
					unit: to
				};
			}
		});
	}

	private createTimeCalculationTool() {
		return tool({
			description: 'Calculate time in different timezones',
			parameters: z.object({
				timezone: z.string().describe('Target timezone')
			}),
			execute: async ({ timezone }) => {
				logger.debug('Time calculation', { timezone });
				const time = new Date().toLocaleString('en-US', { timeZone: timezone });
				return { timezone, time };
			}
		});
	}

	private createAddResourceTool() {
		return tool({
			description: 'Add a resource to your knowledge base',
			parameters: z.object({
				content: z.string().describe('the content to add')
			}),
			execute: async ({ content }) => {
				logger.debug('Adding resource', { content });
				return await resourceService.createResource({ content });
			}
		});
	}

	private createGetInformationTool() {
		return tool({
			description: 'Get information from your knowledge base',
			parameters: z.object({
				question: z.string().describe('the users question')
			}),
			execute: async ({ question }) => {
				logger.debug('Getting information', { question });
				return await embeddingService.findRelevantContent(question);
			}
		});
	}

	async handleChatRequest(messages: any[]) {
		logger.info('Processing chat request', { messageCount: messages.length });

		return streamText({
			model: this.openai('gpt-4o-mini'),
			system: `You are a helpful assistant. Check your knowledge base before answering any questions.
            Only respond to questions using information from tool calls when necessary.`,
			messages,
			tools: this.tools
		});
	}
}

export const chatService = new ChatService();
