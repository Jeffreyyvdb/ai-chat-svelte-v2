'use server';

import {
	type NewResourceParams,
	insertResourceSchema,
	resources,
	embeddings as embeddingsTable
} from '$lib/server/db/schema';
import { db } from '../server/db';
import { embeddingService } from './embedding.service';
import { logger } from '../utils/logger';
import { nanoid } from 'nanoid';

export class ResourceService {
	async createResource(input: NewResourceParams): Promise<string> {
		try {
			logger.debug('Creating new resource', { input });
			const { content } = insertResourceSchema.parse(input);

			const [resource] = await db
				.insert(resources)
				.values({
					id: nanoid(),
					content,
					createdAt: new Date(),
					updatedAt: new Date()
				})
				.returning();

			const embeddings = await embeddingService.generateEmbeddings(content);
			await db.insert(embeddingsTable).values(
				embeddings.map((embedding) => ({
					resourceId: resource.id,
					...embedding
				}))
			);

			logger.info('Resource created successfully', { resourceId: resource.id });
			return 'Resource successfully created and embedded.';
		} catch (error) {
			logger.error('Failed to create resource', error);
			return error instanceof Error && error.message.length > 0
				? error.message
				: 'Error, please try again.';
		}
	}
}

export const resourceService = new ResourceService();
export const createResource = (input: NewResourceParams) => resourceService.createResource(input);
