import { createOpenAI } from '@ai-sdk/openai';
import {
	generateObject,
	streamText,
	tool,
	type CoreAssistantMessage,
	type CoreToolMessage,
	type CoreMessage,
	type ToolCallPart,
	type TextPart,
	type ToolResultPart
} from 'ai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { embeddingService } from './embedding.service';
import { resourceService } from './resource.service';
import { logger } from '../utils/logger';
import { db } from '$lib/server/db';
import {
	messages as messagesTable,
	toolCalls,
	toolCalls as toolCallsTable,
	type Message as DbMessage
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class ChatService {
	private openai;
	private tools;
	private readonly CHAT_ID = '2c50f8f5-85e7-455b-b505-940fce842830'; // TODO: Make this dynamic

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
				'Save memories, preferences, or personal information shared during conversations.',
			parameters: z.object({
				content: z.string().describe('The memory or information to remember about the user')
			}),
			execute: async ({ content }) => {
				try {
					logger.debug('Saving memory', { content });

					// Use resourceService instead of direct DB access
					const result = await resourceService.createResource({ content });

					logger.debug('Memory saved', { result });
					return { success: true, message: 'Memory saved successfully', result };
				} catch (error) {
					logger.error('Failed to save memory', { error, content });
					return {
						success: false,
						message: 'Failed to save memory',
						error: error instanceof Error ? error.message : 'Unknown error'
					};
				}
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

	private async saveUserMessage(content: string) {
		return db
			.insert(messagesTable)
			.values({
				chatId: this.CHAT_ID,
				role: 'user',
				content
			})
			.returning();
	}

	private async saveAssistantMessage(content: string | null, toolCall?: ToolCallPart) {
		const [message] = await db
			.insert(messagesTable)
			.values({
				chatId: this.CHAT_ID,
				role: 'assistant',
				content
			})
			.returning();

		if (toolCall) {
			await db.insert(toolCallsTable).values({
				messageId: message.id,
				toolCallId: toolCall.toolCallId,
				toolName: toolCall.toolName,
				args: toolCall.args as Record<string, unknown>
			});
		}

		return message;
	}

	private async updateToolCallResult(toolCallId: string, result: unknown) {
		await db
			.update(toolCallsTable)
			.set({ result })
			.where(eq(toolCallsTable.toolCallId, toolCallId));
	}

	private async handleAssistantMessage(message: CoreAssistantMessage) {
		if (Array.isArray(message.content)) {
			const textPart = message.content.find((part): part is TextPart => part.type === 'text');
			const toolPart = message.content.find(
				(part): part is ToolCallPart => part.type === 'tool-call'
			);

			await this.saveAssistantMessage(textPart?.text || null, toolPart);
		} else {
			await this.saveAssistantMessage(message.content);
		}
	}

	private async handleToolMessage(message: CoreToolMessage) {
		const toolResult = message.content[0];
		await this.updateToolCallResult(toolResult.toolCallId, toolResult.result);
	}

	async handleChatRequest(messages: CoreMessage[]) {
		logger.info('Processing chat request', { messageCount: messages.length });

		// Save only the user message
		const lastMessage = messages[messages.length - 1];
		if (lastMessage.role === 'user') {
			await this.saveUserMessage(lastMessage.content as string);
		}

		return streamText({
			model: this.openai('gpt-4o'),
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
			tools: this.tools,
			onFinish: async ({ response }) => {
				for (const message of response.messages) {
					if (message.role === 'assistant') {
						await this.handleAssistantMessage(message);
					} else if (message.role === 'tool') {
						await this.handleToolMessage(message);
					}
				}
			}
		});
	}

	async getChatHistory(chatId: string) {
		const messages = await db
			.select({
				message: messagesTable,
				toolCalls: toolCallsTable
			})
			.from(messagesTable)
			.leftJoin(toolCallsTable, eq(messagesTable.id, toolCallsTable.messageId))
			.where(eq(messagesTable.chatId, chatId))
			.orderBy(messagesTable.createdAt);

		return this.groupMessagesWithToolCalls(messages);
	}

	private groupMessagesWithToolCalls(messages: { message: DbMessage; toolCalls: any }[]) {
		type MessageWithToolCalls = DbMessage & { toolCalls?: (typeof toolCalls.$inferSelect)[] };

		return messages.reduce<MessageWithToolCalls[]>((acc, curr) => {
			const existingMessage = acc.find((m) => m.id === curr.message.id);
			if (existingMessage) {
				if (curr.toolCalls) {
					existingMessage.toolCalls = existingMessage.toolCalls || [];
					existingMessage.toolCalls.push(curr.toolCalls);
				}
			} else {
				const newMessage = { ...curr.message } as MessageWithToolCalls;
				if (curr.toolCalls) {
					newMessage.toolCalls = [curr.toolCalls];
				}
				acc.push(newMessage);
			}
			return acc;
		}, []);
	}
}

export const chatService = new ChatService();
