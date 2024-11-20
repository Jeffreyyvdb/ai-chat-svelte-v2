import {
	pgTable,
	text,
	timestamp,
	varchar,
	index,
	vector,
	serial,
	integer,
	date,
	decimal
} from 'drizzle-orm/pg-core';
import { generateId } from 'ai';
import { sql } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { nanoid } from '../../utils';

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique()
});

export const embeddings = pgTable(
	'embeddings',
	{
		id: varchar('id', { length: 191 })
			.primaryKey()
			.$defaultFn(() => generateId()),
		resourceId: varchar('resource_id', { length: 191 }).references(() => resources.id, {
			onDelete: 'cascade'
		}),
		content: text('content').notNull(),
		embedding: vector('embedding', { dimensions: 1536 }).notNull()
	},
	(table) => ({
		embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))
	})
);

export const resources = pgTable('resources', {
	id: varchar('id', { length: 191 })
		.primaryKey()
		.$defaultFn(() => nanoid()),
	content: text('content').notNull(),

	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`now()`)
});

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources).extend({}).omit({
	id: true,
	createdAt: true,
	updatedAt: true
});
// Type for resources - used to type API request params and within Components
export type NewResourceParams = z.infer<typeof insertResourceSchema>;

export const unicorns = pgTable('unicorns', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	company: varchar('company', { length: 255 }).notNull(),
	valuation: decimal('valuation', { precision: 10, scale: 1 }).notNull(),
	date: timestamp('date').notNull(),
	country: varchar('country', { length: 255 }).notNull(),
	city: varchar('city', { length: 255 }),
	industry: varchar('industry', { length: 255 }).notNull(),
	investors: text('investors').notNull()
});
