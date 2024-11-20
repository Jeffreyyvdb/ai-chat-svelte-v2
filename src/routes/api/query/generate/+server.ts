import { logger } from '$lib/utils/logger';
import { openai } from '@ai-sdk/openai';
import type { RequestHandler } from '@sveltejs/kit';
import { generateObject } from 'ai';
import { z } from 'zod';

export const POST = (async ({ request }) => {
	const { input } = await request.json();
	try {
		const result = await generateObject({
			model: openai('gpt-4o'),
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
			prompt: `Generate the query necessary to retreive the data the user wants: ${input}`,
			schema: z.object({
				query: z.string()
			})
		});

		return new Response(JSON.stringify({ input, query: result.object.query }));
	} catch (error) {
		logger.error('Query API Error', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}) satisfies RequestHandler;
