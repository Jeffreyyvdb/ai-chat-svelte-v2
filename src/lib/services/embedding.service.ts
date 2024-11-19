import { embed, embedMany } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { db } from '../server/db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../server/db/schema';
import { env } from '$env/dynamic/private';
import { logger } from '../utils/logger';

export class EmbeddingService {
    private openai;
    private embeddingModel;

    constructor() {
        this.openai = createOpenAI({
            apiKey: env.OPENAI_API_KEY ?? '',
        });
        this.embeddingModel = this.openai.embedding('text-embedding-ada-002');
    }

    private generateChunks(input: string): string[] {
        logger.debug('Generating chunks', { input });
        const chunks = input
            .trim()
            .split('.')
            .filter(i => i.trim() !== '');
        logger.debug('Chunks generated', { count: chunks.length });
        return chunks;
    }

    async generateEmbeddings(
        value: string,
    ): Promise<Array<{ embedding: number[]; content: string }>> {
        logger.debug('Generating embeddings', { value });
        const chunks = this.generateChunks(value);
        
        const { embeddings } = await embedMany({
            model: this.embeddingModel,
            values: chunks,
        });

        return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
    }

    async generateEmbedding(value: string): Promise<number[]> {
        logger.debug('Generating single embedding');
        const input = value.replaceAll('\\n', ' ');
        
        const { embedding } = await embed({
            model: this.embeddingModel,
            value: input,
        });

        return embedding;
    }

    async findRelevantContent(userQuery: string, limit = 4, similarityThreshold = 0.5) {
        logger.debug('Finding relevant content', { userQuery });
        
        const userQueryEmbedded = await this.generateEmbedding(userQuery);
        const similarity = sql<number>`1 - (${cosineDistance(
            embeddings.embedding,
            userQueryEmbedded,
        )})`;

        const similarContent = await db
            .select({ name: embeddings.content, similarity })
            .from(embeddings)
            .where(gt(similarity, similarityThreshold))
            .orderBy(t => desc(t.similarity))
            .limit(limit);

        logger.debug('Found similar content', { count: similarContent.length });
        return similarContent;
    }
}

export const embeddingService = new EmbeddingService(); 