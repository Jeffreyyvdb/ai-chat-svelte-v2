import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, streamText, tool } from 'ai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { embeddingService } from './embedding.service';
import { resourceService } from './resource.service';
import { logger } from '../utils/logger';
import { db } from '$lib/server/db';

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
			getInformation: this.createGetInformationTool(),
			databaseTool: this.createDatabaseTool()
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
			description:
				'Save memories, preferences, or personal information shared during conversations. Use this to remember important details about the user, like their preferences, habits, or any information they share. Think of this as creating memories, similar to how humans remember things about their friends.',
			parameters: z.object({
				content: z.string().describe('The memory or information to remember about the user')
			}),
			execute: async ({ content }) => {
				logger.debug('Saving memory', { content });
				return await resourceService.createResource({
					content
				});
			}
		});
	}

	private createGetInformationTool() {
		return tool({
			description:
				'Access your memories about the user. Use this to recall information, preferences, or details that were previously shared in conversations. This is like remembering things about a friend. Always check these memories first when asked personal questions about the user.',
			parameters: z.object({
				question: z.string().describe('What you want to remember about the user')
			}),
			execute: async ({ question }) => {
				logger.debug('Recalling memory', { question });
				return await embeddingService.findRelevantContent(question);
			}
		});
	}

	private createDatabaseTool() {
		return tool({
			description:
				'Generate SQL queries and retrieve data about unicorn companies. Use this when users ask questions about valuations, industries, locations, or trends related to unicorn companies in the database. Returns both the generated query and its results.',
			parameters: z.object({
				question: z.string().describe('the question about unicorn company data')
			}),
			execute: async ({ question }) => {
				logger.debug('Generating query', { question });
				try {
					const result = await generateObject({
						model: this.openai('gpt-3.5-turbo'),
						system: `You are  a SQL (postgres) and data visualization expert. Your job is to help users write SQL queries to retrieve data they need. The table schema is:

						unicorns (
						id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
						company varchar(255) NOT NULL,
						valuation numeric(10, 1) NOT NULL,
						date timestamp NOT NULL,
						country varchar(255) NOT NULL,
						city varchar(255),
						industry varchar(255) NOT NULL,
						investors text NOT NULL
						);

						Only retrieval queries are allowed.

						For things like industry, company names and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(industry) ILIKE LOWER('%search_term%').

						Note: select_investors is a comma-separated list of investors. Trim whitespace to ensure you're grouping properly. Note, some fields may be null or have only one value.
						When answering questions about a specific field, ensure you are selecting the identifying column (ie. what is Vercel's valuation would select company and valuation').

						The industries available are:
						- healthcare & life sciences
						- consumer & retail
						- financial services
						- enterprise tech
						- insurance
						- media & entertainment
						- industrials
						- health

						If the user asks for a category that is not in the list, infer based on the list above.

						Note: valuation is in billions of dollars so 10b would be 10.0.
						Note: if the user asks for a rate, return it as a decimal. For example, 0.1 would be 10%.

						If the user asks for 'over time' data, return by year.

						When searching for UK or USA, write out United Kingdom or United States respectively.

						EVERY QUERY SHOULD RETURN QUANTITATIVE DATA THAT CAN BE PLOTTED ON A CHART! There should always be at least two columns. If the user asks for a single column, return the column and the count of the column. If the user asks for a rate, return the rate as a decimal. For example, 0.1 would be 10%.
						`,
						prompt: `Generate the query necessary to retreive the data the user wants: ${question}`,
						schema: z.object({
							query: z.string()
						})
					});

					const results = await db.execute(result.object.query);
					return { question, query: result.object.query, data: results };
				} catch (error) {
					logger.error('Query API Error', error);
				}
			}
		});
	}

	async handleChatRequest(messages: any[]) {
		logger.info('Processing chat request', { messageCount: messages.length });

		return streamText({
			model: this.openai('gpt-3.5-turbo'),
			system: `You are a helpful assistant with the ability to remember things about users, similar to how humans remember things about their friends. 

			Important memory guidelines:
			1. Always check your memories (using getInformation) before answering personal questions about the user
			2. When users share personal information, preferences, or habits, save it as a memory (using addResource)
			3. Treat memories as personal experiences - phrase responses like "Based on what you've shared with me..." or "I remember you mentioned..."
			4. If you don't find relevant memories, be honest and say you don't have that information yet
			5. When saving memories, include relevant context and be specific
			6. Use natural language when recalling memories, as if you're remembering a conversation with a friend

			Remember: You're building a personal relationship through these memories, so be conversational and natural in how you store and recall information.`,
			messages,
			tools: this.tools
		});
	}
}

export const chatService = new ChatService();
