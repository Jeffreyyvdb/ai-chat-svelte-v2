import { faker } from '@faker-js/faker';
import type { Message, ToolInvocation } from 'ai';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockToolInvocation: ToolInvocation = {
	toolCallId: faker.string.uuid(),
	toolName: 'databaseTool',
	args: { query: 'SELECT * FROM users LIMIT 5' },
	state: 'result',
	result: {
		query: 'SELECT * FROM users LIMIT 5',
		data: Array(5)
			.fill(null)
			.map(() => ({
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				created_at: faker.date.past().toISOString()
			}))
	}
};

const mockResponses: Message[] = [
	{
		id: faker.string.uuid(),
		role: 'assistant',
		content: 'Here are some sample users from the database:',
		toolInvocations: [mockToolInvocation]
	},
	{
		id: faker.string.uuid(),
		role: 'assistant',
		content: 'I can help you analyze this data. What would you like to know?'
	}
];

export async function* mockStreamResponse(): AsyncGenerator<Message> {
	for (const message of mockResponses) {
		await delay(3000); // Simulate network delay
		yield message;
	}
}
