import { embed, embedMany } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { db } from '../server/db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../server/db/schema';
import { env } from '$env/dynamic/private';

const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY ?? '',
});

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
    console.log('🔄 Generating chunks from input:', { input });
    const chunks = input
        .trim()
        .split('.')
        .filter(i => i !== '');
    console.log('✂️ Generated chunks:', { count: chunks.length, chunks });
    return chunks;
};

export const generateEmbeddings = async (
    value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
    console.log('📝 Starting generateEmbeddings with value:', { value });
    const chunks = generateChunks(value);
    console.log('🔄 Generating embeddings for chunks...');
    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    });
    console.log('✅ Generated embeddings:', {
        count: embeddings.length,
        sampleEmbedding: embeddings[0]?.slice(0, 3) // Show first 3 numbers of first embedding
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
    console.log('🔤 Starting generateEmbedding for value:', { value });
    const input = value.replaceAll('\\n', ' ');
    console.log('🔄 Generating single embedding...');
    const { embedding } = await embed({
        model: embeddingModel,
        value: input,
    });
    console.log('✅ Generated single embedding:', {
        length: embedding.length,
        sample: embedding.slice(0, 3) // Show first 3 numbers
    });
    return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
    console.log('🔍 Finding relevant content for query:', { userQuery });
    const userQueryEmbedded = await generateEmbedding(userQuery);
    console.log('🔄 Searching for similar content...');
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )})`;
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.5))
        .orderBy(t => desc(t.similarity))
        .limit(4);
    console.log('📚 Found similar content:', {
        count: similarGuides.length,
        results: similarGuides
    });
    return similarGuides;
};